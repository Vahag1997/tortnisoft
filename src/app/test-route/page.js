import Image from "next/image";

export default async function TCGPocketTestRoute() {
  // Fetch TCG Pocket series data
  const seriesRes = await fetch("https://api.tcgdex.net/v2/en/series/tcgp", {
    next: { revalidate: 3600 },
  });
  
  if (!seriesRes.ok) {
    return (
      <div className="min-h-screen p-8 bg-gray-900 text-white">
        <h1 className="text-3xl font-bold text-red-500 mb-4">Error fetching data</h1>
        <p>Could not load TCG Pocket series data. Status: {seriesRes.status}</p>
      </div>
    );
  }

  const data = await seriesRes.json();
  const sets = data?.sets || [];

  return (
    <div className="min-h-screen p-8 bg-slate-950 text-slate-100 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
            Pokémon TCG Pocket
          </h1>
          <p className="text-xl text-slate-400">
            Available Sets in the TCGdex API
          </p>
        </header>

        {sets.length === 0 ? (
          <p className="text-center text-slate-500">No sets found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sets.map((set) => (
              <div 
                key={set.id} 
                className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 hover:border-purple-500/50 hover:bg-slate-800/50 transition-all duration-300 group"
              >
                {set.logo && (
                  <div className="relative w-full h-24 mb-6">
                    <Image 
                      src={`${set.logo}.png`} 
                      alt={`${set.name} logo`}
                      fill
                      className="object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                <h2 className="text-2xl font-bold text-slate-200 mb-2">{set.name}</h2>
                <div className="flex flex-col gap-2 text-sm text-slate-400">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800/50">
                    <span>Set ID</span>
                    <span className="font-mono bg-slate-800 px-2 py-1 rounded text-slate-300">{set.id}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Cards</span>
                    <span className="font-semibold text-slate-300">{set.cardCount?.total || "Unknown"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
