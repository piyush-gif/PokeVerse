import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[751px] flex items-center overflow-hidden px-6 py-20">
        {/* Background glow */}
        <div className="absolute top-0 right-0 -z-10 w-2/3 h-full opacity-20 blur-3xl bg-gradient-to-l from-red-500/40 to-transparent pointer-events-none" />

        <div className="max-w-screen-2xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="inline-block px-4 py-1 bg-[#242434] border-l-4 border-red-500 text-red-400 font-label text-xs uppercase tracking-[0.2em] font-bold">
                The Kinetic Archive
              </span>
              <h2 className="text-6xl md:text-8xl font-headline font-bold leading-none tracking-tighter text-white">
                Catch, Battle,
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
                  Explore!
                </span>
              </h2>
              <p className="text-[#aba9b9] text-lg md:text-xl max-w-xl font-body leading-relaxed">
                Access the ultimate research terminal. Track global sightings,
                optimize your move-sets, and master the competitive landscape
                with the Kinetic Archive.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to="/pokedex"
                className="bg-red-500 text-white px-8 py-4 rounded-xl font-headline font-black text-lg uppercase tracking-tight hover:shadow-[0_0_20px_rgba(255,141,140,0.4)] transition-all flex items-center justify-center gap-2"
              >
                Browse Pokedex
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
              <Link
                to="/register"
                className="bg-[#1e1e2d] border border-[#474754]/30 text-white px-8 py-4 rounded-xl font-headline font-black text-lg uppercase tracking-tight hover:bg-[#2b2a3c] transition-all flex items-center justify-center gap-2"
              >
                Get Started
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-12 pt-8 items-center">
              <div className="flex flex-col">
                <span className="text-4xl font-headline font-bold text-white leading-none">
                  386
                </span>
                <span className="text-[#aba9b9] text-xs font-label uppercase tracking-widest mt-1">
                  Species Logged
                </span>
              </div>
              <div className="w-px h-12 bg-[#474754]/30" />
              <div className="flex flex-col">
                <span className="text-4xl font-headline font-bold text-white leading-none">
                  3
                </span>
                <span className="text-[#aba9b9] text-xs font-label uppercase tracking-widest mt-1">
                  Regions
                </span>
              </div>
              <div className="w-px h-12 bg-[#474754]/30" />
              <div className="flex flex-col">
                <span className="text-4xl font-headline font-bold text-white leading-none">
                  Gen 1-3
                </span>
                <span className="text-[#aba9b9] text-xs font-label uppercase tracking-widest mt-1">
                  Generations
                </span>
              </div>
            </div>
          </div>

          {/* Right — Charizard Card */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-red-500/10 rounded-[3rem] blur-2xl group-hover:bg-red-500/20 transition-all" />
            <div className="relative rounded-3xl overflow-hidden aspect-[4/5] bg-[#181826] border border-[#474754]/20">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAU500W7LY4N4e-js4nbZzIh66TorhcSTqDphDUI4ArDFXip8OrjiPJJqdKvJwi6u0SL4yZ-aGD2yCAYkoFTm-EPTcWZHlXpunSuEBsBhcBmMJTIc1IgoYGGFX8O0TUQjxrQWx5_HKyO_J470VYP-sIXOvA644px2T8C9ZoDsflQjGA8bPDa5PZ2mWqG74Op15vILdxm3f0gjY-iSz1O-a7Tp9Up2uDw53iTcLRhinbURGi1xVslcbX47zfHQ8HpS4g43vCho5K0SY"
                alt="Charizard"
                className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
              />
              <div className="absolute bottom-6 left-6 right-6 p-6 bg-[#1e1e2d]/80 backdrop-blur-xl rounded-2xl border border-white/5">
                <div className="flex justify-between items-end">
                  <div>
                    <div className="flex gap-2 mb-2">
                      <span className="px-3 py-0.5 bg-red-500/20 text-red-400 text-[10px] font-label font-black uppercase tracking-widest rounded-full border-l-2 border-red-500">
                        Fire
                      </span>
                      <span className="px-3 py-0.5 bg-sky-500/20 text-sky-400 text-[10px] font-label font-black uppercase tracking-widest rounded-full border-l-2 border-sky-500">
                        Flying
                      </span>
                    </div>
                    <h3 className="text-3xl font-headline font-bold text-white leading-none">
                      CHARIZARD
                    </h3>
                    <p className="text-[#aba9b9] text-xs font-label uppercase mt-1">
                      #0006 — Flame Pokémon
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-red-400 text-xs font-label font-bold">
                      LVL
                    </span>
                    <div className="text-5xl font-headline font-black text-white leading-none">
                      100
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section className="py-24 px-6 max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Battle Arena Card */}
          <div className="md:col-span-2 relative group rounded-3xl bg-[#181826] overflow-hidden p-10 flex flex-col justify-end min-h-[400px]">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMV7Px46ksuz1DNKNtmb6FOx1cbDyvwL8JMVGR4zu0cUvixr0il1eojRDmkw4ES6D4edBvI71OZktawfYVdiMfEiyjB6clrwwNIVyXxPlitaT-X333ih3XKf5sv-Ghdoyl6451qntSQBtUIgw1dL_9KRzYh4H1m5qZdjO14QBiQpz_-r-TSujfBPrxHv1Lmta9UUMYXnKSJ3NFXncabf2wGSp9ItjwD-RNQK-bS-r3688oK73547FHpMhzTz5DViWJfPpeVIzEkAU"
              alt="Battle Arena"
              className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d18] via-[#0d0d18]/40 to-transparent" />
            <div className="relative z-10 space-y-4">
              <h4 className="text-4xl font-headline font-bold text-white uppercase tracking-tight">
                Kinetic Battle Arena
              </h4>
              <p className="text-[#aba9b9] max-w-lg">
                Master the competitive meta with our real-time battle simulator.
                Analyze type matchups and move-set effectiveness.
              </p>
              <div className="pt-4">
                <Link
                  to="/battle"
                  className="bg-[#2b2a3c] text-white px-6 py-2 rounded-lg font-headline font-bold uppercase text-sm tracking-wider flex items-center gap-2 hover:bg-white/10 transition-colors w-fit"
                >
                  Enter Arena
                  <span className="material-symbols-outlined text-sm">
                    stadium
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Explore Card */}
          <div className="relative group rounded-3xl bg-[#181826] overflow-hidden p-10 flex flex-col justify-between border border-[#474754]/10">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400">
                <span className="material-symbols-outlined text-3xl">
                  travel_explore
                </span>
              </div>
              <h4 className="text-2xl font-headline font-bold text-white uppercase tracking-tight">
                Explore Regions
              </h4>
              <p className="text-[#aba9b9] text-sm">
                Venture into Kanto, Johto, and Hoenn. Find wild pokemon across
                different routes and catch them all.
              </p>
            </div>
            <div className="pt-8">
              <Link
                to="/explore"
                className="text-red-400 font-label text-sm uppercase font-bold tracking-widest hover:gap-4 transition-all flex items-center gap-2"
              >
                Start Exploring
                <span className="material-symbols-outlined text-sm">
                  arrow_forward
                </span>
              </Link>
            </div>
          </div>

          {/* Stats Card */}
          <div className="rounded-3xl bg-[#1e1e2d] p-8 border border-[#474754]/10 flex flex-col justify-between">
            <span className="text-red-400 font-label text-[10px] uppercase tracking-[0.3em] font-black">
              Archive Status
            </span>
            <div className="py-6">
              <div className="text-6xl font-headline font-black text-white tabular-nums tracking-tighter">
                386
              </div>
              <p className="text-[#aba9b9] text-sm uppercase tracking-widest font-label mt-2">
                Pokemon Available
              </p>
            </div>
            <div className="flex flex-col gap-2">
              {["Kanto — 151", "Johto — 100", "Hoenn — 135"].map((r) => (
                <div key={r} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <span className="text-[#aba9b9] text-xs font-label">{r}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pokedex Card */}
          <div className="md:col-span-2 group rounded-3xl bg-[#181826] overflow-hidden p-[1px] bg-gradient-to-br from-[#474754]/40 to-transparent">
            <div className="bg-[#181826] rounded-[calc(1.5rem-1px)] h-full p-10 flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1 space-y-4">
                <h4 className="text-3xl font-headline font-bold text-white uppercase tracking-tight leading-none">
                  Smart Pokédex Archive
                </h4>
                <p className="text-[#aba9b9]">
                  The world's most comprehensive database with stats, move-pool
                  analysis, and evolutionary paths for Gen 1-3.
                </p>
                <Link
                  to="/pokedex"
                  className="inline-flex items-center gap-2 text-red-400 font-label text-sm uppercase font-bold tracking-widest hover:gap-4 transition-all"
                >
                  Open Database
                  <span className="material-symbols-outlined text-sm">
                    database
                  </span>
                </Link>
              </div>
              <div className="w-full md:w-64 h-48 rounded-2xl bg-[#12121e] overflow-hidden relative border border-[#474754]/20">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2-pqtn6VEyau9hKBaUb6wt1llSAcWtGKyPsEZz7tOI_iGScp9WbJRxZVmA6XaqPGFSjn25YL4RouzlEvjty07nPKRVZSJNrbHqnEcX9HRQj9EFNQ0EkFNzqpLDqfphPqyfhtQC6MxlQULbLLCWVRmsae2lkyzIZ1fRmg2EViuKNeTWNi8GoEXRlalcDV-FqEdnTqo_YiUJyOVkYaUYl51w7Rg9_C29rdWg0r9B53KPzM9xXKmWhuSVWL8TyOA0mf_JMMzWKJdRWk"
                  alt="Pokeball"
                  className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-12 px-6 mt-auto border-t border-[#474754]/10">
        <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-red-500 text-2xl">
                capture
              </span>
              <span className="text-lg font-black text-white font-headline uppercase tracking-tighter">
                PokéVerse
              </span>
            </div>
            <p className="text-slate-500 max-w-sm font-body text-sm leading-relaxed">
              The Kinetic Archive is a tool for trainers. Catch pokemon across
              all regions and battle your way to the top.
            </p>
            <p className="font-body text-sm uppercase tracking-widest text-slate-500">
              © 2025 PokéVerse Kinetic Archive. All data synchronized.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <span className="text-red-500 font-headline font-bold uppercase text-xs tracking-widest">
                Platform
              </span>
              <nav className="flex flex-col gap-2">
                <a
                  className="text-slate-500 font-body text-sm uppercase tracking-widest hover:text-red-500 transition-colors"
                  href="#"
                >
                  API Docs
                </a>
                <a
                  className="text-slate-500 font-body text-sm uppercase tracking-widest hover:text-red-500 transition-colors"
                  href="#"
                >
                  Privacy Policy
                </a>
                <a
                  className="text-slate-500 font-body text-sm uppercase tracking-widest hover:text-red-500 transition-colors"
                  href="#"
                >
                  Terms of Service
                </a>
              </nav>
            </div>
            <div className="space-y-4">
              <span className="text-red-500 font-headline font-bold uppercase text-xs tracking-widest">
                Support
              </span>
              <nav className="flex flex-col gap-2">
                <a
                  className="text-slate-500 font-body text-sm uppercase tracking-widest hover:text-red-500 transition-colors"
                  href="#"
                >
                  Contact Support
                </a>
                <a
                  className="text-slate-500 font-body text-sm uppercase tracking-widest hover:text-red-500 transition-colors"
                  href="#"
                >
                  Help Center
                </a>
              </nav>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
