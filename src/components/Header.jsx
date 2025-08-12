import React from "react";

const Header = ({ title }) => {
  return (
    <header className="sticky top-0 z-20 bg-slate-900/80 backdrop-blur border-b border-slate-800">
      <div className="container mx-auto flex items-center gap-4 px-4 py-3">
        <img
          src="/logos/SPORTIUM-MAIN.jpg"
          alt="Sportium Logo"
          className="h-12 w-auto object-contain rounded-md shadow-sm"
        />
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-amber-400">
          {title}
        </h1>
      </div>
    </header>
  );
};

export default Header;


