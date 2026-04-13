import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "./store/authStore";
import useFetch from "../hooks/useFetch";

const TYPE_COLORS = {
  fire: "bg-red-500/20 text-red-400 border-red-500",
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

const Profile = () => {
  const { user, clearUser } = useAuthStore();
  const { handleGet } = useFetch();
  const navigate = useNavigate();
  const [caughtPokemon, setCaughtPokemon] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [battlesWon, setBattlesWon] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      const collectionData = await handleGet(
        "http://localhost:8000/explore/collection",
      );
      if (collectionData?.collection)
        setCaughtPokemon(collectionData.collection);

      const favData = await handleGet(
        "http://localhost:8000/explore/favorites",
      );
      if (favData?.favorites) setFavorites(favData.favorites);

      const progressData = await handleGet(
        "http://localhost:8000/battle/progress",
      );
      if (progressData) setBattlesWon(progressData.badges.length);
    };
    fetchData();
  }, []);
  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8000/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {}
    clearUser();
    navigate("/login");
  };

  return (
    <div className="min-h-screen pb-24 pt-6 px-4 md:px-8 max-w-7xl mx-auto space-y-12">
      {/* Trainer Header */}
      <section className="relative overflow-hidden rounded-3xl bg-[#12121e] p-8 border border-white/5">
        <div className="absolute top-0 right-0 p-6 z-10">
          <button
            onClick={handleLogout}
            className="bg-red-500/10 text-red-400 font-headline font-bold px-6 py-2 rounded-xl uppercase tracking-widest text-xs border border-red-500/20 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200"
          >
            LOGOUT
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-red-400 to-red-600 p-1 shadow-[0_0_40px_rgba(255,141,140,0.2)]">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-red-400 text-6xl md:text-8xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  person
                </span>
              </div>
            </div>
          </div>

          <div className="text-center md:text-left space-y-2">
            <h2 className="text-5xl md:text-6xl font-headline font-black tracking-tighter text-white uppercase italic">
              {user?.username}
            </h2>
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 text-[#aba9b9] font-label text-sm tracking-wide">
              <span className="flex items-center justify-center md:justify-start gap-2">
                <span className="material-symbols-outlined text-red-400 text-base">
                  mail
                </span>
                {user?.email}
              </span>
            </div>
          </div>
        </div>

        <div className="absolute -bottom-10 -right-10 opacity-5 font-headline font-black text-9xl italic pointer-events-none select-none">
          ARCHIVE
        </div>
      </section>

      {/* Stats Row */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#181826] rounded-2xl p-6 flex items-center justify-between border-l-4 border-red-400 shadow-xl">
          <div className="space-y-1">
            <p className="font-label text-xs uppercase tracking-widest text-[#aba9b9]">
              Total Caught
            </p>
            <p className="font-headline font-black text-5xl text-white">
              {caughtPokemon.length}
            </p>
          </div>
          <span className="material-symbols-outlined text-red-400 text-5xl opacity-40">
            capture
          </span>
        </div>
        <div className="bg-[#181826] rounded-2xl p-6 flex items-center justify-between border-l-4 border-blue-400 shadow-xl">
          <div className="space-y-1">
            <p className="font-label text-xs uppercase tracking-widest text-[#aba9b9]">
              Favorites
            </p>
            <p className="font-headline font-black text-5xl text-white">
              {favorites.length}
            </p>
          </div>
          <span className="material-symbols-outlined text-blue-400 text-5xl opacity-40">
            favorite
          </span>
        </div>
        <div className="bg-[#181826] rounded-2xl p-6 flex items-center justify-between border-l-4 border-purple-400 shadow-xl">
          <div className="space-y-1">
            <p className="font-label text-xs uppercase tracking-widest text-[#aba9b9]">
              Battles Won
            </p>
            <p className="font-headline font-black text-5xl text-white">
              {battlesWon}
            </p>
          </div>
          <span className="material-symbols-outlined text-purple-400 text-5xl opacity-40">
            swords
          </span>
        </div>
      </section>

      {/* My Collection */}
      <section className="space-y-8">
        <div className="flex items-end justify-between border-b border-[#474754] pb-4">
          <h3 className="font-headline font-black text-3xl tracking-tighter uppercase italic flex items-center gap-3">
            <span className="w-2 h-8 bg-red-400 block" />
            My Collection
          </h3>
        </div>

        {caughtPokemon.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <span className="material-symbols-outlined text-[#474754] text-6xl">
              catching_pokemon
            </span>
            <p className="text-[#aba9b9] font-label uppercase tracking-widest text-sm">
              No pokemon caught yet.
            </p>
            <button
              onClick={() => navigate("/explore")}
              className="bg-red-600 text-white px-6 py-2 rounded-xl font-headline font-bold uppercase tracking-tight hover:bg-red-500 transition-all text-sm"
            >
              Start Exploring
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {caughtPokemon.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/pokedex/${p.pokemon_id}`)}
                className="bg-[#1e1e2d] border border-[#474754]/20 rounded-2xl p-4 flex flex-col items-center gap-2 cursor-pointer hover:border-red-500/50 hover:bg-[#2b2a3c] transition-all duration-300 group"
              >
                <img
                  src={p.sprite}
                  alt={p.name}
                  className="w-20 h-20 object-contain group-hover:scale-110 transition-transform duration-300"
                  style={{ imageRendering: "pixelated" }}
                />
                <p className="text-[#aba9b9] text-xs font-label">
                  #{p.pokemon_id}
                </p>
                <h3 className="text-white font-headline font-bold text-sm uppercase tracking-tight text-center">
                  {p.name.charAt(0).toUpperCase() + p.name.slice(1)}
                </h3>
                <div className="flex gap-1 flex-wrap justify-center">
                  {p.types.map((t) => (
                    <span
                      key={t}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-label font-black uppercase tracking-wider border-l-2 ${TYPE_COLORS[t] || "bg-gray-500/20 text-gray-400 border-gray-500"}`}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Favorites */}
      <section className="space-y-8">
        <div className="flex items-end justify-between border-b border-[#474754] pb-4">
          <h3 className="font-headline font-black text-3xl tracking-tighter uppercase italic flex items-center gap-3">
            <span className="w-2 h-8 bg-blue-400 block" />
            Favorites
          </h3>
        </div>

        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <span className="material-symbols-outlined text-[#474754] text-6xl">
              favorite
            </span>
            <p className="text-[#aba9b9] font-label uppercase tracking-widest text-sm">
              No favorites yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {favorites.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/pokedex/${p.pokemon_id}`)}
                className="bg-[#1e1e2d] border border-[#474754]/20 rounded-2xl p-4 flex flex-col items-center gap-2 cursor-pointer hover:border-blue-500/50 hover:bg-[#2b2a3c] transition-all duration-300 group"
              >
                <img
                  src={p.sprite}
                  alt={p.name}
                  className="w-20 h-20 object-contain group-hover:scale-110 transition-transform duration-300"
                  style={{ imageRendering: "pixelated" }}
                />
                <p className="text-[#aba9b9] text-xs font-label">
                  #{p.pokemon_id}
                </p>
                <h3 className="text-white font-headline font-bold text-sm uppercase tracking-tight text-center">
                  {p.name.charAt(0).toUpperCase() + p.name.slice(1)}
                </h3>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Profile;
