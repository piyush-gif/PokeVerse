import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";

const SHOP_ITEMS = [
  {
    id: "pokeball",
    name: "Pokeball",
    description: "A basic ball for catching wild pokemon",
    price: 30,
    icon: "capture",
    color: "text-red-400",
    bg: "bg-red-500/10",
    inventoryKey: "pokeballs",
  },
  {
    id: "great_ball",
    name: "Great Ball",
    description: "Better catch rate than a Pokeball",
    price: 50,
    icon: "adjust",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    inventoryKey: "great_balls",
  },
  {
    id: "ultra_ball",
    name: "Ultra Ball",
    description: "High performance ball for rare pokemon",
    price: 80,
    icon: "radio_button_checked",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    inventoryKey: "ultra_balls",
  },
  {
    id: "potion",
    name: "Potion",
    description: "Restores 50 HP to a pokemon in battle",
    price: 50,
    icon: "medical_services",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    inventoryKey: "potions",
  },
  {
    id: "super_potion",
    name: "Super Potion",
    description: "Restores 100 HP to a pokemon in battle",
    price: 100,
    icon: "vaccines",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    inventoryKey: "super_potions",
  },
  {
    id: "max_potion",
    name: "Max Potion",
    description: "Fully restores HP to a pokemon in battle",
    price: 200,
    icon: "medication",
    color: "text-green-400",
    bg: "bg-green-500/10",
    inventoryKey: "max_potions",
  },
];

