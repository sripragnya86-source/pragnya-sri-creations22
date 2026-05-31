export interface PortfolioItem {
  id: number;
  category: string;
  categoryLabel: string;
  title: string;
  meta: string;
  image: string;
  videoUrl: string; // Embed or placeholder simulation video
}

export interface ServiceItem {
  id: number;
  title: string;
  description: string;
  iconName: string;
  details: string[];
}

export interface TestimonialItem {
  id: number;
  name: string;
  event: string;
  stars: number;
  quote: string;
  image: string;
}

export interface StatItem {
  id: number;
  value: string;
  label: string;
}

export interface InstagramPost {
  id: number;
  image: string;
  likes: string;
  comments: string;
  url: string;
}

export const STATS_DATA: StatItem[] = [
  { id: 1, value: "250+", label: "Total Works" },
  { id: 2, value: "8+", label: "Years Experience" },
  { id: 3, value: "500+", label: "Happy Clients" },
  { id: 4, value: "15+", label: "Cities Covered" },
];

export const PORTFOLIO_DATA: PortfolioItem[] = [
  {
    id: 1,
    category: "wedding",
    categoryLabel: "Wedding Highlights",
    title: "Eternal Union in Tuscany",
    meta: "Cinematic Wedding Film • Florence, Italy",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200",
    videoUrl: "https://www.youtube.com/embed/g3-V_7ySvaU" // High-quality wedding cinematic example
  },
  {
    id: 2,
    category: "pre-wedding",
    categoryLabel: "Pre Wedding",
    title: "Whispers of the Golden Dunes",
    meta: "Love Story Photography • Thar Desert",
    image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=1200",
    videoUrl: "https://www.youtube.com/embed/gCP_7Duhv8g"
  },
  {
    id: 3,
    category: "songs",
    categoryLabel: "Cover Songs",
    title: "Melody in the Moonlight",
    meta: "Acoustic Cover Video • Studio Session",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=1200",
    videoUrl: "https://www.youtube.com/embed/6m6uT0T_Dco"
  },
  {
    id: 4,
    category: "wedding",
    categoryLabel: "Wedding Highlights",
    title: "A Royal Heritage Celebration",
    meta: "Traditional Wedding Film • Jaipur Palace",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1200",
    videoUrl: "https://www.youtube.com/embed/K8N3X6z2y7Q"
  },
  {
    id: 5,
    category: "baby",
    categoryLabel: "Baby Shoots",
    title: "Little Dreamer's First Steps",
    meta: "Editorial Portrait • Home Comforts Studio",
    image: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=1200",
    videoUrl: "https://www.youtube.com/embed/V6W3B_z6M-M"
  },
  {
    id: 6,
    category: "birthday",
    categoryLabel: "Birthday Events",
    title: "The Golden Decadence Party",
    meta: "Luxury Birthday Highlight • Skyline Lounge",
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=1200",
    videoUrl: "https://www.youtube.com/embed/TshV3-aL_Kk"
  },
  {
    id: 7,
    category: "pre-wedding",
    categoryLabel: "Pre Wedding",
    title: "Misty Mountain Embrace",
    meta: "Cinematic Teaser • Western Ghats Peaks",
    image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=1200",
    videoUrl: "https://www.youtube.com/embed/k86c3Iq86zE"
  },
  {
    id: 8,
    category: "songs",
    categoryLabel: "Cover Songs",
    title: "Unplugged Symphony Of Love",
    meta: "Visual Music Video • Sunset Beach",
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=1200",
    videoUrl: "https://www.youtube.com/embed/6iUv9v3gYlY"
  },
  {
    id: 9,
    category: "other",
    categoryLabel: "Other Events",
    title: "Haute Couture Editorial Reel",
    meta: "Fashion Showcase • Studio Blacklit",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1200",
    videoUrl: "https://www.youtube.com/embed/D_h_rE9uOgw"
  }
];

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 1,
    title: "Photography",
    description: "Capturing high-fashion, premium-grade portraits and landscapes with state-of-the-art medium format lenses.",
    iconName: "Camera",
    details: ["High-End Retouching", "Color Grading Mastery", "Medium Format 100MP Photos", "Online Private Gallery"]
  },
  {
    id: 2,
    title: "Videography",
    description: "Ultra-high definition documentary and event coverage preserving true-to-life soundscapes and genuine emotion.",
    iconName: "Video",
    details: ["4K Cine Resolution", "Crystal Audio Capture", "Multicam Raw Recording", "Gimbal Stabilized Footage"]
  },
  {
    id: 3,
    title: "Cinematic Films",
    description: "Bespoke short films scripted, filmed, and sound-engineered like true theatrical masterpieces.",
    iconName: "Film",
    details: ["Pro Scripting & Storyboard", "Cine Lens Rendering", "Custom Sound Design", "Hollywood Color Graded"]
  },
  {
    id: 4,
    title: "Wedding Coverage",
    description: "Your once-in-a-lifetime heritage wedding filmed with deep sensitivity and absolute grandeur.",
    iconName: "Sparkles",
    details: ["Full Day Capture", "Pre-wedding Film Hooked", "Highlight Teaser Reel", "Master Cinematic Keepsake"]
  },
  {
    id: 5,
    title: "Baby Shoots",
    description: "Delicate and warm high-end portrait sessions that capture your little angel's softest expressions.",
    iconName: "Heart",
    details: ["Safe & Sanitized Environments", "Custom Styled Props", "Playful Natural Lighting", "Heirloom Output Album"]
  },
  {
    id: 6,
    title: "Birthday Events",
    description: "Immersive documentary reels of premium birthdays and luxury private celebrations.",
    iconName: "Gift",
    details: ["Live Action Sizzle", "Candid Captures", "Guest Interview Clips", "Same-day Instagram Reel"]
  }
];

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: 1,
    name: "Aarav & Anjali Sharma",
    event: "Wedding Highlights",
    stars: 5,
    quote: "Pragnya Sri Creations didn't just record our wedding—they made it look like a Hollywood historical romance on the silver screen. Absolute masterminds of lighting and emotion.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: 2,
    name: "Rohan Advani",
    event: "Cover Song Shoot",
    stars: 5,
    quote: "The visual aesthetic they developed for my acoustic video was sublime. The golden highlights, smoky background, and camera flow perfectly complemented the melodic intensity.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: 3,
    name: "Meera Sen",
    event: "Baby & Maternity Shoot",
    stars: 5,
    quote: "We are absolutely enchanted with the editorial portraits of our newborn baby girl. The environment was warm, calming, and the resulting photo album feels like a royal heirloom.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
  }
];

export const INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=400",
    likes: "2.4K",
    comments: "148",
    url: "https://instagram.com"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=400",
    likes: "1.9K",
    comments: "98",
    url: "https://instagram.com"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=400",
    likes: "3.2K",
    comments: "210",
    url: "https://instagram.com"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=400",
    likes: "4.1K",
    comments: "305",
    url: "https://instagram.com"
  }
];
