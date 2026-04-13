import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import useAuthStore from "./store/authStore";

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

const STAT_COLORS = {
  hp: "bg-green-500",
  attack: "bg-red-500",
  defense: "bg-blue-500",
  "special-attack": "bg-purple-500",
  "special-defense": "bg-cyan-500",
  speed: "bg-yellow-400",
};

const PokemonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleGet, loading, error } = useFetch();
  const { user } = useAuthStore();
  const [pokemon, setPokemon] = useState(null);
  const [isCaught, setIsCaught] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  const fetchPokemon = async () => {
    const data = await handleGet(`http://localhost:8000/pokedex/${id}`);
    if (data) setPokemon(data);
  };

  const checkCaughtAndFavorite = async () => {
    if (!user) return;

    const collection = await handleGet(
      "http://localhost:8000/explore/collection",
    );
    if (collection?.collection) {
      const caught = collection.collection.find(
        (p) => p.pokemon_id === parseInt(id),
      );
      setIsCaught(!!caught);
    }

    const favs = await handleGet("http://localhost:8000/explore/favorites");
    if (favs?.favorites) {
      const fav = favs.favorites.find((p) => p.pokemon_id === parseInt(id));
      setIsFavorited(!!fav);
    }
  };

  useEffect(() => {
    fetchPokemon();
    checkCaughtAndFavorite();
  }, [id]);

  const handleFavorite = async () => {
    if (!user || !isCaught) return;
    setFavLoading(true);
    try {
      if (isFavorited) {
        await fetch(`http://localhost:8000/explore/favorite/${id}`, {
          method: "DELETE",
          credentials: "include",
        });
        setIsFavorited(false);
      } else {
        await fetch(`http://localhost:8000/explore/favorite/${id}`, {
          method: "POST",
          credentials: "include",
        });
        setIsFavorited(true);
      }
    } catch (e) {}
    setFavLoading(false);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#aba9b9] font-label uppercase tracking-widest">
          Loading...
        </p>
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  if (!pokemon) return null;

  return (
    <div className="min-h-screen px-6 py-10 max-w-screen-xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate("/pokedex")}
        className="flex items-center gap-2 text-[#aba9b9] hover:text-white transition-colors font-label uppercase text-sm tracking-wider mb-8"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        Back to Pokedex
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Column */}
        <div className="flex flex-col items-center gap-6">
          <div className="bg-[#1e1e2d] border border-[#474754]/20 rounded-3xl p-10 w-full flex flex-col items-center gap-4">
            <img
              src={pokemon.sprite}
              alt={pokemon.name}
              className="w-48 h-48 object-contain"
              style={{ imageRendering: "pixelated" }}
            />
            <p className="text-[#aba9b9] font-label text-sm">#{pokemon.id}</p>
            <h1 className="text-4xl font-headline font-bold text-white uppercase tracking-tighter">
              {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
            </h1>

            {/* Types */}
            <div className="flex gap-2 flex-wrap justify-center">
              {pokemon.types.map((t) => (
                <span
                  key={t}
                  className={`px-4 py-1 rounded-full text-xs font-label font-black uppercase tracking-wider border-l-2 ${TYPE_COLORS[t] || "bg-gray-500/20 text-gray-400 border-gray-500"}`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </span>
              ))}
            </div>

            {/* Favorite Button — only show if logged in and caught */}
            {user && isCaught && (
              <button
                onClick={handleFavorite}
                disabled={favLoading}
                className={`flex items-center gap-2 px-6 py-2 rounded-xl font-label font-bold uppercase text-xs tracking-wider transition-all duration-200 ${
                  isFavorited
                    ? "bg-pink-500/20 text-pink-400 border border-pink-500/30 hover:bg-pink-500/30"
                    : "bg-[#242434] text-[#aba9b9] border border-[#474754]/30 hover:border-pink-500/30 hover:text-pink-400"
                }`}
              >
                <span
                  className="material-symbols-outlined text-base"
                  style={{
                    fontVariationSettings: isFavorited
                      ? "'FILL' 1"
                      : "'FILL' 0",
                  }}
                >
                  favorite
                </span>
                {isFavorited ? "Favorited" : "Add to Favorites"}
              </button>
            )}

            {/* Caught badge */}
            {user && isCaught && (
              <div className="flex items-center gap-2 text-green-400 text-xs font-label uppercase tracking-wider">
                <span
                  className="material-symbols-outlined text-sm"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
                In your collection
              </div>
            )}

            {/* Not caught — prompt to explore */}
            {user && !isCaught && (
              <button
                onClick={() => navigate("/explore")}
                className="flex items-center gap-2 text-[#aba9b9] text-xs font-label uppercase tracking-wider hover:text-red-400 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">
                  travel_explore
                </span>
                Not caught yet — Go explore!
              </button>
            )}
          </div>

          {/* Info Row */}
          <div className="grid grid-cols-3 gap-4 w-full">
            {[
              { label: "Height", value: `${pokemon.height / 10}m` },
              { label: "Weight", value: `${pokemon.weight / 10}kg` },
              { label: "Base EXP", value: pokemon.base_experience },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-[#1e1e2d] border border-[#474754]/20 rounded-2xl p-4 flex flex-col items-center gap-1"
              >
                <span className="text-[#aba9b9] text-xs font-label uppercase tracking-widest">
                  {item.label}
                </span>
                <span className="text-white font-headline font-bold text-lg">
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          {/* Abilities */}
          <div className="bg-[#1e1e2d] border border-[#474754]/20 rounded-2xl p-6 w-full">
            <h2 className="text-white font-headline font-bold uppercase tracking-tight mb-4">
              Abilities
            </h2>
            <div className="flex gap-2 flex-wrap">
              {pokemon.abilities.map((a) => (
                <span
                  key={a}
                  className="px-3 py-1 bg-[#242434] border border-[#474754]/30 rounded-lg text-[#aba9b9] text-sm font-label"
                >
                  {a.charAt(0).toUpperCase() + a.slice(1)}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {/* Stats */}
          <div className="bg-[#1e1e2d] border border-[#474754]/20 rounded-2xl p-6">
            <h2 className="text-white font-headline font-bold uppercase tracking-tight mb-6">
              Base Stats
            </h2>
            <div className="flex flex-col gap-4">
              {Object.entries(pokemon.stats).map(([stat, value]) => (
                <div key={stat} className="flex items-center gap-4">
                  <span className="text-[#aba9b9] text-xs font-label uppercase tracking-wider w-28 shrink-0">
                    {stat.replace("-", " ")}
                  </span>
                  <div className="flex-1 h-2 bg-[#242434] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${STAT_COLORS[stat] || "bg-red-500"}`}
                      style={{ width: `${(value / 255) * 100}%` }}
                    />
                  </div>
                  <span className="text-white font-headline font-bold text-sm w-8 text-right">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Moves */}
          <div className="bg-[#1e1e2d] border border-[#474754]/20 rounded-2xl p-6">
            <h2 className="text-white font-headline font-bold uppercase tracking-tight mb-4">
              Moves
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {pokemon.moves.slice(0, 20).map((m) => (
                <span
                  key={m}
                  className="px-3 py-1.5 bg-[#242434] border border-[#474754]/30 rounded-lg text-[#aba9b9] text-xs font-label text-center"
                >
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetail;
