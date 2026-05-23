import React, { useRef, useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { cn } from "@/lib/utils";

import useDebounce from "@/hooks/useDebounce";

import { useCategory } from "@/hooks/useCategory";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Mail,
  MapPin,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Edit3,
  DollarSign,
  Camera,
  Loader2,
  User,
  Globe,
  X,
  LogOut,
  IndianRupee,
  Check,
  ChevronsUpDown,
  Search,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { updateProfileSchema } from "@/validations/auth.validator";

const Profile = () => {
  const {
    user,
    isLoadingUser,
    resendVerification,
    uploadProfilePic,
    updateProfilePic,
    isUploadingProfilePic,
    isUpdatingProfilePic,
    updateProfile,
    isUpdatingProfile,
    logout,
  } = useAuth();
  const navigate = useNavigate();
  const [openCategory, setOpenCategory] = useState(false);
  const [errors, setErrors] = useState({});

  const [categorySearch, setCategorySearch] = useState("");

  const debouncedCategorySearch = useDebounce(categorySearch, 500);
  const { uniqueCategories } = useCategory({
    search: debouncedCategorySearch,
  });

  const fileInputRef = useRef(null);
  const profileData = user?.data;

  const isFreelancer = profileData?.role === "freelancer";
  const isClient = profileData?.role === "client";

  // Edit States
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [langInput, setLangInput] = useState("");
  const [formData, setFormData] = useState({
    // common
    name: "",
    email: "",
    address: "",

    // freelancer
    title: "",
    bio: "",
    hourlyRate: "",
    currency: "INR",
    skills: [],
    languages: [],
    portfolio: "",
    categoryId: "",
    isAvailable: true,

    // client
    companyName: "",
    companyWebsite: "",
    requirement: "",
  });
  useEffect(() => {
    if (profileData) {
      setFormData({
        // common
        name: profileData.name || "",
        email: profileData.email || "",
        address: profileData.address || "",

        // freelancer
        title: profileData.title || "",
        bio: profileData.bio || "",
        hourlyRate: profileData.hourlyRate || "",
        currency: profileData.currency || "INR",
        skills: profileData.skills || [],
        languages: profileData.languages || [],
        portfolio: profileData.portfolio || "",
        categoryId: profileData?.category?.id?.toString() || "",
        isAvailable: profileData?.isAvailable ?? true,

        // client
        companyName: profileData.companyName || "",
        companyWebsite: profileData.companyWebsite || "",
        requirement: profileData.requirement || "",
      });
    }
  }, [profileData, isEditDialogOpen]);

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const value = skillInput.trim().replace(",", "");
      if (value && !formData.skills.includes(value)) {
        setFormData((prev) => ({ ...prev, skills: [...prev.skills, value] }));
        setSkillInput("");
      }
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleLanguageKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const value = langInput.trim().replace(",", "");
      if (value && !formData.languages.includes(value)) {
        setFormData((prev) => ({
          ...prev,
          languages: [...prev.languages, value],
        }));
        setLangInput("");
      }
    }
  };

  const removeLanguage = (languageToRemove) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.filter(
        (language) => language !== languageToRemove,
      ),
    }));
  };

  const validateField = (name, value) => {
    const fieldSchema = updateProfileSchema.extract(name);

    const { error } = fieldSchema.validate(value);

    setErrors((prev) => ({
      ...prev,
      [name]: error?.details?.[0]?.message || "",
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    validateField(name, value);
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      hourlyRate:
        formData.hourlyRate === "" ? null : Number(formData.hourlyRate),
    };

    const { error } = updateProfileSchema.validate(payload, {
      abortEarly: false,
    });

    if (error) {
      const obj = {};

      error.details.forEach((err) => {
        obj[err.path[0]] = err.message;
      });

      setErrors(obj);
      return;
    }

    setErrors({});

    updateProfile(payload, {
      onSuccess: () => setIsEditDialogOpen(false),
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const imgData = new FormData();
    imgData.append("profilePic", file);
    profileData?.profilePic
      ? updateProfilePic(imgData)
      : uploadProfilePic(imgData);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (isLoadingUser) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-[#020617]">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020817] text-slate-900 dark:text-slate-200 transition-colors duration-300">
      <div className="h-64 w-full relative overflow-hidden border-b border-slate-200 dark:border-white/5">
        <img
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=2000"
          alt="Hero Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/80 to-indigo-100/80 dark:from-blue-900/40 dark:to-slate-900/90" />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-[#020817] via-transparent to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-36 pb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-[#0f172a]/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-sm p-8 shadow-xl dark:shadow-blue-500/5">
              <div className="flex flex-col items-center text-center">
                <div className="relative group mb-6">
                  <div className="w-32 h-32 md:w-36 md:h-36 rounded-[2rem] bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-[#1e293b] p-1 group-hover:border-primary/50 transition-all shadow-lg overflow-hidden">
                    <div className="w-full h-full rounded-[1.8rem] bg-slate-200 dark:bg-slate-900 flex items-center justify-center relative overflow-hidden">
                      {profileData?.profilePic ? (
                        <img
                          src={profileData.profilePic}
                          alt="profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User
                          size={40}
                          className="text-slate-400 dark:text-slate-600 md:w-12 md:h-12"
                        />
                      )}

                      <button
                        onClick={() => fileInputRef.current.click()}
                        className="hidden md:flex absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center text-white"
                      >
                        {isUploadingProfilePic || isUpdatingProfilePic ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          <Camera size={28} />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="md:hidden absolute bottom-0 -right-1 bg-primary text-white p-2.5 rounded-2xl border-4 border-white dark:border-[#0f172a] shadow-xl active:scale-90 transition-transform"
                  >
                    {isUploadingProfilePic || isUpdatingProfilePic ? (
                      <Loader2 className="animate-spin w-4 h-4" />
                    ) : (
                      <Camera size={18} />
                    )}
                  </button>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                  />

                  {Number(profileData?.isEmailVerified) === 1 && (
                    <div className="absolute top-0 -right-1 bg-blue-500 rounded-full p-1.5 border-4 border-white dark:border-[#0f172a] shadow-md">
                      <CheckCircle2 size={14} className="text-white" />
                    </div>
                  )}
                </div>

                <h2 className="text-3xl font-black tracking-tight">
                  {profileData?.name}
                </h2>
                <Badge className="mt-2 bg-primary/10 text-primary border-none text-[10px] font-bold px-4 py-1 uppercase tracking-tighter">
                  {profileData?.role}
                </Badge>

                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mt-4 text-sm font-medium">
                  <Briefcase size={16} className="text-primary" />
                  {profileData?.title || "Professional Specialist"}
                </div>

                {isFreelancer && (
                  <Badge
                    className={` mt-3 flex items-center justify-center
                      ${
                        profileData?.isAvailable
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }
                    `}
                  >
                    {profileData?.isAvailable ? "Available" : "Busy"}
                  </Badge>
                )}

                <div className="w-full h-[1px] bg-slate-100 dark:bg-white/5 my-8" />

                <div className="w-full space-y-4 text-left">
                  {isFreelancer && (
                    <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center">
                        <Briefcase size={18} />
                      </div>

                      <span className="text-xs font-bold">
                        {profileData?.category?.name || "No Category"}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center">
                      <MapPin size={18} />
                    </div>
                    <span className="text-xs font-bold">
                      {profileData?.address || "Location not set"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center">
                      <Mail size={18} />
                    </div>
                    <span className="text-xs font-bold truncate">
                      {profileData?.email}
                    </span>
                  </div>
                </div>

                {/* Edit Modal Button */}
                <Dialog
                  open={isEditDialogOpen}
                  onOpenChange={setIsEditDialogOpen}
                >
                  {/* Buttons Container */}
                  <div className="flex items-center justify-between gap-4 w-full">
                    <DialogTrigger asChild>
                      <Button className="flex-1 mt-8 rounded-xl h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all duration-200 active:scale-[0.98]">
                        <Edit3 size={18} />
                        <span>Edit Profile</span>
                      </Button>
                    </DialogTrigger>

                    <Button
                      onClick={handleLogout}
                      className="flex-1 mt-8 rounded-xl h-12 bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold flex items-center justify-center gap-2 shadow-lg shadow-destructive/10 transition-all duration-200 active:scale-[0.98]"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </Button>
                  </div>

                  {/* Dialog Content */}
                  <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-border bg-card text-card-foreground shadow-2xl max-h-[85vh] flex flex-col rounded-xl animate-in fade-in-50 zoom-in-95 duration-200">
                    {/* Header Section with subtle gradient background using theme colors */}
                    <div className="px-6 py-6 bg-muted/40 border-b border-border/60 backdrop-blur-sm">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                          Edit Profile
                        </DialogTitle>
                        <p className="text-xs text-muted-foreground mt-1 font-medium">
                          Update your profile details and preferences
                          seamlessly.
                        </p>
                      </DialogHeader>
                    </div>

                    {/* Form */}
                    <form
                      onSubmit={handleUpdateProfile}
                      className="flex flex-col overflow-hidden flex-1"
                    >
                      <div className="p-6 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20">
                        {/* COMMON FIELDS CONTAINER */}
                        <div className="space-y-4">
                          <h4 className="text-xs font-bold text-primary uppercase tracking-widest border-b border-border/40 pb-1">
                            Personal Information
                          </h4>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* NAME */}
                            <div className="space-y-2">
                              <Label className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
                                Full Name
                              </Label>
                              <Input
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className={cn(
                                  "h-10 bg-muted/30 rounded-lg text-sm font-medium transition-all",
                                  errors.name
                                    ? "border-destructive focus-visible:ring-2 focus-visible:ring-destructive/20 focus-visible:border-destructive"
                                    : "border-input focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary",
                                )}
                              />
                              {errors.name && (
                                <p className="text-destructive text-xs font-medium animate-in fade-in-50 slide-in-from-top-1">
                                  {errors.name}
                                </p>
                              )}
                            </div>

                            {/* EMAIL */}
                            <div className="space-y-2">
                              <Label className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
                                Email Address
                              </Label>
                              <Input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Enter your email"
                                className={cn(
                                  "h-10 bg-muted/30 rounded-lg text-sm font-medium transition-all",
                                  errors.email
                                    ? "border-destructive focus-visible:ring-2 focus-visible:ring-destructive/20 focus-visible:border-destructive"
                                    : "border-input focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary",
                                )}
                              />
                              {errors.email && (
                                <p className="text-destructive text-xs font-medium animate-in fade-in-50 slide-in-from-top-1">
                                  {errors.email}
                                </p>
                              )}
                            </div>

                            {/* ADDRESS */}
                            <div className="space-y-2 md:col-span-2">
                              <Label className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
                                Current Address
                              </Label>
                              <Input
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="Enter your address"
                                className={cn(
                                  "h-10 bg-muted/30 rounded-lg text-sm font-medium transition-all",
                                  errors.address
                                    ? "border-destructive focus-visible:ring-2 focus-visible:ring-destructive/20 focus-visible:border-destructive"
                                    : "border-input focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary",
                                )}
                              />
                              {errors.address && (
                                <p className="text-destructive text-xs font-medium animate-in fade-in-50 slide-in-from-top-1">
                                  {errors.address}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* ================= FREELANCER SECTION ================= */}
                        {isFreelancer && (
                          <div className="space-y-4 pt-2">
                            <h4 className="text-xs font-bold text-primary uppercase tracking-widest border-b border-border/40 pb-1">
                              Freelancer Profile
                            </h4>

                            <div className="space-y-4">
                              {/* TITLE */}
                              <div className="space-y-2">
                                <Label className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
                                  Professional Title
                                </Label>
                                <Input
                                  name="title"
                                  value={formData.title}
                                  onChange={handleInputChange}
                                  placeholder="e.g. Senior Full Stack Developer"
                                  className={cn(
                                    "h-10 bg-muted/30 rounded-lg text-sm font-medium transition-all",
                                    errors.title
                                      ? "border-destructive focus-visible:ring-2 focus-visible:ring-destructive/20 focus-visible:border-destructive"
                                      : "border-input focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary",
                                  )}
                                />
                                {errors.title && (
                                  <p className="text-destructive text-xs font-medium animate-in fade-in-50 slide-in-from-top-1">
                                    {errors.title}
                                  </p>
                                )}
                              </div>

                              {/* CATEGORY */}
                              <div className="space-y-2">
                                <Label className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
                                  Category
                                </Label>
                                <Popover
                                  open={openCategory}
                                  onOpenChange={setOpenCategory}
                                >
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      role="combobox"
                                      aria-expanded={openCategory}
                                      className={cn(
                                        "w-full h-10 rounded-lg justify-between bg-muted/30 text-sm font-medium transition-all",
                                        errors.categoryId
                                          ? "border-destructive hover:bg-destructive/5 text-destructive"
                                          : "border-input hover:bg-muted/50 text-foreground",
                                      )}
                                    >
                                      <span className="truncate">
                                        {formData.categoryId
                                          ? uniqueCategories.find(
                                              (cat) =>
                                                cat.id.toString() ===
                                                formData.categoryId,
                                            )?.name
                                          : "Select category"}
                                      </span>
                                      <ChevronsUpDown className="h-4 w-4 opacity-50 shrink-0" />
                                    </Button>
                                  </PopoverTrigger>

                                  <PopoverContent
                                    align="start"
                                    sideOffset={8}
                                    className="w-[var(--radix-popover-trigger-width)] p-0 overflow-hidden rounded-xl border-border bg-popover shadow-xl z-[9999]"
                                  >
                                    <div className="p-2 border-b border-border bg-muted/20">
                                      <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                          placeholder="Search category..."
                                          value={categorySearch}
                                          onChange={(e) =>
                                            setCategorySearch(e.target.value)
                                          }
                                          className="pl-9 h-9 rounded-lg bg-background border-input text-sm"
                                        />
                                      </div>
                                    </div>

                                    <div
                                      className="max-h-[220px] overflow-y-auto overscroll-contain p-1 bg-popover scrollbar-thin scrollbar-thumb-primary/30"
                                      onWheel={(e) => e.stopPropagation()}
                                    >
                                      {uniqueCategories?.map((cat) => (
                                        <button
                                          key={cat.id}
                                          type="button"
                                          onClick={() => {
                                            setFormData((prev) => ({
                                              ...prev,
                                              categoryId: cat.id.toString(),
                                            }));
                                            setOpenCategory(false);
                                          }}
                                          className={cn(
                                            "w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all text-left mb-0.5",
                                            formData.categoryId ===
                                              cat.id.toString()
                                              ? "bg-primary text-primary-foreground font-semibold"
                                              : "hover:bg-muted/80 text-foreground",
                                          )}
                                        >
                                          <Check
                                            className={cn(
                                              "h-4 w-4 shrink-0",
                                              formData.categoryId ===
                                                cat.id.toString()
                                                ? "opacity-100"
                                                : "opacity-0",
                                            )}
                                          />
                                          <span className="truncate">
                                            {cat.name}
                                          </span>
                                        </button>
                                      ))}

                                      {uniqueCategories?.length === 0 && (
                                        <div className="py-6 text-center text-xs text-muted-foreground font-medium">
                                          No category found
                                        </div>
                                      )}
                                    </div>
                                  </PopoverContent>
                                </Popover>
                                {errors.categoryId && (
                                  <p className="text-destructive text-xs font-medium animate-in fade-in-50 slide-in-from-top-1">
                                    {errors.categoryId}
                                  </p>
                                )}
                              </div>

                              {/* STATS CARDS (Client Perspective/Info) */}
                              {isClient && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div className="bg-muted/20 border border-border/60 rounded-xl p-5 shadow-sm flex flex-col justify-between">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                                      Company Name
                                    </p>
                                    <span className="text-2xl font-black text-foreground truncate mt-1">
                                      {profileData?.companyName || "N/A"}
                                    </span>
                                  </div>

                                  <div className="bg-muted/20 border border-border/60 rounded-xl p-5 shadow-sm flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shrink-0">
                                      <Globe
                                        size={20}
                                        className="text-accent-foreground"
                                      />
                                    </div>
                                    <div>
                                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                        Success Rate
                                      </p>
                                      <span className="text-2xl font-black text-foreground">
                                        100%
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* SKILLS */}
                              <div className="space-y-2">
                                <Label className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
                                  Skills & Expertise
                                </Label>
                                <div className="relative">
                                  <Input
                                    value={skillInput}
                                    onChange={(e) =>
                                      setSkillInput(e.target.value)
                                    }
                                    onKeyDown={handleSkillKeyDown}
                                    placeholder="Type skill and press Enter..."
                                    className={cn(
                                      "h-10 bg-muted/30 rounded-lg text-sm pr-12 transition-all",
                                      errors.skills
                                        ? "border-destructive focus-visible:ring-2 focus-visible:ring-destructive/20 focus-visible:border-destructive"
                                        : "border-input focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary",
                                    )}
                                  />
                                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground bg-muted border border-border px-1.5 py-0.5 rounded shadow-sm">
                                    ↵
                                  </div>
                                </div>
                                {errors.skills && (
                                  <p className="text-destructive text-xs font-medium animate-in fade-in-50 slide-in-from-top-1">
                                    {errors.skills}
                                  </p>
                                )}

                                {formData.skills.length > 0 && (
                                  <div className="flex flex-wrap gap-1.5 p-3 bg-muted/10 rounded-xl border border-dashed border-border">
                                    {formData.skills.map((skill) => (
                                      <Badge
                                        key={skill}
                                        className="bg-card hover:bg-card text-foreground border border-border flex items-center gap-1.5 py-1 px-2.5 rounded-md shadow-sm text-xs font-medium"
                                      >
                                        <span>{skill}</span>
                                        <button
                                          type="button"
                                          onClick={() => removeSkill(skill)}
                                          className="text-muted-foreground hover:text-destructive transition-colors rounded-sm focus:outline-none"
                                        >
                                          <X size={12} />
                                        </button>
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* LANGUAGES */}
                              <div className="space-y-2">
                                <Label className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
                                  Languages Known
                                </Label>
                                <div className="relative">
                                  <Input
                                    value={langInput}
                                    onChange={(e) =>
                                      setLangInput(e.target.value)
                                    }
                                    onKeyDown={handleLanguageKeyDown}
                                    placeholder="Type language and press Enter..."
                                    className={cn(
                                      "h-10 bg-muted/30 rounded-lg text-sm pr-12 transition-all",
                                      errors.languages
                                        ? "border-destructive focus-visible:ring-2 focus-visible:ring-destructive/20 focus-visible:border-destructive"
                                        : "border-input focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary",
                                    )}
                                  />
                                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground bg-muted border border-border px-1.5 py-0.5 rounded shadow-sm">
                                    ↵
                                  </div>
                                </div>
                                {errors.languages && (
                                  <p className="text-destructive text-xs font-medium animate-in fade-in-50 slide-in-from-top-1">
                                    {errors.languages}
                                  </p>
                                )}

                                {formData.languages.length > 0 && (
                                  <div className="flex flex-wrap gap-1.5 p-3 bg-muted/10 rounded-xl border border-dashed border-border">
                                    {formData.languages.map((language) => (
                                      <Badge
                                        key={language}
                                        className="bg-card hover:bg-card text-foreground border border-border flex items-center gap-1.5 py-1 px-2.5 rounded-md shadow-sm text-xs font-medium"
                                      >
                                        <span>{language}</span>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            removeLanguage(language)
                                          }
                                          className="text-muted-foreground hover:text-destructive transition-colors rounded-sm focus:outline-none"
                                        >
                                          <X size={12} />
                                        </button>
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* BIO */}
                              <div className="space-y-2">
                                <Label className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
                                  Short Bio
                                </Label>
                                <Textarea
                                  name="bio"
                                  value={formData.bio}
                                  onChange={handleInputChange}
                                  placeholder="Tell us about yourself..."
                                  className={cn(
                                    "bg-muted/30 rounded-xl min-h-[90px] text-sm transition-all",
                                    errors.bio
                                      ? "border-destructive focus-visible:ring-2 focus-visible:ring-destructive/25 focus-visible:border-destructive"
                                      : "border-input focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:border-primary",
                                  )}
                                />
                                {errors.bio && (
                                  <p className="text-destructive text-xs font-medium animate-in fade-in-50 slide-in-from-top-1">
                                    {errors.bio}
                                  </p>
                                )}
                              </div>

                              {/* PORTFOLIO */}
                              <div className="space-y-2">
                                <Label className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
                                  Portfolio URL
                                </Label>
                                <Input
                                  name="portfolio"
                                  value={formData.portfolio}
                                  onChange={handleInputChange}
                                  placeholder="https://yourportfolio.com"
                                  className={cn(
                                    "h-10 bg-muted/30 rounded-lg text-sm font-medium transition-all",
                                    errors.portfolio
                                      ? "border-destructive focus-visible:ring-2 focus-visible:ring-destructive/20 focus-visible:border-destructive"
                                      : "border-input focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary",
                                  )}
                                />
                                {errors.portfolio && (
                                  <p className="text-destructive text-xs font-medium animate-in fade-in-50 slide-in-from-top-1">
                                    {errors.portfolio}
                                  </p>
                                )}
                              </div>

                              {/* HOURLY RATE & CURRENCY */}
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
                                    Hourly Rate
                                  </Label>
                                  <Input
                                    type="number"
                                    min="0"
                                    step="1"
                                    name="hourlyRate"
                                    value={formData.hourlyRate}
                                    onChange={handleInputChange}
                                    placeholder="50"
                                    className={cn(
                                      "h-10 bg-muted/30 rounded-lg text-sm font-medium transition-all",
                                      errors.hourlyRate
                                        ? "border-destructive focus-visible:ring-2 focus-visible:ring-destructive/20 focus-visible:border-destructive"
                                        : "border-input focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary",
                                    )}
                                  />
                                  {errors.hourlyRate && (
                                    <p className="text-destructive text-xs font-medium animate-in fade-in-50 slide-in-from-top-1">
                                      {errors.hourlyRate}
                                    </p>
                                  )}
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
                                    Currency
                                  </Label>
                                  <Select
                                    value={formData.currency}
                                    onValueChange={(value) =>
                                      setFormData((prev) => ({
                                        ...prev,
                                        currency: value,
                                      }))
                                    }
                                  >
                                    <SelectTrigger
                                      className={cn(
                                        "h-10 bg-muted/30 rounded-lg text-sm font-medium transition-all",
                                        errors.currency
                                          ? "border-destructive"
                                          : "border-input",
                                      )}
                                    >
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-popover border-border">
                                      <SelectItem value="INR">
                                        INR (₹)
                                      </SelectItem>
                                      <SelectItem value="USD">
                                        USD ($)
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                  {errors.currency && (
                                    <p className="text-destructive text-xs font-medium animate-in fade-in-50 slide-in-from-top-1">
                                      {errors.currency}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* AVAILABILITY TOGGLE */}
                              <div className="space-y-2">
                                <Label className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
                                  Availability Status
                                </Label>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      isAvailable: !prev.isAvailable,
                                    }))
                                  }
                                  className={cn(
                                    "w-full h-11 rounded-xl flex justify-between items-center px-4 transition-all duration-200 font-semibold text-sm border",
                                    formData.isAvailable
                                      ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                                      : "bg-rose-500/5 border-rose-500/20 text-rose-600 dark:text-rose-400",
                                  )}
                                >
                                  <span className="flex items-center gap-2">
                                    <span
                                      className={cn(
                                        "h-2 w-2 rounded-full",
                                        formData.isAvailable
                                          ? "bg-emerald-500"
                                          : "bg-rose-500",
                                      )}
                                    />
                                    {formData.isAvailable
                                      ? "Available for Projects"
                                      : "Currently Unavailable / Busy"}
                                  </span>
                                  {formData.isAvailable ? (
                                    <ToggleRight
                                      size={24}
                                      className="text-emerald-500"
                                    />
                                  ) : (
                                    <ToggleLeft
                                      size={24}
                                      className="text-rose-500"
                                    />
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* ================= CLIENT SECTION ================= */}
                        {isClient && (
                          <div className="space-y-4 pt-2">
                            <h4 className="text-xs font-bold text-primary uppercase tracking-widest border-b border-border/40 pb-1">
                              Company Settings
                            </h4>

                            <div className="space-y-4">
                              {/* COMPANY NAME */}
                              <div className="space-y-2">
                                <Label className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
                                  Company Name
                                </Label>
                                <Input
                                  name="companyName"
                                  value={formData.companyName}
                                  onChange={handleInputChange}
                                  placeholder="Enter company name"
                                  className={cn(
                                    "h-10 bg-muted/30 rounded-lg text-sm font-medium transition-all",
                                    errors.companyName
                                      ? "border-destructive focus-visible:ring-2 focus-visible:ring-destructive/20 focus-visible:border-destructive"
                                      : "border-input focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary",
                                  )}
                                />
                                {errors.companyName && (
                                  <p className="text-destructive text-xs font-medium animate-in fade-in-50 slide-in-from-top-1">
                                    {errors.companyName}
                                  </p>
                                )}
                              </div>

                              {/* COMPANY WEBSITE */}
                              <div className="space-y-2">
                                <Label className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
                                  Company Website
                                </Label>
                                <Input
                                  name="companyWebsite"
                                  value={formData.companyWebsite}
                                  onChange={handleInputChange}
                                  placeholder="https://company.com"
                                  className={cn(
                                    "h-10 bg-muted/30 rounded-lg text-sm font-medium transition-all",
                                    errors.companyWebsite
                                      ? "border-destructive focus-visible:ring-2 focus-visible:ring-destructive/20 focus-visible:border-destructive"
                                      : "border-input focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary",
                                  )}
                                />
                                {errors.companyWebsite && (
                                  <p className="text-destructive text-xs font-medium animate-in fade-in-50 slide-in-from-top-1">
                                    {errors.companyWebsite}
                                  </p>
                                )}
                              </div>

                              {/* REQUIREMENT */}
                              <div className="space-y-2">
                                <Label className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
                                  Project Requirements
                                </Label>
                                <Textarea
                                  name="requirement"
                                  value={formData.requirement}
                                  onChange={handleInputChange}
                                  placeholder="Describe your current talent/project hiring needs..."
                                  className={cn(
                                    "bg-muted/30 rounded-xl min-h-[120px] text-sm transition-all",
                                    errors.requirement
                                      ? "border-destructive focus-visible:ring-2 focus-visible:ring-destructive/25 focus-visible:border-destructive"
                                      : "border-input focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:border-primary",
                                  )}
                                />
                                {errors.requirement && (
                                  <p className="text-destructive text-xs font-medium animate-in fade-in-50 slide-in-from-top-1">
                                    {errors.requirement}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* FOOTER */}
                      <div className="px-6 py-4 bg-muted/30 border-t border-border flex items-center justify-end gap-3 backdrop-blur-sm">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setIsEditDialogOpen(false)}
                          className="h-10 px-4 text-muted-foreground hover:text-foreground font-bold text-xs uppercase tracking-wider transition-colors"
                        >
                          Discard
                        </Button>

                        <Button
                          type="submit"
                          disabled={isUpdatingProfile}
                          className="h-10 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs uppercase tracking-wider shadow-md shadow-primary/10 rounded-lg transition-all active:scale-95 flex items-center justify-center"
                        >
                          {isUpdatingProfile ? (
                            <Loader2 className="animate-spin h-4 w-4" />
                          ) : (
                            "Save Changes"
                          )}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            {/* Email Verification Banner */}
            {Number(profileData?.isEmailVerified) === 0 && (
              <div className="bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 rounded-3xl p-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center shrink-0">
                    <AlertCircle
                      className="text-amber-600 dark:text-amber-500"
                      size={24}
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-black text-amber-700 dark:text-amber-500 uppercase tracking-widest">
                      Action Needed
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Your email is not verified. Please check your inbox or
                      resend the link.
                    </p>
                    <button
                      onClick={resendVerification}
                      className="text-xs font-bold text-amber-600 dark:text-amber-500 hover:underline pt-2 inline-block"
                    >
                      Resend Verification Email →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Main Profile Content */}
          <div className="lg:col-span-8 space-y-8">
            {isFreelancer && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-1">
                {/* --- CARD 1: HOURLY RATE (PRIMARY BRAND GLOW) --- */}
                <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950/50 border border-slate-200/60 dark:border-slate-800/50 p-7 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05),0_20px_40px_-20px_rgba(0,0,0,0.03)] dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_-10px_rgba(var(--primary),0.15)] hover:border-primary/40">
                  {/* Mesh Gradient Light (Primary Color Glow on Hover) */}
                  <div className="absolute -right-12 -top-12 w-32 h-32 bg-primary/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  <div className="flex items-center justify-between mb-6">
                    <p className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                      Hourly Rate
                    </p>
                    {/* Dynamic Status Badge aligned with Primary Color */}
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      Active
                    </span>
                  </div>

                  <div className="flex items-center gap-5">
                    {/* Premium Icon Container with Solid Primary Background */}
                    <div className="relative shrink-0 w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-[0_8px_20px_-6px_rgba(0,0,0,0.3)] dark:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.7)] transform group-hover:rotate-[6deg] transition-transform duration-300">
                      <div className="absolute inset-0.5 rounded-[14px] bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {profileData?.currency === "INR" ? (
                        <IndianRupee
                          size={24}
                          className="text-white drop-shadow-sm"
                        />
                      ) : (
                        <DollarSign
                          size={24}
                          className="text-white drop-shadow-sm"
                        />
                      )}
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-4xl font-black bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent tracking-tight">
                          {profileData?.currency === "INR" ? "₹" : "$"}
                          {profileData?.hourlyRate || "0"}
                        </span>
                        <span className="text-sm font-bold text-slate-400 dark:text-slate-500 ml-1">
                          /hr
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5">
                        Based on market value
                      </p>
                    </div>
                  </div>
                </div>

                {/* --- CARD 2: PROFILE COMPLETION (PRIMARY BRAND RING) --- */}
                <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950/50 border border-slate-200/60 dark:border-slate-800/50 p-7 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05),0_20px_40px_-20px_rgba(0,0,0,0.03)] dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_-10px_rgba(var(--primary),0.15)] hover:border-primary/40">
                  {/* Mesh Gradient Light */}
                  <div className="absolute -right-12 -top-12 w-32 h-32 bg-primary/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  <p className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-5">
                    Profile Completion
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-6 justify-center sm:justify-start">
                    {/* Dynamic Glowing SVG Ring using text-primary */}
                    <div className="relative w-28 h-28 shrink-0">
                      {/* Subtle glow behind the active progress */}
                      <div className="absolute inset-0 rounded-full bg-primary/5 blur-xl group-hover:scale-110 transition-transform duration-500" />

                      <svg className="w-28 h-28 -rotate-90 relative z-10">
                        {/* Soft Background Track */}
                        <circle
                          cx="56"
                          cy="56"
                          r="46"
                          strokeWidth="7"
                          className="fill-none stroke-slate-100 dark:stroke-slate-800/80"
                        />
                        {/* Progress Circle using Tailwind's stroke-primary */}
                        <circle
                          cx="56"
                          cy="56"
                          r="46"
                          strokeWidth="7"
                          strokeLinecap="round"
                          className="fill-none stroke-primary transition-all duration-1000 ease-out"
                          style={{
                            strokeDasharray: 289,
                            strokeDashoffset:
                              289 -
                              (289 * (profileData?.profileCompletion || 10)) /
                                100,
                          }}
                        />
                      </svg>

                      {/* Value inside Ring */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                        <span className="text-2xl font-black bg-gradient-to-br from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent tracking-tighter">
                          {profileData?.profileCompletion || 10}%
                        </span>
                      </div>
                    </div>

                    {/* Dynamic Copywriting & Progress Action */}
                    <div className="text-center sm:text-left flex flex-col justify-center">
                      <h4 className="font-extrabold text-slate-800 dark:text-slate-200 text-sm mb-1 tracking-tight">
                        {(profileData?.profileCompletion || 10) === 100
                          ? "⚡ Profile Perfected"
                          : "🚀 Boost Your Rank"}
                      </h4>
                      <p className="text-xs font-medium text-slate-400 dark:text-slate-500 leading-relaxed max-w-[190px]">
                        {(profileData?.profileCompletion || 10) === 100
                          ? "Your profile is at peak performance."
                          : "Complete missing info to unlock premium badge."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isClient && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-sm p-8 shadow-sm">
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                    Company Name
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-black">
                      {/* {profileData?.currency === "INR" ? "₹" : "$"} */}
                      {profileData?.companyName || "0"}
                      {/* <span className="text-sm text-slate-400 font-medium">
                      /hr
                    </span> */}
                    </span>
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-sm p-6 md:p-8 shadow-sm overflow-hidden">
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
                    Company Website
                  </p>

                  <div className="flex items-center justify-center gap-3">
                    <div className="min-w-12 w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-blue-500/10 flex items-center justify-center">
                      <Globe size={24} className="text-blue-500" />
                    </div>

                    <div className="flex-1 overflow-hidden">
                      <a
                        href={profileData?.companyWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm md:text-lg font-bold break-all text-slate-800 dark:text-slate-200 hover:text-primary transition-colors"
                      >
                        {profileData?.companyWebsite || "No website added"}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Narrative Box */}
            {isFreelancer && (
              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950/50 border border-slate-200/60 dark:border-slate-800/50 p-8 sm:p-10 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05),0_20px_40px_-20px_rgba(0,0,0,0.03)] dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_-10px_rgba(var(--primary),0.1)] hover:border-primary/30 mt-6">
                {/* Futuristic Background Mesh Glow (Primary Color) */}
                <div className="absolute -right-16 -top-16 w-48 h-48 bg-primary/5 rounded-full blur-3xl opacity-100 group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-700 pointer-events-none" />
                <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none" />

                {/* Elegant Editorial Header */}
                <div className="flex items-center gap-3 mb-6 relative z-10">
                  <div className="h-1 w-6 rounded-full bg-primary" />
                  <h3 className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                    About Me
                  </h3>
                </div>

                {/* Bio Content Box with Elegant Quote Effects */}
                <div className="relative z-10 pl-2 sm:pl-4">
                  {/* Visual Quote Icon Watermark */}
                  <span className="absolute -top-6 -left-3 text-7xl font-serif text-primary/10 dark:text-primary/5 select-none pointer-events-none">
                    “
                  </span>

                  <p className="text-lg sm:text-xl text-slate-700 dark:text-slate-300 font-medium leading-relaxed tracking-wide relative z-10 antialiased">
                    {profileData?.bio ? (
                      profileData.bio
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500 font-normal italic text-base">
                        Tell the community about your expertise, passion, and
                        what drives you...
                      </span>
                    )}
                  </p>

                  {profileData?.bio && (
                    <span className="absolute -bottom-12 right-2 text-7xl font-serif text-primary/10 dark:text-primary/5 select-none pointer-events-none">
                      ”
                    </span>
                  )}
                </div>
              </div>
            )}

            {isClient && (
              <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-sm p-10 shadow-sm relative overflow-hidden group">
                <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-700" />
                <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-6">
                  Requirements
                </h3>
                <p className="text-xl text-slate-700 dark:text-slate-300 italic font-medium leading-relaxed relative z-10">
                  "
                  {profileData?.requirement ||
                    "Tell the community about your expertise and passion..."}
                  "
                </p>
              </div>
            )}

            {/* Expertise Box */}
            {isFreelancer && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* --- CARD 1: CORE EXPERTISE --- */}
                <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950/50 border border-slate-200/60 dark:border-slate-800/50 p-7 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05),0_20px_40px_-20px_rgba(0,0,0,0.03)] dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] hover:border-primary/30">
                  {/* Subtle Mesh Light */}
                  <div className="absolute -right-12 -top-12 w-32 h-32 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  <div className="flex items-center justify-between mb-6 relative z-10">
                    <h3 className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                      Core Expertise
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                      {profileData?.skills?.length || 0} Specialties
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2.5 relative z-10">
                    {profileData?.skills?.length > 0 ? (
                      profileData.skills.map((skill, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-primary/50 hover:text-primary hover:bg-white dark:hover:bg-slate-900 hover:shadow-[0_4px_12px_rgba(0,0,0,0.03)] transition-all duration-300 cursor-default"
                        >
                          {skill}
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400 dark:text-slate-500 italic text-xs py-2">
                        Skills list is empty.
                      </p>
                    )}
                  </div>
                </div>

                {/* --- CARD 2: LANGUAGES --- */}
                <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950/50 border border-slate-200/60 dark:border-slate-800/50 p-7 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05),0_20px_40px_-20px_rgba(0,0,0,0.03)] dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] hover:border-primary/30">
                  {/* Subtle Mesh Light */}
                  <div className="absolute -right-12 -top-12 w-32 h-32 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  <div className="flex items-center justify-between mb-6 relative z-10">
                    <h3 className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                      Languages
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                      {profileData?.languages?.length || 0} Fluent
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2.5 relative z-10">
                    {profileData?.languages?.length > 0 ? (
                      profileData.languages.map((language, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-primary/50 hover:text-primary hover:bg-white dark:hover:bg-slate-900 hover:shadow-[0_4px_12px_rgba(0,0,0,0.03)] transition-all duration-300 cursor-default"
                        >
                          {language}
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400 dark:text-slate-500 italic text-xs py-2">
                        Language list is empty.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
