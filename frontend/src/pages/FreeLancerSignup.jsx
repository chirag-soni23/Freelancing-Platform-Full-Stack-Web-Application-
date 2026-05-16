// import React, { useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Badge } from "@/components/ui/badge";
// import {
//   ArrowRight,
//   Briefcase,
//   Globe,
//   Zap,
//   Star,
//   Mail,
//   Lock,
//   User,
//   Link as LinkIcon,
//   Code2,
//   DollarSign,
//   Cpu,
//   X,
//   Phone,
//   IndianRupee,
// } from "lucide-react";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";
// import { Link, useNavigate } from "react-router-dom";
// import { Textarea } from "@/components/ui/textarea";
// import { useAuth } from "@/hooks/useAuth";
// import { registerUserSchema } from "@/validations/auth.validator";

// const FreeLancerSignUp = () => {
//   const { register,isRegistering } = useAuth();
//   const navigate = useNavigate();
//   const initialState = {
//     name: "",
//     // title: "",
//     // bio: "",
//     // address: "",
//     phone: "",
//     email: "",
//     // hourlyRate: "",
//     // currency: "INR",
//     // portfolio: "",
//     password: "",
//     confirmPassword: "",
//     role: "freelancer",
//   };
//   const [skills, setSkills] = useState([]);
//   const [languages, setLanguages] = useState([]);
//   const [inputValue, setInputValue] = useState("");
//   const [langInput, setLangInput] = useState("");
//   const [errors, setErrors] = useState({});
//   const [formData, setFormData] = useState(initialState);

//   const validateForm = () => {
//     const data = {
//       ...formData,
//       skills,
//       languages,
//     };

//     const { error } = registerUserSchema.validate(data, {
//       abortEarly: false,
//     });

//     if (!error) return null;

//     const errObj = {};
//     error.details.forEach((err) => {
//       errObj[err.path[0]] = err.message;
//     });

//     return errObj;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const validationErrors = validateForm();

//     if (validationErrors) {
//       setErrors(validationErrors);
//       return;
//     }

//     setErrors({});

//     const finalData = {
//       ...formData,
//       hourlyRate: Number(formData.hourlyRate),
//       skills,
//       languages,
//     };

//     registerFreelancer(finalData, {
//       onSuccess: () => {
//         setFormData(initialState);
//         setSkills([]);
//         setLanguages([]);
//         setInputValue("");
//         setLangInput("");

//         navigate("/");
//       },
//     });
//   };
//   const addSkill = (e) => {
//     if (e.key === "Enter" && inputValue.trim() !== "") {
//       e.preventDefault();
//       if (!skills.includes(inputValue.trim())) {
//         setSkills([...skills, inputValue.trim()]);
//       }
//       setInputValue("");
//     }
//   };
//   const addLanguage = (e) => {
//     if (e.key === "Enter" && langInput.trim() !== "") {
//       e.preventDefault();

//       if (!languages.includes(langInput.trim())) {
//         setLanguages([...languages, langInput.trim()]);
//       }

//       setLangInput("");
//     }
//   };

//   const removeSkill = (skillToRemove) => {
//     setSkills(skills.filter((skill) => skill !== skillToRemove));
//   };

//   const removeLanguage = (languageToRemove) => {
//     setLanguages(languages.filter((language) => language !== languageToRemove));
//   };
//   return (
//     <div className="h-screen w-screen fixed inset-0 flex flex-col lg:flex-row bg-background overflow-hidden">
//       <div
//         className="hidden lg:flex flex-col justify-between p-16 relative w-[40%] h-full overflow-hidden
//        shrink-0"
//       >
//         <div
//           className="absolute inset-0 z-0 bg-cover bg-center"
//           style={{
//             backgroundImage:
//               "url('https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80')",
//           }}
//         />
//         <div className="absolute inset-0 z-10 bg-indigo-600/90 mix-blend-multiply" />
//         <div className="absolute inset-0 z-20 bg-gradient-to-tr from-black/80 via-transparent to-indigo-500/20 backdrop-blur-[1px]" />

