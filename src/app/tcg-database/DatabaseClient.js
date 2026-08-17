'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

function isDirectImageUrl(value) {
  return typeof value === 'string' && /^https?:\/\//i.test(value);
}

function getCardImageSrc(card, size = 'large') {
  const preferred = size === 'thumb'
    ? card?.imageThumb || card?.imageLarge || card?.image
    : card?.imageLarge || card?.imageThumb || card?.image;

  if (!preferred) return null;
  if (isDirectImageUrl(preferred)) return preferred;
  return size === 'thumb' ? `${preferred}/low.webp` : `${preferred}/high.png`;
}

function formatSetReleaseDate(value) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export default function DatabaseClient() {
  const [meta, setMeta] = useState(null);
  const [selectedLang, setSelectedLang] = useState('en');
  const [selectedSet, setSelectedSet] = useState(null);
  
  const [cards, setCards] = useState([]);
  const [isLoadingCards, setIsLoadingCards] = useState(false);
  const [error, setError] = useState(null);

  // Modal State
  const [selectedCard, setSelectedCard] = useState(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchActive, setSearchActive] = useState(false);

  // Load Metadata
  useEffect(() => {
    fetch('/api/tcg/meta')
      .then(res => res.json())
      .then(data => {
        setMeta(data);
        if (data.languages?.length > 0) {
          const firstLang = data.languages.find(l => l.code === 'en')?.code || data.languages[0].code;
          setSelectedLang(firstLang);
          const firstSet = data.setsByLang[firstLang]?.[0];
          if (firstSet) {
            setSelectedSet(firstSet);
          }
        }
      })
      .catch(err => {
        console.error("Failed to load meta", err);
        setError("Failed to load global database. Did the scraper run?");
      });
  }, []);

  // Handle changing Language
  useEffect(() => {
    if (!meta) return;
    const setsForLang = meta.setsByLang[selectedLang] || [];
    if (!setsForLang.includes(selectedSet)) {
      setSelectedSet(setsForLang[0] || null);
    }
  }, [selectedLang, meta, selectedSet]);

  // Load specific cards when selectedSet changes
  useEffect(() => {
    if (!selectedLang || !selectedSet) {
      setCards([]);
      return;
    }
    
    setIsLoadingCards(true);
    fetch(`/api/tcg/cards?lang=${selectedLang}&setId=${selectedSet}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load set');
        return res.json();
      })
      .then(data => {
        setCards(data.cards || []);
      })
      .catch(err => {
        console.error(err);
        setCards([]);
      })
      .finally(() => {
        setIsLoadingCards(false);
      });
  }, [selectedLang, selectedSet]);

  // Close modal on escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setSelectedCard(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Handle Debounced Global Search
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    const delayDebounceFn = setTimeout(() => {
      fetch(`/api/tcg/search?lang=${selectedLang}&q=${encodeURIComponent(searchQuery)}`)
        .then(res => res.json())
        .then(data => {
          setSearchResults(data.results || []);
        })
        .catch(err => console.error("Search error", err))
        .finally(() => setIsSearching(false));
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, selectedLang]);

  // Click on a global search result
  const handleGlobalCardClick = async (searchCard) => {
    setSearchActive(false);
    
    try {
      const res = await fetch(`/api/tcg/cards?lang=${selectedLang}&setId=${searchCard.setId}`);
      const data = await res.json();
      const fullCard = data.cards?.find(c => c.id === searchCard.id);
      
      if (fullCard) {
        setSelectedSet(searchCard.setId);
        setSelectedCard(fullCard);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-red-400 p-8">
        <p>{error}</p>
      </div>
    );
  }

  if (!meta) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p>Loading global database index...</p>
        </div>
      </div>
    );
  }

  const totalSetsForLang = meta.setsByLang[selectedLang]?.length || 0;
  const exactCardsFetched = meta.exactCardCounts ? (meta.exactCardCounts[selectedLang] || 0) : 0;
  const setDetailsByLang = meta.setDetailsByLang?.[selectedLang] || {};
  const selectedSetDetails = selectedSet ? setDetailsByLang[selectedSet] || null : null;
  const selectedSetReleaseLabel = formatSetReleaseDate(selectedSetDetails?.releaseDate);
  const selectedSetComingSoon = selectedSetDetails?.status === 'coming_soon';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-purple-500/30 flex flex-col pb-20">
      
      {/* Search Overlay */}
      {searchActive && (
        <div className="fixed inset-0 z-40" onClick={() => setSearchActive(false)}></div>
      )}

      {/* HEADER */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50 relative">
        <div className="max-w-[1600px] mx-auto px-6 py-6 flex flex-col lg:flex-row justify-between items-center gap-6 relative z-50">
          <div className="shrink-0 w-full lg:w-auto text-center lg:text-left">
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 bg-clip-text text-transparent">
              TCG Global Explorer
            </h1>
            <p className="text-sm text-slate-400 mt-1 flex items-center justify-center lg:justify-start gap-3">
              Browsing {totalSetsForLang} sets in {meta.languages.find(l => l.code === selectedLang)?.name || selectedLang.toUpperCase()}
              {exactCardsFetched > 0 && (
                <span className="font-mono text-xs bg-teal-900/30 border border-teal-800/50 px-2 py-0.5 rounded text-teal-400">
                  {exactCardsFetched.toLocaleString()} Exact Cards Fetched
                </span>
              )}
            </p>
          </div>

          {/* GLOBAL SEARCH */}
          <div className="w-full lg:max-w-md xl:max-w-xl mx-auto relative z-[100]">
            <div className="relative">
              <input 
                type="text" 
                placeholder={`Search globally in ${meta.languages.find(l => l.code === selectedLang)?.name || selectedLang.toUpperCase()}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchActive(true)}
                className="w-full bg-slate-900 border border-slate-700 text-white placeholder-slate-500 rounded-full py-2.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all shadow-inner"
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            {/* Search Dropdown Results */}
            {searchActive && searchQuery.length >= 2 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700/80 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden z-[100] max-h-[60vh] overflow-y-auto custom-scrollbar">
                {isSearching ? (
                  <div className="p-6 text-center text-slate-400 text-sm">
                    <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                    Searching global database...
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-sm">No cards found for &quot;{searchQuery}&quot;</div>
                ) : (
                  <div className="flex flex-col">
                    {searchResults.map((card, i) => (
                      <button 
                        key={card.id || i}
                        onClick={() => handleGlobalCardClick(card)}
                        className="flex items-center gap-4 p-3 hover:bg-slate-800 transition-colors border-b border-slate-800/50 last:border-0 text-left w-full group focus:outline-none"
                      >
                        <div className="w-12 h-16 bg-slate-950 rounded relative shrink-0 overflow-hidden border border-slate-800 group-hover:border-teal-500/50 transition-colors">
                          {getCardImageSrc(card, 'thumb') && (
                            <Image src={getCardImageSrc(card, 'thumb')} alt={card.name} fill className="object-contain" unoptimized />
                          )}
                        </div>
                        <div>
                          <div className="text-white font-medium group-hover:text-teal-400 transition-colors">{card.name}</div>
                          <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                            <span className="bg-slate-800 text-slate-300 font-mono px-1.5 py-0.5 rounded border border-slate-700">{card.setId}</span>
                            <span>#{card.localId}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 p-1 bg-slate-800/50 rounded-lg justify-center xl:max-w-md shrink-0">
            {meta.languages.map((l) => {
              const countForLang = meta.exactCardCounts?.[l.code] || 0;
              return (
                <button
                  key={l.code}
                  onClick={() => setSelectedLang(l.code)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-300 flex items-center gap-2 ${
                    selectedLang === l.code 
                      ? 'bg-teal-600 text-white shadow-[0_0_15px_rgba(20,184,166,0.3)]' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <span>{l.name}</span>
                  {countForLang > 0 && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono ${
                      selectedLang === l.code ? 'bg-white/20 text-white' : 'bg-slate-900/80 text-slate-500'
                    }`}>
                      {countForLang > 999 ? (countForLang / 1000).toFixed(1) + 'k' : countForLang}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8 w-full">
        
        {/* SIDEBAR FOR SETS */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="sticky top-32 bg-slate-900/30 rounded-2xl border border-slate-800/80 p-4 max-h-[calc(100vh-160px)] overflow-y-auto custom-scrollbar">
            <h2 className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-4 sticky top-0 bg-slate-950 py-2 z-10 flex justify-between items-center">
              <span>Sets ({totalSetsForLang})</span>
              {exactCardsFetched > 0 && <span className="text-teal-500 font-mono tracking-normal lowercase">{exactCardsFetched.toLocaleString()} cards</span>}
            </h2>
            <div className="flex flex-col gap-1.5">
              {(meta.setsByLang[selectedLang] || []).map((setId) => {
                const setDetails = setDetailsByLang[setId] || null;
                const comingSoon = setDetails?.status === 'coming_soon';
                const releaseLabel = formatSetReleaseDate(setDetails?.releaseDate);

                return (
                  <button
                    key={setId}
                    onClick={() => setSelectedSet(setId)}
                    className={`text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      selectedSet === setId 
                        ? 'bg-teal-500/10 border border-teal-500/30 text-teal-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]' 
                        : 'border border-transparent text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate font-medium">{setDetails?.name || setId}</div>
                        <div className="mt-1 text-[11px] font-mono text-slate-500">{setId}</div>
                      </div>
                      {comingSoon && (
                        <span className="shrink-0 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-300">
                          Soon
                        </span>
                      )}
                    </div>
                    {comingSoon && releaseLabel && (
                      <div className="mt-2 text-[11px] text-amber-400/80">
                        Releases {releaseLabel}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* CARDS DISPLAY */}
        <div className="flex-1 w-full min-w-0">
          <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-end border-b border-slate-800 pb-4 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
                {cards[0]?.setName || selectedSetDetails?.name || selectedSet || "Select a Set"}
                {isLoadingCards && (
                  <span className="w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></span>
                )}
              </h2>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-slate-400 text-sm">
                <span className="uppercase tracking-wider">{selectedSet}</span>
                {selectedSetComingSoon && (
                  <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-300">
                    Coming soon
                  </span>
                )}
                {selectedSetComingSoon && selectedSetReleaseLabel && (
                  <span className="text-amber-400/80">{selectedSetReleaseLabel}</span>
                )}
              </div>
            </div>
            
            <div className="flex bg-slate-900 rounded-lg border border-slate-800 p-1 text-sm font-medium">
              <span className="px-4 py-1.5 bg-slate-800 rounded-md text-slate-200 shadow-sm">
                {cards.length} Cards Loaded
              </span>
            </div>
          </div>

          {!isLoadingCards && cards.length === 0 ? (
            <div className="text-center py-24 text-slate-500 bg-slate-900/20 rounded-3xl border border-slate-800/40 border-dashed">
              {selectedSetComingSoon ? (
                <>
                  <p className="text-lg text-amber-300">{selectedSetDetails?.name || selectedSet} is coming soon.</p>
                  <p className="text-sm mt-2 text-slate-400">
                    This set is already listed in the catalog, but card data has not been published yet.
                  </p>
                  {selectedSetReleaseLabel && (
                    <p className="text-sm mt-3 text-amber-400/80">Expected release: {selectedSetReleaseLabel}</p>
                  )}
                </>
              ) : (
                <>
                  <p className="text-lg">No cards found or set not scraped yet in this language.</p>
                  <p className="text-sm mt-2">The background scraper may still be running!</p>
                </>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 ml:grid-cols-3 2xl:grid-cols-4 gap-6">
              {cards.map((card) => {
                // Pick best price for preview
                const tcgPrice = card.pricing?.tcgplayer?.marketPrice 
                              || card.pricing?.tcgplayer?.midPrice 
                              || (card.pricing?.tcgplayer?.normal?.marketPrice)
                              || (card.pricing?.tcgplayer?.holofoil?.marketPrice);
                const cmPrice = card.pricing?.cardmarket?.trend 
                             || card.pricing?.cardmarket?.avg 
                             || card.pricing?.cardmarket?.low;

                let displayPrice = null;
                if (tcgPrice && tcgPrice > 0) displayPrice = `$${tcgPrice.toFixed(2)}`;
                else if (cmPrice && cmPrice > 0) displayPrice = `€${cmPrice.toFixed(2)}`;

                return (
                  <button 
                    key={card.id} 
                    onClick={() => setSelectedCard(card)}
                    className="text-left group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-teal-500/40 hover:bg-slate-800/50 transition-all duration-300 flex flex-col shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {/* IMAGE SECTION */}
                    <div className="relative aspect-[63/88] w-full bg-black flex items-center justify-center p-4">
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-0" />
                      {getCardImageSrc(card, 'large') ? (
                        <Image 
                          src={getCardImageSrc(card, 'large')}
                          alt={card.name}
                          fill
                          className="object-contain p-4 group-hover:scale-105 transition-transform duration-500 drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)] z-10"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          unoptimized
                        />
                      ) : (
                        <div className="z-10 text-slate-700 uppercase tracking-widest text-xs border border-slate-800/50 p-4 rounded-xl border-dashed">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* CONTENT SECTION */}
                    <div className="p-4 flex-1 flex flex-col bg-gradient-to-br from-slate-900 to-slate-950 relative z-20 w-full">
                      
                      <div className="flex justify-between items-start mb-2 gap-2">
                        <div className="flex-1">
                          <span className="text-xs font-mono text-teal-500 bg-teal-500/10 px-1.5 py-0.5 rounded mr-2">
                            {card.localId}
                          </span>
                          <span className="text-xs text-slate-500 uppercase">{card.category}</span>
                        </div>
                        {card.rarity && (
                          <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-300 uppercase tracking-wider border border-slate-700 truncate max-w-[80px]">
                            {card.rarity}
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-slate-100 text-lg leading-tight mb-4">{card.name}</h3>

                      {/* PRICING FOOTER */}
                      <div className="mt-auto pt-3 border-t border-slate-800 flex justify-between items-end">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-0.5">Market Value</span>
                          <span className={`text-xl font-bold tracking-tight ${displayPrice ? 'text-teal-400' : 'text-slate-600'}`}>
                            {displayPrice || 'N/A'}
                          </span>
                        </div>
                        
                        {(card.pricing?.tcgplayer || card.pricing?.cardmarket) && (
                          <div className="flex flex-col items-end gap-1">
                            {card.pricing.tcgplayer && <span className="text-[9px] bg-blue-900/30 text-blue-400 px-1.5 py-0.5 rounded border border-blue-800/50">TCGPlayer</span>}
                            {card.pricing.cardmarket && <span className="text-[9px] bg-orange-900/30 text-orange-400 px-1.5 py-0.5 rounded border border-orange-800/50">Cardmarket</span>}
                          </div>
                        )}
                      </div>

                    </div>
                  </button>
                );
              })}
            </div>
          )}

        </div>
      </main>

      {/* DETAILED PRICING MODAL OVERLAY */}
      {selectedCard && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedCard(null)}
        >
          {/* Backdrop blur */}
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
          
          <div 
            className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <button 
              onClick={() => setSelectedCard(null)}
              className="absolute top-4 right-4 z-50 p-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-full transition-colors backdrop-blur-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Modal Image Area */}
            <div className="w-full md:w-5/12 bg-black flex items-center justify-center p-8 relative min-h-[300px]">
              {getCardImageSrc(selectedCard, 'large') ? (
                <Image 
                  src={getCardImageSrc(selectedCard, 'large')}
                  alt={selectedCard.name}
                  fill
                  className="object-contain p-6 drop-shadow-[0_20px_25px_rgba(0,0,0,0.8)]"
                  unoptimized
                />
              ) : (
                <span className="text-slate-600 uppercase tracking-widest">No Image Available</span>
              )}
            </div>

            {/* Modal Content / Pricing Area */}
            <div className="w-full md:w-7/12 p-6 md:p-8 overflow-y-auto custom-scrollbar flex flex-col">
              <div className="mb-8">
                <div className="flex gap-2 mb-2">
                  <span className="text-xs font-mono text-teal-400 bg-teal-500/10 px-2 py-1 rounded">
                    {selectedCard.localId} / {selectedCard.id}
                  </span>
                  <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded uppercase tracking-wider">
                    {selectedCard.category}
                  </span>
                </div>
                <h2 className="text-3xl font-extrabold text-white mb-2">{selectedCard.name}</h2>
                <p className="text-slate-400 text-sm">
                  {selectedCard.setName || selectedSetDetails?.name || selectedSet} • {selectedCard.rarity || 'Unknown Rarity'}
                </p>
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-200 mb-4 border-b border-slate-700 pb-2">Detailed Market Pricing</h3>
                
                {!selectedCard.pricing?.tcgplayer && !selectedCard.pricing?.cardmarket ? (
                  <div className="bg-slate-800/50 rounded-xl p-6 text-center border border-slate-700 border-dashed">
                    <p className="text-slate-400">No market data available for this specific card.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    
                    {/* TCGPlayer Data */}
                    {selectedCard.pricing?.tcgplayer && (
                      <div className="bg-blue-950/20 border border-blue-900/50 rounded-xl overflow-hidden">
                        <div className="bg-blue-900/40 px-4 py-2 border-b border-blue-900/50 flex justify-between items-center">
                          <span className="font-bold text-blue-400 text-sm tracking-wide">TCGPLAYER (USD)</span>
                          <span className="text-[10px] text-blue-300/60 uppercase">
                            Updated: {selectedCard.pricing.tcgplayer.updatedAt || selectedCard.pricing.tcgplayer.updated || 'Unknown'}
                          </span>
                        </div>
                        <div className="p-4">
                          {/* Map through all variants TCGPlayer provides (normal, holofoil, reverse-holofoil, 1st-edition) */}
                          {['normal', 'holofoil', 'reverseHolofoil', '1stEdition', '1stEditionHolofoil'].map((variantKey) => {
                            const variant = selectedCard.pricing.tcgplayer[variantKey] || selectedCard.pricing.tcgplayer[variantKey.replace('H', '-h')];
                            if (!variant) return null;
                            
                            return (
                              <div key={variantKey} className="mb-4 last:mb-0">
                                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-3 border-b border-slate-700 pb-1">
                                  {variantKey.replace(/([A-Z])/g, ' $1').trim()}
                                </h4>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                  <div className="bg-slate-900/80 rounded p-2 text-center border border-slate-800">
                                    <span className="block text-[9px] text-slate-500 uppercase mb-1">Market</span>
                                    <span className="font-mono text-sm text-green-400">${variant.marketPrice?.toFixed(2) || '-'}</span>
                                  </div>
                                  <div className="bg-slate-900/80 rounded p-2 text-center border border-slate-800">
                                    <span className="block text-[9px] text-slate-500 uppercase mb-1">Mid</span>
                                    <span className="font-mono text-sm text-slate-300">${variant.midPrice?.toFixed(2) || '-'}</span>
                                  </div>
                                  <div className="bg-slate-900/80 rounded p-2 text-center border border-slate-800">
                                    <span className="block text-[9px] text-slate-500 uppercase mb-1">Low</span>
                                    <span className="font-mono text-sm text-slate-300">${variant.lowPrice?.toFixed(2) || '-'}</span>
                                  </div>
                                  <div className="bg-slate-900/80 rounded p-2 text-center border border-slate-800">
                                    <span className="block text-[9px] text-slate-500 uppercase mb-1">High</span>
                                    <span className="font-mono text-sm text-slate-300">${variant.highPrice?.toFixed(2) || '-'}</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                          
                          {/* Fallback if TCGplayer only gives root price instead of variant objects */}
                          {!selectedCard.pricing.tcgplayer.normal && !selectedCard.pricing.tcgplayer.holofoil && selectedCard.pricing.tcgplayer.marketPrice && (
                             <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <div className="bg-slate-900/80 rounded p-2 text-center border border-slate-800">
                                  <span className="block text-[9px] text-slate-500 uppercase mb-1">Market</span>
                                  <span className="font-mono text-sm text-green-400">${selectedCard.pricing.tcgplayer.marketPrice?.toFixed(2) || '-'}</span>
                                </div>
                                <div className="bg-slate-900/80 rounded p-2 text-center border border-slate-800">
                                  <span className="block text-[9px] text-slate-500 uppercase mb-1">Mid</span>
                                  <span className="font-mono text-sm text-slate-300">${selectedCard.pricing.tcgplayer.midPrice?.toFixed(2) || '-'}</span>
                                </div>
                                <div className="bg-slate-900/80 rounded p-2 text-center border border-slate-800">
                                  <span className="block text-[9px] text-slate-500 uppercase mb-1">Low</span>
                                  <span className="font-mono text-sm text-slate-300">${selectedCard.pricing.tcgplayer.lowPrice?.toFixed(2) || '-'}</span>
                                </div>
                             </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Cardmarket Data (EU) */}
                    {selectedCard.pricing?.cardmarket && (
                      <div className="bg-orange-950/20 border border-orange-900/50 rounded-xl overflow-hidden">
                        <div className="bg-orange-900/40 px-4 py-2 border-b border-orange-900/50 flex justify-between items-center">
                          <span className="font-bold text-orange-400 text-sm tracking-wide">CARDMARKET (EUR)</span>
                          <span className="text-[10px] text-orange-300/60 uppercase">
                            Updated: {selectedCard.pricing.cardmarket.updatedAt || selectedCard.pricing.cardmarket.updated || 'Unknown'}
                          </span>
                        </div>
                        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                          <div className="bg-slate-900/80 rounded p-2 border border-slate-800 flex justify-between items-center px-4">
                            <span className="text-xs text-slate-400">Trend</span>
                            <span className="font-mono text-sm text-green-400">€{selectedCard.pricing.cardmarket.trend?.toFixed(2) || '-'}</span>
                          </div>
                          <div className="bg-slate-900/80 rounded p-2 border border-slate-800 flex justify-between items-center px-4">
                            <span className="text-xs text-slate-400">Avg (30d)</span>
                            <span className="font-mono text-sm text-slate-300">€{selectedCard.pricing.cardmarket.avg30?.toFixed(2) || '-'}</span>
                          </div>
                          <div className="bg-slate-900/80 rounded p-2 border border-slate-800 flex justify-between items-center px-4">
                            <span className="text-xs text-slate-400">Low</span>
                            <span className="font-mono text-sm text-slate-300">€{selectedCard.pricing.cardmarket.low?.toFixed(2) || '-'}</span>
                          </div>
                          <div className="bg-slate-900/80 rounded p-2 border border-slate-800 flex justify-between items-center px-4">
                            <span className="text-xs text-slate-400">Trend (Holo)</span>
                            <span className="font-mono text-sm text-green-400">€{selectedCard.pricing.cardmarket.trendHolo?.toFixed(2) || selectedCard.pricing.cardmarket['trend-holo']?.toFixed(2) || '-'}</span>
                          </div>
                          <div className="bg-slate-900/80 rounded p-2 border border-slate-800 flex justify-between items-center px-4">
                            <span className="text-xs text-slate-400">Avg (30) Holo</span>
                            <span className="font-mono text-sm text-slate-300">€{selectedCard.pricing.cardmarket.avg30Holo?.toFixed(2) || selectedCard.pricing.cardmarket['avg30-holo']?.toFixed(2) || '-'}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
