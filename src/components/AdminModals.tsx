import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, Lock, Sliders, RefreshCw, Plus, Trash2, Edit, Save, 
  Settings, User, Phone, Globe, Image, Film, PlusCircle, Check, HelpCircle
} from "lucide-react";
import { BrandingSettings, PortfolioItem, ServiceItem, TestimonialItem, GistConfig } from "../types";

interface AdminModalsProps {
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  settings: BrandingSettings;
  setSettings: React.Dispatch<React.SetStateAction<BrandingSettings>>;
  works: PortfolioItem[];
  setWorks: React.Dispatch<React.SetStateAction<PortfolioItem[]>>;
  services: ServiceItem[];
  setServices: React.Dispatch<React.SetStateAction<ServiceItem[]>>;
  testimonials: TestimonialItem[];
  setTestimonials: React.Dispatch<React.SetStateAction<TestimonialItem[]>>;
  gistConfig: GistConfig;
  setGistConfig: (cfg: GistConfig) => void;
  onShowToast: (msg: string) => void;
  // Specific mod triggers passed down
  activeModal: "login" | "settings" | "work" | "sync" | "edit-intro" | "edit-story" | "edit-gallery" | null;
  setActiveModal: (modal: "login" | "settings" | "work" | "sync" | "edit-intro" | "edit-story" | "edit-gallery" | null) => void;
  editingWork: PortfolioItem | null;
  setEditingWork: (item: PortfolioItem | null) => void;
}

