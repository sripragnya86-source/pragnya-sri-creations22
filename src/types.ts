export interface PortfolioItem {
  id: string; // Dynamic string id
  category: string;
  categoryLabel: string;
  title: string;
  meta: string;
  image: string;
  videoUrl: string;
  location?: string;
  date?: string;
  desc?: string;
  featured?: boolean;
  color?: string;
}

export interface ServiceItem {
  id: number;
  title: string;
  desc: string; // matching user's custom template
  icon: string; // Emoji character string matching reference e.g. "💍"
}

export interface TestimonialItem {
  id: string;
  name: string;
  event: string;
  stars?: number;
  rating?: number; // fallback
  quote?: string;
  text: string; // matching user's reference "text"
  image?: string;
  date?: string;
}

export interface GistConfig {
  gistId: string;
  token: string;
}

export interface BrandingSettings {
  name: string;
  tagline: string;
  logo: string;
  phone: string;
  whatsapp: string;
  email: string;
  instagram: string;
  facebook: string;
  youtube: string;
  showInsta: boolean;
  showFb: boolean;
  showYt: boolean;
  statWorks: string;
  statYears: string;
  statClients: string;
  statCities: string;
  about1: string;
  about2: string;
  sig: string;
  aboutSigLabel: string;
  aboutImage: string;
  aboutHeading: string;
  heroEyebrow: string;
  heroMediaType: "video" | "image";
  heroVideoUrl: string;
  heroImageUrl: string;
  heroLogoUrl: string;
  instaHandle: string;
  instaSubtext: string;
  password: string;
  instaImages: string[];
}
