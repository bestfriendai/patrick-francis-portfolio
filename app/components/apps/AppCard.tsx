'use client';

import Image from 'next/image';
import { App } from './apps.config';

interface AppCardProps {
  app: App;
}

const AppCard = ({ app }: AppCardProps) => {
  const handleClick = () => {
    if (app.link) {
      window.open(app.link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        relative aspect-square rounded-2xl overflow-hidden
        backdrop-blur-md bg-white/10 border border-white/20
        transition-all duration-300 ease-out
        ${app.link ? 'cursor-pointer hover:scale-105 hover:shadow-2xl hover:bg-white/15' : 'cursor-default'}
        ${app.comingSoon ? 'bg-gray-200/5' : ''}
      `}
      aria-label={app.link ? `Open ${app.title}` : app.title}
      role={app.link ? 'button' : 'presentation'}
      tabIndex={app.link ? 0 : -1}
      onKeyDown={(e) => {
        if (app.link && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {app.imageUrl ? (
        <>
          {/* App Image */}
          <div className="relative w-full h-full">
            <Image
              src={app.imageUrl}
              alt={app.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 40vw, 250px"
              quality={90}
            />
          </div>

          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 bg-gradient-to-t from-black/70 via-black/50 to-transparent">
            <h3 className="text-sm md:text-lg font-semibold text-white text-center tracking-wide">
              {app.title}
            </h3>
          </div>
        </>
      ) : (
        /* Coming Soon State */
        <div className="flex items-center justify-center w-full h-full">
          <p className="text-base md:text-xl text-gray-300 italic font-medium tracking-wider">
            {app.title}
          </p>
        </div>
      )}
    </div>
  );
};

export default AppCard;