//         <div className="relative z-30 flex items-center gap-2">
//           <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-2xl rotate-3">
//             <span className="text-indigo-600 font-black text-xl italic">
//               P.
//             </span>
//           </div>
//           <span className="text-white font-black text-2xl tracking-tighter uppercase italic">
//             ProMarket
//           </span>
//         </div>

//         <div className="relative z-30 space-y-8">
//           <div className="space-y-4">
//             <Badge className="bg-amber-400/20 text-amber-300 border-none px-4 py-1 text-[10px] font-black uppercase tracking-widest">
//               Start your journey
//             </Badge>
//             <h2 className="text-5xl font-black text-white leading-[1.1] tracking-tighter">
//               Work on your <br />
//               <span className="text-amber-300 italic underline decoration-wavy decoration-1 underline-offset-8">
//                 Own Terms
//               </span>{" "}
//               <br />
//               globally.
//             </h2>
//           </div>

//           <div className="space-y-6 max-w-sm">
//             {[
//               {
//                 icon: <DollarSign size={20} className="text-amber-300" />,
//                 title: "Keep 100% of your earnings",
//               },
//               {
//                 icon: <Globe size={20} className="text-amber-300" />,
//                 title: "Work with global clients",
//               },
//               {
//                 icon: <Cpu size={20} className="text-amber-300" />,
//                 title: "Get paid for your skills",
//               },
//             ].map((item, i) => (
//               <div key={i} className="flex items-center gap-4">
//                 <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
//                   {item.icon}
//                 </div>
//                 <span className="text-white/90 font-bold text-sm tracking-wide">
//                   {item.title}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="relative z-30 bg-black/20 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 max-w-sm">
//           <div className="flex gap-1 mb-2">
//             {[1, 2, 3, 4, 5].map((s) => (
//               <Star
//                 key={s}
//                 size={12}
//                 className="fill-amber-400 text-amber-400"
//               />
//             ))}
//           </div>
//           <p className="text-white/80 text-xs font-medium italic leading-relaxed">
//             "I doubled my income within 3 months of joining ProMarket. The best
//             community for devs!"
//           </p>
//         </div>
//       </div>

//       <div className="flex-1 h-full overflow-y-auto bg-[#fcfdfe] dark:bg-[#020617] scrollbar-hide">
//         <div className="flex justify-center lg:p-0 md:p-0 p-12">
//           <div className="w-full max-w-2xl space-y-10 py-10">
//             <div className="space-y-3">
//               <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-[0.3em]">
//                 <Zap size={24} strokeWidth={2.5} className="fill-primary/20" />
//                 Talent Signup
//               </div>
//               <h1 className="text-4xl font-black tracking-tighter leading-tight">
//                 Join the expert network.
//               </h1>
//               <p className="text-muted-foreground font-medium italic">
//                 Showcase your skills and start working with top-tier companies.
//               </p>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-8">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
//                 <div className="space-y-2 group">
//                   <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground group-focus-within:text-primary transition-colors">
//                     Full Name <span className="text-red-500">*</span>
//                   </Label>
//                   <div className="relative">
//                     <User
//                       className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
//                       size={16}
//                     />
//                     <Input
//                       placeholder="Chirag Soni"
//                       value={formData.name}
//                       onChange={(e) =>
//                         setFormData({ ...formData, name: e.target.value })
//                       }
//                       className="h-14 rounded-2xl bg-secondary/40 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-bold px-12"
//                     />
//                   </div>
//                   {errors.name && (
//                     <p className="text-red-500 text-xs ml-1">{errors.name}</p>
//                   )}
//                 </div>
// {/*
//                 <div className="space-y-2 group">
//                   <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground group-focus-within:text-primary transition-colors">
//                     Professional Title <span className="text-red-500">*</span>
//                   </Label>
//                   <div className="relative">
//                     <Briefcase
//                       className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
//                       size={16}
//                     />
//                     <Input
//                       value={formData.title}
//                       onChange={(e) =>
//                         setFormData({ ...formData, title: e.target.value })
//                       }
//                       placeholder="Full Stack Developer"
//                       className="h-14 rounded-2xl bg-secondary/40 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-bold px-12"
//                     />
//                   </div>
//                   {errors.title && (
//                     <p className="text-red-500 text-xs">{errors.title}</p>
//                   )}
//                 </div> */}

