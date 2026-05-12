import React, { useEffect, useRef, useState } from "react";
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

const Chat = () => {
  const [activeUser, setActiveUser] = useState(0);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const emojiRef = useRef(null);
  const isDark = document.documentElement.classList.contains("dark");

  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

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
  const users = [
    {
      id: 0,
      name: "Rahul Sharma",
      lastMsg: "Project update ready?",
      time: "10:30 AM",
      status: "online",
      avatar: "https://github.com/shadcn.png",
    },

    {
      id: 1,
      name: "Priya Patel",
      lastMsg: "Let's catch up later.",
      time: "YESTERDAY",
      status: "offline",
      avatar: "",
    },

    {
      id: 2,
      name: "Amit Verma",
      lastMsg: "Shared the file.",
      time: "9:15 AM",
      status: "online",
      avatar: "",
    },

    {
      id: 3,
      name: "Sneha Kapoor",
      lastMsg: "Thanks!",
      time: "MONDAY",
      status: "online",
      avatar: "",
    },
  ];

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

            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground"
            >
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
                className="pl-10 bg-secondary border-border rounded-2xl h-11 focus-visible:ring-1 focus-visible:ring-primary"
              />
            </div>
          </div>

          {/* USER LIST */}
          <ScrollArea className="flex-1 h-0">
            <div className="px-3 pb-3 space-y-2">
              {users.map((user) => (
                <div
                  key={user.id}
                  onClick={() => {
                    setActiveUser(user.id);
                    setMobileSidebar(false);
                  }}
                  className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all ${
                    activeUser === user.id
                      ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20"
                      : "hover:bg-secondary"
                  }`}
                >
                  <div className="relative shrink-0">
                    <Avatar className="h-12 w-12 border border-border">
                      <AvatarImage src={user.avatar} />

                      <AvatarFallback className="bg-secondary font-bold">
                        {user.name[0]}
                      </AvatarFallback>
                    </Avatar>

                    {user.status === "online" && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-emerald-500" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold truncate text-sm">
                        {user.name}
                      </h4>

                      <span className="text-[10px] opacity-70 font-bold">
                        {user.time}
                      </span>
                    </div>

                    <p
                      className={`truncate text-xs ${
                        activeUser === user.id
                          ? "text-primary-foreground/80"
                          : "text-muted-foreground"
                      }`}
                    >
                      {user.lastMsg}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </aside>

        {/* CHAT AREA */}
        <main className="flex-1 flex flex-col min-w-0 bg-background overflow-hidden">
          {/* CHAT HEADER */}
          <header className="h-20 border-b border-border px-4 sm:px-6 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4 min-w-0">
              {/* MOBILE MENU */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileSidebar(true)}
              >
                <Menu size={20} />
              </Button>

              <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage src={users[activeUser].avatar} />

                <AvatarFallback className="bg-secondary">
                  {users[activeUser].name[0]}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0">
                <h3 className="font-bold text-sm truncate">
                  {users[activeUser].name}
                </h3>

                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-1">
                  Online Now
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-muted-foreground">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hidden sm:flex"
              >
                <Phone size={18} />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hidden sm:flex"
              >
                <Video size={18} />
              </Button>

              <Button variant="ghost" size="icon" className="rounded-full">
                <MoreVertical size={18} />
              </Button>
            </div>
          </header>

          {/* MESSAGES */}
          <ScrollArea className="flex-1 h-0">
            <div className="p-4 sm:p-6 space-y-8 max-w-5xl mx-auto w-full min-h-full">
              {/* RECEIVED */}
              <div className="flex gap-3 max-w-[90%] sm:max-w-[75%] items-end">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="text-[10px] bg-secondary">
                    RS
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-1.5">
                  <div className="bg-card border border-border rounded-2xl rounded-bl-none p-4">
                    <p className="text-sm leading-relaxed">
                      Hi there! Did you get a chance to check the latest project
                      requirements?
                    </p>
                  </div>

                  <span className="text-[10px] font-bold text-muted-foreground ml-1">
                    10:31 AM
                  </span>
                </div>
              </div>

              {/* SENT */}
              <div className="flex flex-row-reverse gap-3 max-w-[90%] sm:max-w-[75%] ml-auto items-end">
                <div className="space-y-1.5 text-right">
                  <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-none p-4 shadow-lg shadow-primary/10">
                    <p className="text-sm leading-relaxed">
                      Yes, I just reviewed them. Everything looks great! Will
                      start on the dashboard UI today. 🚀
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-1 mr-1">
                    <span className="text-[10px] font-bold text-muted-foreground">
                      10:35 AM
                    </span>

                    <CheckCheck size={12} className="text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* INPUT */}
          <footer className="border-t border-border p-3 sm:p-4 shrink-0 bg-background relative">
            <div className="max-w-5xl mx-auto">
              {/* EMOJI PICKER */}

              {showEmojiPicker && (
                <div ref={emojiRef} className="absolute bottom-24 left-4 z-50">
                  <EmojiPicker
                    theme={isDark ? "dark" : "light"}
                    onEmojiClick={handleEmojiClick}
                    lazyLoadEmojis
                  />
                </div>
              )}

              <div className="flex items-center gap-2 sm:gap-3 bg-card border border-border rounded-2xl p-2">
                {/* EMOJI BUTTON */}

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground shrink-0"
                  onClick={() => setShowEmojiPicker((prev) => !prev)}
                >
                  <Smile size={20} />
                </Button>

                {/* ATTACHMENT */}

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground shrink-0 hidden sm:flex"
                >
                  <Paperclip size={20} />
                </Button>

                {/* INPUT */}

                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="
          border-0
          !bg-transparent
          shadow-none
          focus-visible:ring-0
          focus-visible:ring-offset-0
          focus-visible:border-0
          focus:border-0
          focus:outline-none
          placeholder:text-muted-foreground
        "
                />

                {/* SEND */}

                <Button className="h-10 w-10 rounded-xl shrink-0 p-0 shadow-lg shadow-primary/20">
                  <Send size={18} />
                </Button>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};
export default Chat;
