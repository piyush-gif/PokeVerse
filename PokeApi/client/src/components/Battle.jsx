import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import BattleBag from "./BattleBag";

const TYPE_COLORS = {
  rock: "bg-stone-500/20 text-stone-400 border-stone-500",
  water: "bg-blue-500/20 text-blue-400 border-blue-500",
  electric: "bg-yellow-400/20 text-yellow-300 border-yellow-400",
  flying: "bg-sky-400/20 text-sky-300 border-sky-400",
  bug: "bg-lime-500/20 text-lime-400 border-lime-500",
  normal: "bg-gray-400/20 text-gray-300 border-gray-400",
  fighting: "bg-red-700/20 text-red-400 border-red-700",
  fire: "bg-orange-500/20 text-orange-400 border-orange-500",
  grass: "bg-green-500/20 text-green-400 border-green-500",
  poison: "bg-purple-500/20 text-purple-400 border-purple-500",
  psychic: "bg-pink-500/20 text-pink-400 border-pink-500",
  ice: "bg-cyan-400/20 text-cyan-300 border-cyan-400",
  ghost: "bg-violet-700/20 text-violet-400 border-violet-700",
  dragon: "bg-indigo-500/20 text-indigo-400 border-indigo-500",
  dark: "bg-neutral-700/20 text-neutral-400 border-neutral-700",
  steel: "bg-slate-400/20 text-slate-300 border-slate-400",
  ground: "bg-amber-600/20 text-amber-400 border-amber-600",
};

const MOVE_COLORS = {
  water: "bg-blue-600 hover:bg-blue-500",
  fire: "bg-orange-600 hover:bg-orange-500",
  grass: "bg-green-600 hover:bg-green-500",
  electric: "bg-yellow-500 hover:bg-yellow-400",
  psychic: "bg-pink-600 hover:bg-pink-500",
  ghost: "bg-violet-700 hover:bg-violet-600",
  dark: "bg-neutral-700 hover:bg-neutral-600",
  dragon: "bg-indigo-600 hover:bg-indigo-500",
  fighting: "bg-red-700 hover:bg-red-600",
  rock: "bg-stone-600 hover:bg-stone-500",
  ground: "bg-amber-700 hover:bg-amber-600",
  flying: "bg-sky-600 hover:bg-sky-500",
  bug: "bg-lime-600 hover:bg-lime-500",
  poison: "bg-purple-600 hover:bg-purple-500",
  ice: "bg-cyan-600 hover:bg-cyan-500",
  normal: "bg-gray-600 hover:bg-gray-500",
  steel: "bg-slate-600 hover:bg-slate-500",
};

const getHpColor = (current, max) => {
  const pct = (current / max) * 100;
  if (pct > 50) return "bg-green-500";
  if (pct > 25) return "bg-yellow-400";
  return "bg-red-500";
};

const SCREEN = {
  GYMS: "gyms",
  TEAM_SELECT: "team_select",
  BATTLE: "battle",
  RESULT: "result",
};