//                 {/* <div className="space-y-2 group md:col-span-2">
//                   <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground group-focus-within:text-primary transition-colors">
//                     Professional Bio / Description{" "}
//                     <span className="text-red-500">*</span>
//                   </Label>
//                   <div className="relative">
//                     <div className="absolute left-4 top-4 text-muted-foreground">
//                       <Briefcase size={16} />
//                     </div>
//                     <Textarea
//                       value={formData.bio}
//                       onChange={(e) =>
//                         setFormData({ ...formData, bio: e.target.value })
//                       }
//                       placeholder="Tell us about your expertise, years of experience, and what you can offer to clients..."
//                       className="min-h-[120px] rounded-2xl bg-secondary/40 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-bold px-12 py-4 resize-none"
//                     />
//                   </div>
//                   <p className="text-[10px] text-muted-foreground italic ml-1">
//                     Pro Tip: A detailed bio increases your chances of getting
//                     hired by 40%.
//                   </p>
//                   {errors.bio && (
//                     <p className="text-red-500 text-xs">{errors.bio}</p>
//                   )}
//                 </div> */}
// {/*
//                 <div className="space-y-2 group">
//                   <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground group-focus-within:text-primary transition-colors">
//                     Office / Residential Address{" "}
//                     <span className="text-red-500">*</span>
//                   </Label>
//                   <div className="relative">
//                     <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
//                       <Globe size={16} />{" "}
//                     </div>
//                     <Input
//                       value={formData.address}
//                       onChange={(e) =>
//                         setFormData({ ...formData, address: e.target.value })
//                       }
//                       placeholder="Street 102, Silicon Valley, CA, USA"
//                       className="h-14 rounded-2xl bg-secondary/40 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-bold px-12"
//                     />
//                   </div>
//                   {errors.address && (
//                     <p className="text-red-500 text-xs">{errors.address}</p>
//                   )}
//                 </div> */}

//                 <div className="space-y-2 group">
//                   <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground group-focus-within:text-primary transition-colors">
//                     Phone Number <span className="text-red-500">*</span>
//                   </Label>
//                   <div className="relative">
//                     <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
//                       <Phone size={16} />
//                     </div>
//                     <Input
//                       value={formData.phone}
//                       onChange={(e) =>
//                         setFormData({ ...formData, phone: e.target.value })
//                       }
//                       placeholder="+91 1234567890"
//                       className="h-14 rounded-2xl bg-secondary/40 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-bold px-12"
//                     />
//                   </div>
//                   {errors.phone && (
//                     <p className="text-red-500 text-xs">{errors.phone}</p>
//                   )}
//                 </div>

//                 <div className="space-y-2 group">
//                   <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground group-focus-within:text-primary transition-colors">
//                     Work Email <span className="text-red-500">*</span>
//                   </Label>
//                   <div className="relative">
//                     <Mail
//                       className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
//                       size={16}
//                     />
//                     <Input
//                       value={formData.email}
//                       onChange={(e) =>
//                         setFormData({ ...formData, email: e.target.value })
//                       }
//                       type="email"
//                       placeholder="chirag@talent.com"
//                       className="h-14 rounded-2xl bg-secondary/40 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-bold px-12"
//                     />
//                   </div>
//                   {errors.email && (
//                     <p className="text-red-500 text-xs">{errors.email}</p>
//                   )}
//                 </div>

//                 {/* <div className="space-y-2 group"> */}
//                   {/* <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">
//                     Hourly Rate <span className="text-red-500">*</span>
//                   </Label> */}

