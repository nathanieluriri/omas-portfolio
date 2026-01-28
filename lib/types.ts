export interface APIResponse<T> {
  status_code: number;
  data: T | null;
  detail: string;
}

export interface AvailabilityBadge {
  label?: string;
  status?: string;
}

export interface HeroSection {
  name?: string;
  title?: string;
  bio?: string[];
  availability?: AvailabilityBadge;
}

export interface ExperienceEntry {
  date: string;
  role: string;
  company: string;
  link?: string | null;
  description?: string | null;
  highlights?: string[];
  current?: boolean;
}

export interface ProjectEntry {
  title: string;
  tags?: string[];
  description: string;
  link: string;
}

export interface SkillGroup {
  title: string;
  items?: string[];
}

export interface ContactEntry {
  label: string;
  value: string;
  href: string;
  icon?: string | null;
}

export interface FooterContent {
  copyright?: string;
  tagline?: string;
}

export interface NavItem {
  href: string;
  label: string;
}

export interface ThemeColors {
  text_primary?: string;
  text_secondary?: string;
  text_muted?: string;
  bg_primary?: string;
  bg_surface?: string;
  bg_surface_hover?: string;
  bg_divider?: string;
  accent_primary?: string;
  accent_muted?: string;
}

export interface AnimationSettings {
  staggerChildren?: number;
  delayChildren?: number;
  duration?: number;
  ease?: string;
}

export interface MetadataFields {
  title?: string;
  description?: string;
  author?: string;
}

export interface PortfolioBase {
  user_id?: string | null;
  navItems?: NavItem[];
  footer?: FooterContent;
  hero?: HeroSection;
  experience?: ExperienceEntry[];
  projects?: ProjectEntry[];
  skillGroups?: SkillGroup[];
  contacts?: ContactEntry[];
  theme?: ThemeColors;
  animations?: AnimationSettings;
  metadata?: MetadataFields;
  resumeUrl?: string;
}

export interface PortfolioOut {
  userId?: string | null;
  navItems?: NavItem[];
  footer?: FooterContent;
  hero?: HeroSection;
  experience?: ExperienceEntry[];
  projects?: ProjectEntry[];
  skillGroups?: SkillGroup[];
  contacts?: ContactEntry[];
  theme?: ThemeColors;
  animations?: AnimationSettings;
  metadata?: MetadataFields;
  resumeUrl?: string;
  id?: string | null;
  dateCreated?: number | null;
  lastUpdated?: number | null;
}

export interface UserOut {
  firstName: string;
  lastName: string;
  loginType: string;
  email: string;
  accountStatus?: string;
  _id?: string | null;
  date_created?: number | null;
  last_updated?: number | null;
  refresh_token?: string | null;
  access_token?: string | null;
}
