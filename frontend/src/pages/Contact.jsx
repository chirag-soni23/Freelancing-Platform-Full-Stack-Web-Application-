import React, { useState } from "react";
import {
  Mail,
  User,
  MessageSquare,
  Phone,
  Sparkles,
  ArrowRight,
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

    setErrors({
      name: "",
      email: "",
      description: "",
    });

    createContact(formData, {
      onSuccess: () => {
        setFormData({
          name: "",
          email: "",
          description: "",
        });
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white selection:bg-primary/30 flex items-center justify-center p-6 md:p-12 font-sans overflow-hidden relative transition-colors duration-500">
      {/* BG */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 dark:bg-primary/20 rounded-full blur-[120px] animate-pulse" />

      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-[100px]" />

      <div className="w-full max-w-7xl z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* LEFT */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-12 p-2">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 dark:bg-white/5 border border-primary/20 dark:border-white/10 text-xs font-bold text-primary tracking-wider uppercase">
                <Sparkles size={14} />
                Available for new projects
              </div>

              <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight leading-none text-slate-900 dark:text-white">
                Let's craft <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-500 to-blue-600 dark:via-purple-400 dark:to-blue-500">
                  something iconic.
                </span>
              </h1>

              <p className="text-slate-600 dark:text-slate-400 text-lg max-w-md leading-relaxed">
                Aapke vision ko reality mein badalne ka waqt aa gaya hai.
              </p>
            </div>

            <div className="space-y-4">
              {/* EMAIL CARD */}
              <div className="group flex items-center gap-6 p-4 rounded-3xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:border-primary/50 transition-all duration-500 shadow-sm hover:shadow-xl dark:shadow-none">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                  <Mail className="text-white" />
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Email Us
                  </p>

                  <p className="text-xl font-bold italic text-slate-800 dark:text-white">
                    csoni0693@gmail.com
                  </p>
                </div>
              </div>

              {/* PHONE CARD */}
              <div className="group flex items-center gap-6 p-4 rounded-3xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:border-primary/50 transition-all duration-500 shadow-sm hover:shadow-xl dark:shadow-none">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Phone className="text-primary" />
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Quick Chat
                  </p>

                  <p className="text-xl font-bold text-slate-800 dark:text-white">
                    +91 8233 877 457
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-7 relative">
            <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10 rounded-[3rem] blur-3xl -z-10" />

            <div className="bg-white/80 dark:bg-white/[0.03] backdrop-blur-3xl border border-white dark:border-white/10 rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-2xl relative overflow-hidden">
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Send a Message
                </h3>

                <p className="text-slate-500 dark:text-slate-400">
                  Usually responds in 2 hours
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* NAME */}
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-tighter text-slate-400 dark:text-slate-500 ml-1">
                      Your Name
                    </label>

                    <div className="relative">
                      <User
                        className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                          errors.name ? "text-red-500" : "text-slate-400"
                        }`}
                        size={18}
                      />

                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Rahul Kumar"
                        className={`bg-slate-100/50 dark:bg-white/[0.05] h-14 pl-12 rounded-2xl transition-all ${
                          errors.name
                            ? "border-red-500 focus-visible:ring-red-500"
                            : "border-slate-200 dark:border-white/10"
                        }`}
                      />
                    </div>

                    {errors.name && (
                      <p className="text-sm text-red-500 ml-1">{errors.name}</p>
                    )}
                  </div>

                  {/* EMAIL */}
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-tighter text-slate-400 dark:text-slate-500 ml-1">
                      Email Address
                    </label>

                    <div className="relative">
                      <Mail
                        className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                          errors.email ? "text-red-500" : "text-slate-400"
                        }`}
                        size={18}
                      />

                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="rahul@example.com"
                        className={`bg-slate-100/50 dark:bg-white/[0.05] h-14 pl-12 rounded-2xl transition-all ${
                          errors.email
                            ? "border-red-500 focus-visible:ring-red-500"
                            : "border-slate-200 dark:border-white/10"
                        }`}
                      />
                    </div>

                    {errors.email && (
                      <p className="text-sm text-red-500 ml-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* DESCRIPTION */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-tighter text-slate-400 dark:text-slate-500 ml-1">
                    Project Details
                  </label>

                  <div className="relative">
                    <MessageSquare
                      className={`absolute left-4 top-5 ${
                        errors.description ? "text-red-500" : "text-slate-400"
                      }`}
                      size={18}
                    />

                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Let's talk about your goals..."
                      className={`bg-slate-100/50 dark:bg-white/[0.05] min-h-[180px] pl-12 pt-5 rounded-3xl resize-none transition-all ${
                        errors.description
                          ? "border-red-500 focus-visible:ring-red-500"
                          : "border-slate-200 dark:border-white/10"
                      }`}
                    />
                  </div>

                  {errors.description && (
                    <p className="text-sm text-red-500 ml-1">
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* BUTTON */}
                <Button
                  type="submit"
                  disabled={isCreatingContact}
                  className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-lg group transition-all duration-300 shadow-lg shadow-primary/25"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isCreatingContact ? "Sending..." : "Send Inquiry"}

                    <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                  </span>
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
