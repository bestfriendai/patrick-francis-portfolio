import { App } from '../types/app';

export const APPS: App[] = [
  {
    id: 'prayai',
    name: 'PRAYAI',
    tagline: 'AI-Powered Prayer & Devotional',
    description: 'Connect with your faith through AI-assisted prayers, daily devotionals, and a supportive community.',
    category: 'faith',
    screenshots: [
      '/apps/prayai.png',
      '/apps/prayai.png',
      '/apps/prayai.png'
    ],
    icon: '/apps/prayai.png',
    themeColor: '#b9c6d6',
    gradientColors: ['#b9c6d6', '#8fa5b8'],
    platforms: ['iOS', 'Android', 'Web'],
    links: {
      website: 'https://prayai.org'
    },
    stats: {
      downloads: '10K+',
      rating: 4.8,
      reviews: 523
    },
    features: [
      'AI Prayer Assistant',
      'Daily Devotionals',
      'Prayer Community',
      'Customizable Reminders',
      'Offline Access'
    ],
    technologies: ['React Native', 'OpenAI', 'Firebase'],
    releaseDate: '2024-01',
    featured: true
  },
  {
    id: 'fakeflex',
    name: 'FAKEFLEX',
    tagline: 'Virtual Try-On & AI Outfits',
    description: 'Try on outfits virtually with AI. Upload photos, select styles, and see yourself in different looks.',
    category: 'entertainment',
    screenshots: [
      '/apps/fakeflex.png',
      '/apps/fakeflex.png',
      '/apps/fakeflex.png'
    ],
    icon: '/apps/fakeflex.png',
    themeColor: '#bdd1e3',
    gradientColors: ['#bdd1e3', '#9ab5cd'],
    platforms: ['iOS', 'Web'],
    links: {
      website: 'https://fakeflex.app'
    },
    stats: {
      downloads: '5K+',
      rating: 4.6,
      reviews: 289
    },
    features: [
      'AI Virtual Try-On',
      'Photo Upload',
      'Style Selection',
      'Share Results',
      'Pro Outfits'
    ],
    technologies: ['Next.js', 'Stable Diffusion', 'Vercel'],
    releaseDate: '2024-06',
    featured: true
  }
];

export const getFeaturedApps = () => APPS.filter(app => app.featured);
export const getAppsByCategory = (category: string) => APPS.filter(app => app.category === category);
export const getAppById = (id: string) => APPS.find(app => app.id === id);
