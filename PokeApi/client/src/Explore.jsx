import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";

const REGIONS = {
  kanto: {
    label: "Kanto",
    number: "01",
    subtitle: "Indigo Plateau Region",
    color: "text-red-400",
    ring: "ring-red-400 shadow-[0_0_30px_rgba(255,100,100,0.2)]",
  },
  johto: {
    label: "Johto",
    number: "02",
    subtitle: "Silver Conference Region",
    color: "text-yellow-400",
    ring: "ring-yellow-400 shadow-[0_0_30px_rgba(255,200,50,0.2)]",
  },
  hoenn: {
    label: "Hoenn",
    number: "03",
    subtitle: "Ever Grande Region",
    color: "text-blue-400",
    ring: "ring-blue-400 shadow-[0_0_30px_rgba(100,150,255,0.2)]",
  },
};

const TYPE_COLORS = {
  fire: "bg-orange-500/20 text-orange-400 border-orange-500",
  water: "bg-blue-500/20 text-blue-400 border-blue-500",
  grass: "bg-green-500/20 text-green-400 border-green-500",
  electric: "bg-yellow-400/20 text-yellow-300 border-yellow-400",
  ice: "bg-cyan-400/20 text-cyan-300 border-cyan-400",
  fighting: "bg-red-700/20 text-red-400 border-red-700",
  poison: "bg-purple-500/20 text-purple-400 border-purple-500",
  ground: "bg-amber-600/20 text-amber-400 border-amber-600",
  flying: "bg-sky-400/20 text-sky-300 border-sky-400",
  psychic: "bg-pink-500/20 text-pink-400 border-pink-500",
  bug: "bg-lime-500/20 text-lime-400 border-lime-500",
  rock: "bg-stone-500/20 text-stone-400 border-stone-500",
  ghost: "bg-violet-700/20 text-violet-400 border-violet-700",
  dragon: "bg-indigo-500/20 text-indigo-400 border-indigo-500",
  dark: "bg-neutral-700/20 text-neutral-400 border-neutral-700",
  steel: "bg-slate-400/20 text-slate-300 border-slate-400",
  normal: "bg-gray-400/20 text-gray-300 border-gray-400",
  fairy: "bg-pink-300/20 text-pink-300 border-pink-300",
};

