export interface App {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  link?: string;
  comingSoon?: boolean;
}

export const APPS: App[] = [
  {
    id: 'prayai',
    title: 'PrayAI',
    description: 'AI-powered prayer and spiritual guidance',
    imageUrl: '/apps/prayai.png',
    link: 'https://prayai.org',
  },
  {
    id: 'fakeflex',
    title: 'FakeFlex',
    description: 'AI virtual try-on with watermarks',
    imageUrl: '/apps/fakeflex.png',
    link: 'https://fakeflex.app',
  },
  {
    id: 'app3',
    title: 'Coming Soon',
    comingSoon: true,
  },
  {
    id: 'app4',
    title: 'Coming Soon',
    comingSoon: true,
  },
];