//                   {/* <div className="flex gap-2"> */}
//                     {/* <Select
//                       value={formData.currency}
//                       onValueChange={(value) =>
//                         setFormData({ ...formData, currency: value })
//                       }
//                     >
//                       <SelectTrigger className="h-14 w-[120px] rounded-2xl bg-secondary/40 border-none font-bold">
//                         <SelectValue placeholder="Currency" />
//                       </SelectTrigger>

//                       <SelectContent>
//                         <SelectItem value="INR">₹ INR</SelectItem>
//                         <SelectItem value="USD">$ USD</SelectItem>
//                       </SelectContent>
//                     </Select> */}

//                     {/* Rate Input */}
//                     {/* <div className="relative flex-1">
//                       {formData.currency === "INR" ? (
//                         <IndianRupee
//                           className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
//                           size={16}
//                         />
//                       ) : (
//                         <DollarSign
//                           class
//                           Name="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
//                           size={16}
//                         />
//                       )}

//                       <Input
//                         value={formData.hourlyRate}
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             hourlyRate: e.target.value,
//                           })
//                         }
//                         type="number"
//                         placeholder="500"
//                         className="h-14 rounded-2xl bg-secondary/40 border-none px-12 font-bold"
//                       />
//                     </div> */}
//                   {/* </div> */}

//                   {/* {errors.hourlyRate && (
//                     <p className="text-red-500 text-xs">{errors.hourlyRate}</p>
//                   )} */}
//                   {/* {errors.currency && (
//                     <p className="text-red-500 text-xs">{errors.currency}</p>
//                   )} */}
//                 {/* </div> */}

//                 {/* <div className="space-y-2 group md:col-span-2">
//                   <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground group-focus-within:text-primary transition-colors">
//                     Portfolio Link <span className="text-red-500">*</span>
//                   </Label>
//                   <div className="relative">
//                     <LinkIcon
//                       className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
//                       size={16}
//                     />
//                     <Input
//                       value={formData.portfolio}
//                       onChange={(e) =>
//                         setFormData({ ...formData, portfolio: e.target.value })
//                       }
//                       placeholder="https://github.com/chiragsoni"
//                       className="h-14 rounded-2xl bg-secondary/40 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-bold px-12"
//                     />
//                   </div>
//                   {errors.portfolio && (
//                     <p className="text-red-500 text-xs">{errors.portfolio}</p>
//                   )}
//                 </div> */}

//                 {/* Password */}
//                 <div className="space-y-2 group md:col-span-2">
//                   <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground group-focus-within:text-primary transition-colors">
//                     Password <span className="text-red-500">*</span>
//                   </Label>
//                   <div className="relative">
//                     <Lock
//                       className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
//                       size={16}
//                     />
//                     <Input
//                       type="password"
//                       name="password"
//                       value={formData.password}
//                       onChange={(e) => {
//                         setFormData({
//                           ...formData,
//                           password: e.target.value,
//                         });
//                         setErrors({ ...errors, password: "" });
//                       }}
//                       placeholder="••••••••"
//                       className="h-14 rounded-2xl bg-secondary/40 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-bold px-12"
//                     />
//                   </div>
//                   {errors.password && (
//                     <p className="text-red-500 text-xs mt-1">
//                       {errors.password}
//                     </p>
//                   )}
//                 </div>
//                 <div className="space-y-2 group md:col-span-2">
//                   <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground group-focus-within:text-primary transition-colors">
//                     Confirm Password <span className="text-red-500">*</span>
//                   </Label>
//                   <div className="relative">
//                     <Lock
//                       className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
//                       size={16}
//                     />
//                     <Input
//                       type="password"
//                       name="confirmPassword"
//                       value={formData.confirmPassword}
//                       onChange={(e) => {
//                         setFormData({
//                           ...formData,
//                           confirmPassword: e.target.value,
//                         });
//                         setErrors({ ...errors, confirmPassword: "" });
//                       }}
//                       placeholder="••••••••"
//                       className={`h-14 rounded-2xl bg-secondary/40 border-none px-12 ${
//                         errors.confirmPassword ? "border border-red-500" : ""
//                       }`}
//                     />
//                   </div>
//                   <p className="text-[10px] text-muted-foreground ml-1">
//                     Must be at least 8 characters long.
//                   </p>
//                   {errors.confirmPassword && (
//                     <p className="text-red-500 text-xs mt-1">
//                       {errors.confirmPassword}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               {/* Checkbox for Freelancer Agreement */}
//               <div className="flex items-start space-x-3 p-1">
//                 <Checkbox
//                   id="terms"
//                   className="mt-1 rounded-md border-muted-foreground/30 shadow-none data-[state=checked]:bg-primary"
//                 />
//                 <label
//                   htmlFor="terms"
//                   className="text-[11px] font-semibold leading-relaxed text-muted-foreground"
//                 >
//                   I agree to the{" "}
//                   <span className="text-primary font-black hover:underline cursor-pointer">
//                     Freelancer Agreement
//                   </span>{" "}
//                   and{" "}
//                   <span className="text-primary font-black hover:underline cursor-pointer">
//                     Service Policies
//                   </span>
//                   .
//                 </label>
//               </div>