const Explore = () => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState("");
  const [routes, setRoutes] = useState([]);
  const [routesLoading, setRoutesLoading] = useState(false);
  const [encounter, setEncounter] = useState(null);
  const [result, setResult] = useState(null);
  const [encountersRemaining, setEncountersRemaining] = useState(5);
  const [recentLogs, setRecentLogs] = useState([]);
  const [inventory, setInventory] = useState(null);
  const { handleGet, handlePost, loading, error } = useFetch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEncounterCount();
    fetchInventory();
  }, []);

  const fetchEncounterCount = async () => {
    const data = await handleGet(
      "http://localhost:8000/explore/encounter-status",
    );
    if (data) setEncountersRemaining(data.encounters_remaining);
  };

  const fetchInventory = async () => {
    const data = await handleGet("http://localhost:8000/shop/inventory");
    if (data) setInventory(data);
  };

  const handleRegionSelect = async (region) => {
    setSelectedRegion(region);
    setSelectedRoute("");
    setEncounter(null);
    setResult(null);
    setRoutes([]);
    setRoutesLoading(true);
    const data = await handleGet(
      `http://localhost:8000/explore/routes/${region}`,
    );
    if (data?.routes) setRoutes(data.routes);
    setRoutesLoading(false);
  };

  const handleFindPokemon = async () => {
    if (!selectedRoute) return;
    setResult(null);
    setEncounter(null);
    const data = await handleGet(
      `http://localhost:8000/explore/encounter/${selectedRoute}`,
    );
    if (data) {
      setEncounter(data);
      setEncountersRemaining(data.encounters_remaining);
    }
  };

  const handleThrowPokeball = async (ballType = "pokeball") => {
    if (!encounter) return;
    const data = await handlePost("http://localhost:8000/explore/catch", {
      pokemon_id: encounter.id,
      ball_type: ballType,
    });
    if (data) {
      setResult(data);
      fetchInventory();
      setRecentLogs((prev) => [
        { name: encounter.name, result: data.result },
        ...prev.slice(0, 4),
      ]);
    }
  };

  const handleFindAnother = () => {
    setEncounter(null);
    setResult(null);
  };

  const BALLS = [
    {
      type: "pokeball",
      label: "Pokeball",
      color: "bg-red-600 hover:bg-red-500",
      count: inventory?.pokeballs || 0,
    },
    {
      type: "great_ball",
      label: "Great Ball",
      color: "bg-blue-600 hover:bg-blue-500",
      count: inventory?.great_balls || 0,
    },
    {
      type: "ultra_ball",
      label: "Ultra Ball",
      color: "bg-yellow-500 hover:bg-yellow-400",
      count: inventory?.ultra_balls || 0,
    },
  ];

  return (
    <div className="min-h-screen pt-6 pb-32 px-4 md:px-8 max-w-7xl mx-auto space-y-12">
      {/* Background glows */}
      <div className="fixed top-0 right-0 -z-10 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[150px]" />
      <div className="fixed bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px]" />

      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-6xl md:text-8xl font-headline font-bold uppercase tracking-tighter text-white">
            Explore
          </h2>
          <p className="text-[#aba9b9] text-lg font-light tracking-wide">
            Venture into the wild and catch pokemon
          </p>
        </div>
        <div className="flex gap-4">
          {/* Inventory quick view */}
          {inventory && (
            <div className="bg-[#1e1e2d] px-4 py-3 rounded-xl border border-[#474754]/20 flex items-center gap-3 shadow-xl">
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-label uppercase tracking-widest text-[#aba9b9]">
                  Balls
                </span>
                <span className="text-white font-headline font-bold">
                  {inventory.pokeballs +
                    inventory.great_balls +
                    inventory.ultra_balls}
                </span>
              </div>
              <div className="w-px h-8 bg-[#474754]/30" />
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-label uppercase tracking-widest text-[#aba9b9]">
                  Potions
                </span>
                <span className="text-white font-headline font-bold">
                  {inventory.potions +
                    inventory.super_potions +
                    inventory.max_potions}
                </span>
              </div>
            </div>
          )}
          {/* Encounters */}
          <div className="bg-[#1e1e2d] px-6 py-4 rounded-xl border border-[#474754]/20 flex items-center gap-4 shadow-xl">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-label font-extrabold uppercase tracking-[0.2em] text-[#aba9b9]">
                Encounters Remaining
              </span>
              <span className="text-2xl font-headline font-bold text-red-400 tracking-tighter">
                {encountersRemaining} / 5
              </span>
            </div>
            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center text-red-400">
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                capture
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Region Selector */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(REGIONS).map(([key, region]) => {
          const isSelected = selectedRegion === key;
          return (
            <div
              key={key}
              onClick={() => handleRegionSelect(key)}
              className={`relative overflow-hidden rounded-2xl p-1 cursor-pointer transition-all duration-300 ${
                isSelected
                  ? `ring-2 ${region.ring} bg-[#1e1e2d]`
                  : "border border-[#474754]/20 bg-[#12121e] hover:border-[#474754]/50"
              }`}
            >
              {isSelected && (
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent pointer-events-none" />
              )}
              <div className="bg-transparent rounded-[calc(1rem-2px)] p-6 relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <span
                    className={`text-3xl font-headline font-black italic tracking-tighter ${
                      isSelected ? region.color : "text-[#474754]/30"
                    }`}
                  >
                    {region.number}
                  </span>
                  {isSelected && (
                    <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-[10px] font-label font-bold uppercase tracking-widest">
                      Selected
                    </span>
                  )}
                </div>
                <h3
                  className={`text-3xl font-headline font-bold uppercase tracking-tight mb-1 ${
                    isSelected ? region.color : "text-white"
                  }`}
                >
                  {region.label}
                </h3>
                <p className="text-[#aba9b9] text-sm">{region.subtitle}</p>
              </div>
            </div>
          );
        })}
      </section>

      {selectedRegion && error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-6 py-4 text-red-400 font-body text-sm">
          {error}
        </div>
      )}

      {/* Route Selector */}
      {selectedRegion && (
        <section className="bg-[#181826] p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8 shadow-2xl">
          <div className="w-full md:w-1/2 space-y-2">
            <label className="text-[10px] font-label font-bold uppercase tracking-widest text-[#aba9b9] ml-1">
              Select Search Area
            </label>
            <div className="relative">
              <select
                value={selectedRoute}
                onChange={(e) => setSelectedRoute(e.target.value)}
                disabled={routesLoading}
                className="w-full bg-[#242434] border-none rounded-xl py-4 px-6 text-white font-headline font-bold focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {routesLoading ? "Loading routes..." : "Choose a route..."}
                </option>
                {routes.map((r) => (
                  <option key={r} value={r}>
                    {r
                      .replace(/-/g, " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#aba9b9]">
                {routesLoading ? (
                  <span className="material-symbols-outlined animate-spin">
                    progress_activity
                  </span>
                ) : (
                  <span className="material-symbols-outlined">expand_more</span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={handleFindPokemon}
            disabled={
              !selectedRoute ||
              loading ||
              routesLoading ||
              encountersRemaining <= 0
            }
            className="w-full md:w-1/2 bg-red-500 text-white font-headline font-black uppercase tracking-widest py-5 rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-[0_8px_24px_rgba(255,141,140,0.3)] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined">search</span>
            {loading
              ? "Searching..."
              : encountersRemaining <= 0
                ? "No Encounters Left"
                : "Find Pokemon"}
          </button>
        </section>
      )}

      {/* Encounter Card */}
      {encounter && !result && (
        <section className="relative bg-[#1e1e2d] rounded-[2.5rem] overflow-hidden border border-[#474754]/10 shadow-2xl min-h-[500px] flex flex-col p-10">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(#ff8d8c 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="relative z-10 flex flex-col flex-1">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-12">
              <div className="space-y-2">
                <h3 className="text-2xl font-headline font-light text-[#aba9b9]">
                  A wild{" "}
                  <span className="text-white font-bold capitalize">
                    {encounter.name}
                  </span>{" "}
                  appeared!
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {encounter.types.map((t) => (
                    <span
                      key={t}
                      className={`px-3 py-0.5 rounded-full text-[10px] font-label font-black uppercase tracking-widest border-l-2 ${TYPE_COLORS[t] || "bg-gray-500/20 text-gray-400 border-gray-500"}`}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </span>
                  ))}
                </div>
              </div>
              <span className="text-5xl font-headline font-black text-white/10 italic tracking-tighter">
                #{String(encounter.id).padStart(4, "0")}
              </span>
            </div>

            {/* Sprite */}
            <div className="flex-1 flex items-center justify-center relative">
              <div className="absolute w-80 h-80 bg-red-500/20 rounded-full blur-[100px]" />
              <img
                src={encounter.sprite}
                alt={encounter.name}
                className="w-64 h-64 md:w-80 md:h-80 object-contain relative z-20 hover:scale-110 transition-transform duration-500"
                style={{ imageRendering: "pixelated" }}
              />
            </div>

            {/* Ball Selector */}
            <div className="mt-12 flex flex-col items-center gap-4">
              <p className="text-[#aba9b9] font-label text-xs uppercase tracking-widest">
                Choose a ball
              </p>
              <div className="flex gap-3 flex-wrap justify-center">
                {BALLS.map((ball) => (
                  <button
                    key={ball.type}
                    onClick={() => handleThrowPokeball(ball.type)}
                    disabled={loading || ball.count <= 0}
                    className={`px-6 py-4 ${ball.color} text-white rounded-full font-headline font-black uppercase tracking-wider transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center gap-1 shadow-lg`}
                  >
                    <span
                      className="material-symbols-outlined text-2xl"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      capture
                    </span>
                    <span className="text-sm">{ball.label}</span>
                    <span className="text-xs opacity-70">
                      {ball.count} left
                    </span>
                  </button>
                ))}
              </div>
              <button
                onClick={handleFindAnother}
                className="px-10 py-4 bg-[#242434] text-[#aba9b9] rounded-full font-headline font-bold uppercase tracking-widest hover:bg-[#2b2a3c] hover:text-white active:scale-95 transition-all mt-2"
              >
                Run Away
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Result Card */}
      {result && (
        <section className="flex flex-col items-center justify-center py-12 gap-6">
          <div
            className={`w-full max-w-md p-8 rounded-3xl border flex flex-col items-center gap-4 text-center ${
              result.result === "caught"
                ? "bg-green-500/10 border-green-500/30"
                : result.result === "fled"
                  ? "bg-red-500/10 border-red-500/30"
                  : "bg-yellow-500/10 border-yellow-500/30"
            }`}
          >
            <span
              className={`material-symbols-outlined text-6xl ${
                result.result === "caught"
                  ? "text-green-400"
                  : result.result === "fled"
                    ? "text-red-400"
                    : "text-yellow-400"
              }`}
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {result.result === "caught"
                ? "check_circle"
                : result.result === "fled"
                  ? "directions_run"
                  : "database"}
            </span>
            <h3 className="text-3xl font-headline font-bold text-white uppercase tracking-tight">
              {result.result === "caught"
                ? "Caught!"
                : result.result === "fled"
                  ? "It Fled!"
                  : "Already Caught!"}
            </h3>
            <p className="text-[#aba9b9] font-body">{result.message}</p>
          </div>
          <button
            onClick={handleFindAnother}
            className="bg-red-600 text-white px-8 py-3 rounded-xl font-headline font-bold uppercase tracking-tight hover:bg-red-500 transition-all"
          >
            Find Another
          </button>
        </section>
      )}

      {/* Recent Logs */}
      {recentLogs.length > 0 && (
        <section className="space-y-4">
          <h4 className="text-[10px] font-label font-black uppercase tracking-[0.3em] text-[#aba9b9] flex items-center gap-2">
            <span className="w-8 h-[1px] bg-[#474754]" />
            Recent Logs
          </h4>
          <div className="flex flex-col gap-3">
            {recentLogs.map((log, i) => (
              <div
                key={i}
                className={`bg-[#12121e] p-4 rounded-xl flex items-center gap-4 border-l-4 ${
                  log.result === "caught"
                    ? "border-green-500"
                    : log.result === "fled"
                      ? "border-red-500"
                      : "border-yellow-500"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    log.result === "caught"
                      ? "bg-green-500/10 text-green-500"
                      : log.result === "fled"
                        ? "bg-red-500/10 text-red-500"
                        : "bg-yellow-500/10 text-yellow-500"
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-sm"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {log.result === "caught"
                      ? "check_circle"
                      : log.result === "fled"
                        ? "directions_run"
                        : "database"}
                  </span>
                </div>
                <div>
                  <p
                    className={`text-[10px] font-label font-bold uppercase ${
                      log.result === "caught"
                        ? "text-green-500"
                        : log.result === "fled"
                          ? "text-red-500"
                          : "text-yellow-500"
                    }`}
                  >
                    {log.result}
                  </p>
                  <p className="text-sm font-headline font-bold text-white capitalize">
                    {log.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Explore;