const Shop = () => {
  const navigate = useNavigate();
  const { handleGet, handlePost } = useFetch();
  const [inventory, setInventory] = useState(null);
  const [quantities, setQuantities] = useState(
    Object.fromEntries(SHOP_ITEMS.map((item) => [item.id, 1])),
  );
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    const data = await handleGet("http://localhost:8000/shop/inventory");
    if (data) setInventory(data);
  };

  const showToast = (message, success = true) => {
    setToast({ message, success });
    setTimeout(() => setToast(null), 3000);
  };

  const handleQuantityChange = (itemId, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max(1, Math.min(99, prev[itemId] + delta)),
    }));
  };

  const handleBuy = async (item) => {
    const qty = quantities[item.id];
    const totalCost = item.price * qty;

    if (!inventory || inventory.coins < totalCost) {
      showToast("Not enough coins!", false);
      return;
    }

    const data = await handlePost(`http://localhost:8000/shop/buy/${item.id}`, {
      quantity: qty,
    });

    if (data) {
      showToast(`Bought ${qty}x ${item.name}!`, true);
      fetchInventory();
    }
  };

  const totalItems = inventory
    ? inventory.pokeballs +
      inventory.great_balls +
      inventory.ultra_balls +
      inventory.potions +
      inventory.super_potions +
      inventory.max_potions
    : 0;

  return (
    <div className="min-h-screen pt-6 pb-32 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Background glows */}
      <div className="fixed top-0 right-0 -z-10 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[150px]" />
      <div className="fixed bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px]" />

      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h2 className="text-5xl md:text-7xl font-headline font-bold uppercase tracking-tighter text-white">
            Item Shop
          </h2>
          <p className="text-[#aba9b9] text-lg mt-2">
            Spend your hard earned coins to level up your squad
          </p>
        </div>
        {inventory && (
          <div className="bg-[#1e1e2d] px-6 py-4 rounded-xl border-l-2 border-red-400 flex items-center gap-3 shadow-xl">
            <span
              className="material-symbols-outlined text-yellow-400 text-2xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              monetization_on
            </span>
            <div>
              <p className="text-[10px] font-label uppercase tracking-widest text-[#aba9b9]">
                Balance
              </p>
              <p className="text-white font-headline font-bold text-xl">
                {inventory.coins} Coins
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Shop Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SHOP_ITEMS.map((item) => {
          const owned = inventory ? inventory[item.inventoryKey] : 0;
          const qty = quantities[item.id];
          const totalCost = item.price * qty;
          const canAfford = inventory ? inventory.coins >= totalCost : false;

          return (
            <div
              key={item.id}
              className="bg-[#181826] rounded-2xl p-6 relative overflow-hidden group hover:bg-[#2b2a3c] transition-all duration-300"
            >
              {/* Background icon */}
              <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined text-[120px]">
                  {item.icon}
                </span>
              </div>

              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div
                  className={`w-16 h-16 ${item.bg} rounded-2xl flex items-center justify-center`}
                >
                  <span
                    className={`material-symbols-outlined ${item.color} text-4xl`}
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {item.icon}
                  </span>
                </div>
                <span className="font-label text-xs font-bold uppercase bg-[#242434] text-[#aba9b9] px-3 py-1 rounded-full border border-[#474754]/20">
                  Owned: {owned}
                </span>
              </div>

              {/* Info */}
              <h3 className="font-headline text-xl font-bold text-white mb-1">
                {item.name}
              </h3>
              <p className="font-body text-sm text-[#aba9b9] mb-6 leading-relaxed">
                {item.description}
              </p>

              {/* Buy row */}
              <div className="flex items-center justify-between pt-4 border-t border-[#474754]/10">
                <div className="flex items-center gap-2">
                  <span
                    className="material-symbols-outlined text-yellow-400 text-lg"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    monetization_on
                  </span>
                  <span className="font-headline font-bold text-white text-lg">
                    {totalCost}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {/* Quantity selector */}
                  <div className="flex items-center bg-[#12121e] rounded-lg p-1">
                    <button
                      onClick={() => handleQuantityChange(item.id, -1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-[#242434] rounded text-[#aba9b9] active:scale-90 transition-transform font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 font-label font-bold text-sm text-white min-w-[2rem] text-center">
                      {qty}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item.id, 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-[#242434] rounded text-[#aba9b9] active:scale-90 transition-transform font-bold"
                    >
                      +
                    </button>
                  </div>
                  {/* Buy button */}
                  <button
                    onClick={() => handleBuy(item)}
                    disabled={!canAfford}
                    className="bg-red-600 hover:bg-red-500 text-white font-headline font-bold px-5 py-2 rounded-xl transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Buy
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inventory Summary */}
      <section className="mt-16">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-headline text-3xl font-bold text-white uppercase tracking-tight">
            Your Inventory
          </h3>
          <span className="text-[#aba9b9] font-label text-sm uppercase tracking-widest">
            {totalItems} items total
          </span>
        </div>
        <div className="bg-[#12121e] rounded-3xl p-8 border border-[#474754]/10 flex flex-wrap gap-8 items-center">
          {inventory &&
            SHOP_ITEMS.map((item, i) => (
              <div key={item.id} className="flex items-center gap-8">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 bg-[#1e1e2d] rounded-full flex items-center justify-center">
                    <span
                      className={`material-symbols-outlined ${item.color}`}
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      {item.icon}
                    </span>
                  </div>
                  <span className="font-label font-bold text-[10px] uppercase text-[#aba9b9] text-center">
                    {item.name}
                  </span>
                  <span className="font-headline font-bold text-xl text-white">
                    {inventory[item.inventoryKey]}
                  </span>
                </div>
                {i < SHOP_ITEMS.length - 1 && (
                  <div className="w-px h-12 bg-[#474754]/20" />
                )}
              </div>
            ))}
        </div>
      </section>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-24 md:bottom-12 right-6 z-50 animate-bounce">
          <div
            className={`border backdrop-blur-xl px-6 py-4 rounded-2xl flex items-center gap-4 shadow-2xl ${
              toast.success
                ? "bg-green-900/40 border-green-500/50"
                : "bg-red-900/40 border-red-500/50"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                toast.success ? "bg-green-500/20" : "bg-red-500/20"
              }`}
            >
              <span
                className={`material-symbols-outlined ${
                  toast.success ? "text-green-400" : "text-red-400"
                }`}
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {toast.success ? "check_circle" : "error"}
              </span>
            </div>
            <div>
              <p
                className={`font-headline font-bold ${
                  toast.success ? "text-green-100" : "text-red-100"
                }`}
              >
                {toast.success ? "Transaction Successful" : "Purchase Failed"}
              </p>
              <p
                className={`font-body text-xs uppercase tracking-wider ${
                  toast.success ? "text-green-200/70" : "text-red-200/70"
                }`}
              >
                {toast.message}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
