import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";

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

const Pokedex = () => {
  const [pokemon, setPokemon] = useState([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [region, setRegion] = useState("");
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const { handleGet, loading, error } = useFetch();
  const navigate = useNavigate();
  const LIMIT = 24;

  const types = [
    "fire",
    "water",
    "grass",
    "electric",
    "ice",
    "fighting",
    "poison",
    "ground",
    "flying",
    "psychic",
    "bug",
    "rock",
    "ghost",
    "dragon",
    "dark",
    "steel",
    "normal",
  ];

  const regions = ["kanto", "johto", "hoenn"];

  const fetchPokemon = async (currentOffset = 0, append = false) => {
    let url = `http://localhost:8000/pokedex?limit=${LIMIT}&offset=${currentOffset}`;
    if (search) url += `&search=${search}`;
    if (type) url += `&type=${type}`;
    if (region) url += `&region=${region}`;
    const data = await handleGet(url);
    if (data) {
      setTotal(data.total);
      if (append) {
        setPokemon((prev) => [...prev, ...data.pokemon]);
      } else {
        setPokemon(data.pokemon);
      }
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      setOffset(0);
      fetchPokemon(0, false);
    }, 400);
    return () => clearTimeout(delay);
  }, [search, type, region]);

  const handleLoadMore = () => {
    const newOffset = offset + LIMIT;
    setOffset(newOffset);
    fetchPokemon(newOffset, true);
  };

  return (
    <div className="min-h-screen px-6 py-10 max-w-screen-2xl mx-auto">
      <h1 className="text-5xl font-headline font-bold text-white uppercase tracking-tighter mb-8">
        Pokédex
      </h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-10">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search pokemon..."
          className="bg-[#1e1e2d] border border-[#474754]/30 text-white placeholder-[#aba9b9] px-4 py-3 rounded-xl flex-1 focus:outline-none focus:border-red-500 transition-colors font-body"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="bg-[#1e1e2d] border border-[#474754]/30 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-red-500 transition-colors font-body"
        >
          <option value="">All Types</option>
          {types.map((t) => (
            <option key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
        </select>
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="bg-[#1e1e2d] border border-[#474754]/30 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-red-500 transition-colors font-body"
        >
          <option value="">All Regions</option>
          {regions.map((r) => (
            <option key={r} value={r}>
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {pokemon.map((p) => (
          <div
            key={p.id}
            onClick={() => navigate(`/pokedex/${p.id}`)}
            className="bg-[#1e1e2d] border border-[#474754]/20 rounded-2xl p-4 flex flex-col items-center gap-2 cursor-pointer hover:border-red-500/50 hover:bg-[#2b2a3c] transition-all duration-300 group"
          >
            <img
              src={p.sprite}
              alt={p.name}
              className="w-20 h-20 object-contain group-hover:scale-110 transition-transform duration-300"
            />
            <p className="text-[#aba9b9] text-xs font-label">#{p.id}</p>
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

      {/* Load More */}
      {pokemon.length < total && !loading && (
        <div className="flex justify-center mt-10">
          <button
            onClick={handleLoadMore}
            className="bg-red-600 text-white px-8 py-3 rounded-xl font-headline font-bold uppercase tracking-tight hover:bg-red-500 transition-all duration-300 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)]"
          >
            Load More
          </button>
        </div>
      )}

      {loading && (
        <div className="flex justify-center mt-10">
          <p className="text-[#aba9b9] font-label uppercase tracking-widest text-sm">
            Loading...
          </p>
        </div>
      )}
    </div>
  );
};

export default Pokedex;
