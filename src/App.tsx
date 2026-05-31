import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Camera,
  Video,
  Film,
  Sparkles,
  Heart,
  Gift,
  Play,
  X,
  Star,
  Instagram,
  Facebook,
  Youtube,
  Phone,
  Mail,
  Share2,
  Menu,
  ChevronRight,
  ArrowRight,
  Check,
  Copy,
  Info,
  Lock,
  Unlock,
  Settings as SettingsIcon,
  Plus,
  RefreshCw,
  LogOut,
  Edit,
  Trash2
} from "lucide-react";
import {
  PORTFOLIO_DATA,
  SERVICES_DATA,
  TESTIMONIALS_DATA
} from "./data";
import { BrandingSettings, PortfolioItem, ServiceItem, TestimonialItem, GistConfig } from "./types";
import { AdminModals } from "./components/AdminModals";

/**
 * Utility function to convert standard YouTube/Google Drive URLs to embeddable URLs
 */
export function getEmbedUrl(url: string | undefined): string {
  if (!url) return "";
  const trimmed = url.trim();

  // YouTube URL conversion
  if (trimmed.includes("youtube.com") || trimmed.includes("youtu.be")) {
    let videoId = "";
    try {
      if (trimmed.includes("youtu.be/")) {
        const parts = trimmed.split("youtu.be/");
        if (parts[1]) {
          videoId = parts[1].split(/[?#]/)[0];
        }
      } else if (trimmed.includes("/shorts/")) {
        const parts = trimmed.split("/shorts/");
        if (parts[1]) {
          videoId = parts[1].split(/[?#]/)[0];
        }
      } else if (trimmed.includes("embed/")) {
        return trimmed;
      } else {
        const urlObj = new URL(trimmed);
        videoId = urlObj.searchParams.get("v") || "";
        if (!videoId) {
          const vPart = trimmed.split("v=");
          if (vPart[1]) {
            videoId = vPart[1].split(/[&?#]/)[0];
          }
        }
      }
    } catch (e) {
      console.error("Error parsing YouTube URL:", e);
    }
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
  }

  // Google Drive URL conversion
  if (trimmed.includes("drive.google.com")) {
    // If it's a folder link
    if (trimmed.includes("/folders/")) {
      let folderId = "";
      try {
        const parts = trimmed.split("/folders/");
        if (parts[1]) {
          folderId = parts[1].split(/[?#&]/)[0];
        }
      } catch (e) {
        console.error("Error parsing Google Drive folder URL:", e);
      }
      if (folderId) {
        return `https://drive.google.com/embeddedfolderview?id=${folderId}#grid`;
      }
    }

    let fileId = "";
    try {
      if (trimmed.includes("/file/d/")) {
        const parts = trimmed.split("/file/d/");
        if (parts[1]) {
          fileId = parts[1].split("/")[0];
        }
      } else if (trimmed.includes("open?id=")) {
        const parts = trimmed.split("open?id=");
        if (parts[1]) {
          fileId = parts[1].split(/[&?#]/)[0];
        }
      } else if (trimmed.includes("id=")) {
        const urlObj = new URL(trimmed);
        fileId = urlObj.searchParams.get("id") || "";
      }
    } catch (e) {
      console.error("Error parsing Google Drive URL:", e);
    }
    if (fileId) {
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
  }

  return trimmed;
}

export default function App() {
  // Administrative control state definitions
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem("pragnya_is_admin") === "true";
  });
  const [activeModal, setActiveModal] = useState<"login" | "settings" | "work" | "sync" | "edit-intro" | "edit-story" | "edit-gallery" | null>(null);
  const [editingWork, setEditingWork] = useState<PortfolioItem | null>(null);

  const [gistConfig, setGistConfig] = useState<GistConfig>(() => {
    const saved = localStorage.getItem("pragnya_gist_config");
    if (saved) return JSON.parse(saved);
    return { gistId: "", token: "" };
  });

  const handleSetGistConfig = (cfg: GistConfig) => {
    setGistConfig(cfg);
    localStorage.setItem("pragnya_gist_config", JSON.stringify(cfg));
  };

  const handleSetIsAdmin = (val: boolean) => {
    setIsAdmin(val);
    localStorage.setItem("pragnya_is_admin", val ? "true" : "false");
  };

  // Dynamic state loaded from local persistence or falls back to template properties
  const [settings, setSettings] = useState<BrandingSettings>(() => {
    const saved = localStorage.getItem("pragnya_settings");
    if (saved) return JSON.parse(saved);
    return {
      name: "PRAGNYA SRI CREATIONS",
      tagline: "Capturing Memories, Creating Magic",
      logo: "",
      phone: "+91 99999 99999",
      whatsapp: "919999999999",
      email: "pragnyasri2204@gmail.com",
      instagram: "https://instagram.com/pragnyasri_creations",
      facebook: "https://facebook.com/",
      youtube: "https://youtube.com/",
      showInsta: true,
      showFb: true,
      showYt: true,
      statWorks: "250+",
      statYears: "8+",
      statClients: "500+",
      statCities: "15+",
      about1: "We are passionate storytellers who believe every moment deserves to be captured in its purest form. With years of experience in photography and videography, we bring an artistic eye and technical excellence to every project.",
      about2: "From grand wedding celebrations to intimate baby shoots, our team is dedicated to delivering cinematic quality that you will cherish for a lifetime.",
      sig: "The Pragnya Sri Team",
      aboutSigLabel: "Photographer & Videographer",
      aboutImage: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=1200",
      aboutHeading: "Timeless Memories",
      heroEyebrow: "— A Fine Art Photography Studio —",
      heroMediaType: "video",
      heroVideoUrl: "https://pub-1d01942ff7d34ef5a4756322b5f889b4.r2.dev/BABY%20PHOTOGRAPHY%20LANDSCAPE.mp4",
      heroImageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=2000",
      heroLogoUrl: "",
      instaHandle: "PRAGNYASRI_CREATIONS",
      instaSubtext: "Join our community and stay updated with our latest magical moments",
      password: "admin@123",
      instaImages: [
        "https://chinnaristudio.com/wp-content/uploads/2023/12/AJ3_4886-768x1154.jpg",
        "https://chinnaristudio.com/wp-content/uploads/2023/12/AJ3_4677-768x1154.jpg",
        "https://chinnaristudio.com/wp-content/uploads/2023/12/AJ6_8974-768x1154.jpg",
        "https://chinnaristudio.com/wp-content/uploads/2023/12/AJ8_7806-copy-768x768.jpg",
        "https://chinnaristudio.com/wp-content/uploads/2024/06/AJ87913-copy-1-768x524.jpg",
        "https://chinnaristudio.com/wp-content/uploads/2024/06/AJ88017-768x1152.jpg",
        "https://chinnaristudio.com/wp-content/uploads/2024/01/AJ8_8132-copy-768x1152.jpg",
        "https://chinnaristudio.com/wp-content/uploads/2024/01/AJ8_7921-768x960.jpg"
      ]
    };
  });

  // Dynamic portfolio database loading
  const [works, setWorks] = useState<PortfolioItem[]>(() => {
    const saved = localStorage.getItem("pragnya_works");
    if (saved) return JSON.parse(saved);
    return PORTFOLIO_DATA.map(item => ({
      id: String(item.id),
      category: item.category,
      categoryLabel: item.categoryLabel,
      title: item.title,
      meta: item.meta,
      image: item.image,
      videoUrl: item.videoUrl
    }));
  });

  // Dynamic service cards state loading
  const [services, setServices] = useState<ServiceItem[]>(() => {
    const saved = localStorage.getItem("pragnya_services");
    if (saved) return JSON.parse(saved);
    const iconsMap: Record<string, string> = {
      Camera: "📸",
      Video: "📽️",
      Film: "🎬",
      Sparkles: "💍",
      Heart: "👶",
      Gift: "🎂"
    };
    return SERVICES_DATA.map(item => ({
      id: item.id,
      title: item.title,
      desc: item.description,
      icon: iconsMap[item.iconName] || "📸"
    }));
  });

  // Dynamic testimonials loading
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(() => {
    const saved = localStorage.getItem("pragnya_testimonials");
    if (saved) return JSON.parse(saved);
    return TESTIMONIALS_DATA.map(item => ({
      id: String(item.id),
      name: item.name,
      event: item.event,
      stars: item.stars,
      text: item.quote,
      image: item.image
    }));
  });

  // Loading screen state
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Nav scroll layout
  const [scrolled, setScrolled] = useState(false);

  // Category filter tracker
  const [activeCategory, setActiveCategory] = useState("all");

  // Lightbox selection holder
  const [selectedWork, setSelectedWork] = useState<PortfolioItem | null>(null);

  // Pop notifications / Action toast triggers
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Booking details holders
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingName, setBookingName] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [bookingService, setBookingService] = useState("");
  const [bookingDate, setBookingDate] = useState("");

  // Contact client form states
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactMsg, setContactMsg] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Sidebar toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Live action notifier
  const [notification, setNotification] = useState("");

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4400);
  };


  // Run automatic cloud datastore synchronization from GitHub Gist on startup
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlGistId = urlParams.get("gist");
    let activeGistId = gistConfig.gistId;

    if (urlGistId && urlGistId !== gistConfig.gistId) {
      activeGistId = urlGistId;
      const newConfig = { ...gistConfig, gistId: urlGistId };
      setGistConfig(newConfig);
      localStorage.setItem("pragnya_gist_config", JSON.stringify(newConfig));
    }

    if (!activeGistId) {
      return;
    }

    const fetchCloudData = async () => {
      try {
        const url = `https://api.github.com/gists/${activeGistId}`;
        const response = await fetch(url);
        if (response.ok) {
          const gistData = await response.json();
          const fileContent = gistData.files && gistData.files["pragnyasri_creations_db.json"]?.content;
          if (fileContent) {
            const parsed = JSON.parse(fileContent);
            if (parsed.settings) {
              setSettings(parsed.settings);
              localStorage.setItem("pragnya_settings", JSON.stringify(parsed.settings));
            }
            if (parsed.works) {
              setWorks(parsed.works);
              localStorage.setItem("pragnya_works", JSON.stringify(parsed.works));
            }
            if (parsed.services) {
              setServices(parsed.services);
              localStorage.setItem("pragnya_services", JSON.stringify(parsed.services));
            }
            if (parsed.testimonials) {
              setTestimonials(parsed.testimonials);
              localStorage.setItem("pragnya_testimonials", JSON.stringify(parsed.testimonials));
            }
            triggerToast("Synchronized with cloud database!");
          }
        }
      } catch (err) {
        console.error("Failed to fetch cloud database from Gist:", err);
      }
    };

    fetchCloudData();
  }, []);


  // Run initial preloader countdown
  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 8) + 4;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setLoading(false);
        }, 600);
      }
      setLoadingProgress(progress);
    }, 70);

    return () => clearInterval(interval);
  }, []);

  // Monitor window scroll to add glass blurs to header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Set randomized gentle notification alerts to mimic prime activity
  useEffect(() => {
    const notifications = [
      "Pragnya from Hyderabad just locked a wedding session!",
      "A premium pre-wedding shoot was booked for Ooty.",
      "New cinematic teaser uploaded to Instagram gallery.",
      "Limited slots remaining for November weddings."
    ];
    
    const initialTimer = setTimeout(() => {
      const randomMsg = notifications[Math.floor(Math.random() * notifications.length)];
      setNotification(randomMsg);
      setTimeout(() => setNotification(""), 6000);
    }, 15000);

    const recurringTimer = setInterval(() => {
      const randomMsg = notifications[Math.floor(Math.random() * notifications.length)];
      setNotification(randomMsg);
      setTimeout(() => setNotification(""), 6000);
    }, 45000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(recurringTimer);
    };
  }, []);

  // Filter portfolio list
  const filteredWorks = activeCategory === "all" 
    ? works 
    : works.filter(item => item.category === activeCategory);

  // Copy shareable link to clipboard
  const triggerCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    triggerToast("Premium Portfolio Link copied to clipboard!");
  };

  // Live whatsapp message routing
  const navigateWhatsApp = (customMessage: string) => {
    const defaultText = encodeURIComponent(customMessage);
    window.open(`https://wa.me/${settings.whatsapp}?text=${defaultText}`, "_blank");
  };

  // Form submits
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName || !bookingPhone || !bookingService) return;
    
    // Create WhatsApp Concierge payload
    const textStr = `Hello Pragnya Sri Creations! I would like to book a session.\n\n*Name:* ${bookingName}\n*Phone:* ${bookingPhone}\n*Service Type:* ${bookingService}\n*Preferred Date:* ${bookingDate || "Undecided"}`;
    navigateWhatsApp(textStr);
    
    // Close & reset
    setIsBookingOpen(false);
    setBookingName("");
    setBookingPhone("");
    setBookingService("");
    setBookingDate("");

    setToastMessage("Concierge request compiled! Opening WhatsApp...");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMsg) return;

    // Simulate luxury confirmation
    setFormSubmitted(true);
    setToastMessage("Thank you! Our creative concierge will connect with you within 24 hours.");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);

    // Reset Fields after delay
    setTimeout(() => {
      setContactName("");
      setContactEmail("");
      setContactPhone("");
      setContactMsg("");
      setFormSubmitted(false);
    }, 3000);
  };

  // Nav smooth scroll with element highlight
  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Dynamic Lucide-react components mapper for services
  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case "Camera": return <Camera id="icon-camera" className="w-8 h-8 text-[#c9a86c]" />;
      case "Video": return <Video id="icon-video" className="w-8 h-8 text-[#c9a86c]" />;
      case "Film": return <Film id="icon-film" className="w-8 h-8 text-[#c9a86c]" />;
      case "Sparkles": return <Sparkles id="icon-sparkles" className="w-8 h-8 text-[#c9a86c]" />;
      case "Heart": return <Heart id="icon-heart" className="w-8 h-8 text-[#c9a86c]" />;
      case "Gift": return <Gift id="icon-gift" className="w-8 h-8 text-[#c9a86c]" />;
      default: return <Camera id="icon-default" className="w-8 h-8 text-[#c9a86c]" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-[#d4cfc8] font-sans selection:bg-[#c9a86c] selection:text-[#080808] relative overflow-x-hidden">
      
      {/* 1. LUXURY PRELOADER */}
      <AnimatePresence>
        {loading && (
          <motion.div
            id="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
            className="fixed inset-0 bg-[#080808] z-[9999] flex flex-col items-center justify-center pointer-events-auto"
          >
            <div className="text-center px-6">
              {/* Animated Monogram Symbol */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="w-16 h-16 border border-[#c9a86c] rounded-full mx-auto flex items-center justify-center mb-6 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-[#c9a86c]/20 to-transparent animate-pulse" />
                <span className="font-serif text-xl font-light text-[#c9a86c]">P</span>
                <span className="font-serif text-sm font-light text-[#e8d5a3] -ml-0.5">S</span>
              </motion.div>

              {/* Title brand */}
              <motion.h1
                initial={{ letterSpacing: "0.15em", opacity: 0 }}
                animate={{ letterSpacing: "0.25em", opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="font-serif text-2xl md:text-3xl font-light text-[#c9a86c] tracking-widest uppercase mb-1"
              >
                PRAGNYA SRI
              </motion.h1>
              <p className="font-serif text-sm text-[#e8d5a3] italic uppercase tracking-[0.3em] font-light mb-8">
                CREATIONS
              </p>

              {/* Loading progress wrapper */}
              <div className="w-48 max-w-xs h-[1px] bg-[#222] mx-auto rounded-full overflow-hidden relative mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${loadingProgress}%` }}
                  transition={{ duration: 0.1 }}
                  className="h-full bg-gradient-to-r from-[#c9a86c] to-[#e8d5a3]"
                />
              </div>

              {/* Percent values */}
              <span className="font-mono text-[10px] uppercase text-[#c9a86c]/70 tracking-widest block">
                {loadingProgress}% Cinematic Canvas Loaded
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. GLASSMORPHIC NAVBAR & COMMAND RAIL */}
      <nav
        id="navbar"
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500`}
      >
        {/* Administrative Ribbon Bar */}
        {isAdmin && (
          <div id="admin-bar" className="w-full bg-[#c9a86c] text-[#080808] py-2 px-6 flex items-center justify-between text-[10px] font-sans font-bold tracking-wider relative z-[105] uppercase border-b border-[#080808]/20">
            <div className="flex items-center gap-3">
              <span className="bg-black text-[#c9a86c] text-[9px] px-2 py-0.5 font-bold tracking-widest flex items-center gap-1">
                <Unlock className="w-3 h-3" />
                <span>SESSION STATUS : ACTIVE</span>
              </span>
              <span className="hidden sm:inline-block font-serif text-xs font-normal">
                Pragnya Sri Creations Command Desk
              </span>
            </div>
            <div className="flex items-center gap-4 sm:gap-6">
              <button
                id="admin-add-trigger"
                onClick={() => {
                  setEditingWork(null);
                  setActiveModal("work");
                }}
                className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Work</span>
              </button>
              <button
                id="admin-settings-trigger"
                onClick={() => setActiveModal("settings")}
                className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <SettingsIcon className="w-3.5 h-3.5" />
                <span>Settings</span>
              </button>
              <button
                id="admin-sync-trigger"
                onClick={() => setActiveModal("sync")}
                className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sync Cloud</span>
              </button>
              <button
                id="admin-logout-trigger"
                onClick={() => {
                  handleSetIsAdmin(false);
                  triggerToast("Administrator credentials logged out.");
                }}
                className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer border-l border-[#080808]/15 pl-4 sm:pl-6"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Exit</span>
              </button>
            </div>
          </div>
        )}

        {/* Real-time Glassmorphic visual container */}
        <div className={`transition-all duration-500 ${
          scrolled 
            ? "backdrop-blur-md bg-[#080808]/85 py-3 border-b border-[#c9a86c]/10" 
            : "bg-transparent py-6"
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex items-center justify-between">
            
            {/* Logo with circular layout */}
            <div 
              id="brand-logo"
              onClick={() => scrollToSection("home")}
              className="flex items-center gap-2 sm:gap-3 cursor-pointer group min-w-0"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#c9a86c] flex items-center justify-center relative bg-black overflow-hidden transition-all duration-500 group-hover:scale-105 group-hover:border-[#e8d5a3] shrink-0">
                {settings.heroLogoUrl ? (
                  <img src={settings.heroLogoUrl} alt="logo" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-radial-gradient-dark group-hover:opacity-80 transition-opacity" />
                    <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#c9a86c] group-hover:rotate-12 transition-transform duration-500" />
                  </>
                )}
              </div>
              <div className="min-w-0 select-none">
                <span className="font-serif text-xs sm:text-base font-medium tracking-[0.1em] sm:tracking-[0.12em] text-[#c9a86c] block leading-none truncate max-w-[130px] sm:max-w-none">
                  {settings.name.split(" ").slice(0, 2).join(" ") || "PRAGNYA SRI"}
                </span>
                <span className="text-[8px] sm:text-[10px] font-sans tracking-[0.2em] sm:tracking-[0.25em] text-[#d4cfc8]/70 block mt-0.5 leading-none truncate max-w-[130px] sm:max-w-none">
                  {settings.name.split(" ").slice(2).join(" ") || "CREATIONS"}
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              {["Home", "Portfolio", "Services", "About", "Contact"].map((link) => (
                <button
                  key={link}
                  onClick={() => scrollToSection(link.toLowerCase())}
                  className="text-xs font-medium uppercase tracking-widest text-[#d4cfc8]/70 hover:text-[#c9a86c] transition-colors relative py-1 group"
                >
                  {link}
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#c9a86c] transition-all duration-300 group-hover:w-full" />
                </button>
              ))}
            </div>

            {/* Book Now trigger & Menu (Desktop) */}
            <div className="hidden md:flex items-center gap-4">
              <button
                id="nav-book-btn"
                onClick={() => setIsBookingOpen(true)}
                className="px-6 py-2.5 bg-[#c9a86c] text-[#080808] text-[10px] uppercase tracking-[0.2em] font-semibold transition-all duration-300 hover:bg-[#e8d5a3] hover:shadow-[0_0_15px_rgba(201,168,108,0.3)] shadow-[0_4px_10px_rgba(0,0,0,0.4)] cursor-pointer"
              >
                Book Now
              </button>

              {/* Administrative Shield Gate Lock */}
              <button
                id="lock-btn"
                onClick={() => {
                  if (isAdmin) {
                    handleSetIsAdmin(false);
                    triggerToast("Logged out from admin role.");
                  } else {
                    setActiveModal("login");
                  }
                }}
                className="w-10 h-10 rounded-full border border-white/5 hover:border-[#c9a86c]/70 flex items-center justify-center text-[#d4cfc8] hover:text-[#c9a86c] transition-colors relative bg-black/30 cursor-pointer"
                title={isAdmin ? "Log out Admin" : "Log in Admin"}
              >
                {isAdmin ? <Unlock className="w-4 h-4 text-[#c9a86c]" /> : <Lock className="w-4 h-4 text-[#c9a86c]" />}
              </button>
            </div>

            {/* Hamburger menu trigger (Mobile) */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                id="lock-btn-mobile"
                onClick={() => {
                  if (isAdmin) {
                    handleSetIsAdmin(false);
                    triggerToast("Logged out from admin role.");
                  } else {
                    setActiveModal("login");
                  }
                }}
                className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-[#c9a86c] cursor-pointer"
              >
                {isAdmin ? <Unlock className="w-4.5 h-4.5" /> : <Lock className="w-4.5 h-4.5" />}
              </button>

              <button
                id="mobile-menu-trigger"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-[#d4cfc8] hover:text-[#c9a86c] transition-colors p-2"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

          </div>
        </div>

        {/* Mobile dropdown sliding menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              id="mobile-nav-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="md:hidden bg-[#0e0e0e]/95 border-b border-[#c9a86c]/20 backdrop-blur-lg w-full absolute top-[100%] left-0"
            >
              <div className="px-6 py-8 flex flex-col gap-6 text-center">
                {["Home", "Portfolio", "Services", "About", "Contact"].map((link) => (
                  <button
                    key={link}
                    onClick={() => scrollToSection(link.toLowerCase())}
                    className="text-sm font-medium tracking-[0.15em] uppercase text-[#d4cfc8] hover:text-[#c9a86c] transition-all block"
                  >
                    {link}
                  </button>
                ))}
                
                <div className="h-[1px] bg-[#c9a86c]/10 my-1" />

                <button
                  id="mobile-book-btn"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsBookingOpen(true);
                  }}
                  className="w-full py-3 bg-[#c9a86c] text-[#080808] text-xs font-semibold uppercase tracking-widest rounded-none"
                >
                  Book Now
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 3. HERO SECTION */}
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      >
        {/* Dynamic media selection logic (Cinematic Video stream vs HD Still Portrait) */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          {settings.heroMediaType === "video" && settings.heroVideoUrl ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover scale-[1.01]"
              key={settings.heroVideoUrl}
            >
              <source src={settings.heroVideoUrl} type="video/mp4" />
            </video>
          ) : (
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
              className="w-full h-full bg-cover bg-center"
              style={{ 
                backgroundImage: `url('${settings.heroImageUrl || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=2000"}')` 
              }}
            />
          )}
          {/* Subtle Dark Luxury Cinematic Vignette & Solid Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/75 to-black/90" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#080808_95%)]" />
        </div>

        {/* Floating Administrative Action Overlay button */}
        {isAdmin && (
          <div className="absolute top-28 left-6 z-20">
            <button
              onClick={() => setActiveModal("edit-intro")}
              className="px-4 py-2 border border-[#c9a86c] text-[#c9a86c] text-[10px] uppercase font-bold tracking-widest bg-black/85 hover:bg-[#c9a86c] hover:text-[#080808] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Intro Backdrop</span>
            </button>
          </div>
        )}

        {/* Ambient Floating Dust particles overlay */}
        <div className="absolute inset-0 z-1 pointer-events-none opacity-40">
          <div className="absolute top-[20%] left-[10%] w-1.5 h-1.5 rounded-full bg-[#c9a86c]/70 blur-sm animate-pulse" />
          <div className="absolute top-[60%] left-[80%] w-2 h-2 rounded-full bg-[#e8d5a3]/50 blur-md animate-bounce" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-[30%] left-[30%] w-1 h-1 rounded-full bg-[#c9a86c]/80 blur-[1px] animate-pulse" style={{ animationDuration: '4s' }} />
        </div>

        {/* Main Content Container */}
        <div className="max-w-5xl mx-auto px-6 text-center z-10 relative mt-8">
          
          <span className="font-serif text-[10px] tracking-[0.3em] text-[#c9a86c] uppercase block mb-4 animate-pulse">
            {settings.heroEyebrow || "— A Fine Art Photography Studio —"}
          </span>

          {/* Concentric Floating Logo Rings */}
          <div id="hero-logo-box" className="mb-8 flex justify-center">
            <div className="relative w-28 h-28 flex items-center justify-center">
              {/* Spinning outer rings */}
              <div className="absolute inset-0 border border-[#c9a86c]/20 rounded-full animate-spin" style={{ animationDuration: '30s' }} />
              <div className="absolute inset-2 border border-dashed border-[#e8d5a3]/30 rounded-full animate-spin" style={{ animationDuration: '20s', animationDirection: 'reverse' }} />
              <div className="absolute inset-4 border border-[#c9a86c]/45 rounded-full animate-pulse" style={{ animationDuration: '3s' }} />
              
              {/* Floating inner core capsule */}
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 rounded-full bg-black/80 border border-[#c9a86c] flex items-center justify-center shadow-[0_0_25px_rgba(201,168,108,0.3)] overflow-hidden"
              >
                {settings.heroLogoUrl ? (
                  <img src={settings.heroLogoUrl} alt="Logo emblem overlay" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-6 h-6 text-[#c9a86c]" />
                )}
              </motion.div>
            </div>
          </div>

          {/* Majestic Studio Heading */}
          <motion.div
            id="hero-header-text"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3 }}
          >
            <h1 className="font-serif font-light tracking-[0.18em] text-4xl sm:text-6xl md:text-8xl text-white uppercase leading-[1.1]">
              {settings.name.split(" ").slice(0, 2).join(" ") || "PRAGNYA SRI"} <br />
              <span className="text-[#c9a86c] tracking-[0.3em] font-light text-2xl sm:text-4xl md:text-5xl block mt-3">
                {settings.name.split(" ").slice(2).join(" ") || "CREATIONS"}
              </span>
            </h1>
          </motion.div>

          {/* Elegantly formatted subtitle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1 }}
            className="mt-6 font-serif text-lg md:text-xl text-[#d4cfc8]/90 tracking-wide max-w-2xl mx-auto italic"
          >
            <span className="text-[#c9a86c] font-normal not-italic">★</span> {settings.tagline} <span className="text-[#c9a86c] font-normal not-italic">★</span>
          </motion.div>

          {/* Action triggers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.3 }}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
          >
            <button
              id="hero-work-btn"
              onClick={() => scrollToSection("portfolio")}
              className="w-56 sm:w-auto px-8 py-3.5 border border-[#c9a86c] text-[#c9a86c] text-xs font-normal uppercase tracking-widest hover:bg-[#c9a86c] hover:text-[#080808] transition-all bg-black/40 cursor-pointer"
            >
              View Our Work
            </button>
            <button
              id="hero-book-btn"
              onClick={() => setIsBookingOpen(true)}
              className="w-56 sm:w-auto px-8 py-3.5 bg-[#c9a86c] text-[#080808] text-xs font-semibold uppercase tracking-widest hover:bg-[#e8d5a3] transition-colors cursor-pointer"
            >
              Book a Session
            </button>
          </motion.div>

        </div>

        {/* Scroll pointer tracker icon */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-center animate-bounce">
          <button 
            id="hero-scroll-trigger"
            onClick={() => scrollToSection("statistics")}
            className="flex flex-col items-center gap-2 cursor-pointer"
          >
            <span className="font-sans text-[8px] uppercase tracking-[0.4em] text-[#c9a86c]/70">
              Scroll
            </span>
            <div className="w-5 h-8 rounded-full border border-[#c9a86c]/60 p-1 flex justify-center">
              <div className="w-1 h-2 bg-[#c9a86c] rounded-full animate-ping" />
            </div>
          </button>
        </div>

      </section>

      {/* 4. STATISTICS SECTION */}
      <section
        id="statistics"
        className="bg-[#0e0e0e] border-y border-[#c9a86c]/10 py-16 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 relative z-10 text-center">
            
            {[
              { id: "works", value: settings.statWorks, label: "Complete Events" },
              { id: "years", value: settings.statYears, label: "Years Experience" },
              { id: "clients", value: settings.statClients, label: "Happy Couples" },
              { id: "cities", value: settings.statCities, label: "Cities Explored" }
            ].map((stat, i) => (
              <div 
                key={stat.id} 
                id={`stat-box-${stat.id}`}
                className="flex flex-col items-center justify-center relative py-4 group"
              >
                {/* Accent mini corner decoration */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[1px] bg-gradient-to-r from-transparent via-[#c9a86c]/40 to-transparent scale-0 group-hover:scale-100 transition-all duration-500" />
                
                <h3 className="font-serif text-4xl md:text-5xl font-light text-[#c9a86c] leading-tight flex items-end justify-center">
                  <span>{stat.value}</span>
                </h3>
                
                {/* Separator line under design criteria */}
                <div className="w-6 h-[1px] bg-[#c9a86c]/30 my-3" />

                <p className="text-[10px] md:text-xs uppercase tracking-widest text-[#d4cfc8]/80 font-medium font-sans">
                  {stat.label}
                </p>

                {/* Vertical Separator for wide grids */}
                {i < 3 && (
                  <div className="hidden lg:block absolute -right-6 top-1/4 h-1/2 w-[1px] bg-[#c9a86c]/15" />
                )}
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* 5. PORTFOLIO SECTION */}
      <section
        id="portfolio"
        className="py-24 md:py-32 relative bg-radial-gradient-dark"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          {/* Symmetrical Luxury Header */}
          <div className="text-center mb-16">
            <span className="font-serif text-[11px] font-light uppercase tracking-[0.4em] text-[#c9a86c] block mb-2">
              Our Legacy
            </span>
            <div className="h-[1px] w-12 bg-[#c9a86c] mx-auto mb-4" />
            <h2 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-white uppercase leading-normal">
              PORTFOLIO
            </h2>
            <p className="text-xs md:text-sm text-[#d4cfc8]/70 font-sans tracking-wider max-w-xl mx-auto mt-2 italic">
              Explore dynamic showcases of timeless stories curated with editorial elegance
            </p>
          </div>

          {/* Elegant Carousel Filters Tabs */}
          <div 
            id="portfolio-tabs-container"
            className="flex flex-wrap items-center justify-center gap-2 mb-12 max-w-4xl mx-auto border-b border-[#c9a86c]/10 pb-4"
          >
            {[
              { id: "all", label: "All" },
              { id: "wedding", label: "Wedding Highlights" },
              { id: "pre-wedding", label: "Pre Wedding" },
              { id: "songs", label: "Cover Songs" },
              { id: "baby", label: "Baby Shoots" },
              { id: "birthday", label: "Birthday Events" },
              { id: "other", label: "Other" }
            ].map((tab) => (
              <button
                key={tab.id}
                id={`tab-filter-${tab.id}`}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-4 py-2 text-[10px] md:text-xs uppercase tracking-[0.18em] transition-all duration-300 ${
                  activeCategory === tab.id
                    ? "text-[#080808] bg-[#c9a86c] font-semibold"
                    : "text-[#d4cfc8]/70 hover:text-[#c9a86c]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Masonry Columns Layout */}
          <div 
            id="portfolio-masonry-wrapper"
            className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredWorks.map((item) => (
                <motion.div
                  key={item.id}
                  id={`portfolio-item-${item.id}`}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  onClick={() => setSelectedWork(item)}
                  className="break-inside-avoid relative overflow-hidden group cursor-pointer border border-zinc-900 bg-[#0e0e0e] shadow-2xl"
                >
                  {/* Administrative edit and delete coordinates buttons overlay */}
                  {isAdmin && (
                    <div className="absolute top-4 right-4 z-30 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => {
                          setEditingWork(item);
                          setActiveModal("work");
                        }}
                        className="p-2 bg-[#080808] border border-[#c9a86c]/40 hover:border-[#c9a86c] text-[#c9a86c] hover:bg-[#c9a86c] hover:text-[#080808] transition-all rounded-none cursor-pointer"
                        title="Edit Work"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Do you wish to permanently delete "${item.title}"?`)) {
                            const updated = works.filter((w) => w.id !== item.id);
                            setWorks(updated);
                            localStorage.setItem("pragnya_works", JSON.stringify(updated));
                            triggerToast(`Deleted "${item.title}"`);
                          }
                        }}
                        className="p-2 bg-[#080808] border border-red-500/40 hover:border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all rounded-none cursor-pointer"
                        title="Delete Work"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Image Aspect ratio container */}
                  <div className="relative overflow-hidden aspect-[3/4] sm:aspect-auto">
                    <img
                      src={item.image}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                    />
                    
                    {/* Dark gradient visual lens card overlay */}
                    <div className="absolute inset-x-0 bottom-0 top-1/4 bg-gradient-to-t from-black via-black/40 to-transparent transition-opacity duration-500 opacity-80 group-hover:opacity-100" />
                    
                    {/* Golden thin border on active hover state */}
                    <div className="absolute inset-0 border border-[#c9a86c] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10 m-3" />
                    
                    {/* Centered Golden Cinematic play node button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-75 group-hover:scale-100 z-10">
                      <div className="w-14 h-14 rounded-full bg-[#080808]/90 border border-[#c9a86c] flex items-center justify-center text-[#c9a86c] group-hover:shadow-[0_0_20px_rgba(201,168,108,0.5)] transition-shadow">
                        <Play className="w-5 h-5 ml-1 fill-current" />
                      </div>
                    </div>

                    {/* Metadata text card slides upward on hover */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-10 text-left transition-transform duration-500 transform translate-y-2 group-hover:translate-y-0">
                      <span className="font-serif text-[10px] uppercase tracking-widest text-[#c9a86c] block mb-1">
                        {item.categoryLabel}
                      </span>
                      <h3 className="font-serif text-lg md:text-xl font-light text-white tracking-wide uppercase leading-snug">
                        {item.title}
                      </h3>
                      
                      <div className="h-[1px] bg-[#c9a86c]/30 my-2 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                      
                      <p className="text-[10px] text-[#d4cfc8]/80 font-sans tracking-wide truncate max-w-full">
                        {item.meta}
                      </p>
                    </div>

                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Dynamic Empty filter handler */}
          {filteredWorks.length === 0 && (
            <div className="text-center py-20">
              <span className="font-serif text-[#c9a86c]/50 text-base">
                No productions found in this category at this time.
              </span>
            </div>
          )}

        </div>
      </section>

      {/* LIGHTBOX CUSTOM MEDIA SYSTEM MODAL */}
      <AnimatePresence>
        {selectedWork && (
          <motion.div
            id="portfolio-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#080808]/98 backdrop-blur-md z-[500] flex flex-col justify-between p-4 md:p-8"
          >
            {/* Top Close Control Panel */}
            <div className="flex items-center justify-between w-full p-4 relative z-[510]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border border-[#c9a86c]/40 flex items-center justify-center">
                  <Play className="w-3 h-3 text-[#c9a86c]" />
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-[#c9a86c] font-sans block leading-none">
                    Currently Viewing Reel
                  </span>
                  <span className="font-serif text-sm text-white block mt-1 tracking-wider">
                    {selectedWork.title}
                  </span>
                </div>
              </div>

              <button
                id="lightbox-close-btn"
                onClick={() => setSelectedWork(null)}
                className="w-12 h-12 rounded-full border border-white/10 hover:border-[#c9a86c] flex items-center justify-center text-white hover:text-[#c9a86c] transition-all bg-[#0e0e0e]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Central Video Player / High-Definition display section */}
            <div className="flex-1 flex items-center justify-center px-4 max-w-5xl mx-auto w-full my-4">
              <div className="w-full bg-[#0a0a0a] border border-[#c9a86c]/10 shadow-[0_0_50px_rgba(201,168,108,0.15)] relative aspect-video">
                
                {/* Embedded Video Player Iframe simulator with cinematic settings */}
                <iframe
                  id="lightbox-iframe-player"
                  key={selectedWork.id}
                  src={`${getEmbedUrl(selectedWork.videoUrl)}?autoplay=1&rel=0&modestbranding=1`}
                  title={selectedWork.title}
                  referrerPolicy="strict-origin-when-cross-origin"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full absolute inset-0 border-0"
                />

                {/* Left vertical info pillar indicator */}
                <div className="absolute top-4 left-4 z-20 hidden md:flex items-center gap-2 bg-black/60 border border-white/5 py-1 px-3 text-[9px] uppercase tracking-widest text-[#c9a86c]">
                  <Info className="w-3 h-3" />
                  <span>Cinematic Production Raw Stream</span>
                </div>

              </div>
            </div>

            {/* Bottom details description toolbar */}
            <div className="max-w-4xl mx-auto w-full text-center pb-6 px-4">
              <span className="text-[10px] py-1 px-3 bg-[#c9a86c]/10 text-[#c9a86c] border border-[#c9a86c]/20 uppercase tracking-[0.2em] inline-block mb-3">
                {selectedWork.categoryLabel}
              </span>
              <p className="text-xs text-[#d4cfc8]/80 font-sans tracking-wide max-w-2xl mx-auto">
                {selectedWork.meta} — Developed exclusively in 4K DCI master rendering formats with Pragnya Sri Creations design standard.
              </p>
              
              <div className="mt-6 flex justify-center gap-4">
                <button
                  id="lightbox-inquire-btn"
                  onClick={() => {
                    navigateWhatsApp(`Hi Pragnya Sri Creations! I just viewed your spectacular portfolio reel "${selectedWork.title}" and would like to inquire about similar packages!`);
                    setSelectedWork(null);
                  }}
                  className="px-6 py-2.5 bg-[#c9a86c] text-[#080808] text-[9px] uppercase tracking-widest font-semibold hover:bg-[#e8d5a3] transition-colors"
                >
                  Inquire About This Format
                </button>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. SERVICES SECTION */}
      <section
        id="services"
        className="py-24 md:py-32 bg-[#0e0e0e] border-y border-[#c9a86c]/10 relative relative"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          
          {/* Symmetrical Header */}
          <div className="text-center mb-20">
            <span className="font-serif text-[11px] font-light uppercase tracking-[0.4em] text-[#c9a86c] block mb-2">
              Our Craft
            </span>
            <div className="h-[1px] w-12 bg-[#c9a86c] mx-auto mb-4" />
            <h2 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-white uppercase leading-normal">
              SERVICES
            </h2>
            <p className="text-xs md:text-sm text-[#d4cfc8]/70 font-sans tracking-wider max-w-xl mx-auto mt-2 italic">
              Impeccable execution, premium technology, and deep cinematic devotion
            </p>
          </div>

          {/* Service grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((srv, idx) => {
              // Custom luxurious checklist items for each service category
              const detailsMap: Record<string, string[]> = {
                "Wedding Highlight": ["Cinematic Teasers & Feature Films", "Multi-camera Drone Coverage", "State-of-the-Art Color Grading"],
                "Pre-Wedding Films": ["Exclusive Location Shoots", "Stylized Concept & Scripting", "Direct Director Mentoring"],
                "Cover Music Video": ["High fidelity Studio Sound Master", "Visual Sync & Choreography", "Fine-Art Framing Layouts"],
                "Newborn Baby Shoot": ["Certified safe baby props", "Soft comfortable studio setup", "Artistic custom theme designs"],
                "Birthday & Corporate": ["Event layout mapping documentation", "Candid moments highlights reel", "Fast master delivery system"]
              };
              const srvDetails = detailsMap[srv.title] || ["Premium Professional Retouching", "Online Private Cloud Gallery", "Master Cinematic Dolby Sound"];

              return (
                <div
                  key={srv.id || idx}
                  id={`service-box-${srv.id || idx}`}
                  className="bg-[#080808] border border-zinc-900 p-8 md:p-10 relative overflow-hidden group transition-all duration-500 hover:border-[#c9a86c]/30 hover:shadow-[0_10px_35px_rgba(201,168,108,0.06)]"
                >
                  {/* Top scaling gold indicator bar */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#c9a86c] to-[#e8d5a3] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
                  
                  {/* Floating dynamic icon background element */}
                  <div className="absolute right-4 bottom-4 opacity-5 text-stone-600 scale-150 transform translate-x-1/4 translate-y-1/4 pointer-events-none group-hover:opacity-10 transition-opacity duration-500 text-3xl">
                    {srv.icon || "📸"}
                  </div>
  
                  {/* Service Icons and Title */}
                  <div className="mb-6 flex items-center justify-between">
                    <div className="w-14 h-14 bg-[#0e0e0e] rounded-none border border-zinc-900 group-hover:border-[#c9a86c]/30 flex items-center justify-center transition-all duration-500 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(201,168,108,0.2)] text-2xl">
                      {srv.icon || "📸"}
                    </div>
                    <span className="font-mono text-[10px] tracking-widest text-[#c9a86c]/50">
                      0{idx + 1} // CINEMA
                    </span>
                  </div>
  
                  <h3 className="font-serif text-xl font-normal text-white tracking-wide uppercase mb-4">
                    {srv.title}
                  </h3>
  
                  <p className="text-xs text-[#d4cfc8]/70 mb-8 font-sans leading-relaxed tracking-wide min-h-[50px]">
                    {srv.desc}
                  </p>
  
                  {/* High contrast interactive checklist */}
                  <ul className="space-y-2.5 border-t border-zinc-900/80 pt-6">
                    {srvDetails.map((dt, idx2) => (
                      <li key={idx2} className="flex items-center gap-2.5 text-[11px] text-[#d4cfc8]/90 font-sans tracking-wide">
                        <div className="w-1 h-1 rounded-full bg-[#c9a86c]" />
                        <span>{dt}</span>
                      </li>
                    ))}
                  </ul>
  
                  {/* Action inquire link */}
                  <div className="mt-8 pt-4">
                    <button
                      onClick={() => {
                        setIsBookingOpen(true);
                        setBookingService(srv.title);
                      }}
                      className="text-[10px] uppercase tracking-widest font-semibold text-[#c9a86c] hover:text-[#e8d5a3] flex items-center gap-1.5 transition-colors group/btn cursor-pointer bg-transparent border-none"
                    >
                      <span>Inquire Capacity</span>
                      <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
  
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 7. ABOUT SECTION */}
      <section
        id="about"
        className="py-24 md:py-32 relative overflow-hidden bg-radial-gradient-dark"
      >
        {/* Floating Administrative Action Overlay button */}
        {isAdmin && (
          <div className="absolute top-8 left-6 z-20">
            <button
              onClick={() => setActiveModal("edit-story")}
              className="px-4 py-2 border border-[#c9a86c] text-[#c9a86c] text-[10px] uppercase font-bold tracking-widest bg-black/85 hover:bg-[#c9a86c] hover:text-[#080808] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Studio Story</span>
            </button>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            
            {/* Split layout LEFT: High-end artist portrait frame */}
            <div className="lg:col-span-5 relative">
              <div 
                id="about-portrait-wrapper"
                className="relative mx-auto max-w-sm lg:max-w-none"
              >
                {/* Floating golden offset outline frames */}
                <div className="absolute -inset-4 border border-[#c9a86c] opacity-40 transform translate-x-3 translate-y-3 pointer-events-none z-0" />
                
                {/* Central imagery block */}
                <div className="relative z-10 border border-zinc-800 p-2 bg-black shadow-2xl">
                  <img
                    src={settings.aboutImage || "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=1200"}
                    alt="Creative Director holding camera"
                    referrerPolicy="no-referrer"
                    className="w-full object-cover aspect-[3/4]"
                  />
                  
                  {/* Subtle caption bottom pillar overlay */}
                  <div className="absolute bottom-6 left-6 right-6 bg-[#080808]/90 backdrop-blur-sm border border-[#c9a86c]/20 p-4">
                    <span className="font-serif text-xs text-[#c9a86c] block uppercase tracking-wide">
                      {settings.sig}
                    </span>
                    <span className="text-[9px] text-[#d4cfc8]/60 uppercase tracking-widest font-sans mt-0.5 block">
                      {settings.aboutSigLabel}
                    </span>
                  </div>
                </div>

                {/* Background artistic elements */}
                <div className="absolute -top-10 -left-10 h-32 w-32 bg-gradient-to-tr from-[#c9a86c]/10 to-transparent blur-2xl rounded-full" />
                <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-gradient-to-tr from-[#c9a86c]/5 to-transparent blur-3xl rounded-full" />
              </div>
            </div>

            {/* Split layout RIGHT: Premium Storytelling Text */}
            <div className="lg:col-span-7 text-left">
              <span className="font-serif text-[11px] font-light uppercase tracking-[0.4em] text-[#c9a86c] block mb-2">
                Our Philosophy
              </span>
              <div className="h-[1px] w-12 bg-[#c9a86c] mb-6" />
              
              <h2 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-white uppercase mb-8 leading-tight">
                {settings.aboutHeading.split(" ").slice(0, 1).join(" ") || "Timeless"} <span className="italic text-[#c9a86c] font-medium font-serif">{settings.aboutHeading.split(" ").slice(1, 2).join(" ") || "Memories"}</span> <br /> 
                {settings.aboutHeading.split(" ").slice(2).join(" ") || "& Magical Reels"}
              </h2>

              <div className="space-y-6 text-sm text-[#d4cfc8]/85 font-sans leading-relaxed">
                <p>
                  {settings.about1}
                </p>
                <p>
                  {settings.about2}
                </p>
              </div>

              {/* Founder's digital elegant signature and gold touch */}
              <div className="mt-10 pt-8 border-t border-zinc-900 flex items-center justify-between">
                <div>
                  <p className="font-serif text-2xl text-[#c9a86c] italic font-light tracking-wider">
                    {settings.name}
                  </p>
                  <span className="text-[10px] uppercase tracking-widest text-[#d4cfc8]/50 block mt-1">
                    Cine-Aesthetics Laboratory
                  </span>
                </div>
                <div className="w-16 h-12 flex items-center justify-center opacity-30">
                  <span className="font-serif text-3xl italic font-serif text-[#c9a86c]">Est. 2018</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 8. TESTIMONIALS SECTION */}
      <section
        id="testimonials"
        className="py-24 md:py-32 bg-[#0e0e0e] border-y border-[#c9a86c]/10 relative relative"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          
          {/* Symmetrical Header */}
          <div className="text-center mb-20">
            <span className="font-serif text-[11px] font-light uppercase tracking-[0.4em] text-[#c9a86c] block mb-2">
              Endorsements
            </span>
            <div className="h-[1px] w-12 bg-[#c9a86c] mx-auto mb-4" />
            <h2 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-white uppercase leading-normal">
              TESTIMONIALS
            </h2>
            <p className="text-xs md:text-sm text-[#d4cfc8]/70 font-sans tracking-wider max-w-xl mx-auto mt-2 italic">
              A testament to our devotion shared by our prominent, happy client families
            </p>
          </div>

          {/* Testimonial elegant cards block */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div
                key={t.id}
                id={`testimonial-card-${t.id}`}
                className="bg-[#080808] border border-zinc-900 p-8 flex flex-col justify-between relative group hover:border-[#c9a86c]/20 transition-all duration-300"
              >
                {/* Accent giant gold quote decorator inside frame */}
                <span className="absolute top-4 right-6 font-serif text-7xl text-[#c9a86c]/10 select-none pointer-events-none group-hover:text-[#c9a86c]/15 transition-colors">
                  “
                </span>

                {/* Administrative custom controls overlay */}
                {isAdmin && (
                  <div className="absolute top-4 left-4 z-30 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Do you wish to delete testimonial of ${t.name}?`)) {
                          const updated = testimonials.filter((tm) => tm.id !== t.id);
                          setTestimonials(updated);
                          localStorage.setItem("pragnya_testimonials", JSON.stringify(updated));
                          triggerToast(`Removed review of ${t.name}`);
                        }
                      }}
                      className="p-1 px-2 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white transition-all text-[9.5px] font-sans bg-black/85 cursor-pointer rounded-none"
                      title="Delete Review"
                    >
                      Delete Review
                    </button>
                  </div>
                )}

                <div>
                  {/* Gold Star rating indicator vector */}
                  <div className="flex items-center gap-1 mb-5">
                    {[...Array(t.stars)].map((_, idx) => (
                      <Star key={idx} className="w-4.5 h-4.5 text-[#c9a86c] fill-current" />
                    ))}
                  </div>

                  <p className="text-xs text-[#d4cfc8]/80 leading-relaxed font-sans italic mb-8 min-h-[90px]">
                    "{t.text}"
                  </p>
                </div>

                {/* Customer client image circle avatar */}
                <div className="flex items-center gap-4 pt-6 border-t border-zinc-900">
                  <div className="w-12 h-12 rounded-full border border-[#c9a86c] p-0.5 overflow-hidden">
                    <img
                      src={t.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300"}
                      alt={t.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-medium text-white tracking-wide">
                      {t.name}
                    </h4>
                    <span className="text-[10px] text-[#c9a86c]/80 uppercase tracking-widest font-sans font-medium mt-0.5 block">
                      {t.event}
                    </span>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 9. INSTAGRAM GALLERY */}
      <section
        id="instagram"
        className="py-24 md:py-32 relative bg-radial-gradient-dark"
      >
        {/* Floating Administrative Action Overlay button */}
        {isAdmin && (
          <div className="absolute top-8 left-6 z-20">
            <button
              onClick={() => setActiveModal("edit-gallery")}
              className="px-4 py-2 border border-[#c9a86c] text-[#c9a86c] text-[10px] uppercase font-bold tracking-widest bg-black/85 hover:bg-[#c9a86c] hover:text-[#080808] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Instagram Gallery</span>
            </button>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          
          {/* Header */}
          <div className="text-center mb-16">
            <span className="font-serif text-[11px] font-light uppercase tracking-[0.4em] text-[#c9a86c] block mb-2">
              {settings.instaSubtext ? settings.instaSubtext : "Follow Our Chronicle"}
            </span>
            <div className="h-[1px] w-12 bg-[#c9a86c] mx-auto mb-4" />
            <h2 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-white uppercase leading-normal">
              @{settings.instaHandle || "PRAGNYASRI_CREATIONS"}
            </h2>
            
            <button
              id="instagram-follow-btn"
              onClick={() => window.open(settings.instagram, "_blank")}
              className="mt-6 px-6 py-2 border border-[#c9a86c] text-[#c9a86c] text-[10px] uppercase font-semibold tracking-widest hover:bg-[#c9a86c] hover:text-[#080808] transition-all bg-black/40 cursor-pointer"
            >
              Follow Studio Feed
            </button>
          </div>

          {/* 4-column Instagram grid */}
          <div 
            id="instagram-grid"
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {settings.instaImages.map((imgSrc, idx) => (
              <div
                key={idx}
                onClick={() => window.open(settings.instagram, "_blank")}
                className="relative overflow-hidden aspect-square group cursor-pointer border border-zinc-900 bg-zinc-950"
              >
                <img
                  src={imgSrc}
                  alt="Instagram studio snap"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Dark sliding hover overlay showing stats */}
                <div className="absolute inset-0 bg-black/75 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Instagram className="w-6 h-6 text-[#c9a86c] mb-2 scale-75 group-hover:scale-100 transition-transform" />
                  <div className="text-white text-[11px] tracking-wider font-mono flex items-center gap-3">
                    <span>♥ {Math.floor(400 - idx * 25)}+</span>
                    <span>✉ {Math.floor(20 - idx * 2)}+</span>
                  </div>
                </div>

                {/* Miniature camera shutter gold decoration on card borders */}
                <div className="absolute inset-0 border border-[#c9a86c]/20 pointer-events-none" />
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 10. CONTACT SECTION (Let's Work Together) */}
      <section
        id="contact"
        className="py-24 md:py-32 bg-[#0e0e0e] border-t border-[#c9a86c]/10 relative relative"
      >
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          
          {/* Symmetrical Header Logo Ball */}
          <div className="flex justify-center mb-8">
            <div className="w-14 h-14 rounded-full border border-[#c9a86c]/30 flex items-center justify-center p-0.5 animate-pulse bg-black">
              <div className="w-full h-full rounded-full border border-[#c9a86c] flex items-center justify-center">
                <Camera className="w-5 h-5 text-[#c9a86c]" />
              </div>
            </div>
          </div>

          <span className="font-serif text-[11px] font-light uppercase tracking-[0.4em] text-[#c9a86c] block mb-2">
            Initiate Conversation
          </span>
          <div className="h-[1px] w-12 bg-[#c9a86c] mx-auto mb-6" />

          <h2 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-white uppercase mb-4 leading-normal">
            LET'S WORK TOGETHER
          </h2>
          <p className="text-xs md:text-sm text-[#d4cfc8]/70 max-w-xl mx-auto mb-16 leading-relaxed">
            Reach out via our luxury interactive contact concierge desk or submit the reservation inquiry wire. We would love to capture your masterpiece.
          </p>

          {/* Quick Connect Action Cards Grid */}
          <div 
            id="contact-quick-grid"
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
          >
            {[
              { 
                id: "whats-trigger",
                title: "WhatsApp Us", 
                detail: "Instant Callback", 
                action: () => navigateWhatsApp(`Hi ${settings.name}! I would like to quickly connect and ask details for photo package inquiries.`), 
                icon: <MessageSquareIcon /> 
              },
              { 
                id: "call-trigger",
                title: "Voice Call", 
                detail: settings.phone, 
                action: () => window.open(`tel:${settings.phone.replace(/\s+/g, "")}`, "_self"), 
                icon: <Phone className="w-5 h-5 text-[#c9a86c]" /> 
              },
              { 
                id: "email-trigger",
                title: "Email Studio", 
                detail: settings.email, 
                action: () => window.open(`mailto:${settings.email}?subject=Studio Photography Inquiry`, "_self"), 
                icon: <Mail className="w-5 h-5 text-[#c9a86c]" /> 
              },
              { 
                id: "share-trigger",
                title: "Share Link", 
                detail: "Copy Portfolio URL", 
                action: triggerCopy, 
                icon: <Share2 className="w-5 h-5 text-[#c9a86c]" /> 
              }
            ].map((box, idx) => (
              <div
                key={idx}
                id={box.id}
                onClick={box.action}
                className="bg-[#080808] border border-zinc-900 hover:border-[#c9a86c]/30 p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:scale-[1.02] group"
              >
                <div className="w-10 h-10 rounded-full border border-[#c9a86c]/20 group-hover:border-[#c9a86c]/55 flex items-center justify-center mb-4 transition-colors">
                  {box.icon}
                </div>
                <h4 className="font-serif text-sm text-white font-medium group-hover:text-[#c9a86c] transition-colors leading-none mb-1.5">
                  {box.title}
                </h4>
                <p className="text-[9px] text-[#d4cfc8]/50 uppercase tracking-widest text-center truncate max-w-full leading-none mt-1">
                  {box.detail}
                </p>
              </div>
            ))}
          </div>

          {/* Symmetrical Luxury Interactive Reservation Wire Form */}
          <div className="max-w-2xl mx-auto bg-[#080808] border border-zinc-900 p-8 sm:p-12 text-left relative overflow-hidden">
            {/* Corner accent vectors */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#c9a86c]" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#c9a86c]" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#c9a86c]" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#c9a86c]" />

            <h3 className="font-serif text-lg text-white font-light tracking-widest uppercase mb-8 border-b border-[#c9a86c]/10 pb-4">
              RESERVATION INQUIRY WIRE
            </h3>

            <form onSubmit={handleContactSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-sans tracking-widest text-[#c9a86c]">
                    YOUR FULL NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Enter your name"
                    className="bg-[#0e0e0e] border border-zinc-800 focus:border-[#c9a86c] text-[#d4cfc8] text-xs px-4 py-3 placeholder:text-zinc-600 focus:outline-none transition-colors rounded-none w-full"
                  />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-sans tracking-widest text-[#c9a86c]">
                    EMAIL ADDRESS *
                  </label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="bg-[#0e0e0e] border border-zinc-800 focus:border-[#c9a86c] text-[#d4cfc8] text-xs px-4 py-3 placeholder:text-zinc-600 focus:outline-none transition-colors rounded-none w-full"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-sans tracking-widest text-[#c9a86c]">
                  PHONE NUMBER
                </label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  className="bg-[#0e0e0e] border border-zinc-800 focus:border-[#c9a86c] text-[#d4cfc8] text-xs px-4 py-3 placeholder:text-zinc-600 focus:outline-none transition-colors rounded-none w-full"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-sans tracking-widest text-[#c9a86c]">
                  EVENT DETAILS & SPECIAL REQUESTS *
                </label>
                <textarea
                  rows={4}
                  required
                  value={contactMsg}
                  onChange={(e) => setContactMsg(e.target.value)}
                  placeholder="Describe your event date, location, and creative ideas..."
                  className="bg-[#0e0e0e] border border-zinc-800 focus:border-[#c9a86c] text-[#d4cfc8] text-xs p-4 placeholder:text-zinc-600 focus:outline-none transition-colors rounded-none w-full resize-none"
                />
              </div>

              {/* Submission button with complete luxurious styling */}
              <button
                type="submit"
                id="contact-form-submit"
                disabled={formSubmitted}
                className="w-full py-4 bg-[#c9a86c] hover:bg-[#e8d5a3] text-[#080808] font-semibold text-xs tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
              >
                {formSubmitted ? (
                  <>
                    <Check className="w-4 h-4 animate-bounce" />
                    <span>Inquiry Registered!</span>
                  </>
                ) : (
                  <span>Dispatch Reservation wire</span>
                )}
              </button>

            </form>
          </div>

        </div>
      </section>

      {/* 11. FOOTER */}
      <footer
        id="footer"
        className="bg-[#080808] border-t border-[#c9a86c]/10 py-16 text-center"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          {/* Logo element with gold formatting */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection("home")}>
              <div className="w-12 h-12 rounded-full border border-[#c9a86c] flex items-center justify-center bg-black">
                <Camera className="w-5 h-5 text-[#c9a86c]" />
              </div>
              <div className="text-left">
                <span className="font-serif text-lg font-medium tracking-widest text-[#c9a86c] block leading-none">
                  {settings.name.split(" ").slice(0, 2).join(" ") || "PRAGNYA SRI"}
                </span>
                <span className="text-[11px] font-sans tracking-[0.3em] text-[#d4cfc8]/60 block mt-1 leading-none">
                  {settings.name.split(" ").slice(2).join(" ") || "CREATIONS"}
                </span>
              </div>
            </div>
          </div>

          <p className="font-serif text-sm text-[#d4cfc8]/70 italic tracking-wider max-w-sm mx-auto mb-8">
            "{settings.tagline || "Capturing Memories, Creating Magic"}"
          </p>

          {/* Navigation Links inside footer */}
          <div className="flex flex-wrap items-center justify-center gap-8 mb-8 text-[11px] uppercase tracking-[0.18em]">
            {["Home", "Portfolio", "Services", "About", "Contact"].map((link) => (
              <button
                key={link}
                onClick={() => scrollToSection(link.toLowerCase())}
                className="text-[#d4cfc8]/70 hover:text-[#c9a86c] transition-colors font-medium cursor-pointer"
              >
                {link}
              </button>
            ))}
          </div>

          {/* Social media connections */}
          <div className="flex items-center justify-center gap-6 mb-12">
            {[
              { id: "foot-insta", icon: <Instagram className="w-5 h-5" />, path: settings.instagram || "https://instagram.com", show: settings.showInsta !== false },
              settings.showFb && settings.facebook ? { id: "foot-fb", icon: <Facebook className="w-5 h-5" />, path: settings.facebook, show: true } : null,
              settings.showYt && settings.youtube ? { id: "foot-yt", icon: <Youtube className="w-5 h-5" />, path: settings.youtube, show: true } : null,
              settings.whatsapp ? { id: "foot-wa", icon: <MessageSquareIcon />, path: `https://wa.me/${settings.whatsapp}`, show: true } : null,
              { id: "foot-phone", icon: <Phone className="w-5 h-5" />, path: `tel:${settings.phone.replace(/\s+/g, "")}`, show: true },
              { id: "foot-mail", icon: <Mail className="w-5 h-5" />, path: `mailto:${settings.email}`, show: true }
            ].filter((soc): soc is { id: string; icon: React.ReactNode; path: string; show: boolean } => soc !== null && soc.show !== false).map((soc, idx) => (
              <a
                id={soc.id}
                key={idx}
                href={soc.path}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full border border-zinc-800 hover:border-[#c9a86c] flex items-center justify-center text-[#d4cfc8]/60 hover:text-[#c9a86c] transition-all"
              >
                {soc.icon}
              </a>
            ))}
          </div>

          <div className="h-[1px] bg-zinc-900 max-w-xl mx-auto mb-8" />

          {/* Copyright statement */}
          <p className="text-[10px] font-mono text-zinc-600 tracking-widest">
            © {new Date().getFullYear()} PRAGNYA SRI CREATIONS • ALL RIGHTS RESERVED. <br />
            <span className="text-[9px] text-[#c9a86c]/30 mt-1 block">ESTABLISHED IN HYDERABAD • ELITE CINEMATOGRAPHY LAB</span>
          </p>

        </div>
      </footer>

      {/* LUXURY SLIDE-OUT OVERLAY CONCIERGE BOOKING MODAL */}
      <AnimatePresence>
        {isBookingOpen && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
            {/* Modal Ambient Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBookingOpen(false)}
              className="absolute inset-0 bg-black/95 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              id="booking-concierge-modal"
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="bg-[#080808] border border-[#c9a86c]/30 max-w-md w-full relative z-[610] p-8 md:p-10 shadow-[0_0_50px_rgba(201,168,108,0.2)] text-left"
            >
              {/* Close Button */}
              <button
                id="booking-close-btn"
                onClick={() => setIsBookingOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full border border-white/5 hover:border-[#c9a86c] flex items-center justify-center text-[#d4cfc8] hover:text-[#c9a86c] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="mb-6">
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#c9a86c] block mb-1">
                  Private Session Intake
                </span>
                <h3 className="font-serif text-2xl text-white font-light tracking-wider uppercase leading-none">
                  CONCIERGE DESK
                </h3>
                <div className="h-[2px] w-12 bg-[#c9a86c] mt-3" />
              </div>

              <p className="text-[11px] text-[#d4cfc8]/70 mb-6 font-sans leading-relaxed">
                Connect directly with our Hyderabad reservation coordinator. Submitting this form compiles details and launches direct secure routing via WhatsApp.
              </p>

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] tracking-widest text-[#c9a86c] font-sans">
                    YOUR NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingName}
                    onChange={(e) => setBookingName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-[#0e0e0e] border border-zinc-800 focus:border-[#c9a86c] text-[#d4cfc8] text-xs px-3.5 py-2.5 placeholder:text-zinc-650 focus:outline-none rounded-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] tracking-widest text-[#c9a86c] font-sans">
                    TELEPHONE NUMBER *
                  </label>
                  <input
                    type="tel"
                    required
                    value={bookingPhone}
                    onChange={(e) => setBookingPhone(e.target.value)}
                    placeholder="+91 Mobile number"
                    className="w-full bg-[#0e0e0e] border border-zinc-800 focus:border-[#c9a86c] text-[#d4cfc8] text-xs px-3.5 py-2.5 placeholder:text-zinc-650 focus:outline-none rounded-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] tracking-widest text-[#c9a86c] font-sans">
                    SELECT SERVICE *
                  </label>
                  <select
                    required
                    value={bookingService}
                    onChange={(e) => setBookingService(e.target.value)}
                    className="w-full bg-[#0e0e0e] border border-zinc-800 focus:border-[#c9a86c] text-[#d4cfc8] text-xs px-3.5 py-2.5 focus:outline-none rounded-none appearance-none"
                  >
                    <option value="">Select a visual format...</option>
                    <option value="Photography Portfolio">Photography Portfolio</option>
                    <option value="Videography Service">Videography Service</option>
                    <option value="Cinematic Master Film">Cinematic Master Film</option>
                    <option value="Wedding Highlights Coverage">Wedding Highlights Coverage</option>
                    <option value="Maternity & Baby Shoot">Maternity & Baby Shoot</option>
                    <option value="Luxury Birthday Celebration">Luxury Birthday Celebration</option>
                    <option value="Other Custom Productions">Other Custom Productions</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] tracking-widest text-[#c9a86c] font-sans">
                    PREFERRED SESSION DATE
                  </label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full bg-[#0e0e0e] border border-zinc-800 focus:border-[#c9a86c] text-[#d4cfc8] text-xs px-3.5 py-2.5 focus:outline-none rounded-none"
                  />
                </div>

                <button
                  type="submit"
                  id="booking-submit-btn"
                  className="w-full py-3 bg-[#c9a86c] hover:bg-[#e8d5a3] text-[#080808] font-bold text-[10px] uppercase tracking-widest transition-colors mt-6 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Connect WhatsApp Concierge</span>
                </button>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FLOATING ACTION NOTIFICATION BANNER (MIMICKING LIVE EVENTS BOOKINGS) */}
      <AnimatePresence>
        {notification && (
          <motion.div
            id="live-booking-alert"
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-[400] bg-black border border-[#c9a86c] p-4 shadow-[0_10px_30px_rgba(201,168,108,0.25)] flex items-center gap-3.5 max-w-sm"
          >
            <div className="w-8 h-8 rounded-full border border-[#c9a86c]/30 flex items-center justify-center shrink-0">
              <Camera className="w-3.5 h-3.5 text-[#c9a86c] animate-pulse" />
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-widest text-[#c9a86c] block font-semibold leading-none">
                Live Studio Event
              </span>
              <p className="text-[11px] text-white font-sans mt-1 leading-normal tracking-wide">
                {notification}
              </p>
            </div>
            <button 
              onClick={() => setNotification("")}
              className="text-white hover:text-[#c9a86c] p-1 self-start"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP FLOATING CONCIERGE TOAST MESSAGE NOTIFICATION */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            id="toast-notification"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[1000] bg-zinc-950 border border-[#c9a86c] py-3.5 px-6 shadow-2xl backdrop-blur-md flex items-center gap-3"
          >
            <div className="w-5 h-5 rounded-full bg-[#c9a86c] flex items-center justify-center">
              <Check className="w-3 h-3 text-[#080808]" />
            </div>
            <span className="text-xs font-sans text-white tracking-wide">
              {toastMessage}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CENTRAL ADMINISTRATIVE MANAGERS AND CONTROL DIALS */}
      <AdminModals
        isAdmin={isAdmin}
        setIsAdmin={handleSetIsAdmin}
        activeModal={activeModal}
        setActiveModal={setActiveModal}
        settings={settings}
        setSettings={setSettings}
        works={works}
        setWorks={setWorks}
        services={services}
        setServices={setServices}
        testimonials={testimonials}
        setTestimonials={setTestimonials}
        editingWork={editingWork}
        setEditingWork={setEditingWork}
        gistConfig={gistConfig}
        setGistConfig={handleSetGistConfig}
        onShowToast={triggerToast}
      />

    </div>
  );
}

// Custom simple WhatsApp icons matching Lucide styling format
function MessageSquareIcon() {
  return (
    <svg 
      className="w-5 h-5 text-[#c9a86c]" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  );
}