const Battle = () => {
  const navigate = useNavigate();
  const { handleGet, handlePost, loading } = useFetch();
  const logRef = useRef(null);

  const [screen, setScreen] = useState(SCREEN.GYMS);
  const [gyms, setGyms] = useState([]);
  const [progress, setProgress] = useState(null);
  const [selectedGym, setSelectedGym] = useState(null);
  const [collection, setCollection] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState([]);
  const [battleState, setBattleState] = useState(null);
  const [battleLoading, setBattleLoading] = useState(false);
  const [showBag, setShowBag] = useState(false);

  useEffect(() => {
    fetchGyms();
    fetchProgress();
    fetchCollection();
  }, []);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [battleState?.log]);

  const fetchGyms = async () => {
    const data = await handleGet("http://localhost:8000/battle/gyms");
    if (data) setGyms(data);
  };

  const fetchProgress = async () => {
    const data = await handleGet("http://localhost:8000/battle/progress");
    if (data) setProgress(data);
  };

  const fetchCollection = async () => {
    const data = await handleGet("http://localhost:8000/explore/collection");
    if (data?.collection) setCollection(data.collection);
  };

  const handleGymSelect = (gym) => {
    if (!gym.unlocked) return;
    setSelectedGym(gym);
    setSelectedPokemon([]);
    setScreen(SCREEN.TEAM_SELECT);
  };

  const togglePokemon = (pokemon) => {
    setSelectedPokemon((prev) => {
      const exists = prev.find((p) => p.pokemon_id === pokemon.pokemon_id);
      if (exists)
        return prev.filter((p) => p.pokemon_id !== pokemon.pokemon_id);
      if (prev.length >= 5) return prev;
      return [...prev, pokemon];
    });
  };

  const handleStartBattle = async () => {
    if (selectedPokemon.length === 0) return;
    setBattleLoading(true);
    const data = await handlePost(
      `http://localhost:8000/battle/start/${selectedGym.id}`,
      { pokemon_ids: selectedPokemon.map((p) => p.pokemon_id) },
    );
    if (data) {
      setBattleState(data);
      setScreen(SCREEN.BATTLE);
    }
    setBattleLoading(false);
  };

  const handleMove = async (moveIndex) => {
    if (!battleState || battleLoading) return;
    setBattleLoading(true);
    const data = await handlePost("http://localhost:8000/battle/move", {
      action: "move",
      move_index: moveIndex,
    });
    if (data) {
      setBattleState(data);
      if (data.battle_over) {
        await fetchProgress();
        setScreen(SCREEN.RESULT);
      }
    }
    setBattleLoading(false);
  };

  const handlePotion = async (potionType = "potion") => {
    if (!battleState || battleLoading) return;
    setBattleLoading(true);
    const data = await handlePost("http://localhost:8000/battle/move", {
      action: "potion",
      potion_type: potionType,
    });
    if (data) {
      setBattleState(data);
      if (data.battle_over) {
        await fetchProgress();
        setScreen(SCREEN.RESULT);
      }
    }
    setBattleLoading(false);
  };

  const handleSwitch = async (index) => {
    const data = await handlePost("http://localhost:8000/battle/switch", {
      switch_index: index,
    });
    if (data) {
      setBattleState(data);
    }
    setShowBag(false);
  };

  const handleReset = () => {
    setScreen(SCREEN.GYMS);
    setSelectedGym(null);
    setSelectedPokemon([]);
    setBattleState(null);
    fetchGyms();
    fetchProgress();
  };

  // ── GYM SELECTION ──────────────────────────────────────────
  if (screen === SCREEN.GYMS) {
    return (
      <div className="min-h-screen pt-6 pb-32 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="text-5xl md:text-7xl font-headline font-bold uppercase tracking-tighter text-white">
              Battle Arena
            </h2>
            <p className="text-[#aba9b9] text-lg mt-2">
              Challenge gym leaders and earn badges
            </p>
          </div>
          {progress && (
            <div className="bg-[#1e1e2d] px-6 py-4 rounded-xl border border-[#474754]/20 flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-label uppercase tracking-widest text-[#aba9b9]">
                  Coins
                </span>
                <span className="text-2xl font-headline font-bold text-yellow-400">
                  🪙 {progress.coins}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-label uppercase tracking-widest text-[#aba9b9]">
                  Badges
                </span>
                <span className="text-2xl font-headline font-bold text-red-400">
                  {progress.badges.length} / 9
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gyms.map((gym) => (
            <div
              key={gym.id}
              onClick={() => handleGymSelect(gym)}
              className={`relative rounded-xl overflow-hidden border transition-all duration-300 ${
                !gym.unlocked
                  ? "bg-black/50 border-[#474754]/10 cursor-not-allowed opacity-50"
                  : gym.completed
                    ? "bg-[#1e1e2d]/60 border-green-500/20 cursor-pointer opacity-80"
                    : "bg-[#1e1e2d] border-red-500/30 cursor-pointer hover:-translate-y-1 shadow-[0_0_20px_rgba(255,141,140,0.15)]"
              }`}
            >
              {!gym.unlocked ? (
                <div className="h-80 flex flex-col items-center justify-center gap-4 p-8 text-center">
                  <div className="w-20 h-20 rounded-full bg-[#1e1e2d] flex items-center justify-center border border-[#474754]/20">
                    <span className="material-symbols-outlined text-4xl text-[#474754]">
                      lock
                    </span>
                  </div>
                  <h3 className="font-headline text-xl font-bold uppercase tracking-widest text-[#474754]">
                    Locked
                  </h3>
                  <p className="text-[#aba9b9] text-sm">
                    Defeat previous gym leaders to unlock
                  </p>
                </div>
              ) : (
                <div className="p-6">
                  {gym.completed && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white w-10 h-10 rounded-full flex items-center justify-center">
                      <span
                        className="material-symbols-outlined"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        check_circle
                      </span>
                    </div>
                  )}
                  <div className="text-6xl font-headline font-black italic text-white/5 absolute bottom-4 right-6">
                    {String(gym.id).padStart(2, "0")}
                  </div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-[10px] font-label font-black uppercase tracking-wider border-l-2 mb-4 ${TYPE_COLORS[gym.specialty] || "bg-gray-500/20 text-gray-400 border-gray-500"}`}
                  >
                    {gym.specialty}
                  </span>
                  <h3 className="font-headline text-3xl font-bold uppercase tracking-tight text-white mb-1">
                    {gym.name}
                  </h3>
                  <p className="text-[#aba9b9] text-xs font-label uppercase tracking-widest mb-6">
                    {gym.gym} •{" "}
                    {gym.region.charAt(0).toUpperCase() + gym.region.slice(1)}
                  </p>
                  <div className="flex items-center gap-3 bg-[#12121e] p-3 rounded-lg mb-6">
                    <span
                      className="material-symbols-outlined text-yellow-400"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      military_tech
                    </span>
                    <span className="text-white font-body text-sm">
                      {gym.badge}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[#aba9b9] text-xs font-label uppercase tracking-widest">
                      Reward
                    </span>
                    <span className="text-yellow-400 font-headline font-bold">
                      🪙 {gym.reward_coins}
                    </span>
                  </div>
                  <button
                    className={`w-full py-3 rounded-lg font-headline font-bold uppercase tracking-widest transition-all ${
                      gym.completed
                        ? "bg-[#242434] text-[#aba9b9] cursor-not-allowed"
                        : "bg-red-600 text-white hover:bg-red-500 active:scale-95"
                    }`}
                    disabled={gym.completed}
                  >
                    {gym.completed ? "Completed" : "Challenge Now"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── TEAM SELECTION ──────────────────────────────────────────
  if (screen === SCREEN.TEAM_SELECT) {
    return (
      <div className="min-h-screen pt-6 pb-32 px-4 md:px-8 max-w-7xl mx-auto">
        <button
          onClick={() => setScreen(SCREEN.GYMS)}
          className="flex items-center gap-2 text-[#aba9b9] hover:text-white transition-colors font-label uppercase text-sm tracking-wider mb-8"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back to Gyms
        </button>

        <div className="bg-[#12121e] rounded-2xl p-8 border border-[#474754]/20 mb-10 relative overflow-hidden">
          <div className="absolute -bottom-8 -right-8 opacity-5 font-headline font-black text-9xl italic pointer-events-none uppercase">
            {selectedGym.specialty}
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 text-center md:text-left">
              <span
                className={`inline-block px-3 py-1 rounded-full text-[10px] font-label font-black uppercase tracking-wider border-l-2 mb-3 ${TYPE_COLORS[selectedGym.specialty] || "bg-gray-500/20 text-gray-400 border-gray-500"}`}
              >
                {selectedGym.specialty} specialist
              </span>
              <h2 className="text-5xl font-headline font-black uppercase tracking-tighter text-white mb-1">
                {selectedGym.name}
              </h2>
              <p className="text-[#aba9b9] font-label uppercase text-sm tracking-widest">
                {selectedGym.gym}
              </p>
            </div>
            <div className="flex gap-4">
              <div className="bg-[#1e1e2d] px-4 py-3 rounded-xl text-center border border-[#474754]/20">
                <p className="text-[#aba9b9] text-[10px] font-label uppercase tracking-widest">
                  Pokemon
                </p>
                <p className="text-white font-headline font-bold text-xl">
                  {selectedGym.team.length}
                </p>
              </div>
              <div className="bg-[#1e1e2d] px-4 py-3 rounded-xl text-center border border-[#474754]/20">
                <p className="text-[#aba9b9] text-[10px] font-label uppercase tracking-widest">
                  Reward
                </p>
                <p className="text-yellow-400 font-headline font-bold text-xl">
                  🪙 {selectedGym.reward_coins}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-end mb-6">
          <div>
            <span className="text-red-400 font-label text-[10px] uppercase tracking-[0.4em] font-bold">
              Battle Command
            </span>
            <h3 className="font-headline text-3xl font-bold uppercase tracking-tighter text-white">
              Assemble Your Team
            </h3>
          </div>
          <div className="text-right">
            <span className="text-[#aba9b9] text-xs font-label uppercase tracking-widest">
              Selected: {selectedPokemon.length} / 5
            </span>
            <div className="flex gap-1 mt-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-8 h-1 rounded-full ${i < selectedPokemon.length ? "bg-red-500" : "bg-[#242434]"}`}
                />
              ))}
            </div>
          </div>
        </div>

        {collection.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <span className="material-symbols-outlined text-[#474754] text-6xl">
              catching_pokemon
            </span>
            <p className="text-[#aba9b9] font-label uppercase tracking-widest">
              No pokemon caught yet
            </p>
            <button
              onClick={() => navigate("/explore")}
              className="bg-red-600 text-white px-6 py-2 rounded-xl font-headline font-bold uppercase"
            >
              Go Explore
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {collection.map((p) => {
              const isSelected = selectedPokemon.find(
                (s) => s.pokemon_id === p.pokemon_id,
              );
              return (
                <div
                  key={p.pokemon_id}
                  onClick={() => togglePokemon(p)}
                  className={`relative bg-[#181826] rounded-2xl p-4 flex flex-col items-center gap-2 cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? "border-2 border-red-500 shadow-[0_0_15px_rgba(255,100,100,0.4)]"
                      : "border border-[#474754]/20 hover:border-[#474754]/50"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <span
                        className="material-symbols-outlined text-red-400 text-sm"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        check_circle
                      </span>
                    </div>
                  )}
                  <img
                    src={p.sprite}
                    alt={p.name}
                    className="w-16 h-16 object-contain"
                    style={{ imageRendering: "pixelated" }}
                  />
                  <h4 className="text-white font-headline font-bold text-xs uppercase tracking-tight text-center">
                    {p.name.charAt(0).toUpperCase() + p.name.slice(1)}
                  </h4>
                  <div className="flex gap-1 flex-wrap justify-center">
                    {p.types?.map((t) => (
                      <span
                        key={t}
                        className={`px-2 py-0.5 rounded-full text-[8px] font-label font-black uppercase border-l-2 ${TYPE_COLORS[t] || ""}`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex justify-center mt-12">
          <button
            onClick={handleStartBattle}
            disabled={selectedPokemon.length === 0 || battleLoading}
            className="px-12 py-6 bg-red-600 rounded-xl font-headline font-black text-3xl text-white uppercase tracking-tight hover:bg-red-500 active:scale-95 transition-all shadow-[0_0_30px_rgba(230,57,70,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-4"
          >
            <span className="material-symbols-outlined text-3xl">swords</span>
            {battleLoading ? "Loading..." : "Start Battle"}
          </button>
        </div>
      </div>
    );
  }

  // ── BATTLE SCREEN ──────────────────────────────────────────
  if (screen === SCREEN.BATTLE && battleState) {
    const playerPokemon =
      battleState.player_team[battleState.active_player_index];
    const gymPokemon = battleState.gym_team[battleState.active_gym_index];

    // Guard — if battle is over redirect to result
    if (!playerPokemon || !gymPokemon || battleState.battle_over) {
      if (battleState.battle_over) {
        setScreen(SCREEN.RESULT);
      }
      return null;
    }

    return (
      <div className="h-screen pt-16 pb-20 flex flex-col overflow-hidden bg-black">
        <div className="flex-grow relative bg-gradient-to-b from-slate-900 to-black overflow-hidden">
          {/* Opponent HP */}
          <div className="absolute top-6 left-6 z-10 w-64 bg-[#181826]/80 backdrop-blur-md p-4 rounded-xl border-l-4 border-blue-400">
            <div className="flex justify-between items-end mb-1">
              <h2 className="font-headline font-bold text-lg tracking-tight uppercase text-white">
                {gymPokemon.name.toUpperCase()}
              </h2>
              <span className="font-label text-xs text-[#aba9b9]">LVL 50</span>
            </div>
            <div className="h-2 w-full bg-[#242434] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getHpColor(gymPokemon.current_hp, gymPokemon.max_hp)}`}
                style={{
                  width: `${(gymPokemon.current_hp / gymPokemon.max_hp) * 100}%`,
                }}
              />
            </div>
            <div className="flex justify-end mt-1">
              <span className="text-[10px] font-label font-bold text-[#aba9b9]">
                {gymPokemon.current_hp} / {gymPokemon.max_hp}
              </span>
            </div>
          </div>

          {/* Opponent Sprite */}
          <div className="absolute top-8 right-16 flex items-center justify-center">
            <img
              src={gymPokemon.sprite}
              alt={gymPokemon.name}
              className="w-40 h-40 object-contain"
              style={{ imageRendering: "pixelated" }}
            />
          </div>

          {/* Player Sprite */}
          <div className="absolute bottom-8 left-16 flex items-center justify-center">
            <img
              src={playerPokemon.sprite}
              alt={playerPokemon.name}
              className="w-48 h-48 object-contain scale-125"
              style={{ imageRendering: "pixelated" }}
            />
          </div>

          {/* Player HP */}
          <div className="absolute bottom-6 right-6 z-10 w-72 bg-[#181826]/80 backdrop-blur-md p-4 rounded-xl border-r-4 border-red-400">
            <div className="flex justify-between items-end mb-1">
              <h2 className="font-headline font-bold text-lg tracking-tight uppercase text-white">
                {playerPokemon.name.toUpperCase()}
              </h2>
              <span className="font-label text-xs text-[#aba9b9]">LVL 50</span>
            </div>
            <div className="h-2 w-full bg-[#242434] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getHpColor(playerPokemon.current_hp, playerPokemon.max_hp)}`}
                style={{
                  width: `${(playerPokemon.current_hp / playerPokemon.max_hp) * 100}%`,
                }}
              />
            </div>
            <div className="flex justify-between items-center mt-1">
              <div className="flex gap-1">
                {battleState.player_team.map((p, i) => (
                  <span
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      p.current_hp > 0
                        ? i === battleState.active_player_index
                          ? "bg-red-400"
                          : "bg-green-400"
                        : "bg-[#474754]"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] font-label font-bold text-[#aba9b9]">
                {playerPokemon.current_hp} / {playerPokemon.max_hp}
              </span>
            </div>
          </div>
        </div>

        {/* HUD */}
        <div className="bg-[#0d0d18] border-t border-[#474754]/20 p-4 grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Battle Log */}
          <div
            ref={logRef}
            className="md:col-span-4 h-32 bg-[#12121e] rounded-xl p-3 overflow-y-auto border border-[#474754]/20 text-sm space-y-1"
          >
            {battleState.log.slice(-8).map((entry, i) => (
              <p key={i} className="text-[#aba9b9] font-body text-xs">
                <span className="text-red-400">&gt;&gt;</span> {entry}
              </p>
            ))}
            {battleLoading && (
              <p className="text-[#aba9b9] animate-pulse text-xs">
                <span className="text-red-400">&gt;&gt;</span> ...
              </p>
            )}
          </div>

          {/* Moves */}
          <div className="md:col-span-6 grid grid-cols-2 gap-2">
            {playerPokemon.moves.length > 0 ? (
              playerPokemon.moves.slice(0, 4).map((move, i) => (
                <button
                  key={i}
                  onClick={() => handleMove(i)}
                  disabled={battleLoading}
                  className={`p-3 rounded-xl flex flex-col items-start justify-between h-20 transition-all active:scale-95 disabled:opacity-50 text-white ${MOVE_COLORS[move.type] || "bg-gray-600 hover:bg-gray-500"}`}
                >
                  <span className="text-[10px] font-label font-bold uppercase tracking-widest opacity-70">
                    {move.type} • PWR {move.power}
                  </span>
                  <span className="font-headline font-bold text-sm uppercase">
                    {move.name.replace(/-/g, " ")}
                  </span>
                </button>
              ))
            ) : (
              <button
                onClick={() => handleMove(0)}
                disabled={battleLoading}
                className="p-3 rounded-xl bg-gray-600 hover:bg-gray-500 text-white font-headline font-bold col-span-2 h-20 disabled:opacity-50"
              >
                Tackle
              </button>
            )}
          </div>

          {/* Bag + Forfeit */}
          <div className="md:col-span-2 flex flex-col gap-2">
            <button
              onClick={() => setShowBag(true)}
              disabled={battleLoading}
              className="flex-1 py-3 px-4 bg-[#1e1e2d] hover:bg-[#2b2a3c] text-white font-label font-bold rounded-xl border border-[#474754]/30 flex items-center justify-center gap-2 transition-colors active:scale-95 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-yellow-400">
                backpack
              </span>
              <span className="text-xs uppercase tracking-wider">Bag</span>
            </button>
            <button
              onClick={handleReset}
              className="py-3 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl border border-red-500/20 text-xs font-label font-bold uppercase tracking-wider active:scale-95 transition-all"
            >
              Forfeit
            </button>
          </div>
        </div>

        {/* Bag Popup */}
        {showBag && (
          <BattleBag
            playerTeam={battleState.player_team}
            activeIndex={battleState.active_player_index}
            potions={battleState.potions}
            superPotions={battleState.super_potions}
            maxPotions={battleState.max_potions}
            onSwitch={handleSwitch}
            onPotion={async (potionType) => {
              await handlePotion(potionType);
              setShowBag(false);
            }}
            onClose={() => setShowBag(false)}
          />
        )}
      </div>
    );
  }

  // ── RESULT SCREEN ──────────────────────────────────────────
  if (screen === SCREEN.RESULT && battleState) {
    const won = battleState.winner === "player";
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center gap-8 px-4 ${
          won
            ? "bg-gradient-to-b from-yellow-900/20 to-[#0d0d18]"
            : "bg-gradient-to-b from-red-900/20 to-[#0d0d18]"
        }`}
      >
        <div
          className={`w-full max-w-md p-10 rounded-3xl border flex flex-col items-center gap-6 text-center ${
            won
              ? "bg-yellow-500/10 border-yellow-500/30"
              : "bg-red-900/10 border-red-900/30"
          }`}
        >
          <span
            className={`material-symbols-outlined text-8xl ${
              won ? "text-yellow-400" : "text-red-600"
            }`}
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {won ? "emoji_events" : "sentiment_very_dissatisfied"}
          </span>
          <h2
            className={`text-5xl font-headline font-black uppercase tracking-tighter ${
              won ? "text-yellow-400" : "text-red-400"
            }`}
          >
            {won ? "Victory!" : "Defeated!"}
          </h2>
          {won && progress && (
            <div className="flex gap-6 mt-2">
              <div className="flex flex-col items-center">
                <span className="text-[#aba9b9] text-xs font-label uppercase tracking-widest">
                  Coins Earned
                </span>
                <span className="text-yellow-400 font-headline font-bold text-2xl">
                  🪙 {selectedGym.reward_coins}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[#aba9b9] text-xs font-label uppercase tracking-widest">
                  Badge Earned
                </span>
                <span className="text-white font-headline font-bold text-lg">
                  {selectedGym.badge}
                </span>
              </div>
            </div>
          )}
          <p className="text-[#aba9b9] font-body text-sm">
            {won
              ? `You defeated ${selectedGym.name}!`
              : `${selectedGym.name} was too strong. Try again!`}
          </p>
        </div>
        <button
          onClick={handleReset}
          className="bg-red-600 text-white px-8 py-4 rounded-xl font-headline font-bold uppercase tracking-tight hover:bg-red-500 transition-all text-lg"
        >
          {won ? "Back to Gyms" : "Try Again"}
        </button>
      </div>
    );
  }

  return null;
};

export default Battle;