//               {/* CTA Button */}
//               <Button
//                 disabled={isRegistering}
//                 className="w-full h-16 rounded-3xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.98] transition-all group overflow-hidden"
//               >
//                 {isRegistering
//                   ? "Creating..."
//                   : "Create Talent Account"}
//                 <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
//               </Button>
//             </form>

//             {/* Footer Switch */}
//             <div className="border-t border-border/50 pt-8">
//               <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-bold">
//                 <p className="text-muted-foreground">
//                   Already have an account?{" "}
//                   <Link to={"/login"}>
//                     <span className="text-primary font-black hover:underline cursor-pointer">
//                       Log in
//                     </span>
//                   </Link>
//                 </p>

//                 <div className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-xl border border-border/50 transition-all hover:bg-secondary">
//                   <p className="text-[11px] text-muted-foreground uppercase tracking-tight">
//                     Want to hire talent?
//                   </p>
//                   <Link to={"/client-signup"}>
//                     <span className="text-primary font-black hover:underline cursor-pointer flex items-center gap-1">
//                       Join as client <ArrowRight size={14} />
//                     </span>
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FreeLancerSignUp;

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Building2,
  Globe,
  ShieldCheck,
  Zap,
  Star,
  Mail,
  Lock,
  User,
  Link as LinkIcon,
  Phone,
  FileText,
  DollarSign,
  Cpu,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { clientSchema, registerUserSchema } from "@/validations/auth.validator";
import { useAuth } from "@/hooks/useAuth";
import { Textarea } from "@/components/ui/textarea";

