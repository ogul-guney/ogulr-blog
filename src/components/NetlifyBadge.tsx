import React from 'react';

export const NetlifyBadge: React.FC = () => {
  return (
    <a
      href="https://www.netlify.com"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-6 z-40 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#161a1f]/90 hover:bg-[#1f252d] border border-neutral-800 text-xs text-neutral-300 transition-all duration-200 shadow-lg hover:border-neutral-700 backdrop-blur-sm group"
      title="Deploys on Netlify"
    >
      {/* Official Netlify Logo Mark */}
      <svg
        className="w-4 h-4 text-[#00c7b7] group-hover:scale-105 transition-transform"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M6.49 19.09l-3.35-3.35a.55.55 0 010-.78l3.35-3.35a.55.55 0 01.78 0l3.35 3.35a.55.55 0 010 .78l-3.35 3.35a.55.55 0 01-.78 0z" />
        <path d="M12 24l-3.35-3.35a.55.55 0 010-.78l3.35-3.35a.55.55 0 01.78 0l3.35 3.35a.55.55 0 010 .78L12.78 24a.55.55 0 01-.78 0z" />
        <path d="M17.51 19.09l-3.35-3.35a.55.55 0 010-.78l3.35-3.35a.55.55 0 01.78 0l3.35 3.35a.55.55 0 010 .78l-3.35 3.35a.55.55 0 01-.78 0z" />
        <path d="M12 13.58l-3.35-3.35a.55.55 0 010-.78l3.35-3.35a.55.55 0 01.78 0l3.35 3.35a.55.55 0 010 .78l-3.35 3.35a.55.55 0 01-.78 0z" />
        <path d="M6.49 8.16L3.14 4.81a.55.55 0 010-.78L6.49.68a.55.55 0 01.78 0l3.35 3.35a.55.55 0 010 .78l-3.35 3.35a.55.55 0 01-.78 0z" />
        <path d="M12 3.23L8.65-.12a.55.55 0 01.78 0l3.35 3.35a.55.55 0 010 .78L9.43 7.36a.55.55 0 01-.78 0L12 3.23z" />
        <path d="M17.51 8.16l-3.35-3.35a.55.55 0 010-.78l3.35-3.35a.55.55 0 01.78 0l3.35 3.35a.55.55 0 010 .78l-3.35 3.35a.55.55 0 01-.78 0z" />
      </svg>
      <span className="font-normal tracking-wide">
        Powered by <strong className="font-semibold text-white">Netlify</strong>
      </span>
    </a>
  );
};
