import React, { useState } from "react";
import {
  Mail,
  User,
  MessageSquare,
  Phone,
  Sparkles,
  ArrowRight,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { useContact } from "@/hooks/useContact";
import { contactSchema } from "@/validations/contact.validator.js";

const Contact = () => {
  const { createContact, isCreatingContact } = useContact();

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    description: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { error } = contactSchema.validate(formData, {
      abortEarly: false,
    });

    if (error) {
      const newErrors = {};
      error.details.forEach((err) => {
        newErrors[err.path[0]] = err.message;
      });
      setErrors(newErrors);
      return;
    }

    setErrors({ name: "", email: "", description: "" });

    createContact(formData, {
      onSuccess: () => {
        setFormData({ name: "", email: "", description: "" });
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-zinc-50 flex items-center justify-center p-6 md:p-12 font-sans relative overflow-hidden transition-colors duration-500">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 dark:bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-6xl z-10 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT SIDE - Info Panel */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-10 lg:pr-6">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 text-xs font-semibold text-primary tracking-wide w-fit">
                <Sparkles size={13} className="animate-pulse" />
                Available for new projects
              </div>

              <h1 className="text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05] text-slate-950 dark:text-white">
                Let's craft <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-500 to-blue-600 dark:from-primary dark:via-purple-400 dark:to-blue-500">
                  something iconic.
                </span>
              </h1>

              <p className="text-slate-600 dark:text-zinc-400 text-base max-w-sm leading-relaxed font-normal">
                Aapke vision ko reality mein badalne ka waqt aa gaya hai. Let's collaborate to build an exceptional digital experience.
              </p>
            </div>

            {/* Contact Cards */}
            <div className="space-y-3 max-w-md">
              {/* EMAIL CARD */}
              <div className="group flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-zinc-900/40 border border-slate-200/60 dark:border-zinc-800/50 hover:border-primary/40 dark:hover:border-primary/40 transition-all duration-300 shadow-sm">
                <div className="w-11 h-11 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform duration-300 shrink-0">
                  <Mail size={18} />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[11px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                    Email Us
                  </p>
                  <p className="text-base font-medium text-slate-800 dark:text-zinc-200 truncate">
                    csoni0693@gmail.com
                  </p>
                </div>
              </div>

              {/* PHONE CARD */}
              <div className="group flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-zinc-900/40 border border-slate-200/60 dark:border-zinc-800/50 hover:border-primary/40 dark:hover:border-primary/40 transition-all duration-300 shadow-sm">
                <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-600 dark:text-zinc-400 group-hover:scale-105 transition-transform duration-300 shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                    Quick Chat
                  </p>
                  <p className="text-base font-medium text-slate-800 dark:text-zinc-200">
                    +91 8233 877 457
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - Premium Form Panel */}
          <div className="lg:col-span-7 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-blue-500/5 rounded-[2.5rem] blur-2xl -z-10" />

            <div className="bg-white dark:bg-zinc-900/70 border border-slate-200/80 dark:border-zinc-800/80 rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-100/40 dark:shadow-none backdrop-blur-md">
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white tracking-tight">
                  Send a Message
                </h3>
                <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
                  Leave your details and we'll respond within 2 hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* NAME */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500 ml-1">
                      Your Name
                    </label>
                    <div className="relative">
                      <User
                        className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                          errors.name ? "text-destructive" : "text-slate-400 dark:text-zinc-500"
                        }`}
                        size={16}
                      />
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Rahul Kumar"
                        className={`bg-slate-50/50 dark:bg-zinc-950/40 h-12 pl-11 rounded-xl border transition-all duration-300 focus-visible:ring-1 focus-visible:ring-primary/30 focus-visible:border-primary ${
                          errors.name
                            ? "border-destructive focus-visible:ring-destructive/20 focus-visible:border-destructive"
                            : "border-slate-200 dark:border-zinc-800"
                        }`}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-xs font-medium text-destructive ml-1 mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* EMAIL */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500 ml-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail
                        className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                          errors.email ? "text-destructive" : "text-slate-400 dark:text-zinc-500"
                        }`}
                        size={16}
                      />
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="rahul@example.com"
                        className={`bg-slate-50/50 dark:bg-zinc-950/40 h-12 pl-11 rounded-xl border transition-all duration-300 focus-visible:ring-1 focus-visible:ring-primary/30 focus-visible:border-primary ${
                          errors.email
                            ? "border-destructive focus-visible:ring-destructive/20 focus-visible:border-destructive"
                            : "border-slate-200 dark:border-zinc-800"
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-xs font-medium text-destructive ml-1 mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* DESCRIPTION */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500 ml-1">
                    Project Details
                  </label>
                  <div className="relative">
                    <MessageSquare
                      className={`absolute left-4 top-4 transition-colors duration-300 ${
                        errors.description ? "text-destructive" : "text-slate-400 dark:text-zinc-500"
                      }`}
                      size={16}
                    />
                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Let's talk about your goals and expectations..."
                      className={`bg-slate-50/50 dark:bg-zinc-950/40 min-h-[140px] pl-11 pt-3.5 rounded-xl border resize-none transition-all duration-300 focus-visible:ring-1 focus-visible:ring-primary/30 focus-visible:border-primary ${
                        errors.description
                          ? "border-destructive focus-visible:ring-destructive/20 focus-visible:border-destructive"
                          : "border-slate-200 dark:border-zinc-800"
                      }`}
                    />
                  </div>
                  {errors.description && (
                    <p className="text-xs font-medium text-destructive ml-1 mt-1">{errors.description}</p>
                  )}
                </div>

                {/* BUTTON */}
                <Button
                  type="submit"
                  disabled={isCreatingContact}
                  className="w-full h-12 rounded-xl bg-primary hover:bg-primary/95 text-white font-semibold text-sm group transition-all duration-300 shadow-sm shadow-primary/10"
                >
                  {isCreatingContact ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-1.5">
                      Send Inquiry
                      <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  )}
                </Button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;