const FreelancerSignUp = () => {
  const initialState = {
    name: "",
    // companyName: "",
    email: "",
    // companyWebsite: "",
    // address: "",
    // requirements: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "freelancer",
  };
  const [formData, setFormData] = useState(initialState);
  const { register, isRegistering } = useAuth();
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const { error } = registerUserSchema.validate(formData, {
      abortEarly: false,
    });

    if (!error) return null;

    const errObj = {};
    error.details.forEach((err) => {
      errObj[err.path[0]] = err.message;
    });

    return errObj;
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateForm();

    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    const finalData = {
      ...formData,
    };

    register(finalData, {
      onSuccess: () => {
        setFormData(initialState);

        navigate("/profile");
      },
    });
  };
  return (
    <div className="h-screen w-screen fixed inset-0 flex flex-col lg:flex-row bg-background overflow-hidden">
      <div
        className="hidden lg:flex flex-col justify-between p-16 relative w-[40%] h-full overflow-hidden
       shrink-0"
      >
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80')",
          }}
        />
        <div className="absolute inset-0 z-10 bg-indigo-600/90 mix-blend-multiply" />
        <div className="absolute inset-0 z-20 bg-gradient-to-tr from-black/80 via-transparent to-indigo-500/20 backdrop-blur-[1px]" />

        <div className="relative z-30 flex items-center gap-2">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-2xl rotate-3">
            <span className="text-indigo-600 font-black text-xl italic">
              P.
            </span>
          </div>
          <span className="text-white font-black text-2xl tracking-tighter uppercase italic">
            ProMarket
          </span>
        </div>

        <div className="relative z-30 space-y-8">
          <div className="space-y-4">
            <Badge className="bg-amber-400/20 text-amber-300 border-none px-4 py-1 text-[10px] font-black uppercase tracking-widest">
              Start your journey
            </Badge>
            <h2 className="text-5xl font-black text-white leading-[1.1] tracking-tighter">
              Work on your <br />
              <span className="text-amber-300 italic underline decoration-wavy decoration-1 underline-offset-8">
                Own Terms
              </span>{" "}
              <br />
              globally.
            </h2>
          </div>

          <div className="space-y-6 max-w-sm">
            {[
              {
                icon: <DollarSign size={20} className="text-amber-300" />,
                title: "Keep 100% of your earnings",
              },
              {
                icon: <Globe size={20} className="text-amber-300" />,
                title: "Work with global clients",
              },
              {
                icon: <Cpu size={20} className="text-amber-300" />,
                title: "Get paid for your skills",
              },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
                  {item.icon}
                </div>
                <span className="text-white/90 font-bold text-sm tracking-wide">
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-30 bg-black/20 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 max-w-sm">
          <div className="flex gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={12}
                className="fill-amber-400 text-amber-400"
              />
            ))}
          </div>
          <p className="text-white/80 text-xs font-medium italic leading-relaxed">
            "I doubled my income within 3 months of joining ProMarket. The best
            community for devs!"
          </p>
        </div>
      </div>

      <div className="flex-1 h-full overflow-y-auto bg-[#fcfdfe] dark:bg-[#020617] scrollbar-hide">
        <div className="flex justify-center lg:p-0 md:p-0 p-12">
          <div className="w-full max-w-2xl space-y-6 py-10">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-[0.3em]">
                <Zap size={24} strokeWidth={2.5} className="fill-primary/20" />
                Talent Signup
              </div>
              <h1 className="text-4xl font-black tracking-tighter leading-tight">
                Join the expert network.
              </h1>
              <p className="text-muted-foreground font-medium italic">
                Showcase your skills and start working with top-tier companies.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {/* Full Name */}
                <div className="space-y-2 group">
                  <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground group-focus-within:text-primary transition-colors">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <User
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                      size={16}
                    />
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Chirag Soni"
                      className="h-14 rounded-2xl bg-secondary/40 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-bold px-12"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-xs">{errors.name}</p>
                  )}
                </div>

                {/* Company Name
                <div className="space-y-2 group">
                  <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground group-focus-within:text-primary transition-colors">
                    Company Name
                  </Label>
                  <div className="relative">
                    <Building2
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                      size={16}
                    />
                    <Input
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="Creative Labs Inc."
                      className="h-14 rounded-2xl bg-secondary/40 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-bold px-12"
                    />
                  </div>
                  {errors.companyName && (
                    <p className="text-red-500 text-xs">{errors.companyName}</p>
                  )}
                </div> */}

                {/* Work Email */}
                <div className="space-y-2 group">
                  <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground group-focus-within:text-primary transition-colors">
                    Work Email <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                      size={16}
                    />
                    <Input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      type="email"
                      placeholder="chirag@company.com"
                      className="h-14 rounded-2xl bg-secondary/40 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-bold px-12"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs">{errors.email}</p>
                  )}
                </div>

                {/* Company Website */}
                {/* <div className="space-y-2 group">
                  <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground group-focus-within:text-primary transition-colors">
                    Company Website
                  </Label>
                  <div className="relative">
                    <LinkIcon
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                      size={16}
                    />
                    <Input
                      name="companyWebsite"
                      value={formData.companyWebsite}
                      onChange={handleChange}
                      placeholder="https://example.com"
                      className="h-14 rounded-2xl bg-secondary/40 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-bold px-12"
                    />
                  </div>
                  {errors.companyWebsite && (
                    <p className="text-red-500 text-xs">
                      {errors.companyWebsite}
                    </p>
                  )}
                </div> */}

                {/* <div className="space-y-2 group">
                  <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground group-focus-within:text-primary transition-colors">
                    Address <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Globe size={16} />
                    </div>
                    <Input
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Street 102, Silicon Valley, CA, USA"
                      className="h-14 rounded-2xl bg-secondary/40 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-bold px-12"
                    />
                  </div>
                  {errors.address && (
                    <p className="text-red-500 text-xs">{errors.address}</p>
                  )}
                </div> */}

                <div className="space-y-2 group">
                  <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground group-focus-within:text-primary transition-colors">
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Phone size={16} />
                    </div>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 1234567890"
                      className="h-14 rounded-2xl bg-secondary/40 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-bold px-12"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-xs">{errors.phone}</p>
                  )}
                </div>

                {/* <div className="space-y-2 group md:col-span-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground group-focus-within:text-primary transition-colors">
                    Requirements{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <div className="absolute left-4 top-4 text-muted-foreground">
                      <FileText size={16} />
                    </div>
                    <Textarea
                      value={formData.re}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                      placeholder="Tell us about your expertise, years of experience, and what you can offer to clients..."
                      className="min-h-[120px] rounded-2xl bg-secondary/40 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-bold px-12 py-4 resize-none"
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground italic ml-1">
                    Pro Tip: A detailed bio increases your chances of getting
                    hired by 40%.
                  </p>
                  {errors.bio && (
                    <p className="text-red-500 text-xs">{errors.bio}</p>
                  )}
                </div> */}

                {/* Password (Full width logic optionally or half) */}
                <div className="space-y-2 group md:col-span-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground group-focus-within:text-primary transition-colors">
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Lock
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                      size={16}
                    />
                    <Input
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      type="password"
                      placeholder="••••••••"
                      className="h-14 rounded-2xl bg-secondary/40 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-bold px-12"
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground ml-1">
                    Must be at least 8 characters long.
                  </p>
                  {errors.password && (
                    <p className="text-red-500 text-xs">{errors.password}</p>
                  )}
                </div>

                <div className="space-y-2 group md:col-span-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground group-focus-within:text-primary transition-colors">
                    Confirm Password <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Lock
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                      size={16}
                    />
                    <Input
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      type="password"
                      placeholder="••••••••"
                      className="h-14 rounded-2xl bg-secondary/40 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-bold px-12"
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground ml-1">
                    Must be at least 8 characters long.
                  </p>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-3 p-1">
                <Checkbox
                  id="terms"
                  className="mt-1 rounded-md border-muted-foreground/30 shadow-none data-[state=checked]:bg-primary"
                />
                <label
                  htmlFor="terms"
                  className="text-[11px] font-semibold leading-relaxed text-muted-foreground"
                >
                  I agree to the{" "}
                  <span className="text-primary font-black hover:underline cursor-pointer">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="text-primary font-black hover:underline cursor-pointer">
                    Privacy Policy
                  </span>
                  .
                </label>
              </div>

              <Button
                disabled={isRegistering}
                className="w-full h-16 rounded-3xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.98] transition-all group overflow-hidden"
              >
                {isRegistering ? "Creating..." : "Create Account"}
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>

            <div className="border-t border-border/50 ">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-bold">
                <p className="text-muted-foreground">
                  Already have an account?{" "}
                  <Link to={"/login"}>
                    <span className="text-primary font-black hover:underline cursor-pointer">
                      Log in
                    </span>
                  </Link>
                </p>

                <div className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-xl border border-border/50 transition-all hover:bg-secondary">
                  <p className="text-[11px] text-muted-foreground uppercase tracking-tight">
                    Looking for work?
                  </p>
                  <Link to={"/client-signup"}>
                    <span className="text-primary font-black hover:underline cursor-pointer flex items-center gap-1">
                      Join as Client <ArrowRight size={14} />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerSignUp;
