'use client';

import { useState } from 'react';
import Image from 'next/image';

const LANGUAGE_NAMES = {
  en: "English",
  fr: "Français",
  es: "Español",
  it: "Italiano",
  de: "Deutsch"
};

export default function TcgPocketDashboard({ initialData }) {
  const { languages, cardsByLang, setsByLang, stats } = initialData;

  // State Management
  const [selectedLang, setSelectedLang] = useState(languages[0] || 'en');
  // Default to the first set of the selected language
  const currentSets = setsByLang[selectedLang] || [];
  const [selectedSetId, setSelectedSetId] = useState(currentSets[0]?.id || null);

  // Derived state
  const currentCards = cardsByLang[selectedLang] || [];
  
  // Update selected set if language changes and the old set ID doesn't exist in the new language
  const handleLanguageChange = (lang) => {
    setSelectedLang(lang);
    const newSets = setsByLang[lang] || [];
    if (!newSets.find(s => s.id === selectedSetId)) {
      setSelectedSetId(newSets[0]?.id || null);
    }
  };

  const filteredCards = currentCards.filter(card => card.setId === selectedSetId);
  const selectedSetName = currentSets.find(s => s.id === selectedSetId)?.name || "Unknown Set";

  if (!languages.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <p>No card data found. Please run the scraper script first.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-purple-500/30">
      
      {/* HEADER DASHBOARD */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
              Pokémon TCG Pocket
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {stats.totalLanguages} Languages • {stats.totalCardsPerLang[selectedLang]} Cards in {LANGUAGE_NAMES[selectedLang] || selectedLang.toUpperCase()}
            </p>
          </div>

          {/* LANGUAGE SWITCHER PILLS */}
          <div className="flex gap-2 p-1 bg-slate-800/50 rounded-lg shrink-0">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                  selectedLang === lang 
                    ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {LANGUAGE_NAMES[lang] || lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* SIDEBAR - SET SELECTOR */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="sticky top-32">
            <h2 className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-4">Available Sets</h2>
            <div className="flex flex-col gap-2">
              {currentSets.map((set) => {
                const isSelected = selectedSetId === set.id;
                // Count cards in this set for the sidebar
                const cardsInSet = currentCards.filter(c => c.setId === set.id).length;
                
                return (
                  <button
                    key={set.id}
                    onClick={() => setSelectedSetId(set.id)}
                    className={`flex justify-between items-center px-4 py-3 rounded-xl transition-all duration-300 text-left ${
                      isSelected 
                        ? 'bg-blue-600/10 border border-blue-500/30 text-blue-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]' 
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800/80 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <span className="font-medium truncate pr-2" title={set.name}>{set.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${isSelected ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-800 text-slate-500'}`}>
                      {cardsInSet}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* CARD GRID OVERVIEW */}
        <div className="flex-1">
          <div className="mb-8 flex justify-between items-end border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-100">{selectedSetName}</h2>
              <p className="text-slate-400 text-sm mt-1">Set ID: {selectedSetId}</p>
            </div>
            <div className="text-sm text-slate-500 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
              {filteredCards.length} Cards
            </div>
          </div>

          {filteredCards.length === 0 ? (
            <div className="text-center py-20 text-slate-500 bg-slate-900/30 rounded-2xl border border-slate-800/50 border-dashed">
              No cards found for this set.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCards.map((card) => (
                <div 
                  key={card.id} 
                  className="group bg-slate-900/40 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-purple-500/50 hover:bg-slate-800/60 transition-all duration-500 flex flex-col shadow-lg"
                >
                  <div className="relative aspect-[63/88] w-full bg-slate-950 p-4">
                    {/* Glowing effect behind card image on hover */}
                    <div className="absolute inset-0 bg-gradient-to-b from-purple-500/0 via-purple-500/0 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    
                    {card.image ? (
                      <Image 
                        src={`${card.image}/high.png`} // TCGdex docs state "/high.png" or "/low.png" appending for full images
                        alt={card.name}
                        fill
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-500 drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)] z-10"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        unoptimized // Adding this to avoid Next.js image optimization limits since we have thousands of external images
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-700/50 rounded-xl text-slate-600">
                        <span className="text-xs uppercase tracking-widest">No Image</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex-1 flex flex-col bg-gradient-to-b from-slate-900 to-slate-950">
                    <div className="text-xs text-slate-500 font-mono mb-1">{card.localId} / {card.id}</div>
                    <h3 className="font-bold text-slate-200 leading-tight mb-4 flex-1">{card.name}</h3>
                    
                    {/* The Price Placeholder as requested by standard TCG sites, but adapted for TCG Pocket's reality */}
                    <div className="mt-auto pt-3 border-t border-slate-800/60 flex justify-between items-center">
                      <span className="text-xs text-slate-500">Market Price</span>
                      <span className="text-xs font-semibold bg-slate-800 text-slate-400 px-2 py-0.5 rounded shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                        N/A (Digital)
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
