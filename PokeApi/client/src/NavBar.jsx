import { Link } from "react-router-dom";
import useAuthStore from "./store/authStore";

const NavBar = () => {
  const { user } = useAuthStore();

  return (
    <>
      {/* Desktop Navbar */}
      <header className="bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-screen-2xl mx-auto">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <span className="material-symbols-outlined text-red-500 text-3xl">
              capture
            </span>
            <h1 className="text-2xl font-bold tracking-tighter text-white font-headline uppercase">
              PokéVerse
            </h1>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-slate-400 font-medium hover:text-white transition-colors font-headline uppercase text-sm tracking-wider"
            >
              Home
            </Link>
            <Link
              to="/pokedex"
              className="text-slate-400 font-medium hover:text-white transition-colors font-headline uppercase text-sm tracking-wider"
            >
              Pokedex
            </Link>
            <Link
              to="/explore"
              className="text-slate-400 font-medium hover:text-white transition-colors font-headline uppercase text-sm tracking-wider"
            >
              Explore
            </Link>
            <Link
              to="/battle"
              className="text-slate-400 font-medium hover:text-white transition-colors font-headline uppercase text-sm tracking-wider"
            >
              Battle
            </Link>
            <Link
              to="/shop"
              className="text-slate-400 font-medium hover:text-white transition-colors font-headline uppercase text-sm tracking-wider"
            >
              Shop
            </Link>
          </nav>

          {/* Auth */}
          {user ? (
            <Link
              to="/profile"
              className="text-white font-headline font-bold uppercase tracking-tight px-6 py-2 rounded-lg bg-surface-container-high border border-outline-variant/30 hover:bg-surface-bright transition-all"
            >
              {user.username}
            </Link>
          ) : (
            <Link
              to="/login"
              className="bg-red-600 text-white px-6 py-2 rounded-lg font-headline font-bold uppercase tracking-tight hover:bg-red-500 transition-all duration-300"
            >
              Login
            </Link>
          )}
        </div>
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-xl border-t border-white/5 px-6 py-3 flex justify-between items-center shadow-[0_-8px_32px_rgba(0,0,0,0.5)]">
        <Link to="/" className="flex flex-col items-center gap-1 text-red-400">
          <span className="material-symbols-outlined">home</span>
          <span className="text-[10px] font-bold uppercase">Home</span>
        </Link>
        <Link
          to="/pokedex"
          className="flex flex-col items-center gap-1 text-slate-500 hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined">search</span>
          <span className="text-[10px] font-bold uppercase">Pokedex</span>
        </Link>
        <Link
          to="/battle"
          className="flex flex-col items-center gap-1 text-slate-500 hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined">swords</span>
          <span className="text-[10px] font-bold uppercase">Battle</span>
        </Link>
        <Link
          to="/profile"
          className="flex flex-col items-center gap-1 text-slate-500 hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined">account_circle</span>
          <span className="text-[10px] font-bold uppercase">Profile</span>
        </Link>
      </nav>
    </>
  );
};

export default NavBar;
