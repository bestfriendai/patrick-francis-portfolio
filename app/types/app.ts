export interface AppStats {
  downloads?: string;
  rating?: number;
  reviews?: number;
}

export interface AppLinks {
  appStore?: string;
  playStore?: string;
  website: string;
}

export type AppCategory = 'productivity' | 'social' | 'lifestyle' | 'entertainment' | 'utilities' | 'faith';
export type Platform = 'iOS' | 'Android' | 'Web';

export interface App {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: AppCategory;
  screenshots: string[];
  icon: string;
  themeColor: string;
  gradientColors: [string, string];
  platforms: Platform[];
  links: AppLinks;
  stats: AppStats;
  features: string[];
  technologies?: string[];
  releaseDate: string;
  featured?: boolean;
}