export function AdminModals({
  isAdmin,
  setIsAdmin,
  settings,
  setSettings,
  works,
  setWorks,
  services,
  setServices,
  testimonials,
  setTestimonials,
  gistConfig,
  setGistConfig,
  onShowToast,
  activeModal,
  setActiveModal,
  editingWork,
  setEditingWork
}: AdminModalsProps) {

  // Local dialog inputs
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [settingsTab, setSettingsTab] = useState<"branding" | "contact" | "social" | "stats" | "services" | "reviews" | "password" | "manual">("branding");

  // GitHub Gist sync states
  const [tempGistId, setTempGistId] = useState(gistConfig?.gistId || "");
  const [tempToken, setTempToken] = useState(gistConfig?.token || "");
  const [syncing, setSyncing] = useState(false);

  // Editable work form state (for additions and modifications)
  const [workForm, setWorkForm] = useState<Partial<PortfolioItem>>({
    id: "",
    title: "",
    category: "wedding",
    categoryLabel: "Wedding Highlights",
    meta: "",
    image: "",
    videoUrl: ""
  });

  // Open & Pre-populate Work form
  React.useEffect(() => {
    if (editingWork) {
      setWorkForm(editingWork);
    } else {
      setWorkForm({
        id: "",
        title: "",
        category: "wedding",
        categoryLabel: "Wedding Highlights",
        meta: "",
        image: "",
        videoUrl: ""
      });
    }
  }, [editingWork, activeModal]);

  // Handle Login Authentication
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === settings.password) {
      setIsAdmin(true);
      setActiveModal(null);
      setPasswordInput("");
      setLoginError("");
      onShowToast("Logged in successfully as Administrator.");
    } else {
      setLoginError("Invalid password. Please request assistance or retry.");
    }
  };

  // Push Active Content JSON direct to GitHub Gist for true visitor persistence
  const syncWithGithubCloud = async (overrideGist?: string, overrideToken?: string) => {
    const targetGist = overrideGist !== undefined ? overrideGist : tempGistId;
    const targetToken = overrideToken !== undefined ? overrideToken : tempToken;

    if (!targetGist || !targetToken) {
      onShowToast("Unable to sync: Gist ID and Classic Token are required.");
      return;
    }

    setSyncing(true);
    try {
      const payload = {
        description: "Pragnya Sri Creations Studio Dynamic DB File",
        files: {
          "pragnyasri_creations_db.json": {
            content: JSON.stringify({
              settings,
              works,
              services,
              testimonials
            }, null, 2)
          }
        }
      };

      const response = await fetch(`https://api.github.com/gists/${targetGist}`, {
        method: "PATCH",
        headers: {
          Authorization: `token ${targetToken}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        onShowToast("Cloud database updated. Live changes synchronized!");
        setGistConfig({ gistId: targetGist, token: targetToken });
      } else {
        const errorText = await response.text();
        console.error("Gist save failure response:", errorText);
        onShowToast("Sync error: Please verify your GitHub Credentials.");
      }
    } catch (err) {
      console.error(err);
      onShowToast("Sync error: Connection refused or API is offline.");
    } finally {
      setSyncing(false);
    }
  };

  // Pull Dynamic Content down from GitHub Gist
  const pullFromGithubCloud = async (targetGist: string, targetToken: string) => {
    if (!targetGist || !targetToken) return;
    setSyncing(true);
    try {
      const response = await fetch(`https://api.github.com/gists/${targetGist}`, {
        headers: {
          Authorization: `token ${targetToken}`,
          Accept: "application/vnd.github.v3+json"
        }
      });

      if (response.ok) {
        const gistData = await response.json();
        const fileContent = gistData.files && gistData.files["pragnyasri_creations_db.json"]?.content;
        if (fileContent) {
          const parsed = JSON.parse(fileContent);
          if (parsed.settings) setSettings(parsed.settings);
          if (parsed.works) setWorks(parsed.works);
          if (parsed.services) setServices(parsed.services);
          if (parsed.testimonials) setTestimonials(parsed.testimonials);
          
          localStorage.setItem("pragnya_settings", JSON.stringify(parsed.settings || settings));
          localStorage.setItem("pragnya_works", JSON.stringify(parsed.works || works));
          localStorage.setItem("pragnya_services", JSON.stringify(parsed.services || services));
          localStorage.setItem("pragnya_testimonials", JSON.stringify(parsed.testimonials || testimonials));

          onShowToast("Succesfully compiled live cloud data down!");
        }
      }
    } catch (err) {
      console.error("Gist pull failure:", err);
    } finally {
      setSyncing(false);
    }
  };

  // Handle saving portfolio work addition or edit
  const handleWorkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workForm.title || !workForm.image) {
      onShowToast("Title and Thumbnail Image are required.");
      return;
    }

    const catLabels: Record<string, string> = {
      wedding: "Wedding Highlights",
      "pre-wedding": "Pre Wedding",
      songs: "Cover Songs",
      baby: "Baby Shoots",
      birthday: "Birthday Events",
      other: "Other Events"
    };

    const finalForm: PortfolioItem = {
      id: workForm.id || "work-" + Date.now(),
      title: workForm.title,
      category: workForm.category || "wedding",
      categoryLabel: catLabels[workForm.category || "wedding"] || "Other Events",
      meta: workForm.meta || "",
      image: workForm.image,
      videoUrl: workForm.videoUrl || ""
    };

    let updatedWorks: PortfolioItem[];
    if (editingWork) {
      updatedWorks = works.map(w => w.id === editingWork.id ? finalForm : w);
      onShowToast("Portfolio Work item modified successfully.");
    } else {
      updatedWorks = [finalForm, ...works];
      onShowToast("New Portfolio Work Item registered successfully.");
    }

    setWorks(updatedWorks);
    localStorage.setItem("pragnya_works", JSON.stringify(updatedWorks));
    setActiveModal(null);
    setEditingWork(null);

    // Auto trigger push to cloud database if sync is enabled
    if (gistConfig.gistId && gistConfig.token) {
      setTimeout(() => syncWithGithubCloud(gistConfig.gistId, gistConfig.token), 300);
    }
  };

  // Handle standard setting saves
  const handleSaveSettings = (updated: BrandingSettings) => {
    setSettings(updated);
    localStorage.setItem("pragnya_settings", JSON.stringify(updated));
    onShowToast("Settings updated locally.");
    if (gistConfig.gistId && gistConfig.token) {
      setTimeout(() => syncWithGithubCloud(gistConfig.gistId, gistConfig.token), 300);
    }
  };

  return (
    <>
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 overflow-y-auto">
            {/* Dark Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setActiveModal(null);
                setEditingWork(null);
              }}
              className="fixed inset-0 bg-black/95 backdrop-blur-md"
            />

            {/* Modal Canvas Box */}
            <motion.div
              initial={{ y: 20, scale: 0.95, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 20, scale: 0.95, opacity: 0 }}
              className="bg-[#0e0e0e] border border-[#c9a86c]/35 max-w-2xl w-full p-6 sm:p-8 relative z-10 shadow-[0_0_50px_rgba(201,168,108,0.15)] overflow-hidden"
            >
              {/* Gold corners */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[#c9a86c]" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[#c9a86c]" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[#c9a86c]" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[#c9a86c]" />

              {/* Close Button */}
              <button
                onClick={() => {
                  setActiveModal(null);
                  setEditingWork(null);
                }}
                className="absolute top-4 right-4 w-8 h-8 rounded-full border border-white/5 hover:border-[#c9a86c]/60 flex items-center justify-center text-zinc-500 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* MODAL 1: ADMINISTRATIVE AUTHENTICATION */}
              {activeModal === "login" && (
                <div id="admin-login-modal" className="py-2 text-center">
                  <div className="w-14 h-14 rounded-full border border-[#c9a86c] flex items-center justify-center mx-auto mb-5 bg-black/50">
                    <Lock className="w-6 h-6 text-[#c9a86c]" />
                  </div>
                  <h3 className="font-serif text-2xl tracking-widest text-[#f0eadd] mb-2 uppercase text-white">
                    Administrator Shield
                  </h3>
                  <p className="text-xs text-[#d4cfc8]/60 font-sans tracking-wide max-w-sm mx-auto mb-8 leading-relaxed">
                    Unlocking will enable real-time floating visual modifiers and direct state manipulations across active components.
                  </p>

                  <form onSubmit={handleLoginSubmit} className="max-w-xs mx-auto space-y-4">
                    <div className="flex flex-col gap-1.5 text-left">
                      <label className="text-[10px] tracking-widest uppercase font-sans text-[#c9a86c]">
                        ACCESS KEY
                      </label>
                      <input
                        type="password"
                        required
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="••••••••••••••"
                        className="bg-[#080808] border border-zinc-800 focus:border-[#c9a86c] text-[#d4cfc8] text-center text-xs px-4 py-3 placeholder:text-zinc-750 focus:outline-none transition-colors w-full rounded-none"
                      />
                    </div>

                    {loginError && (
                      <p className="text-[10px] text-red-500 font-mono tracking-wide">
                        ⚠️ {loginError}
                      </p>
                    )}

                    <button
                      type="submit"
                      className="w-full py-3 bg-[#c9a86c] hover:bg-[#e8d5a3] text-[#080808] text-xs uppercase tracking-widest font-semibold transition-colors mt-2 rounded-none cursor-pointer"
                    >
                      Authenticate Command
                    </button>
                  </form>
                </div>
              )}

              {/* MODAL 2: GITHUB GIST SYNC PORT */}
              {activeModal === "sync" && (
                <div id="cloud-sync-modal" className="py-2">
                  <div className="flex items-center gap-3.5 border-b border-zinc-900 pb-4 mb-6">
                    <div className="w-10 h-10 rounded-full border border-[#c9a86c]/40 flex items-center justify-center bg-black/40">
                      <RefreshCw className={`w-4 h-4 text-[#c9a86c] ${syncing ? "animate-spin" : ""}`} />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg tracking-wider text-white">
                        CLOUD SYNC PORTAL
                      </h3>
                      <span className="text-[9px] uppercase tracking-widest text-[#c9a86c] block">
                        GitHub Gist Persistence Database Config
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#d4cfc8]/70 leading-relaxed font-sans mb-8">
                    Link this design template to your live private GitHub account. Dynamic changes will persist across multiple active visits (including client and visitor mobile devices) automatically.
                  </p>

                  <div className="space-y-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-sans tracking-widest text-[#c9a86c]">
                        GitHub Personal Access Token (Classic)
                      </label>
                      <input
                        type="password"
                        value={tempToken}
                        onChange={(e) => setTempToken(e.target.value)}
                        placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxx"
                        className="bg-[#080808] border border-zinc-800 focus:border-[#c9a86c] text-[#d4cfc8] text-xs px-4 py-3 placeholder:text-zinc-700 focus:outline-none transition-colors rounded-none font-mono"
                      />
                      <span className="text-[9px] text-[#d4cfc8]/40 leading-normal block">
                        Must contain the 'gist' permission scope. Keep this confidential.
                      </span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-sans tracking-widest text-[#c9a86c]">
                        Existing GitHub Gist ID
                      </label>
                      <input
                        type="text"
                        value={tempGistId}
                        onChange={(e) => setTempGistId(e.target.value)}
                        placeholder="e.g. 52f94ca810168b4ef2b7c62bb950de68"
                        className="bg-[#080808] border border-zinc-800 focus:border-[#c9a86c] text-[#d4cfc8] text-xs px-4 py-3 placeholder:text-zinc-700 focus:outline-none transition-colors rounded-none font-mono"
                      />
                      <span className="text-[9px] text-[#d4cfc8]/40 leading-normal block">
                        Create a secret or public Gist on gist.github.com to receive a dynamic JSON payload.
                      </span>
                    </div>

                    {tempGistId && (
                      <div className="bg-black/80 border border-zinc-900/90 p-4 space-y-2 text-left mt-2">
                        <span className="text-[9.5px] uppercase tracking-widest text-[#c9a86c] block font-semibold">
                          Device Synchronization URL
                        </span>
                        <p className="text-[10px] text-[#d4cfc8]/60 font-sans leading-relaxed">
                          Share this link, or open it on other devices (tablets, mobiles, clients' computers). It automatically loads and caches all updated settings, portfolios, and services instantly on load:
                        </p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            readOnly
                            value={`${window.location.origin}${window.location.pathname}?gist=${tempGistId}`}
                            className="bg-[#080808] border border-zinc-800 text-[#c9a86c] text-[10px] p-2.5 flex-1 focus:outline-none font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?gist=${tempGistId}`);
                              onShowToast("Sync URL copied to clipboard!");
                            }}
                            className="bg-[#c9a86c]/20 hover:bg-[#c9a86c] hover:text-[#080808] border border-[#c9a86c]/40 px-4 text-[10px] uppercase font-bold text-[#c9a86c] transition-all cursor-pointer whitespace-nowrap"
                          >
                            Copy Link
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-4 pt-4 border-t border-zinc-900 mt-4">
                      <button
                        onClick={() => syncWithGithubCloud(tempGistId, tempToken)}
                        disabled={syncing}
                        className="flex-1 py-3 bg-[#c9a86c] hover:bg-[#e8d5a3] text-[#080808] font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {syncing ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Updating...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-3.5 h-3.5" />
                            <span>Save and Push Now</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => pullFromGithubCloud(tempGistId, tempToken)}
                        disabled={syncing}
                        className="px-6 py-3 border border-[#c9a86c] text-[#c9a86c] hover:bg-[#c9a86c]/10 text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {syncing ? "Please Wait" : "Pull Down Latest"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* MODAL 3: PORTFOLIO WORK CREATOR / EDITOR */}
              {activeModal === "work" && (
                <div id="add-work-modal" className="py-2">
                  <div className="flex items-center gap-3.5 border-b border-zinc-900 pb-4 mb-6">
                    <div className="w-10 h-10 rounded-full border border-[#c9a86c]/40 flex items-center justify-center bg-black/40">
                      <PlusCircle className="w-5 h-5 text-[#c9a86c]" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg tracking-wider text-white uppercase">
                        {editingWork ? "Edit Visual Masterpiece" : "Register New Visual Work"}
                      </h3>
                      <span className="text-[9px] uppercase tracking-widest text-[#c9a86c] block">
                        Configure Item details to display in filtered portfolio
                      </span>
                    </div>
                  </div>

                  <form onSubmit={handleWorkSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] uppercase tracking-widest font-sans text-[#c9a86c]">
                          Visual Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={workForm.title || ""}
                          onChange={(e) => setWorkForm({ ...workForm, title: e.target.value })}
                          placeholder="e.g. Royal Heritage Teaser"
                          className="bg-[#080808] border border-zinc-800 focus:border-[#c9a86c] text-[#d4cfc8] text-xs px-3.5 py-2.5 focus:outline-none transition-colors rounded-none"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] uppercase tracking-widest font-sans text-[#c9a86c]">
                          Studio Category *
                        </label>
                        <select
                          required
                          value={workForm.category || "wedding"}
                          onChange={(e) => setWorkForm({ ...workForm, category: e.target.value })}
                          className="bg-[#080808] border border-zinc-800 focus:border-[#c9a86c] text-[#d4cfc8] text-xs px-3.5 py-2.5 focus:outline-none transition-colors rounded-none font-sans"
                        >
                          <option value="wedding">Wedding Highlights</option>
                          <option value="pre-wedding">Pre Wedding</option>
                          <option value="songs">Cover Songs</option>
                          <option value="baby">Baby Shoots</option>
                          <option value="birthday">Birthday Events</option>
                          <option value="other">Other Events</option>
                        </select>
                      </div>

                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] uppercase tracking-widest font-sans text-[#c9a86c]">
                        Location / Event Metadata Subheading
                      </label>
                      <input
                        type="text"
                        value={workForm.meta || ""}
                        onChange={(e) => setWorkForm({ ...workForm, meta: e.target.value })}
                        placeholder="e.g. Traditional Wedding film • Hyderabad Palace"
                        className="bg-[#080808] border border-zinc-800 focus:border-[#c9a86c] text-[#d4cfc8] text-xs px-3.5 py-2.5 focus:outline-none transition-colors rounded-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] uppercase tracking-widest font-sans text-[#c9a86c]">
                        Thumbnail Image URL * (Resolves instantly for visitor devices)
                      </label>
                      <input
                        type="text"
                        required
                        value={workForm.image || ""}
                        onChange={(e) => setWorkForm({ ...workForm, image: e.target.value })}
                        placeholder="https://images.unsplash.com/... or cloud image path"
                        className="bg-[#080808] border border-zinc-800 focus:border-[#c9a86c] text-[#d4cfc8] text-xs px-3.5 py-2.5 focus:outline-none transition-colors rounded-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] uppercase tracking-widest font-sans text-[#c9a86c]">
                        YouTube Video URL or Google Drive Video Link
                      </label>
                      <input
                        type="text"
                        value={workForm.videoUrl || ""}
                        onChange={(e) => setWorkForm({ ...workForm, videoUrl: e.target.value })}
                        placeholder="e.g. https://www.youtube.com/watch?v=g3-V_7ySvaU or Drive file link"
                        className="bg-[#080808] border border-zinc-800 focus:border-[#c9a86c] text-[#d4cfc8] text-xs px-3.5 py-2.5 focus:outline-none transition-colors rounded-none"
                      />
                      <p className="text-[10px] text-[#d4cfc8]/50 leading-relaxed mt-1">
                        <strong className="text-[#c9a86c]">Supported & Auto-Converted Formats:</strong><br />
                        • <span className="text-[#d4cfc8]">YouTube Standard:</span> <code className="text-[#c9a86c]/95">https://www.youtube.com/watch?v=...</code><br />
                        • <span className="text-[#d4cfc8]">YouTube Shorts:</span> <code className="text-[#c9a86c]/95">https://www.youtube.com/shorts/...</code><br />
                        • <span className="text-[#d4cfc8]">YouTube Direct:</span> <code className="text-[#c9a86c]/95">https://youtu.be/...</code><br />
                        • <span className="text-[#d4cfc8]">Google Drive Share URL:</span> <code className="text-[#c9a86c]/95">https://drive.google.com/file/d/.../view</code><br />
                        <span className="text-[9px] text-[#c9a86c]/60">* Must make Google Drive links accessible to "Anyone with the link".</span>
                      </p>
                    </div>

                    <div className="pt-4 border-t border-zinc-900 mt-4 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveModal(null);
                          setEditingWork(null);
                        }}
                        className="px-5 py-2.5 border border-zinc-805 text-zinc-400 hover:text-white hover:border-[#c9a86c]/30 text-[10px] uppercase font-semibold transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-[#c9a86c] hover:bg-[#e8d5a3] text-[#080808] text-[10px] uppercase font-bold tracking-widest transition-colors flex items-center gap-1.5"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Register Visual Item</span>
                      </button>
                    </div>

                  </form>
                </div>
              )}

              {/* MODAL 4: FULL FEATURED TABBED SETTINGS PANEL */}
              {activeModal === "settings" && (
                <div id="general-settings-panel" className="py-2">
                  <div className="flex flex-col md:flex-row gap-5">
                    
                    {/* Left Sidebar Tabs Navigation */}
                    <div className="w-full md:w-1/4 shrink-0 flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible border-b md:border-b-0 md:border-r border-zinc-900 pr-0 md:pr-4">
                      {([
                        { id: "branding", label: "Branding", icon: <Sliders className="w-3.5 h-3.5" /> },
                        { id: "contact", label: "Coordinates", icon: <Phone className="w-3.5 h-3.5" /> },
                        { id: "social", label: "Socials", icon: <Globe className="w-3.5 h-3.5" /> },
                        { id: "stats", label: "Statistics", icon: <Check className="w-3.5 h-3.5" /> },
                        { id: "services", label: "Services", icon: <Sliders className="w-3.5 h-3.5" /> },
                        { id: "reviews", label: "Reviews", icon: <User className="w-3.5 h-3.5" /> },
                        { id: "password", label: "Security", icon: <Lock className="w-3.5 h-3.5" /> },
                        { id: "manual", label: "Help & PDF Guide", icon: <HelpCircle className="w-3.5 h-3.5 text-[#c9a86c]" /> }
                      ] as const).map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setSettingsTab(tab.id)}
                          className={`flex items-center gap-2.5 px-3.5 py-2.5 text-left text-[11px] font-semibold tracking-wider uppercase transition-all rounded-none cursor-pointer border-b md:border-b-0 whitespace-nowrap ${
                            settingsTab === tab.id
                              ? "bg-[#c9a86c]/10 text-[#c9a86c] border-[#c9a86c]"
                              : "text-zinc-400 hover:text-white border-transparent"
                          }`}
                        >
                          {tab.icon}
                          <span>{tab.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Right Dynamic Content Scroll Box */}
                    <div className="flex-1 max-h-[460px] overflow-y-auto pr-1 space-y-6">
                      
                      {/* TAB 1: BRANDING AND ABOUT CONTENT */}
                      {settingsTab === "branding" && (
                        <div className="space-y-4">
                          <h4 className="font-serif text-sm uppercase text-white border-b border-zinc-900 pb-2 mb-3">
                            Branding Coordinates & Statements
                          </h4>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] uppercase tracking-widest text-[#c9a86c]">Studio Name</label>
                              <input
                                type="text"
                                value={settings.name}
                                onChange={(e) => handleSaveSettings({ ...settings, name: e.target.value })}
                                className="bg-[#080808] border border-zinc-800 text-xs text-white p-2.5 focus:outline-none focus:border-[#c9a86c]"
                              />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] uppercase tracking-widest text-[#c9a86c]">Tagline Motto</label>
                              <input
                                type="text"
                                value={settings.tagline}
                                onChange={(e) => handleSaveSettings({ ...settings, tagline: e.target.value })}
                                className="bg-[#080808] border border-zinc-800 text-xs text-white p-2.5 focus:outline-none focus:border-[#c9a86c]"
                              />
                            </div>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-[9px] uppercase tracking-widest text-[#c9a86c]">Header Eyebrow Heading</label>
                            <input
                              type="text"
                              value={settings.heroEyebrow}
                              onChange={(e) => handleSaveSettings({ ...settings, heroEyebrow: e.target.value })}
                              className="bg-[#080808] border border-zinc-800 text-xs text-white p-2.5 focus:outline-none focus:border-[#c9a86c]"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-[9px] uppercase tracking-widest text-[#c9a86c]">Custom Logo Circle Image URL</label>
                            <input
                              type="text"
                              value={settings.heroLogoUrl || ""}
                              placeholder="Leave blank for cinematic default camera vector"
                              onChange={(e) => handleSaveSettings({ ...settings, heroLogoUrl: e.target.value })}
                              className="bg-[#080808] border border-zinc-800 text-xs text-white p-2.5 focus:outline-none"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-[9px] uppercase tracking-widest text-[#c9a86c]">Story Main Title Header</label>
                            <input
                              type="text"
                              value={settings.aboutHeading}
                              onChange={(e) => handleSaveSettings({ ...settings, aboutHeading: e.target.value })}
                              className="bg-[#080808] border border-zinc-800 text-xs text-white p-2.5 focus:outline-none focus:border-[#c9a86c]"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-[9px] uppercase tracking-widest text-[#c9a86c]">Story Text Paragraph 1</label>
                            <textarea
                              rows={3}
                              value={settings.about1}
                              onChange={(e) => handleSaveSettings({ ...settings, about1: e.target.value })}
                              className="bg-[#080808] border border-zinc-800 text-xs text-white p-2.5 focus:outline-none focus:border-[#c9a86c] resize-none"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-[9px] uppercase tracking-widest text-[#c9a86c]">Story Text Paragraph 2</label>
                            <textarea
                              rows={3}
                              value={settings.about2}
                              onChange={(e) => handleSaveSettings({ ...settings, about2: e.target.value })}
                              className="bg-[#080808] border border-zinc-800 text-xs text-white p-2.5 focus:outline-none focus:border-[#c9a86c] resize-none"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] uppercase tracking-widest text-[#c9a86c]">Story Signature Name</label>
                              <input
                                type="text"
                                value={settings.sig}
                                onChange={(e) => handleSaveSettings({ ...settings, sig: e.target.value })}
                                className="bg-[#080808] border border-zinc-800 text-xs text-white p-2.5 focus:outline-none focus:border-[#c9a86c]"
                              />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] uppercase tracking-widest text-[#c9a86c]">Story Signature Label</label>
                              <input
                                type="text"
                                value={settings.aboutSigLabel}
                                onChange={(e) => handleSaveSettings({ ...settings, aboutSigLabel: e.target.value })}
                                className="bg-[#080808] border border-zinc-800 text-xs text-white p-2.5 focus:outline-none focus:border-[#c9a86c]"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* TAB 2: CONTACT COORDINATES */}
                      {settingsTab === "contact" && (
                        <div className="space-y-4">
                          <h4 className="font-serif text-sm uppercase text-white border-b border-zinc-900 pb-2 mb-3">
                            Direct Contact & Reservation Desks
                          </h4>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] uppercase tracking-widest text-[#c9a86c]">Studio Phone *</label>
                              <input
                                type="text"
                                value={settings.phone}
                                onChange={(e) => handleSaveSettings({ ...settings, phone: e.target.value })}
                                className="bg-[#080808] border border-zinc-800 text-xs text-white p-2.5 focus:outline-none"
                              />
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] uppercase tracking-widest text-[#c9a86c]">WhatsApp Callback with Country Code *</label>
                              <input
                                type="text"
                                value={settings.whatsapp}
                                onChange={(e) => handleSaveSettings({ ...settings, whatsapp: e.target.value })}
                                placeholder="e.g. 919999999999"
                                className="bg-[#080808] border border-zinc-800 text-xs text-white p-2.5 focus:outline-none"
                              />
                            </div>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-[9px] uppercase tracking-widest text-[#c9a86c]">Studio Email Address *</label>
                            <input
                              type="email"
                              value={settings.email}
                              onChange={(e) => handleSaveSettings({ ...settings, email: e.target.value })}
                              className="bg-[#080808] border border-zinc-800 text-xs text-white p-2.5 focus:outline-none"
                            />
                          </div>
                        </div>
                      )}

                      {/* TAB 3: SOCIAL HANDLES */}
                      {settingsTab === "social" && (
                        <div className="space-y-4">
                          <h4 className="font-serif text-sm uppercase text-white border-b border-zinc-900 pb-2 mb-3">
                            External Luxury Network Presence
                          </h4>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-[9px] uppercase tracking-widest text-[#c9a86c]">Instagram Feed URL</label>
                            <input
                              type="text"
                              value={settings.instagram}
                              onChange={(e) => handleSaveSettings({ ...settings, instagram: e.target.value })}
                              className="bg-[#080808] border border-zinc-800 text-xs text-white p-2.5 focus:outline-none"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] uppercase tracking-widest text-[#c9a86c]">Facebook Profile URL</label>
                              <input
                                type="text"
                                value={settings.facebook}
                                onChange={(e) => handleSaveSettings({ ...settings, facebook: e.target.value })}
                                className="bg-[#080808] border border-zinc-800 text-xs text-white p-2.5 focus:outline-none"
                              />
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] uppercase tracking-widest text-[#c9a86c]">YouTube Channel URL</label>
                              <input
                                type="text"
                                value={settings.youtube}
                                onChange={(e) => handleSaveSettings({ ...settings, youtube: e.target.value })}
                                className="bg-[#080808] border border-zinc-800 text-xs text-white p-2.5 focus:outline-none"
                              />
                            </div>
                          </div>

                          <h4 className="font-serif text-sm uppercase text-white border-b border-zinc-900 pb-2 mt-6 mb-3">
                            Visibility Toggles
                          </h4>
                          <div className="grid grid-cols-3 gap-4">
                            <label className="flex items-center gap-2 text-xs text-zinc-300">
                              <input
                                type="checkbox"
                                checked={settings.showInsta}
                                onChange={(e) => handleSaveSettings({ ...settings, showInsta: e.target.checked })}
                                className="accent-[#c9a86c]"
                              />
                              Show Instagram
                            </label>
                            <label className="flex items-center gap-2 text-xs text-zinc-300">
                              <input
                                type="checkbox"
                                checked={settings.showFb}
                                onChange={(e) => handleSaveSettings({ ...settings, showFb: e.target.checked })}
                                className="accent-[#c9a86c]"
                              />
                              Show Facebook
                            </label>
                            <label className="flex items-center gap-2 text-xs text-zinc-300">
                              <input
                                type="checkbox"
                                checked={settings.showYt}
                                onChange={(e) => handleSaveSettings({ ...settings, showYt: e.target.checked })}
                                className="accent-[#c9a86c]"
                              />
                              Show YouTube
                            </label>
                          </div>
                        </div>
                      )}

                      {/* TAB 4: STATISTICS PANEL */}
                      {settingsTab === "stats" && (
                        <div className="space-y-4">
                          <h4 className="font-serif text-sm uppercase text-white border-b border-zinc-900 pb-2 mb-3">
                            Studio Highlights Counter Stats
                          </h4>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] uppercase tracking-widest text-[#c9a86c]">Total Visual Works</label>
                              <input
                                type="text"
                                value={settings.statWorks}
                                onChange={(e) => handleSaveSettings({ ...settings, statWorks: e.target.value })}
                                className="bg-[#080808] border border-zinc-800 text-xs text-white p-2.5 focus:outline-none"
                              />
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] uppercase tracking-widest text-[#c9a86c]">Years of Experience</label>
                              <input
                                type="text"
                                value={settings.statYears}
                                onChange={(e) => handleSaveSettings({ ...settings, statYears: e.target.value })}
                                className="bg-[#080808] border border-zinc-800 text-xs text-white p-2.5 focus:outline-none"
                              />
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] uppercase tracking-widest text-[#c9a86c]">Elite Happy Clients</label>
                              <input
                                type="text"
                                value={settings.statClients}
                                onChange={(e) => handleSaveSettings({ ...settings, statClients: e.target.value })}
                                className="bg-[#080808] border border-zinc-800 text-xs text-white p-2.5 focus:outline-none"
                              />
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] uppercase tracking-widest text-[#c9a86c]">Cities Covered</label>
                              <input
                                type="text"
                                value={settings.statCities}
                                onChange={(e) => handleSaveSettings({ ...settings, statCities: e.target.value })}
                                className="bg-[#080808] border border-zinc-800 text-xs text-white p-2.5 focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* TAB 5: SERVICES DESCRIPTIONS LIST */}
                      {settingsTab === "services" && (
                        <div className="space-y-4">
                          <h4 className="font-serif text-sm uppercase text-white border-b border-zinc-900 pb-2 mb-3">
                            Services Modules & Definitions
                          </h4>

                          {services.map((srv) => (
                            <div key={srv.id} className="p-3.5 bg-black border border-zinc-900 space-y-3 relative">
                              <span className="absolute top-3.5 right-3.5 text-xs text-zinc-650 font-mono">
                                ID {srv.id}
                              </span>

                              <div className="flex gap-3">
                                <div className="flex flex-col gap-1 flex-1">
                                  <label className="text-[9px] uppercase tracking-widest text-[#c9a86c]">Service Title</label>
                                  <input
                                    type="text"
                                    value={srv.title}
                                    onChange={(e) => {
                                      const updated = services.map(s => s.id === srv.id ? { ...s, title: e.target.value } : s);
                                      setServices(updated);
                                      localStorage.setItem("pragnya_services", JSON.stringify(updated));
                                    }}
                                    className="bg-[#0e0e0e] border border-zinc-800 text-xs text-[#f5f0e8] p-2 focus:outline-none rounded-none"
                                  />
                                </div>
                                <div className="flex flex-col gap-1 w-16">
                                  <label className="text-[9px] uppercase tracking-widest text-[#c9a86c]">Icon</label>
                                  <input
                                    type="text"
                                    value={srv.icon || "📷"}
                                    onChange={(e) => {
                                      const updated = services.map(s => s.id === srv.id ? { ...s, icon: e.target.value } : s);
                                      setServices(updated);
                                      localStorage.setItem("pragnya_services", JSON.stringify(updated));
                                    }}
                                    className="bg-[#0e0e0e] border border-zinc-800 text-xs text-[#f5f0e8] p-2 focus:outline-none text-center rounded-none"
                                  />
                                </div>
                              </div>

                              <div className="flex flex-col gap-1">
                                <label className="text-[9px] uppercase tracking-widest text-[#c9a86c]">Description Summary</label>
                                <textarea
                                  rows={2}
                                  value={srv.desc}
                                  onChange={(e) => {
                                    const updated = services.map(s => s.id === srv.id ? { ...s, desc: e.target.value } : s);
                                    setServices(updated);
                                    localStorage.setItem("pragnya_services", JSON.stringify(updated));
                                  }}
                                  className="bg-[#0e0e0e] border border-zinc-800 text-xs text-[#d4cfc8] p-2 focus:outline-none resize-none rounded-none"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* TAB 6: TESTIMONIAL REVIEWS LIST */}
                      {settingsTab === "reviews" && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between border-b border-zinc-900 pb-2 mb-3">
                            <h4 className="font-serif text-sm uppercase text-white">
                              Client Review Cards
                            </h4>
                            <button
                              type="button"
                              onClick={() => {
                                const newReview: TestimonialItem = {
                                  id: "rev-" + Date.now(),
                                  name: "New Guest Client",
                                  event: "Celebration Highlight",
                                  stars: 5,
                                  text: "Pragnya Sri team has was an absolute pleasure to collaborate with. Majestic cinematography styles.",
                                  image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150"
                                };
                                const updated = [...testimonials, newReview];
                                setTestimonials(updated);
                                localStorage.setItem("pragnya_testimonials", JSON.stringify(updated));
                                onShowToast("New blank Testimonial added. Scroll to customize below.");
                              }}
                              className="px-2.5 py-1 bg-[#c9a86c]/20 text-[#c9a86c] border border-[#c9a86c]/40 hover:bg-[#c9a86c]/30 text-[9px] uppercase font-bold tracking-widest transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add Testimonial</span>
                            </button>
                          </div>

                          {testimonials.map((t, index) => (
                            <div key={t.id} className="p-3.5 bg-black border border-zinc-900 space-y-3 relative">
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = testimonials.filter(itm => itm.id !== t.id);
                                  setTestimonials(updated);
                                  localStorage.setItem("pragnya_testimonials", JSON.stringify(updated));
                                  onShowToast("Testimonial card removed.");
                                }}
                                className="absolute top-3.5 right-3.5 w-6 h-6 rounded-full bg-zinc-950 hover:bg-neutral-900 flex items-center justify-center text-red-500 border border-transparent hover:border-red-500/20 transition-all cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>

                              <span className="font-mono text-[9px] text-[#c9a86c]/50 uppercase">
                                Testimonial Card #{index + 1}
                              </span>

                              <div className="grid grid-cols-2 gap-3 pb-1">
                                <div className="flex flex-col gap-1">
                                  <label className="text-[8px] uppercase tracking-wider text-zinc-500">Client Name</label>
                                  <input
                                    type="text"
                                    value={t.name}
                                    onChange={(e) => {
                                      const updated = testimonials.map(item => item.id === t.id ? { ...item, name: e.target.value } : item);
                                      setTestimonials(updated);
                                      localStorage.setItem("pragnya_testimonials", JSON.stringify(updated));
                                    }}
                                    className="bg-[#0e0e0e] border border-zinc-800 text-xs text-[#f5f0e8] p-1.5 focus:outline-none"
                                  />
                                </div>
                                <div className="flex flex-col gap-1">
                                  <label className="text-[8px] uppercase tracking-wider text-zinc-500">Event Label</label>
                                  <input
                                    type="text"
                                    value={t.event}
                                    onChange={(e) => {
                                      const updated = testimonials.map(item => item.id === t.id ? { ...item, event: e.target.value } : item);
                                      setTestimonials(updated);
                                      localStorage.setItem("pragnya_testimonials", JSON.stringify(updated));
                                    }}
                                    className="bg-[#0e0e0e] border border-zinc-800 text-xs text-[#f5f0e8] p-1.5 focus:outline-none"
                                  />
                                </div>
                              </div>

                              <div className="flex flex-col gap-1.5 pb-2 border-b border-zinc-950">
                                <label className="text-[9px] uppercase tracking-widest text-[#c9a86c]">Client Snapshot/Portrait Link</label>
                                <input
                                  type="text"
                                  value={t.image || ""}
                                  onChange={(e) => {
                                    const updated = testimonials.map(item => item.id === t.id ? { ...item, image: e.target.value } : item);
                                    setTestimonials(updated);
                                    localStorage.setItem("pragnya_testimonials", JSON.stringify(updated));
                                  }}
                                  className="bg-[#0e0e0e] border border-zinc-800 text-xs text-[#d4cfc8] p-2 focus:outline-none"
                                />
                              </div>

                              <div className="flex flex-col gap-1">
                                <label className="text-[8px] uppercase tracking-wider text-zinc-500">Quote Text Content</label>
                                <textarea
                                  rows={3}
                                  value={t.text || t.quote || ""}
                                  onChange={(e) => {
                                    const updated = testimonials.map(item => item.id === t.id ? { ...item, text: e.target.value, quote: e.target.value } : item);
                                    setTestimonials(updated);
                                    localStorage.setItem("pragnya_testimonials", JSON.stringify(updated));
                                  }}
                                  className="bg-[#0e0e0e] border border-zinc-800 text-xs text-white p-2 focus:outline-none resize-none"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* TAB 7: ADMINISTRATIVE PASSWORD MANAGER */}
                      {settingsTab === "password" && (
                        <div className="space-y-4">
                          <h4 className="font-serif text-sm uppercase text-white border-b border-zinc-900 pb-2 mb-3">
                            Administrator Security Settings
                          </h4>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] uppercase font-sans tracking-widest text-[#c9a86c]">
                              Update Admin Password Key *
                            </label>
                            <input
                              type="password"
                              defaultValue={settings.password}
                              onChange={(e) => {
                                if (e.target.value.trim().length >= 4) {
                                  const updated = { ...settings, password: e.target.value };
                                  setSettings(updated);
                                  localStorage.setItem("pragnya_settings", JSON.stringify(updated));
                                  onShowToast("Security password changed successfully!");
                                }
                              }}
                              placeholder="admin@123"
                              className="bg-[#080808] border border-zinc-800 focus:border-[#c9a86c] text-[#d4cfc8] text-xs px-4 py-3 placeholder:text-zinc-700 focus:outline-none transition-colors rounded-none font-mono"
                            />
                            <span className="text-[9px] text-[#d4cfc8]/50 leading-normal block">
                              Must be at least 4 characters long. Saving triggers instant hot reloading.
                            </span>
                          </div>
                        </div>
                      )}

                      {/* TAB 8: HELP & SYNC PDF MANUAL */}
                      {settingsTab === "manual" && (
                        <div className="space-y-4">
                          <h4 className="font-serif text-sm uppercase text-white border-b border-zinc-900 pb-2 mb-3">
                            Device Sync & Deployment Guide
                          </h4>
                          <p className="text-xs text-[#d4cfc8]/85 leading-relaxed font-sans">
                            Follow this complete guide to share your website, keep all your edits synchronized without errors, and save a clean administrative manual as a <strong>PDF</strong>.
                          </p>

                          <div className="space-y-3 bg-[#080808]/95 border border-zinc-900 p-4">
                            <span className="text-[10px] uppercase font-bold tracking-widest text-[#c9a86c] block">
                              How to Generate & Deploy Your Link:
                            </span>
                            <ol className="list-decimal pl-4 text-[11px] text-[#d4cfc8]/80 space-y-2">
                              <li>
                                In your Cloud Sync Portal, configure your <strong>GitHub Gist ID</strong> and <strong>Classic Access Token</strong>.
                              </li>
                              <li>
                                When you perform edits (like editing social handles, uploading portraits, or modifying wedding highlights), click <strong>"Save and Push Now"</strong> inside the cloud tab.
                              </li>
                              <li>
                                Open the specialized synchronization URL (containing the <code>?gist=...</code> parameter) on client smartphones, computers, or test environments. It will fetch all records instantly on load with zero cache errors!
                              </li>
                            </ol>
                          </div>

                          <div className="pt-4 flex justify-center">
                            <button
                              type="button"
                              onClick={() => {
                                const printWindow = window.open("", "_blank");
                                if (!printWindow) {
                                  onShowToast("Pop-up blocked. Please allow popups to save the PDF.");
                                  return;
                                }
                                const siteUrl = window.location.origin + window.location.pathname;
                                const syncUrl = gistConfig && gistConfig.gistId
                                  ? `${siteUrl}?gist=${gistConfig.gistId}`
                                  : `${siteUrl} (Configure Gist in Cloud Sync Portal first!)`;

                                printWindow.document.write(`
                                  <!DOCTYPE html>
                                  <html>
                                  <head>
                                    <title>Backup & Sync Manual - ${settings.name}</title>
                                    <style>
                                      body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #111; line-height: 1.6; }
                                      .wrapper { max-width: 700px; margin: auto; }
                                      h1 { font-size: 26px; border-bottom: 2px solid #c9a86c; padding-bottom: 12px; margin-bottom: 25px; text-transform: uppercase; letter-spacing: 1px; }
                                      h2 { font-size: 16px; margin-top: 25px; border-bottom: 1px solid #ddd; padding-bottom: 5px; text-transform: uppercase; color: #222; }
                                      .code-box { background: #f5f5f5; border-left: 4px solid #c9a86c; padding: 12px; font-family: monospace; font-size: 12px; margin: 15px 0; word-break: break-all; }
                                      .btn-print { background: #c9a86c; color: #000; padding: 10px 20px; border: none; font-weight: bold; cursor: pointer; text-transform: uppercase; font-size: 12px; margin-top: 25px; letter-spacing: 1px; }
                                      ol, ul { padding-left: 20px; }
                                      li { margin-bottom: 8px; font-size: 13px; color: #333; }
                                      .footer { margin-top: 60px; border-top: 1px solid #eee; padding-top: 15px; font-size: 11px; text-align: center; color: #888; }
                                      @media print { .no-print { display: none; } body { padding: 10px; } }
                                    </style>
                                  </head>
                                  <body>
                                    <div class="wrapper">
                                      <h1>Sync & Deployment Manual</h1>
                                      <p style="font-size: 13px; color: #666; font-style: italic;">Official System Blueprint for ${settings.name}</p>

                                      <h2>1. Active Identification Configuration</h2>
                                      <ul>
                                        <li><strong>Studio Webspace:</strong> ${settings.name}</li>
                                        <li><strong>Local Administration Password Key:</strong> <code>${settings.password}</code></li>
                                      </ul>

                                      <h2>2. Safe Sync Procedures (Prevent Missing Data)</h2>
                                      <ol>
                                        <li><strong>Setup Cloud Store:</strong> Visit Gist on GitHub and create a file with name <code>pragnyasri_creations_db.json</code>.</li>
                                        <li><strong>Link up credentials:</strong> Enter the token & Gist ID into your Cloud Sync Portal within this app.</li>
                                        <li><strong>Execute Synchronization:</strong> Post any content edit (such as updating Instagram layout, WhatsApp numbers, Facebook links, or porting client highlights), tap <strong>"Save and Push Now"</strong>.</li>
                                        <li><strong>Open On Other Devices:</strong> Share your Synchronized URL showing your configuration. By utilizing the <code>?gist=...</code> parameter, other devices will instantly load your saved data into local storage from Gist directly, avoiding empty layouts or outdated works!</li>
                                      </ol>

                                      <h2>3. Media & Video Link Guide (YouTube & Google Drive)</h2>
                                      <p style="font-size: 13px; color: #333;">This website automatically translates standard web links into interactive embeds. Simply paste regular links of these forms:</p>
                                      <ul>
                                        <li><strong>YouTube Watch Links:</strong> <code>https://www.youtube.com/watch?v=VIDEO_ID</code></li>
                                        <li><strong>YouTube Shorts Links:</strong> <code>https://www.youtube.com/shorts/VIDEO_ID</code></li>
                                        <li><strong>YouTube Mobile Share Links:</strong> <code>https://youtu.be/VIDEO_ID</code></li>
                                        <li><strong>Google Drive Videos:</strong> <code>https://drive.google.com/file/d/FILE_ID/view?usp=sharing</code><br/>
                                        <span style="font-size: 11px; color: #c9a86c; font-style: italic;">* Warning: Set Google Drive permissions to "Anyone with the link" so everyone can stream it.</span></li>
                                      </ul>

                                      <h2>4. Live Shared System Link</h2>
                                      <div class="code-box">${syncUrl}</div>

                                      <div class="no-print" style="text-align: center;">
                                        <button class="btn-print" onclick="window.print()">Print or Download as PDF</button>
                                      </div>

                                      <div class="footer">
                                        Generated on ${new Date().toLocaleDateString()} | Pragnya Sri Creations Systems Manual
                                      </div>
                                    </div>
                                  </body>
                                  </html>
                                `);
                                printWindow.document.close();
                              }}
                              className="px-6 py-2.5 border border-[#c9a86c] bg-[#c9a86c]/10 text-[#c9a86c] hover:bg-[#c9a86c] hover:text-[#080808] transition-all text-xs uppercase font-bold tracking-widest cursor-pointer rounded-none"
                            >
                              Get Sync Instructions PDF
                            </button>
                          </div>
                        </div>
                      )}

                    </div>

                  </div>
                </div>
              )}

              {/* MODAL 5: INTRO CREDENTIALS DIRECT MOD */}
              {activeModal === "edit-intro" && (
                <div id="intro-config-modal" className="py-2">
                  <div className="flex items-center gap-3.5 border-b border-zinc-900 pb-4 mb-6">
                    <div className="w-10 h-10 rounded-full border border-[#c9a86c]/40 flex items-center justify-center bg-black/40">
                      <Film className="w-5 h-5 text-[#c9a86c]" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg tracking-wider text-white">
                        EDIT HERO ASSETS
                      </h3>
                      <span className="text-[9px] uppercase tracking-widest text-[#c9a86c] block">
                        Swap visual backdrop videos, banner images, and logo seals
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] uppercase tracking-widest font-sans text-[#c9a86c]">
                        Hero Media Type Trigger
                      </label>
                      <select
                        value={settings.heroMediaType}
                        onChange={(e) => handleSaveSettings({ ...settings, heroMediaType: e.target.value as "video" | "image" })}
                        className="bg-[#080808] border border-zinc-800 text-xs text-white p-2.5 focus:outline-none font-sans"
                      >
                        <option value="video">Cinematic Video Background (.mp4 link)</option>
                        <option value="image">Ultra HD Still Image Banner (.jpg / .png link)</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] uppercase tracking-widest font-sans text-[#c9a86c]">
                        Active Hero Video Stream URL (.mp4 file link)
                      </label>
                      <input
                        type="text"
                        value={settings.heroVideoUrl}
                        onChange={(e) => handleSaveSettings({ ...settings, heroVideoUrl: e.target.value })}
                        placeholder="https://pub-1234.mp4"
                        className="bg-[#080808] border border-zinc-800 text-xs text-white p-2.5 focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] uppercase tracking-widest font-sans text-[#c9a86c]">
                        Active Hero Image URL (Fallback / Poster picture link)
                      </label>
                      <input
                        type="text"
                        value={settings.heroImageUrl || ""}
                        onChange={(e) => handleSaveSettings({ ...settings, heroImageUrl: e.target.value })}
                        placeholder="https://images.unsplash.com/photo-xxx"
                        className="bg-[#080808] border border-zinc-800 text-xs text-white p-2.5 focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] uppercase tracking-widest font-sans text-[#c9a86c]">
                        Hero Miniature Logo Emblem (Optional Logo bubble overlay)
                      </label>
                      <input
                        type="text"
                        value={settings.heroLogoUrl || ""}
                        onChange={(e) => handleSaveSettings({ ...settings, heroLogoUrl: e.target.value })}
                        placeholder="https://images.unsplash.com/xxx"
                        className="bg-[#080808] border border-zinc-800 text-xs text-white p-2.5 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* MODAL 6: EDIT GALLERY SOCIAL GRID */}
              {activeModal === "edit-gallery" && (
                <div id="gallery-config-modal" className="py-2">
                  <div className="flex items-center gap-3.5 border-b border-zinc-900 pb-4 mb-6">
                    <div className="w-10 h-10 rounded-full border border-[#c9a86c]/40 flex items-center justify-center bg-black/40">
                      <Image className="w-5 h-5 text-[#c9a86c]" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg tracking-wider text-white">
                        EDIT PORTABLE STREAM CAROUSEL
                      </h3>
                      <span className="text-[9px] uppercase tracking-widest text-[#c9a86c] block">
                        Change customized Instagram handle and direct photo URL slots
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] uppercase tracking-widest text-[#c9a86c]">Handle Label</label>
                        <input
                          type="text"
                          value={settings.instaHandle}
                          onChange={(e) => handleSaveSettings({ ...settings, instaHandle: e.target.value })}
                          className="bg-[#080808] border border-zinc-800 text-xs text-white p-2.5"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] uppercase tracking-widest text-[#c9a86c]">Subtext Call</label>
                        <input
                          type="text"
                          value={settings.instaSubtext}
                          onChange={(e) => handleSaveSettings({ ...settings, instaSubtext: e.target.value })}
                          className="bg-[#080808] border border-zinc-800 text-xs text-white p-2.5"
                        />
                      </div>
                    </div>

                    <h4 className="font-serif text-xs uppercase text-white pt-4 border-t border-zinc-900 mb-2">
                      Studio Images Feed (8 Grid items)
                    </h4>

                    <div className="grid grid-cols-2 gap-3.5 max-h-[220px] overflow-y-auto pr-1">
                      {settings.instaImages.map((img, idx) => (
                        <div key={idx} className="flex flex-col gap-1">
                          <label className="text-[8px] uppercase text-zinc-500 font-mono">Image Slot #{idx + 1}</label>
                          <input
                            type="text"
                            value={img}
                            onChange={(e) => {
                              const updatedImages = [...settings.instaImages];
                              updatedImages[idx] = e.target.value;
                              handleSaveSettings({ ...settings, instaImages: updatedImages });
                            }}
                            className="bg-[#080808] border border-zinc-850 p-2 text-[10px] text-white focus:outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
