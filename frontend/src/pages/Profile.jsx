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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    updateProfile(formData, { onSuccess: () => setIsEditDialogOpen(false) });
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
                  <Dialog
                    open={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <DialogTrigger asChild>
                        <Button className="flex-1 mt-8 rounded-xl h-12 bg-primary text-white font-bold flex items-center justify-center gap-2">
                          <Edit3 size={18} />
                          <span>Edit Profile</span>
                        </Button>
                      </DialogTrigger>

                      <Button
                        onClick={handleLogout}
                        className="flex-1 mt-8 rounded-xl h-12 bg-red-500 text-white font-bold flex items-center justify-center gap-2"
                      >
                        <LogOut size={18} />
                        <span>Logout</span>
                      </Button>
                    </div>

                    {/* DialogContent same rahega */}
                  </Dialog>

                  <DialogContent className="sm:max-w-[580px] p-0 overflow-hidden border-none bg-white dark:bg-[#0f172a] shadow-2xl max-h-[85vh] flex flex-col">
                    {/* Header Section */}
                    <div className="px-6 py-5 bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/10">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                          Edit Profile
                        </DialogTitle>
                      </DialogHeader>
                    </div>

                    <form
                      onSubmit={handleUpdateProfile}
                      className="flex flex-col overflow-hidden"
                    >
                      <div className="p-6 space-y-5 overflow-y-auto scrollbar-hide">
                        {/* COMMON FIELDS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* NAME */}
                          <div className="space-y-1.5">
                            <Label className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
                              Full Name
                            </Label>

                            <Input
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              className="h-10 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-primary/20"
                            />
                          </div>

                          {/* EMAIL */}
                          <div className="space-y-1.5">
                            <Label className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
                              Email
                            </Label>

                            <Input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="Enter your email"
                              className="h-10 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-primary/20"
                            />
                          </div>

                          {/* ADDRESS */}
                          <div className="space-y-1.5 md:col-span-2">
                            <Label className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
                              Address
                            </Label>

                            <Input
                              name="address"
                              value={formData.address}
                              onChange={handleInputChange}
                              placeholder="Enter your address"
                              className="h-10 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                        </div>

                        {/* ================= FREELANCER ================= */}
                        {isFreelancer && (
                          <>
                            {/* TITLE */}
                            <div className="space-y-1.5">
                              <Label className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
                                Title
                              </Label>

                              <Input
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="h-10 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-primary/20"
                              />
                            </div>

                            {/* CATEGORY */}
                            <div className="space-y-2">
                              <Label className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
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
                                    className="
          w-full
          h-10
          rounded-lg
          justify-between
          bg-slate-50
          dark:bg-slate-900/50
          border-slate-200
          dark:border-white/10
          hover:bg-slate-100
          dark:hover:bg-slate-900
        "
                                  >
                                    <span className="truncate font-medium">
                                      {formData.categoryId
                                        ? uniqueCategories.find(
                                            (cat) =>
                                              cat.id.toString() ===
                                              formData.categoryId,
                                          )?.name
                                        : "Select category"}
                                    </span>

                                    <ChevronsUpDown className="h-4 w-4 opacity-50" />
                                  </Button>
                                </PopoverTrigger>

                                <PopoverContent
                                  align="start"
                                  className="
        w-[var(--radix-popover-trigger-width)]
        p-0
        overflow-hidden
        rounded-xl
        border-slate-200
        dark:border-white/10
      "
                                >
                                  {/* SEARCH */}
                                  <div className="p-3 border-b border-slate-100 dark:border-white/10">
                                    <div className="relative">
                                      <Search
                                        className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              h-4
              w-4
              text-muted-foreground
            "
                                      />

                                      <Input
                                        placeholder="Search category..."
                                        value={categorySearch}
                                        onChange={(e) =>
                                          setCategorySearch(e.target.value)
                                        }
                                        className="
              pl-10
              h-10
              rounded-lg
              bg-slate-50
              dark:bg-slate-900/50
              border-slate-200
              dark:border-white/10
            "
                                      />
                                    </div>
                                  </div>

                                  {/* LIST */}
                                  <div className="max-h-[250px] overflow-y-auto p-2">
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
                                          `
                w-full
                flex
                items-center
                gap-3
                rounded-lg
                px-3
                py-2.5
                text-sm
                font-medium
                transition-all
                hover:bg-slate-100
                dark:hover:bg-slate-800
              `,
                                          formData.categoryId ===
                                            cat.id.toString() &&
                                            "bg-primary text-white hover:bg-primary",
                                        )}
                                      >
                                        <Check
                                          className={cn(
                                            "h-4 w-4",
                                            formData.categoryId ===
                                              cat.id.toString()
                                              ? "opacity-100"
                                              : "opacity-0",
                                          )}
                                        />

                                        <span>{cat.name}</span>
                                      </button>
                                    ))}

                                    {uniqueCategories?.length === 0 && (
                                      <div className="py-6 text-center text-sm text-muted-foreground">
                                        No category found
                                      </div>
                                    )}
                                  </div>
                                </PopoverContent>
                              </Popover>
                            </div>

                            {isClient && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-sm p-8 shadow-sm">
                                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                                    Company Name
                                  </p>

                                  <div className="flex items-center gap-3">
                                    <span className="text-4xl font-black">
                                      {/* {profileData?.currency === "INR"
                                        ? "₹"
                                        : "$"} */}
                                      {profileData?.companyName || "0"}
                                      {/* <span className="text-sm text-slate-400 font-medium">
                                        /hr
                                      </span> */}
                                    </span>
                                  </div>
                                </div>

                                <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-sm p-8 shadow-sm">
                                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                                    Success Rate
                                  </p>

                                  <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-blue-500/10 flex items-center justify-center">
                                      <Globe
                                        size={24}
                                        className="text-blue-500"
                                      />
                                    </div>

                                    <span className="text-4xl font-black">
                                      100%
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* SKILLS */}
                            <div className="space-y-3">
                              <div className="space-y-1.5">
                                <Label className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
                                  Add Skills
                                </Label>

                                <div className="relative">
                                  <Input
                                    value={skillInput}
                                    onChange={(e) =>
                                      setSkillInput(e.target.value)
                                    }
                                    onKeyDown={handleSkillKeyDown}
                                    placeholder="Type and press Enter..."
                                    className="h-10 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-primary/20 pr-10"
                                  />

                                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                                    ↵
                                  </div>
                                </div>
                              </div>

                              {formData.skills.length > 0 && (
                                <div className="flex flex-wrap gap-2 p-3 bg-slate-50/50 dark:bg-white/5 rounded-xl border border-dashed border-slate-200 dark:border-white/10">
                                  {formData.skills.map((skill) => (
                                    <Badge
                                      key={skill}
                                      className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 flex items-center gap-1.5 py-1 px-2.5"
                                    >
                                      <span className="text-[11px] font-semibold">
                                        {skill}
                                      </span>

                                      <button
                                        type="button"
                                        onClick={() => removeSkill(skill)}
                                      >
                                        <X size={12} />
                                      </button>
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* LANGUAGES */}
                            <div className="space-y-3">
                              <div className="space-y-1.5">
                                <Label className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
                                  Add Languages
                                </Label>

                                <div className="relative">
                                  <Input
                                    value={langInput}
                                    onChange={(e) =>
                                      setLangInput(e.target.value)
                                    }
                                    onKeyDown={handleLanguageKeyDown}
                                    placeholder="Type and press Enter..."
                                    className="h-10 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-primary/20 pr-10"
                                  />

                                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                                    ↵
                                  </div>
                                </div>
                              </div>

                              {formData.languages.length > 0 && (
                                <div className="flex flex-wrap gap-2 p-3 bg-slate-50/50 dark:bg-white/5 rounded-xl border border-dashed border-slate-200 dark:border-white/10">
                                  {formData.languages.map((language) => (
                                    <Badge
                                      key={language}
                                      className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 flex items-center gap-1.5 py-1 px-2.5"
                                    >
                                      <span className="text-[11px] font-semibold">
                                        {language}
                                      </span>

                                      <button
                                        type="button"
                                        onClick={() => removeLanguage(language)}
                                      >
                                        <X size={12} />
                                      </button>
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* BIO */}
                            <div className="space-y-1.5">
                              <Label className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
                                Short Bio
                              </Label>

                              <Textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleInputChange}
                                className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-white/10 rounded-xl min-h-[80px]"
                              />
                            </div>

                            {/* PORTFOLIO */}
                            <div className="space-y-1.5">
                              <Label className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
                                Portfolio
                              </Label>

                              <Input
                                name="portfolio"
                                value={formData.portfolio}
                                onChange={handleInputChange}
                                placeholder="https://portfolio.com"
                                className="h-10 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-white/10 rounded-lg"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
                                Availability
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
                                className="
      w-full
      h-10
      rounded-lg
      flex
      justify-between
      bg-slate-50
      dark:bg-slate-900/50
    "
                              >
                                <span>
                                  {formData.isAvailable ? "Available" : "Busy"}
                                </span>

                                {formData.isAvailable ? (
                                  <ToggleRight className="text-green-500" />
                                ) : (
                                  <ToggleLeft className="text-red-500" />
                                )}
                              </Button>
                            </div>
                          </>
                        )}

                        {/* ================= CLIENT ================= */}
                        {isClient && (
                          <>
                            {/* COMPANY NAME */}
                            <div className="space-y-1.5">
                              <Label className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
                                Company Name
                              </Label>

                              <Input
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleInputChange}
                                placeholder="Enter company name"
                                className="h-10 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-white/10 rounded-lg"
                              />
                            </div>

                            {/* COMPANY WEBSITE */}
                            <div className="space-y-1.5">
                              <Label className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
                                Company Website
                              </Label>

                              <Input
                                name="companyWebsite"
                                value={formData.companyWebsite}
                                onChange={handleInputChange}
                                placeholder="https://company.com"
                                className="h-10 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-white/10 rounded-lg"
                              />
                            </div>

                            {/* REQUIREMENT */}
                            <div className="space-y-1.5">
                              <Label className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
                                Requirement
                              </Label>

                              <Textarea
                                name="requirement"
                                value={formData.requirement}
                                onChange={handleInputChange}
                                placeholder="Describe your project requirement..."
                                className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-white/10 rounded-xl min-h-[120px]"
                              />
                            </div>
                          </>
                        )}
                      </div>

                      {/* FOOTER */}
                      <div className="px-6 py-4 bg-slate-50/50 dark:bg-white/5 border-t border-slate-100 dark:border-white/10 flex items-center justify-end gap-3">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setIsEditDialogOpen(false)}
                          className="h-9 px-4 text-slate-500 font-bold text-[10px] uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-white/5"
                        >
                          Discard
                        </Button>

                        <Button
                          type="submit"
                          disabled={isUpdatingProfile}
                          className="h-9 px-6 bg-primary hover:bg-primary/90 text-white font-black text-[10px] uppercase tracking-[0.15em] shadow-lg shadow-primary/20 rounded-lg"
                        >
                          {isUpdatingProfile ? (
                            <Loader2 className="animate-spin h-3 w-3" />
                          ) : (
                            "Save Profile"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-sm p-8 shadow-sm">
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                    Hourly Rate
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-primary/10 flex items-center justify-center">
                      {profileData?.currency === "INR" ? (
                        <IndianRupee size={24} className="text-primary" />
                      ) : (
                        <DollarSign size={24} className="text-primary" />
                      )}
                    </div>

                    <span className="text-4xl font-black">
                      {profileData?.currency === "INR" ? "₹" : "$"}
                      {profileData?.hourlyRate || "0"}
                      <span className="text-sm text-slate-400 font-medium">
                        /hr
                      </span>
                    </span>
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-sm p-8 shadow-sm">
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                    Success Rate
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-blue-500/10 flex items-center justify-center">
                      <Globe size={24} className="text-blue-500" />
                    </div>
                    <span className="text-4xl font-black">100%</span>
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
              <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-sm p-10 shadow-sm relative overflow-hidden group">
                <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-700" />
                <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-6">
                  About Me
                </h3>
                <p className="text-xl text-slate-700 dark:text-slate-300 italic font-medium leading-relaxed relative z-10">
                  "
                  {profileData?.bio ||
                    "Tell the community about your expertise and passion..."}
                  "
                </p>
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
              <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-sm p-10 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                    Core Expertise
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400">
                    {profileData?.skills?.length || 0} Specialties
                  </span>
                </div>
                <div className="flex flex-wrap gap-4">
                  {profileData?.skills?.length > 0 ? (
                    profileData.skills.map((skill, index) => (
                      <div
                        key={index}
                        className="px-6 py-3 rounded-2xl bg-slate-50 dark:bg-[#1e293b]/50 border border-slate-100 dark:border-white/5 text-sm font-bold hover:border-primary/50 hover:bg-white dark:hover:bg-slate-800 transition-all cursor-default"
                      >
                        {skill}
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 italic text-sm">
                      Skills list is empty.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Language Box */}
            {isFreelancer && (
              <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-sm p-10 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                    Languages
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400">
                    {profileData?.languages?.length || 0} Languages
                  </span>
                </div>
                <div className="flex flex-wrap gap-4">
                  {profileData?.languages?.length > 0 ? (
                    profileData.languages.map((language, index) => (
                      <div
                        key={index}
                        className="px-6 py-3 rounded-2xl bg-slate-50 dark:bg-[#1e293b]/50 border border-slate-100 dark:border-white/5 text-sm font-bold hover:border-primary/50 hover:bg-white dark:hover:bg-slate-800 transition-all cursor-default"
                      >
                        {language}
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 italic text-sm">
                      Language list is empty.
                    </p>
                  )}
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
