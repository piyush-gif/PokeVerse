const BattleBag = ({
  playerTeam,
  activeIndex,
  potions,
  superPotions,
  maxPotions,
  onSwitch,
  onPotion,
  onClose,
}) => {
  const getHpColor = (current, max) => {
    const pct = (current / max) * 100;
    if (pct > 50) return "from-emerald-600 to-emerald-400";
    if (pct > 25) return "from-yellow-600 to-yellow-400";
    return "from-red-600 to-red-400";
  };

  const POTIONS = [
    {
      type: "potion",
      label: "Potion",
      description: "Restores 50 HP",
      count: potions,
      icon: "medical_services",
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      border: "border-blue-400",
    },
    {
      type: "super_potion",
      label: "Super Potion",
      description: "Restores 100 HP",
      count: superPotions,
      icon: "vaccines",
      color: "text-cyan-400",
      bg: "bg-cyan-400/10",
      border: "border-cyan-400",
    },
    {
      type: "max_potion",
      label: "Max Potion",
      description: "Fully restores HP",
      count: maxPotions,
      icon: "medication",
      color: "text-green-400",
      bg: "bg-green-400/10",
      border: "border-green-400",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-[#1e1e2d] rounded-t-[2.5rem] border-t border-[#474754]/10 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Pull Handle */}
        <div className="w-full flex justify-center pt-4 pb-2">
          <div className="w-12 h-1 bg-[#474754]/30 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-8 py-4 flex items-center justify-between">
          <h2 className="font-headline text-4xl font-bold tracking-tighter text-white">
            Bag
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#242434] text-[#aba9b9] hover:bg-[#2b2a3c] active:scale-90 transition-all"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-8">
          {/* Pokemon Team */}
          <div>
            <label className="font-label text-[10px] font-extrabold tracking-[0.2em] text-[#aba9b9] uppercase mb-4 block opacity-60">
              Your Team
            </label>
            <div className="grid gap-3">
              {playerTeam.map((p, i) => {
                const isActive = i === activeIndex;
                const isFainted = p.current_hp <= 0;
                const hpPct = (p.current_hp / p.max_hp) * 100;

                return (
                  <div
                    key={i}
                    onClick={() => !isActive && !isFainted && onSwitch(i)}
                    className={`relative bg-[#181826] p-4 rounded-2xl flex items-center gap-5 transition-all ${
                      isActive
                        ? "border border-red-500/30 cursor-default"
                        : isFainted
                          ? "opacity-50 grayscale border border-dashed border-[#474754]/20 cursor-not-allowed"
                          : "border border-[#474754]/10 cursor-pointer hover:bg-[#2b2a3c] active:scale-[0.98]"
                    }`}
                  >
                    {/* Sprite */}
                    <div className="w-16 h-16 bg-[#12121e] rounded-xl flex items-center justify-center overflow-hidden border border-[#474754]/10">
                      <img
                        src={p.sprite}
                        alt={p.name}
                        className="w-12 h-12 object-contain"
                        style={{ imageRendering: "pixelated" }}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-headline font-bold text-lg text-white tracking-tight uppercase">
                          {p.name.charAt(0).toUpperCase() + p.name.slice(1)}
                        </h3>
                        {isActive && (
                          <span className="px-2 py-0.5 bg-red-500/10 text-red-400 text-[10px] font-black rounded border border-red-500/20 uppercase">
                            Active
                          </span>
                        )}
                        {isFainted && (
                          <span className="px-2 py-0.5 bg-[#242434] text-[#aba9b9] text-[10px] font-black rounded uppercase">
                            Fainted
                          </span>
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="h-1.5 w-full bg-[#242434] rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${getHpColor(p.current_hp, p.max_hp)} transition-all duration-500`}
                            style={{ width: `${hpPct}%` }}
                          />
                        </div>
                        <div className="flex justify-end">
                          <span className="font-label text-[10px] font-bold text-[#aba9b9]">
                            {p.current_hp} / {p.max_hp} HP
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Items */}
          <div>
            <label className="font-label text-[10px] font-extrabold tracking-[0.2em] text-[#aba9b9] uppercase mb-4 block opacity-60">
              Items
            </label>
            <div className="space-y-3">
              {POTIONS.map((potion) => (
                <button
                  key={potion.type}
                  onClick={() => potion.count > 0 && onPotion(potion.type)}
                  disabled={potion.count <= 0}
                  className={`w-full flex items-center gap-4 p-5 rounded-3xl border-l-4 text-left transition-all active:scale-[0.99] ${
                    potion.count <= 0
                      ? "bg-[#181826]/20 opacity-40 cursor-not-allowed border-[#474754]"
                      : `bg-[#181826] ${potion.border} hover:bg-[#2b2a3c]`
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-2xl ${potion.bg} flex items-center justify-center ${potion.color}`}
                  >
                    <span className="material-symbols-outlined text-3xl">
                      {potion.icon}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-headline font-bold text-lg text-white">
                        {potion.label}
                      </h4>
                      <span
                        className={`font-label text-xs font-black ${potion.count > 0 ? potion.color : "text-[#aba9b9]"}`}
                      >
                        {potion.count} LEFT
                      </span>
                    </div>
                    <p className="font-body text-sm text-[#aba9b9]">
                      {potion.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BattleBag;
