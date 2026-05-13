import React, { useEffect, useMemo, useRef, useState } from "react";

import {
  Search,
  Send,
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  Smile,
  CheckCheck,
  Menu,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { ScrollArea } from "@/components/ui/scroll-area";

import EmojiPicker from "emoji-picker-react";

import { useNavigate, useSearchParams } from "react-router-dom";

import { socket } from "@/lib/socket";

import { useAuth } from "@/hooks/useAuth";

import { useChat } from "@/hooks/useChat";

const Chat = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const conversationId = Number(searchParams.get("conversationId"));

  const receiverId = Number(searchParams.get("receiverId"));

  const { user } = useAuth();

  const { conversations, messages } = useChat(conversationId);

  const [liveMessages, setLiveMessages] = useState([]);

  const [mobileSidebar, setMobileSidebar] = useState(false);

  const [message, setMessage] = useState("");

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [typing, setTyping] = useState(false);

  const [onlineUsers, setOnlineUsers] = useState([]);

  const emojiRef = useRef(null);

  const messagesEndRef = useRef(null);

  const typingTimeoutRef = useRef(null);

  const isDark = document.documentElement.classList.contains("dark");

  /* =========================
     ACTIVE CONVERSATION
  ========================= */

  const activeConversation = conversations.find(
    (c) => Number(c.id) === Number(conversationId),
  );

  const receiver =
    activeConversation?.sender?.id === user?.data?.id
      ? activeConversation?.receiver
      : activeConversation?.sender;

  /* =========================
     MERGE MESSAGES
  ========================= */

  const allMessages = useMemo(() => {
    const merged = [...messages, ...liveMessages];

    return merged.filter(
      (msg, index, self) => index === self.findIndex((m) => m.id === msg.id),
    );
  }, [messages, liveMessages]);

  /* =========================
     EMOJI
  ========================= */

  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  /* =========================
     CLOSE EMOJI
  ========================= */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* =========================
     SOCKET CONNECT
  ========================= */

  useEffect(() => {
    if (!user?.data?.id) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join", user?.data?.id);

    return () => {
      socket.off("receiveMessage");

      socket.off("typing");

      socket.off("onlineUsers");

      socket.off("messagesSeen");
    };
  }, [user]);

  /* =========================
     CLEAR LIVE MESSAGES
  ========================= */

  // useEffect(() => {
  //   setLiveMessages([]);
  // }, [conversationId]);

  /* =========================
     RECEIVE MESSAGE
  ========================= */

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      // realtime message save for all conversations
      setLiveMessages((prev) => {
        const exists = prev.some((msg) => msg.id === data.id);

        if (exists) return prev;

        return [...prev, data];
      });

      // auto read only current open chat
      if (
        Number(data.conversationId) === Number(conversationId) &&
        Number(data.receiverId) === Number(user?.data?.id)
      ) {
        socket.emit("markAsRead", {
          conversationId: data.conversationId,

          senderId: data.senderId,

          receiverId: user?.data?.id,
        });
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [conversationId, user]);

  /* =========================
     MARK AS READ
  ========================= */

  useEffect(() => {
    if (!conversationId || !user?.data?.id) return;

    socket.emit("markAsRead", {
      conversationId,

      senderId: receiverId,

      receiverId: user?.data?.id,
    });
  }, [conversationId, receiverId, user]);

  /* =========================
     MESSAGE SEEN
  ========================= */

  useEffect(() => {
    const handleMessagesSeen = (data) => {
      if (Number(data.conversationId) !== Number(conversationId)) {
        return;
      }

      setLiveMessages((prev) =>
        prev.map((msg) => ({
          ...msg,
          isRead: true,
        })),
      );
    };

    socket.on("messagesSeen", handleMessagesSeen);

    return () => {
      socket.off("messagesSeen", handleMessagesSeen);
    };
  }, [conversationId]);

  /* =========================
     TYPING
  ========================= */

  useEffect(() => {
    const handleTyping = (data) => {
      if (Number(data.senderId) !== Number(receiverId)) return;

      setTyping(true);

      clearTimeout(typingTimeoutRef.current);

      typingTimeoutRef.current = setTimeout(() => {
        setTyping(false);
      }, 1500);
    };

    socket.on("typing", handleTyping);

    return () => {
      socket.off("typing", handleTyping);

      clearTimeout(typingTimeoutRef.current);
    };
  }, [receiverId]);

  /* =========================
     ONLINE USERS
  ========================= */

  useEffect(() => {
    const handleOnlineUsers = (users) => {
      setOnlineUsers(users);
    };

    socket.on("onlineUsers", handleOnlineUsers);

    return () => {
      socket.off("onlineUsers", handleOnlineUsers);
    };
  }, []);

  /* =========================
     AUTO SCROLL
  ========================= */

  /* =========================
   AUTO SCROLL
========================= */

  const scrollRef = useRef(null);

  const hasOpenedConversationRef = useRef(false);

  // first open conversation -> direct bottom
  useEffect(() => {
    if (!conversationId) return;

    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView();
    }, 50);

    hasOpenedConversationRef.current = true;
  }, [conversationId, messages.length]);

  // realtime new messages
  useEffect(() => {
    if (!liveMessages.length) return;

    if (!hasOpenedConversationRef.current) return;

    const lastMessage = liveMessages[liveMessages.length - 1];

    // current open conversation only
    if (Number(lastMessage.conversationId) !== Number(conversationId)) {
      return;
    }

    // smooth scroll for new message
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [liveMessages, conversationId]);

  /* =========================
     SEND MESSAGE
  ========================= */

  const handleSendMessage = () => {
    if (!message.trim()) return;

    if (!conversationId) return;

    socket.emit("sendMessage", {
      conversationId,

      senderId: user?.data?.id,

      receiverId,

      text: message.trim(),
    });

    setMessage("");
  };

  const formatMessageDate = (date) => {
    const today = new Date();

    const yesterday = new Date();

    yesterday.setDate(today.getDate() - 1);

    const msgDate = new Date(date);

    const isToday = msgDate.toDateString() === today.toDateString();

    const isYesterday = msgDate.toDateString() === yesterday.toDateString();

    if (isToday) return "Today";

    if (isYesterday) return "Yesterday";

    return msgDate.toLocaleDateString([], {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="h-[calc(100vh-104px)] overflow-hidden rounded-3xl border border-border bg-background text-foreground">
      <div className="flex h-full relative overflow-hidden">
        {/* MOBILE OVERLAY */}

        {mobileSidebar && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileSidebar(false)}
          />
        )}

        {/* SIDEBAR */}

        <aside
          className={`
          fixed lg:static z-50 lg:z-auto
          top-0 left-0 h-full
          w-[320px] sm:w-[360px]
          bg-card
          border-r border-border
          flex flex-col overflow-hidden
          transition-transform duration-300
          ${
            mobileSidebar
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
        >
          {/* HEADER */}

          <div className="p-5 sm:p-6 flex items-center justify-between border-b border-border">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Messages
            </h2>

            <Button variant="ghost" size="icon">
              <MoreVertical size={20} />
            </Button>
          </div>

          {/* SEARCH */}

          <div className="p-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-3 text-muted-foreground"
                size={18}
              />

              <Input
                placeholder="Search conversations..."
                className="pl-10 bg-secondary border-border rounded-2xl h-11"
              />
            </div>
          </div>

          {/* CONVERSATIONS */}

          <ScrollArea className="flex-1 h-0">
            <div className="px-3 pb-3 space-y-2">
              {conversations.map((conversation) => {
                const otherUser =
                  conversation?.sender?.id === user?.data?.id
                    ? conversation?.receiver
                    : conversation?.sender;

                const isOnline = onlineUsers.includes(
                  otherUser?.id?.toString(),
                );

                const unreadCount = allMessages.filter(
                  (msg) =>
                    Number(msg.senderId) === Number(otherUser?.id) &&
                    !msg.isRead &&
                    Number(msg.conversationId) === Number(conversation.id),
                ).length;
                const realtimeLastMessage = [...allMessages]
                  .filter(
                    (msg) =>
                      Number(msg.conversationId) === Number(conversation.id),
                  )
                  .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                  .pop();

                const apiLastMessage = conversation?.messages?.[0];

                const lastMessage = realtimeLastMessage || apiLastMessage;
                return (
                  <div
                    key={conversation.id}
                    onClick={() => {
                      navigate(
                        `/dashboard/chats?conversationId=${conversation?.id}&receiverId=${otherUser?.id}`,
                      );

                      setMobileSidebar(false);
                    }}
                    className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all ${
                      Number(conversationId) === Number(conversation.id)
                        ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20"
                        : "hover:bg-secondary"
                    }`}
                  >
                    <div className="relative shrink-0">
                      <Avatar className="h-12 w-12 border border-border">
                        <AvatarImage src={otherUser?.profilePic} />

                        <AvatarFallback>{otherUser?.name?.[0]}</AvatarFallback>
                      </Avatar>

                      {isOnline && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-emerald-500" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold truncate text-sm">
                          {otherUser?.name}
                        </h4>

                        <div className="flex items-center gap-2">
                          {unreadCount > 0 && (
                            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                          )}

                          <span className="text-[10px] opacity-70 font-bold">
                            {isOnline ? "Online" : "Offline"}
                          </span>
                        </div>
                      </div>
                      <p
                        className={`truncate text-xs ${
                          Number(conversationId) === Number(conversation.id)
                            ? "text-primary-foreground/80"
                            : "text-muted-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          {Number(lastMessage?.senderId) ===
                            Number(user?.data?.id) && (
                            <CheckCheck
                              size={12}
                              className={
                                lastMessage?.isRead
                                  ? "text-blue-300"
                                  : "text-primary-foreground/70"
                              }
                            />
                          )}

                          <span className="truncate">{lastMessage?.text}</span>
                        </div>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </aside>

        {/* CHAT AREA */}
        <main className="flex-1 flex flex-col min-w-0 bg-background overflow-hidden">
          {!conversationId ? (
            <>
              {/* HEADER */}

              <header className="h-20 border-b border-border px-4 sm:px-6 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4 min-w-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    onClick={() => setMobileSidebar(true)}
                  >
                    <Menu size={20} />
                  </Button>

                  <div>
                    <h3 className="font-bold text-lg">Chats</h3>

                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">
                      Select Conversation
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon">
                    <MoreVertical size={18} />
                  </Button>
                </div>
              </header>

              {/* EMPTY SCREEN */}

              <div className="flex flex-1 items-center justify-center px-6">
                <div className="text-center">
                  <h2 className="text-3xl sm:text-4xl font-black mb-3">
                    Start a Chat
                  </h2>

                  <p className="text-muted-foreground text-sm sm:text-base">
                    Select a conversation from the sidebar to start messaging
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* HEADER */}

              <header className="h-20 border-b border-border px-4 sm:px-6 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4 min-w-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    onClick={() => setMobileSidebar(true)}
                  >
                    <Menu size={20} />
                  </Button>

                  <Avatar className="h-10 w-10">
                    <AvatarImage src={receiver?.profilePic} />

                    <AvatarFallback>{receiver?.name?.[0]}</AvatarFallback>
                  </Avatar>

                  <div>
                    <h3 className="font-bold text-sm">{receiver?.name}</h3>

                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-1">
                      {onlineUsers.includes(String(receiver?.id))
                        ? "ONLINE NOW"
                        : "OFFLINE"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hidden sm:flex"
                  >
                    <Phone size={18} />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="hidden sm:flex"
                  >
                    <Video size={18} />
                  </Button>

                  <Button variant="ghost" size="icon">
                    <MoreVertical size={18} />
                  </Button>
                </div>
              </header>

              {/* MESSAGES */}

              <ScrollArea className="flex-1 h-0" viewportRef={scrollRef}>
                <div className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto w-full min-h-full">
                  {allMessages.map((msg, index) => {
                    const isMe =
                      Number(msg.senderId) === Number(user?.data?.id);

                    const currentDate = formatMessageDate(msg.createdAt);

                    const previousDate =
                      index > 0
                        ? formatMessageDate(allMessages[index - 1].createdAt)
                        : null;

                    const showDate = currentDate !== previousDate;

                    return (
                      <React.Fragment key={msg.id}>
                        {showDate && (
                          <div className="flex justify-center">
                            <div className="px-4 py-1 rounded-full bg-card border border-border text-xs text-muted-foreground font-medium">
                              {currentDate}
                            </div>
                          </div>
                        )}

                        <div
                          className={`flex ${
                            isMe ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`flex gap-3 max-w-[75%] ${
                              isMe ? "flex-row-reverse" : "flex-row"
                            }`}
                          >
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={
                                  isMe
                                    ? user?.data?.profilePic
                                    : receiver?.profilePic
                                }
                              />

                              <AvatarFallback>
                                {isMe
                                  ? user?.data?.name?.[0]
                                  : receiver?.name?.[0]}
                              </AvatarFallback>
                            </Avatar>

                            <div
                              className={`space-y-1 ${
                                isMe ? "text-right" : "text-left"
                              }`}
                            >
                              <div
                                className={`p-4 rounded-2xl ${
                                  isMe
                                    ? "bg-primary text-primary-foreground rounded-br-none"
                                    : "bg-card border border-border rounded-bl-none"
                                }`}
                              >
                                <p className="text-sm break-words">
                                  {msg.text}
                                </p>
                              </div>

                              <div
                                className={`flex items-center gap-1 text-[10px] text-muted-foreground ${
                                  isMe ? "justify-end" : "justify-start"
                                }`}
                              >
                                <span>
                                  {new Date(msg.createdAt).toLocaleTimeString(
                                    [],
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    },
                                  )}
                                </span>

                                {isMe && (
                                  <CheckCheck
                                    size={12}
                                    className={
                                      msg.isRead
                                        ? "text-blue-500"
                                        : "text-gray-400"
                                    }
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}

                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* TYPING */}

              {typing && (
                <p className="text-xs text-muted-foreground px-4 pb-2">
                  Typing...
                </p>
              )}

              {/* INPUT */}

              <footer className="border-t border-border p-3 sm:p-4 bg-background relative">
                <div className="max-w-5xl mx-auto">
                  {showEmojiPicker && (
                    <div
                      ref={emojiRef}
                      className="absolute bottom-24 left-4 z-50"
                    >
                      <EmojiPicker
                        theme={isDark ? "dark" : "light"}
                        onEmojiClick={handleEmojiClick}
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-2 sm:gap-3 bg-card border border-border rounded-2xl p-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowEmojiPicker((prev) => !prev)}
                    >
                      <Smile size={20} />
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="hidden sm:flex"
                    >
                      <Paperclip size={20} />
                    </Button>

                    <Input
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);

                        socket.emit("typing", {
                          senderId: user?.data?.id,

                          receiverId,
                        });
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSendMessage();
                        }
                      }}
                      placeholder="Type your message..."
                      className="border-0 !bg-transparent shadow-none focus-visible:ring-0"
                    />

                    <Button
                      onClick={handleSendMessage}
                      className="h-10 w-10 rounded-xl p-0"
                    >
                      <Send size={18} />
                    </Button>
                  </div>
                </div>
              </footer>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Chat;
