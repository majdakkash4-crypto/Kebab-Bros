import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  ShoppingBag, Plus, Minus, X, MapPin, Phone, Clock, Instagram, Facebook,
  Mail, Flame, Leaf, Search, ChevronRight, Check, Truck, Store, CreditCard,
  Banknote, Heart, Star, Menu as MenuIcon, ArrowRight, ShieldCheck, Package,
  Sparkles, ChevronDown, User, Home, Lock
} from "lucide-react";

/* ========================================================================
   KEBAB BRO'S COESFELD — PRODUCTION WEB APP
   Markt 3, 48653 Coesfeld · Tel. 02541-8444390
   ======================================================================== */

// ---------- SEED MENÜ (wird beim ersten Start in die "Datenbank" geschrieben)
const SEED_MENU = [
  // ANGEBOTE
  { id: "a1", cat: "angebote", name: "Mittags-Menü", desc: "Döner Tasche + Getränk 0,33l + kleine Pommes", price: 9.50, badge: "Mo-Fr bis 14:30", img: "🔥" },
  { id: "a2", cat: "angebote", name: "Familien-Box", desc: "4× Döner Tasche, große Pommes, 1,5l Cola", price: 34.90, badge: "Bestseller", img: "👨‍👩‍👧‍👦" },
  { id: "a3", cat: "angebote", name: "Bro's Combo", desc: "Döner Dürüm + Ayran + Baklava", price: 12.00, img: "⭐" },

  // DÖNER
  { id: "d1", cat: "doner", name: "Döner Tasche", desc: "Fladenbrot, Salat, Soße nach Wahl", price: 7.00, img: "🥙" },
  { id: "d2", cat: "doner", name: "Döner Dürüm", desc: "Gerolltes Yufka mit Fleisch, Salat, Soße", price: 7.50, img: "🌯" },
  { id: "d3", cat: "doner", name: "Jumbo Döner Dürüm", desc: "XXL-Rolle, doppelte Portion Fleisch", price: 10.00, badge: "XXL", img: "🌯" },
  { id: "d4", cat: "doner", name: "Döner Teller", desc: "Fleisch, Salat, Reis oder Pommes, Fladenbrot", price: 12.50, img: "🍽️" },
  { id: "d5", cat: "doner", name: "Döner Box", desc: "Pommes mit Dönerfleisch, Käse & Soße", price: 8.50, img: "📦" },
  { id: "d6", cat: "doner", name: "XXL Döner", desc: "Extra-großes Fladenbrot, reichlich Fleisch", price: 9.50, badge: "XXL", img: "🥙" },

  // VEGAN
  { id: "v1", cat: "vegan", name: "Vegan Döner Tasche", desc: "Veganes Dönerfleisch vom Spieß, vegane Soßen", price: 7.50, badge: "Nur in Coesfeld", img: "🌱" },
  { id: "v2", cat: "vegan", name: "Vegan Dürüm", desc: "Yufka-Rolle mit veganem Spießfleisch", price: 8.00, badge: "Vegan", img: "🌱" },
  { id: "v3", cat: "vegan", name: "Vegan Box", desc: "Pommes, veganes Fleisch, vegane Soße", price: 9.00, badge: "Vegan", img: "📦" },
  { id: "v4", cat: "vegan", name: "Vegan Teller", desc: "Veganes Fleisch, Reis/Pommes, Salat", price: 12.50, badge: "Vegan", img: "🍽️" },
  { id: "v5", cat: "vegan", name: "Falafel Dürüm", desc: "Hausgemachte Falafel, Hummus, Salat", price: 8.50, badge: "Vegan", img: "🧆" },

  // BURGER
  { id: "b1", cat: "burger", name: "Döner Burger", desc: "Brioche-Bun, Dönerfleisch, Salat", price: 5.00, img: "🍔" },
  { id: "b2", cat: "burger", name: "Cheese Döner Burger", desc: "Mit doppeltem Cheddar", price: 6.50, img: "🍔" },
  { id: "b3", cat: "burger", name: "Bros Classic", desc: "200g Rindfleisch-Patty, Salat, Bros-Sauce", price: 9.00, img: "🍔" },
  { id: "b4", cat: "burger", name: "Bros BBQ", desc: "Rindfleisch, Bacon, Cheddar, BBQ-Sauce", price: 10.50, img: "🍔" },

  // BOWLS & SALATE
  { id: "bw1", cat: "bowls", name: "Döner Bowl", desc: "Reis, Dönerfleisch, Rucola, Sesam, Soße", price: 10.50, img: "🥗" },
  { id: "bw2", cat: "bowls", name: "Falafel Bowl", desc: "Quinoa, Falafel, Hummus, Salat, Tahini", price: 9.50, badge: "Vegan", img: "🥗" },
  { id: "bw3", cat: "bowls", name: "Chicken Bowl", desc: "Hähnchenbrust, Bulgur, Rucola, Feta", price: 10.00, img: "🥗" },
  { id: "bw4", cat: "bowls", name: "Gemischter Salat", desc: "Blattsalat, Tomate, Gurke, Zwiebel, Dressing", price: 6.50, img: "🥗" },
  { id: "bw5", cat: "bowls", name: "Salat mit Hähnchen", desc: "Großer Salatteller mit gegrilltem Hähnchen", price: 10.50, img: "🥗" },

  // PIZZA
  { id: "p1", cat: "pizza", name: "Margherita", desc: "Tomaten, Mozzarella, Basilikum", price: 8.00, img: "🍕" },
  { id: "p2", cat: "pizza", name: "Salami", desc: "Tomaten, Mozzarella, italienische Salami", price: 9.00, img: "🍕" },
  { id: "p3", cat: "pizza", name: "Bros Spezial", desc: "Dönerfleisch, Zwiebel, Paprika, Knoblauch", price: 11.50, badge: "Signature", img: "🍕" },
  { id: "p4", cat: "pizza", name: "Tonno", desc: "Tomaten, Mozzarella, Thunfisch, Zwiebel", price: 10.00, img: "🍕" },
  { id: "p5", cat: "pizza", name: "Vegetaria", desc: "Paprika, Champignon, Oliven, Mais", price: 9.50, img: "🍕" },

  // PIDE & LAHMACUN
  { id: "pl1", cat: "pide", name: "Lahmacun Klassisch", desc: "Dünne türkische Pizza mit Hackfleisch", price: 4.50, img: "🫓" },
  { id: "pl2", cat: "pide", name: "Lahmacun Döner", desc: "Mit Dönerfleisch, Salat und Soße", price: 8.50, img: "🫓" },
  { id: "pl3", cat: "pide", name: "Pide Käse", desc: "Schiffchenform, Schafskäse, Ei", price: 9.00, img: "🫓" },
  { id: "pl4", cat: "pide", name: "Pide Hackfleisch", desc: "Mit gewürztem Hackfleisch und Käse", price: 10.00, img: "🫓" },
  { id: "pl5", cat: "pide", name: "Pide Spinat", desc: "Spinat, Schafskäse, Gewürze", price: 9.50, img: "🫓" },

  // PASTA
  { id: "ps1", cat: "pasta", name: "Tagliatelle Bolognese", desc: "Hausgemachte Bolognese-Sauce", price: 10.50, img: "🍝" },
  { id: "ps2", cat: "pasta", name: "Tagliatelle Carbonara", desc: "Speck, Eigelb, Pecorino", price: 11.00, img: "🍝" },
  { id: "ps3", cat: "pasta", name: "Penne Arrabbiata", desc: "Scharfe Tomatensauce, Knoblauch", price: 9.50, badge: "Scharf", img: "🍝" },

  // BEILAGEN
  { id: "s1", cat: "beilagen", name: "Pommes Frites", desc: "Klein / Mittel / Groß", price: 3.50, img: "🍟" },
  { id: "s2", cat: "beilagen", name: "Pommes Spezial", desc: "Mit Mayo, Ketchup und Käse", price: 5.00, img: "🍟" },
  { id: "s3", cat: "beilagen", name: "Portion Dönerfleisch", desc: "Extra Portion vom Spieß", price: 7.00, img: "🍖" },
  { id: "s4", cat: "beilagen", name: "Falafel 6 Stk.", desc: "Hausgemacht, vegan", price: 5.00, badge: "Vegan", img: "🧆" },
  { id: "s5", cat: "beilagen", name: "Fladenbrot", desc: "Frisch aus dem Steinofen", price: 1.50, img: "🍞" },

  // GETRÄNKE
  { id: "g1", cat: "getranke", name: "Coca-Cola 0,33l", desc: "", price: 2.50, img: "🥤" },
  { id: "g2", cat: "getranke", name: "Fanta 0,33l", desc: "", price: 2.50, img: "🥤" },
  { id: "g3", cat: "getranke", name: "Sprite 0,33l", desc: "", price: 2.50, img: "🥤" },
  { id: "g4", cat: "getranke", name: "Cola Zero 0,33l", desc: "", price: 2.50, img: "🥤" },
  { id: "g5", cat: "getranke", name: "Wasser 0,5l", desc: "Still oder sprudelnd", price: 2.00, img: "💧" },
  { id: "g6", cat: "getranke", name: "Ayran 0,25l", desc: "Türkisches Joghurtgetränk", price: 2.00, img: "🥛" },
  { id: "g7", cat: "getranke", name: "Çay", desc: "Türkischer Tee", price: 2.00, img: "☕" },
  { id: "g8", cat: "getranke", name: "Cola 1,5l", desc: "", price: 4.50, img: "🥤" },

  // DESSERTS
  { id: "de1", cat: "dessert", name: "Baklava (3 Stk.)", desc: "Hausgemacht mit Pistazien", price: 4.50, img: "🍯" },
  { id: "de2", cat: "dessert", name: "Künefe", desc: "Warmer Käsekuchen mit Sirup", price: 6.50, img: "🧀" },
  { id: "de3", cat: "dessert", name: "Kuchen des Tages", desc: "Fragen Sie unser Team", price: 4.00, img: "🍰" },
];

const CATS = [
  { id: "angebote", name: "Angebote", icon: "🔥" },
  { id: "doner", name: "Döner", icon: "🥙" },
  { id: "vegan", name: "Vegan", icon: "🌱" },
  { id: "burger", name: "Burger", icon: "🍔" },
  { id: "bowls", name: "Bowls & Salate", icon: "🥗" },
  { id: "pizza", name: "Pizza", icon: "🍕" },
  { id: "pide", name: "Pide & Lahmacun", icon: "🫓" },
  { id: "pasta", name: "Pasta", icon: "🍝" },
  { id: "beilagen", name: "Beilagen", icon: "🍟" },
  { id: "getranke", name: "Getränke", icon: "🥤" },
  { id: "dessert", name: "Dessert", icon: "🍯" },
];

const SAUCES = ["Knoblauch", "Cocktail", "Scharf", "Kräuter", "Tzatziki", "BBQ", "Ohne Soße"];

const EUR = (n) => n.toFixed(2).replace(".", ",") + " €";
const uid = () => "BRO-" + Math.random().toString(36).slice(2, 6).toUpperCase() + "-" + Date.now().toString().slice(-4);

/* ---------- STORAGE-HELPER (persistente "Datenbank") ---------- */
const db = {
  async get(key, fallback = null) {
    try {
      const r = await window.storage.get(key);
      return r ? JSON.parse(r.value) : fallback;
    } catch { return fallback; }
  },
  async set(key, value) {
    try { await window.storage.set(key, JSON.stringify(value)); return true; }
    catch { return false; }
  },
};

/* ---------- ÖFFNUNGSZEITEN-LOGIK ---------- */
function getOpenStatus() {
  const now = new Date();
  const day = now.getDay(); // 0=So, 1=Mo ... 6=Sa
  const minutes = now.getHours() * 60 + now.getMinutes();
  // Mo-Fr (1-5): 11:30-21:30 | Sa-So (6,0): 13:00-21:30
  const weekend = day === 0 || day === 6;
  const open = weekend ? 13 * 60 : 11 * 60 + 30;
  const close = 21 * 60 + 30;
  const isOpen = minutes >= open && minutes < close;
  let nextChange;
  if (isOpen) {
    const mins = close - minutes;
    nextChange = `Schließt in ${Math.floor(mins / 60)}h ${mins % 60}min`;
  } else {
    const tomorrow = (day + 1) % 7;
    const tomorrowWeekend = tomorrow === 0 || tomorrow === 6;
    const openingTime = tomorrowWeekend ? "13:00" : "11:30";
    nextChange = minutes < open ? `Öffnet heute um ${weekend ? "13:00" : "11:30"}` : `Öffnet morgen um ${openingTime}`;
  }
  return { isOpen, nextChange };
}

/* =========================================================================
   HAUPT-KOMPONENTE
   ========================================================================= */
export default function App() {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeCat, setActiveCat] = useState("angebote");
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutStage, setCheckoutStage] = useState(null); // null | 'form' | 'confirm' | 'done'
  const [lastOrder, setLastOrder] = useState(null);
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [view, setView] = useState("shop"); // shop | orders | admin | about
  const [adminAuth, setAdminAuth] = useState(false);
  const [openStatus, setOpenStatus] = useState(getOpenStatus());
  const [toast, setToast] = useState(null);

  // Initial load aus "DB"
  useEffect(() => {
    (async () => {
      let m = await db.get("bros:menu");
      if (!m) { await db.set("bros:menu", SEED_MENU); m = SEED_MENU; }
      setMenu(m);
      setCart(await db.get("bros:cart", []));
      setOrders(await db.get("bros:orders", []));
      setFavorites(await db.get("bros:favs", []));
    })();
  }, []);

  // Live-Status jede Minute aktualisieren
  useEffect(() => {
    const t = setInterval(() => setOpenStatus(getOpenStatus()), 60000);
    return () => clearInterval(t);
  }, []);

  // Cart persistieren
  useEffect(() => { db.set("bros:cart", cart); }, [cart]);
  useEffect(() => { db.set("bros:favs", favorites); }, [favorites]);

  // Toast-Helfer
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  // Cart-Funktionen
  const addToCart = (item, sauce = "Knoblauch") => {
    setCart((c) => {
      const existing = c.find((i) => i.id === item.id && i.sauce === sauce);
      if (existing) return c.map((i) => i === existing ? { ...i, qty: i.qty + 1 } : i);
      return [...c, { ...item, sauce, qty: 1, lineId: Math.random().toString(36).slice(2) }];
    });
    showToast(`✓ ${item.name} hinzugefügt`);
  };
  const updateQty = (lineId, delta) => {
    setCart((c) => c.map((i) => i.lineId === lineId ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter((i) => i.qty > 0));
  };
  const removeLine = (lineId) => setCart((c) => c.filter((i) => i.lineId !== lineId));
  const clearCart = () => setCart([]);

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const toggleFav = (id) => {
    setFavorites((f) => f.includes(id) ? f.filter(x => x !== id) : [...f, id]);
  };

  const filteredMenu = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return menu;
    return menu.filter((i) => i.name.toLowerCase().includes(s) || i.desc.toLowerCase().includes(s));
  }, [menu, search]);

  const byCategory = useCallback((catId) => {
    const items = search ? filteredMenu : menu;
    return items.filter((i) => i.cat === catId);
  }, [menu, filteredMenu, search]);

  // Bestellung abschließen
  const placeOrder = async (formData) => {
    const order = {
      id: uid(),
      items: cart,
      subtotal,
      delivery: formData.mode === "lieferung",
      fee: 0,
      total: subtotal,
      customer: formData,
      status: "Eingegangen",
      createdAt: Date.now(),
    };
    const newOrders = [order, ...orders];
    setOrders(newOrders);
    await db.set("bros:orders", newOrders);
    setLastOrder(order);
    setCart([]);
    setCheckoutStage("done");
  };

  return (
    <div className="min-h-screen bg-[#FDF9F1] text-[#1A1816]" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <FontStyles />
      <GrainOverlay />

      <Header
        cartCount={cartCount}
        onCart={() => setCartOpen(true)}
        onNav={setView}
        view={view}
        openStatus={openStatus}
      />

      {toast && <Toast msg={toast} />}

      {view === "shop" && (
        <>
          <Hero openStatus={openStatus} />
          <InfoStrip />
          <MenuSection
            cats={CATS}
            activeCat={activeCat}
            setActiveCat={setActiveCat}
            byCategory={byCategory}
            onAdd={addToCart}
            search={search}
            setSearch={setSearch}
            favorites={favorites}
            toggleFav={toggleFav}
          />
          <AboutSection />
        </>
      )}

      {view === "orders" && <OrdersView orders={orders.filter(o => o.customer?.email)} />}

      {view === "admin" && (
        adminAuth
          ? <AdminView orders={orders} />
          : <AdminLogin onAuth={() => setAdminAuth(true)} />
      )}

      {view === "about" && <AboutFull />}

      <Footer onNav={setView} />

      {cartOpen && (
        <CartDrawer
          cart={cart}
          subtotal={subtotal}
          onClose={() => setCartOpen(false)}
          onUpdate={updateQty}
          onRemove={removeLine}
          onClear={clearCart}
          onCheckout={() => { setCartOpen(false); setCheckoutStage("form"); }}
          openStatus={openStatus}
        />
      )}

      {checkoutStage === "form" && (
        <CheckoutModal
          subtotal={subtotal}
          cart={cart}
          onClose={() => setCheckoutStage(null)}
          onSubmit={placeOrder}
        />
      )}

      {checkoutStage === "done" && lastOrder && (
        <OrderConfirmation order={lastOrder} onClose={() => { setCheckoutStage(null); setLastOrder(null); }} />
      )}
    </div>
  );
}

/* =========================================================================
   FONT & TEXTURE
   ========================================================================= */
const FontStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Anton&family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
    .font-display { font-family: 'Anton', Impact, sans-serif; letter-spacing: 0.01em; }
    .font-serif { font-family: 'Instrument Serif', serif; }
    .font-body { font-family: 'DM Sans', system-ui, sans-serif; }
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    @keyframes slideInR { from { transform: translateX(100%); } to { transform: translateX(0); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes pulse-soft { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
    .anim-up { animation: slideUp 0.5s ease-out; }
    .anim-in-r { animation: slideInR 0.35s ease-out; }
    .anim-fade { animation: fadeIn 0.25s ease-out; }
    .pulse-dot { animation: pulse-soft 2s infinite; }
    .grain::before {
      content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 100;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E");
      opacity: 0.08; mix-blend-mode: multiply;
    }
    html { scroll-behavior: smooth; }
    ::-webkit-scrollbar { width: 10px; height: 10px; }
    ::-webkit-scrollbar-track { background: #F4EFE3; }
    ::-webkit-scrollbar-thumb { background: #171413; border-radius: 4px; }
  `}</style>
);

const GrainOverlay = () => <div className="grain" />;

/* =========================================================================
   HEADER
   ========================================================================= */
function Header({ cartCount, onCart, onNav, view, openStatus }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const nav = [
    { id: "shop", label: "Speisekarte", icon: Home },
    { id: "orders", label: "Bestellungen", icon: Package },
    { id: "about", label: "Über Uns", icon: ShieldCheck },
  ];
  return (
    <header className="sticky top-0 z-40 bg-[#171413] text-[#FDF9F1] border-b-4 border-[#C1292E]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 md:h-20 flex items-center justify-between gap-4">
        {/* Logo */}
        <button onClick={() => onNav("shop")} className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-[#C1292E] flex items-center justify-center -rotate-6 group-hover:rotate-0 transition">
            <Flame className="w-5 h-5 md:w-6 md:h-6 text-[#F2B544]" />
          </div>
          <div className="leading-none">
            <div className="font-display text-2xl md:text-3xl tracking-wide">KEBAB BRO'S</div>
            <div className="text-[10px] md:text-[11px] opacity-70 tracking-[0.2em] -mt-0.5">COESFELD · MARKT 3</div>
          </div>
        </button>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {nav.map((n) => (
            <button key={n.id} onClick={() => onNav(n.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${view === n.id ? "bg-[#FDF9F1] text-[#171413]" : "text-[#FDF9F1]/80 hover:text-[#FDF9F1] hover:bg-white/10"}`}>
              {n.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <OpenBadge openStatus={openStatus} />
          <button onClick={onCart}
            className="relative px-3 md:px-5 py-2 md:py-2.5 bg-[#C1292E] hover:bg-[#a62026] rounded-full flex items-center gap-2 transition group">
            <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden md:inline text-sm font-semibold">Warenkorb</span>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-[#F2B544] text-[#171413] rounded-full text-xs font-bold flex items-center justify-center pulse-dot">
                {cartCount}
              </span>
            )}
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2">
            <MenuIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#171413] anim-fade">
          {nav.map((n) => (
            <button key={n.id} onClick={() => { onNav(n.id); setMobileOpen(false); }}
              className="w-full px-6 py-3 text-left text-sm border-b border-white/5 hover:bg-white/5 flex items-center gap-3">
              <n.icon className="w-4 h-4" /> {n.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

function OpenBadge({ openStatus }) {
  return (
    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full">
      <span className={`w-2 h-2 rounded-full ${openStatus.isOpen ? "bg-green-400 pulse-dot" : "bg-red-400"}`} />
      <span className="text-xs font-medium">{openStatus.isOpen ? "Jetzt geöffnet" : "Geschlossen"}</span>
    </div>
  );
}

/* =========================================================================
   HERO
   ========================================================================= */
function Hero({ openStatus }) {
  return (
    <section className="relative overflow-hidden bg-[#171413] text-[#FDF9F1]">
      {/* Deko */}
      <div className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#C1292E]/40 via-[#F2B544]/20 to-transparent blur-3xl" />
      <div className="absolute -bottom-40 -left-20 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#F2B544]/10 to-transparent blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-28 grid md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-7 anim-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#C1292E] rounded-full text-xs tracking-widest uppercase mb-6">
            <Flame className="w-3.5 h-3.5" /> Street-Food vom Marktplatz
          </div>
          <h1 className="font-display text-[14vw] md:text-[8rem] leading-[0.85] tracking-tight">
            BAM. <br />
            <span className="text-[#F2B544]">DÖNER.</span><br />
            <span className="italic font-serif normal-case text-[12vw] md:text-[7rem] font-normal">Bro's Art.</span>
          </h1>
          <p className="mt-8 text-lg md:text-xl max-w-xl opacity-80 leading-relaxed">
            Prall gefüllte Döner, saftige Spieße, knuspriges Brot – und die einzige <span className="text-[#F2B544] font-semibold">vegane Dönerauswahl</span> in Coesfeld. Direkt bestellen, in 15 Min. abholen.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href="#menu" className="px-7 py-4 bg-[#C1292E] hover:bg-[#a62026] rounded-full font-semibold flex items-center gap-2 transition">
              Jetzt bestellen <ArrowRight className="w-4 h-4" />
            </a>
            <a href="tel:+4925418444390" className="px-7 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full font-semibold flex items-center gap-2 transition">
              <Phone className="w-4 h-4" /> 02541 8444390
            </a>
          </div>
          <div className="mt-10 flex items-center gap-6 text-sm opacity-70">
            <div className="flex items-center gap-1.5">
              {[1,2,3,4,5].map((i) => <Star key={i} className="w-4 h-4 fill-[#F2B544] text-[#F2B544]" />)}
              <span className="ml-2">4,9 / 5 auf Google</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5"><Truck className="w-4 h-4" /> Lieferung ab 15 €</div>
          </div>
        </div>

        {/* Plate visual */}
        <div className="md:col-span-5 relative hidden md:block">
          <div className="relative w-full aspect-square">
            {/* Plate */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#F2B544] via-[#e09d2f] to-[#C1292E] shadow-2xl" />
            <div className="absolute inset-4 rounded-full bg-[#171413] border-[3px] border-[#F2B544]/30" />
            {/* Emoji food */}
            <div className="absolute inset-0 flex items-center justify-center text-[14rem]">🥙</div>
            {/* Floating badges */}
            <div className="absolute -top-4 -left-4 px-4 py-2 bg-[#FDF9F1] text-[#171413] rounded-full rotate-[-8deg] shadow-xl font-display text-2xl">
              FRISCH!
            </div>
            <div className="absolute bottom-8 -right-4 px-4 py-2 bg-[#C1292E] text-[#FDF9F1] rounded-full rotate-[12deg] shadow-xl">
              <Leaf className="w-4 h-4 inline mr-1" /> VEGAN
            </div>
            <div className="absolute -bottom-2 left-10 px-4 py-2 bg-[#F2B544] text-[#171413] rounded-full rotate-[-4deg] shadow-xl font-semibold text-sm">
              Nur in Coesfeld
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   INFO STRIP
   ========================================================================= */
function InfoStrip() {
  return (
    <div className="bg-[#C1292E] text-[#FDF9F1] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-wrap items-center justify-between gap-4 text-sm">
        <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Markt 3, 48653 Coesfeld</div>
        <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> Mo-Fr 11:30-21:30 · Sa-So 13:00-21:30</div>
        <div className="flex items-center gap-2"><Truck className="w-4 h-4" /> Mindestbestellwert Coesfeld 15 € · außerhalb 25 €</div>
        <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> 02541 8444390</div>
      </div>
    </div>
  );
}

/* =========================================================================
   MENU SECTION
   ========================================================================= */
function MenuSection({ cats, activeCat, setActiveCat, byCategory, onAdd, search, setSearch, favorites, toggleFav }) {
  return (
    <section id="menu" className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="text-sm font-medium text-[#C1292E] tracking-[0.3em] uppercase mb-3">Die Speisekarte</div>
          <h2 className="font-display text-6xl md:text-8xl leading-[0.9]">
            Was <span className="font-serif italic font-normal normal-case">willst du</span>,<br />Bro?
          </h2>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6460]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Gericht suchen..."
            className="w-full pl-11 pr-4 py-3 bg-white border-2 border-[#171413] rounded-full text-sm focus:outline-none focus:ring-4 focus:ring-[#C1292E]/20 focus:border-[#C1292E]"
          />
        </div>
      </div>

      {/* Category tabs */}
      <div className="sticky top-16 md:top-20 z-20 -mx-4 md:-mx-8 px-4 md:px-8 py-4 bg-[#FDF9F1]/95 backdrop-blur-md border-b border-[#171413]/10">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {cats.map((c) => (
            <button key={c.id} onClick={() => {
              setActiveCat(c.id);
              document.getElementById(`cat-${c.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
              className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition flex items-center gap-2 ${activeCat === c.id ? "bg-[#171413] text-[#FDF9F1]" : "bg-white border border-[#171413]/15 hover:border-[#171413]"}`}>
              <span>{c.icon}</span>
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12 space-y-16">
        {cats.map((c) => {
          const items = byCategory(c.id);
          if (!items.length) return null;
          return (
            <div key={c.id} id={`cat-${c.id}`} className="scroll-mt-32">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl">{c.icon}</span>
                <h3 className="font-display text-4xl md:text-5xl">{c.name.toUpperCase()}</h3>
                <div className="flex-1 h-px bg-[#171413]/15" />
                <span className="text-sm text-[#6B6460]">{items.length} {items.length === 1 ? "Gericht" : "Gerichte"}</span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {items.map((item) => (
                  <ProductCard
                    key={item.id}
                    item={item}
                    onAdd={onAdd}
                    isFav={favorites.includes(item.id)}
                    onFav={() => toggleFav(item.id)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ProductCard({ item, onAdd, isFav, onFav }) {
  const [sauce, setSauce] = useState(SAUCES[0]);
  const [open, setOpen] = useState(false);
  const needsSauce = ["doner", "vegan", "burger", "bowls"].includes(item.cat);

  return (
    <article className="group bg-white rounded-2xl border-2 border-[#171413]/10 hover:border-[#171413] transition overflow-hidden flex flex-col">
      <div className="relative aspect-[5/3] bg-gradient-to-br from-[#F4EFE3] to-[#e6dcc8] flex items-center justify-center overflow-hidden">
        <div className="text-8xl group-hover:scale-110 transition duration-500">{item.img}</div>
        {item.badge && (
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#C1292E] text-[#FDF9F1] rounded-full text-[10px] font-bold tracking-wider uppercase">
            {item.badge}
          </span>
        )}
        <button onClick={onFav}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur transition ${isFav ? "bg-[#C1292E] text-white" : "bg-white/80 text-[#171413] hover:bg-white"}`}>
          <Heart className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} />
        </button>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-1">
          <h4 className="font-display text-xl tracking-wide leading-tight">{item.name}</h4>
          <span className="font-display text-xl text-[#C1292E]">{EUR(item.price)}</span>
        </div>
        {item.desc && <p className="text-sm text-[#6B6460] leading-relaxed">{item.desc}</p>}

        {needsSauce && open && (
          <div className="mt-4 anim-fade">
            <label className="text-xs font-semibold tracking-wider uppercase text-[#6B6460]">Soße wählen</label>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {SAUCES.map((s) => (
                <button key={s} onClick={() => setSauce(s)}
                  className={`px-3 py-1 text-xs rounded-full border transition ${sauce === s ? "bg-[#171413] text-[#FDF9F1] border-[#171413]" : "bg-white border-[#171413]/15 hover:border-[#171413]"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-5 flex items-center gap-2">
          {needsSauce && !open ? (
            <button onClick={() => setOpen(true)}
              className="flex-1 py-2.5 bg-[#FDF9F1] hover:bg-[#F4EFE3] border-2 border-[#171413] rounded-full text-sm font-semibold transition flex items-center justify-center gap-2">
              Anpassen <ChevronDown className="w-4 h-4" />
            </button>
          ) : null}
          <button onClick={() => { onAdd(item, sauce); setOpen(false); }}
            className="flex-1 py-2.5 bg-[#171413] hover:bg-[#C1292E] text-[#FDF9F1] rounded-full text-sm font-semibold transition flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Hinzufügen
          </button>
        </div>
      </div>
    </article>
  );
}

/* =========================================================================
   CART DRAWER
   ========================================================================= */
function CartDrawer({ cart, subtotal, onClose, onUpdate, onRemove, onClear, onCheckout, openStatus }) {
  const [deliveryMode, setDeliveryMode] = useState("abholung");
  const minOrder = deliveryMode === "lieferung" ? 15 : 0;
  const canCheckout = cart.length > 0 && subtotal >= minOrder;
  const toMin = Math.max(0, minOrder - subtotal);

  return (
    <div className="fixed inset-0 z-50 flex justify-end anim-fade">
      <div onClick={onClose} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <aside className="relative w-full max-w-md bg-[#FDF9F1] h-full flex flex-col anim-in-r shadow-2xl">
        <div className="p-6 bg-[#171413] text-[#FDF9F1] flex items-center justify-between">
          <div>
            <div className="text-xs tracking-widest opacity-60 uppercase">Dein Warenkorb</div>
            <div className="font-display text-2xl mt-1">{cart.length} {cart.length === 1 ? "Position" : "Positionen"}</div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-5 border-b border-[#171413]/10 bg-white">
          <div className="grid grid-cols-2 gap-2 bg-[#F4EFE3] p-1 rounded-full">
            <button onClick={() => setDeliveryMode("abholung")}
              className={`py-2.5 rounded-full text-sm font-semibold transition flex items-center justify-center gap-2 ${deliveryMode === "abholung" ? "bg-[#171413] text-[#FDF9F1]" : ""}`}>
              <Store className="w-4 h-4" /> Abholung
            </button>
            <button onClick={() => setDeliveryMode("lieferung")}
              className={`py-2.5 rounded-full text-sm font-semibold transition flex items-center justify-center gap-2 ${deliveryMode === "lieferung" ? "bg-[#171413] text-[#FDF9F1]" : ""}`}>
              <Truck className="w-4 h-4" /> Lieferung
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {cart.length === 0 && (
            <div className="py-20 text-center text-[#6B6460]">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="font-medium">Noch nichts ausgewählt</p>
              <p className="text-sm mt-1">Zurück zur Speisekarte und loslegen.</p>
            </div>
          )}
          {cart.map((item) => (
            <div key={item.lineId} className="bg-white rounded-xl p-4 border border-[#171413]/10 flex gap-3">
              <div className="text-4xl flex items-center">{item.img}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-semibold leading-tight truncate">{item.name}</div>
                    {item.sauce && <div className="text-xs text-[#6B6460] mt-0.5">Soße: {item.sauce}</div>}
                  </div>
                  <button onClick={() => onRemove(item.lineId)} className="text-[#6B6460] hover:text-[#C1292E] p-1">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-[#F4EFE3] rounded-full p-1">
                    <button onClick={() => onUpdate(item.lineId, -1)} className="w-7 h-7 rounded-full bg-white hover:bg-[#171413] hover:text-white flex items-center justify-center"><Minus className="w-3 h-3" /></button>
                    <span className="w-6 text-center text-sm font-semibold">{item.qty}</span>
                    <button onClick={() => onUpdate(item.lineId, 1)} className="w-7 h-7 rounded-full bg-white hover:bg-[#171413] hover:text-white flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                  </div>
                  <div className="font-semibold">{EUR(item.price * item.qty)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-[#171413]/10 bg-white p-5 space-y-3">
            {deliveryMode === "lieferung" && toMin > 0 && (
              <div className="p-3 bg-[#F2B544]/20 border border-[#F2B544] rounded-xl text-sm">
                Noch <strong>{EUR(toMin)}</strong> bis zum Mindestbestellwert für Lieferung.
                <div className="mt-2 h-1.5 bg-white rounded-full overflow-hidden">
                  <div className="h-full bg-[#C1292E]" style={{ width: `${Math.min(100, (subtotal / 15) * 100)}%` }} />
                </div>
              </div>
            )}
            <div className="flex items-center justify-between text-sm text-[#6B6460]">
              <span>Zwischensumme</span>
              <span>{EUR(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between font-display text-2xl">
              <span>Gesamt</span>
              <span className="text-[#C1292E]">{EUR(subtotal)}</span>
            </div>
            <button onClick={onCheckout} disabled={!canCheckout}
              className="w-full py-4 bg-[#171413] hover:bg-[#C1292E] disabled:bg-[#6B6460] disabled:cursor-not-allowed text-[#FDF9F1] rounded-full font-semibold transition flex items-center justify-center gap-2">
              Zur Kasse <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={onClear} className="w-full text-xs text-[#6B6460] hover:text-[#C1292E] py-1">Warenkorb leeren</button>
          </div>
        )}
      </aside>
    </div>
  );
}

/* =========================================================================
   CHECKOUT
   ========================================================================= */
function CheckoutModal({ subtotal, cart, onClose, onSubmit }) {
  const [form, setForm] = useState({
    mode: "abholung",
    name: "",
    phone: "",
    email: "",
    street: "",
    plz: "",
    city: "Coesfeld",
    payment: "bar",
    notes: "",
  });
  const minOrder = form.mode === "lieferung" ? (form.plz === "48653" ? 15 : 25) : 0;
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name fehlt";
    if (!/^[0-9+\s\-()]{6,}$/.test(form.phone)) e.phone = "Telefonnummer prüfen";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "E-Mail ungültig";
    if (form.mode === "lieferung") {
      if (!form.street.trim()) e.street = "Straße fehlt";
      if (!/^\d{5}$/.test(form.plz)) e.plz = "5-stellige PLZ";
      if (subtotal < minOrder) e.min = `Mindestbestellwert ${EUR(minOrder)}`;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 anim-fade">
      <div onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-[#FDF9F1] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl anim-up">
        <div className="sticky top-0 z-10 bg-[#171413] text-[#FDF9F1] px-6 py-5 flex items-center justify-between rounded-t-3xl">
          <div>
            <div className="text-xs tracking-widest uppercase opacity-60">Schritt 2 von 2</div>
            <div className="font-display text-2xl mt-1">Bestellung abschließen</div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-6">
          {/* Modus */}
          <Field label="Wie möchtest du es bekommen?">
            <div className="grid grid-cols-2 gap-3">
              <RadioCard active={form.mode === "abholung"} onClick={() => setForm({ ...form, mode: "abholung" })}
                icon={<Store />} title="Abholung" subtitle="In ca. 15 Min." />
              <RadioCard active={form.mode === "lieferung"} onClick={() => setForm({ ...form, mode: "lieferung" })}
                icon={<Truck />} title="Lieferung" subtitle="In ca. 30-60 Min." />
            </div>
          </Field>

          {/* Kontakt */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Dein Name *" error={errors.name}>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" placeholder="Max Mustermann" />
            </Field>
            <Field label="Telefon *" error={errors.phone}>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input" placeholder="0170 1234567" />
            </Field>
          </div>
          <Field label="E-Mail (für Bestellbestätigung)" error={errors.email}>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" placeholder="du@example.de" />
          </Field>

          {form.mode === "lieferung" && (
            <div className="space-y-4 p-4 bg-white rounded-2xl border-2 border-[#171413]/10 anim-up">
              <div className="text-sm font-semibold">Lieferadresse</div>
              <Field label="Straße & Nr. *" error={errors.street}>
                <input value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} className="input" placeholder="Marktplatz 3" />
              </Field>
              <div className="grid grid-cols-3 gap-3">
                <Field label="PLZ *" error={errors.plz}>
                  <input value={form.plz} onChange={(e) => setForm({ ...form, plz: e.target.value })} className="input" placeholder="48653" maxLength={5} />
                </Field>
                <div className="col-span-2">
                  <Field label="Stadt">
                    <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input" />
                  </Field>
                </div>
              </div>
              <div className="text-xs text-[#6B6460] flex items-start gap-2">
                <Truck className="w-4 h-4 mt-0.5 flex-shrink-0" />
                Mindestbestellwert: Coesfeld (48653) 15 €, außerhalb 25 € – Lieferung kostenfrei.
              </div>
              {errors.min && <div className="text-sm text-[#C1292E] font-semibold">⚠ {errors.min}</div>}
            </div>
          )}

          {/* Payment */}
          <Field label="Zahlungsart">
            <div className="grid grid-cols-2 gap-3">
              <RadioCard active={form.payment === "bar"} onClick={() => setForm({ ...form, payment: "bar" })}
                icon={<Banknote />} title="Barzahlung" subtitle={form.mode === "lieferung" ? "bei Lieferung" : "bei Abholung"} />
              <RadioCard active={form.payment === "paypal"} onClick={() => setForm({ ...form, payment: "paypal" })}
                icon={<CreditCard />} title="PayPal" subtitle="Online sicher" />
            </div>
          </Field>

          <Field label="Anmerkungen (optional)">
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={2} className="input" placeholder="z. B. bitte an der Seitentür klingeln" />
          </Field>

          {/* Summary */}
          <div className="bg-[#171413] text-[#FDF9F1] rounded-2xl p-5">
            <div className="font-display text-lg mb-3">Deine Bestellung</div>
            <div className="space-y-1.5 text-sm opacity-90 max-h-40 overflow-y-auto">
              {cart.map((i) => (
                <div key={i.lineId} className="flex justify-between">
                  <span>{i.qty}× {i.name}</span>
                  <span>{EUR(i.price * i.qty)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 mt-3 pt-3 flex justify-between font-display text-2xl">
              <span>Gesamt</span>
              <span className="text-[#F2B544]">{EUR(subtotal)}</span>
            </div>
          </div>

          <button onClick={submit}
            className="w-full py-4 bg-[#C1292E] hover:bg-[#a62026] text-[#FDF9F1] rounded-full font-semibold text-lg transition flex items-center justify-center gap-2">
            Kostenpflichtig bestellen <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-xs text-center text-[#6B6460]">Mit Klick bestätigst du unsere AGB und Datenschutz.</p>
        </div>

        <style>{`.input { width:100%; padding: 0.75rem 1rem; background:white; border: 2px solid rgba(23,20,19,0.1); border-radius: 0.75rem; font-size: 0.9rem; outline: none; transition: all 0.2s; }
          .input:focus { border-color: #C1292E; box-shadow: 0 0 0 4px rgba(193,41,46,0.1); }`}</style>
      </div>
    </div>
  );
}

const Field = ({ label, error, children }) => (
  <div>
    <label className="block text-xs font-semibold tracking-wider uppercase text-[#6B6460] mb-1.5">{label}</label>
    {children}
    {error && <div className="text-xs text-[#C1292E] mt-1 font-semibold">⚠ {error}</div>}
  </div>
);

const RadioCard = ({ active, onClick, icon, title, subtitle }) => (
  <button onClick={onClick}
    className={`p-4 rounded-xl border-2 transition text-left flex items-center gap-3 ${active ? "border-[#C1292E] bg-[#C1292E]/5" : "border-[#171413]/10 bg-white hover:border-[#171413]/40"}`}>
    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${active ? "bg-[#C1292E] text-white" : "bg-[#F4EFE3]"}`}>
      {React.cloneElement(icon, { className: "w-5 h-5" })}
    </div>
    <div>
      <div className="font-semibold text-sm">{title}</div>
      <div className="text-xs text-[#6B6460]">{subtitle}</div>
    </div>
    {active && <Check className="w-5 h-5 ml-auto text-[#C1292E]" />}
  </button>
);

/* =========================================================================
   ORDER CONFIRMATION
   ========================================================================= */
function OrderConfirmation({ order, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 anim-fade">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
      <div className="relative bg-[#FDF9F1] rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl anim-up">
        <div className="p-8 text-center bg-[#171413] text-[#FDF9F1] relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-[#F2B544]/20 blur-2xl" />
          <div className="relative">
            <div className="w-20 h-20 mx-auto bg-[#F2B544] rounded-full flex items-center justify-center mb-5 pulse-dot">
              <Check className="w-10 h-10 text-[#171413]" strokeWidth={3} />
            </div>
            <div className="font-display text-4xl">Merci, Bro!</div>
            <p className="opacity-80 mt-2">Deine Bestellung ist bei uns eingegangen</p>
          </div>
        </div>
        <div className="p-7 space-y-5">
          <div className="p-4 bg-white rounded-xl border-2 border-dashed border-[#171413]/20 text-center">
            <div className="text-xs tracking-widest uppercase text-[#6B6460]">Bestellnummer</div>
            <div className="font-display text-3xl mt-1 text-[#C1292E]">{order.id}</div>
          </div>
          <div className="space-y-2 text-sm">
            <Row label="Name" value={order.customer.name} />
            <Row label="Modus" value={order.delivery ? "Lieferung" : "Abholung"} />
            <Row label="Zahlung" value={order.customer.payment === "paypal" ? "PayPal" : "Barzahlung"} />
            <Row label="Summe" value={<strong className="text-[#C1292E]">{EUR(order.total)}</strong>} />
            <Row label="Geschätzte Zeit" value={order.delivery ? "30–60 Min." : "ca. 15 Min."} />
          </div>
          <div className="p-4 bg-[#F2B544]/20 border border-[#F2B544] rounded-xl text-sm flex gap-3">
            <Phone className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              Fragen? Ruf uns an: <strong className="block">02541 8444390</strong>
            </div>
          </div>
          <button onClick={onClose}
            className="w-full py-4 bg-[#171413] hover:bg-[#C1292E] text-[#FDF9F1] rounded-full font-semibold transition">
            Zurück zur Speisekarte
          </button>
        </div>
      </div>
    </div>
  );
}

const Row = ({ label, value }) => (
  <div className="flex justify-between py-1.5 border-b border-[#171413]/10 last:border-0">
    <span className="text-[#6B6460]">{label}</span>
    <span>{value}</span>
  </div>
);

/* =========================================================================
   ABOUT + FULL ABOUT
   ========================================================================= */
function AboutSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
      <div className="grid md:grid-cols-12 gap-10 items-center">
        <div className="md:col-span-5">
          <div className="relative aspect-[4/5] bg-[#171413] rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#C1292E] via-transparent to-[#F2B544]/40" />
            <div className="absolute inset-0 flex items-center justify-center text-[16rem]">🔥</div>
            <div className="absolute bottom-6 left-6 right-6 bg-[#FDF9F1] rounded-xl p-4">
              <div className="text-xs tracking-widest uppercase text-[#6B6460]">Seit Tag 1</div>
              <div className="font-display text-2xl mt-1">Hochwertiges Fleisch & frische Zutaten</div>
            </div>
          </div>
        </div>
        <div className="md:col-span-7">
          <div className="text-sm font-medium text-[#C1292E] tracking-[0.3em] uppercase mb-3">Unsere Story</div>
          <h2 className="font-display text-5xl md:text-7xl leading-[0.9] mb-6">
            Street-Food-Charme,<br />
            <span className="font-serif italic font-normal normal-case text-4xl md:text-6xl">prall gefüllt, ehrlich gemacht.</span>
          </h2>
          <p className="text-lg text-[#3a3532] leading-relaxed mb-4">
            Mitten auf dem Marktplatz von Coesfeld servieren wir Döner, wie wir ihn selbst lieben: saftiges
            Hähnchen- oder Kalbfleisch vom Spieß, knuspriges Brot, frischer Salat und Soßen, die's bringen.
          </p>
          <p className="text-lg text-[#3a3532] leading-relaxed">
            Und weil wir alle glücklich machen wollen, gibt's bei uns – exklusiv in Coesfeld – veganes
            Spießfleisch, das geschmacklich mithält. Plus Pizza, Pide, Bowls, Pasta und sogar Kuchen.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            <Stat value="4,9" label="Google-Sterne" />
            <Stat value="100%" label="Hausgemacht" />
            <Stat value="15 min" label="Abholzeit" />
          </div>
        </div>
      </div>
    </section>
  );
}

const Stat = ({ value, label }) => (
  <div className="p-4 bg-white rounded-2xl border-2 border-[#171413]/10">
    <div className="font-display text-3xl md:text-4xl text-[#C1292E]">{value}</div>
    <div className="text-xs tracking-wider uppercase text-[#6B6460] mt-1">{label}</div>
  </div>
);

function AboutFull() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-16">
      <h1 className="font-display text-6xl md:text-8xl mb-8">ÜBER UNS</h1>
      <div className="prose prose-lg max-w-none">
        <p className="text-xl leading-relaxed mb-6">
          Willkommen bei <strong>Kebab Bro's</strong> – dem Dönerladen auf dem Marktplatz von Coesfeld.
          Wir sind klein, aber ehrlich: frisches Brot, hochwertiges Fleisch, reichlich Salat und Soßen,
          die nicht zimperlich sind.
        </p>
        <div className="grid md:grid-cols-2 gap-6 my-10">
          <InfoCard icon={<MapPin />} title="Adresse" text="Markt 3, 48653 Coesfeld" />
          <InfoCard icon={<Phone />} title="Telefon" text="02541 8444390" />
          <InfoCard icon={<Mail />} title="E-Mail" text="info@kebab-bros-coesfeld.de" />
          <InfoCard icon={<Clock />} title="Öffnungszeiten" text="Mo-Fr 11:30-21:30, Sa-So 13:00-21:30" />
        </div>
        <h2 className="font-display text-4xl mt-12 mb-4">LIEFERUNG & ABHOLUNG</h2>
        <p>Lieferung innerhalb Coesfeld ab 15 € Mindestbestellwert, außerhalb ab 25 € – kostenfrei. Lieferzeit in der Regel bis 60 Minuten. Abholung in ca. 15 Minuten möglich.</p>
        <h2 className="font-display text-4xl mt-12 mb-4">ZAHLUNG</h2>
        <p>Online: PayPal oder Barzahlung bei Abholung/Lieferung. Vor Ort: Bar, PayPal oder Kartenzahlung.</p>
      </div>
    </div>
  );
}

const InfoCard = ({ icon, title, text }) => (
  <div className="p-5 bg-white rounded-2xl border-2 border-[#171413]/10 flex gap-4">
    <div className="w-12 h-12 rounded-full bg-[#C1292E] text-[#FDF9F1] flex items-center justify-center flex-shrink-0">
      {React.cloneElement(icon, { className: "w-5 h-5" })}
    </div>
    <div>
      <div className="text-xs tracking-wider uppercase text-[#6B6460]">{title}</div>
      <div className="font-semibold mt-1">{text}</div>
    </div>
  </div>
);

/* =========================================================================
   ORDERS VIEW (Kunden-Historie)
   ========================================================================= */
function OrdersView({ orders }) {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-16">
      <h1 className="font-display text-6xl md:text-8xl mb-4">BESTELLUNGEN</h1>
      <p className="text-[#6B6460] mb-10">Alle bestätigten Bestellungen mit hinterlegter E-Mail.</p>
      {orders.length === 0 ? (
        <div className="p-10 text-center bg-white rounded-2xl border-2 border-dashed border-[#171413]/15">
          <Package className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-[#6B6460]">Noch keine Bestellungen. Leg direkt auf der Speisekarte los!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => <OrderRow key={o.id} order={o} />)}
        </div>
      )}
    </div>
  );
}

function OrderRow({ order }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-2xl border-2 border-[#171413]/10 overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full p-5 flex items-center justify-between gap-4 hover:bg-[#F4EFE3]/50 transition">
        <div className="flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-full bg-[#171413] text-[#FDF9F1] flex items-center justify-center">
            {order.delivery ? <Truck className="w-5 h-5" /> : <Store className="w-5 h-5" />}
          </div>
          <div>
            <div className="font-display text-lg">{order.id}</div>
            <div className="text-xs text-[#6B6460]">{new Date(order.createdAt).toLocaleString("de-DE")} · {order.customer.name}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-display text-xl text-[#C1292E]">{EUR(order.total)}</div>
          <div className="text-xs text-[#6B6460]">{order.status}</div>
        </div>
      </button>
      {open && (
        <div className="px-5 pb-5 pt-0 border-t border-[#171413]/10 bg-[#FDF9F1]/50 anim-fade">
          <div className="text-xs tracking-wider uppercase text-[#6B6460] mt-3 mb-2">Positionen</div>
          {order.items.map((i) => (
            <div key={i.lineId} className="flex justify-between text-sm py-1">
              <span>{i.qty}× {i.name} {i.sauce && <span className="text-[#6B6460]">({i.sauce})</span>}</span>
              <span>{EUR(i.price * i.qty)}</span>
            </div>
          ))}
          <div className="mt-3 pt-3 border-t border-[#171413]/10 grid sm:grid-cols-2 gap-2 text-xs text-[#6B6460]">
            <div>Zahlung: <strong className="text-[#171413]">{order.customer.payment}</strong></div>
            <div>Telefon: <strong className="text-[#171413]">{order.customer.phone}</strong></div>
            {order.delivery && <div className="sm:col-span-2">Adresse: <strong className="text-[#171413]">{order.customer.street}, {order.customer.plz} {order.customer.city}</strong></div>}
            {order.customer.notes && <div className="sm:col-span-2">Notiz: <em>{order.customer.notes}</em></div>}
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   ADMIN
   ========================================================================= */
function AdminLogin({ onAuth }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  return (
    <div className="max-w-md mx-auto px-4 py-24">
      <div className="bg-[#171413] text-[#FDF9F1] rounded-3xl p-8">
        <Lock className="w-10 h-10 mb-4 text-[#F2B544]" />
        <h1 className="font-display text-3xl mb-2">ADMIN BEREICH</h1>
        <p className="text-sm opacity-70 mb-6">Nur für Mitarbeiter. Demo-Passwort: <code className="bg-white/10 px-1.5 py-0.5 rounded">bros2026</code></p>
        <input type="password" value={pw} onChange={(e) => { setPw(e.target.value); setErr(false); }}
          placeholder="Passwort"
          className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl focus:border-[#F2B544] outline-none" />
        {err && <p className="text-[#F2B544] text-sm mt-2">Falsches Passwort</p>}
        <button onClick={() => pw === "bros2026" ? onAuth() : setErr(true)}
          className="mt-5 w-full py-3 bg-[#C1292E] hover:bg-[#a62026] rounded-full font-semibold transition">Anmelden</button>
      </div>
    </div>
  );
}

function AdminView({ orders }) {
  const total = orders.reduce((s, o) => s + o.total, 0);
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-16">
      <div className="flex items-center gap-3 mb-8">
        <div className="px-3 py-1 bg-[#C1292E] text-[#FDF9F1] rounded-full text-xs tracking-widest uppercase">Admin</div>
        <h1 className="font-display text-5xl md:text-7xl">BESTELLUNGEN</h1>
      </div>
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Gesamt Umsatz" value={EUR(total)} accent="#C1292E" />
        <StatCard label="Bestellungen" value={orders.length} accent="#F2B544" />
        <StatCard label="Ø Warenkorb" value={orders.length ? EUR(total / orders.length) : "—"} accent="#171413" />
      </div>
      {orders.length === 0 ? (
        <div className="p-10 text-center bg-white rounded-2xl border-2 border-dashed border-[#171413]/15 text-[#6B6460]">Noch keine Bestellungen eingegangen.</div>
      ) : (
        <div className="space-y-3">{orders.map((o) => <OrderRow key={o.id} order={o} />)}</div>
      )}
    </div>
  );
}

const StatCard = ({ label, value, accent }) => (
  <div className="p-5 bg-white rounded-2xl border-2 border-[#171413]/10">
    <div className="text-xs tracking-wider uppercase text-[#6B6460]">{label}</div>
    <div className="font-display text-3xl mt-2" style={{ color: accent }}>{value}</div>
  </div>
);

/* =========================================================================
   FOOTER
   ========================================================================= */
function Footer({ onNav }) {
  return (
    <footer className="bg-[#171413] text-[#FDF9F1] mt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-14 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-11 h-11 rounded-full bg-[#C1292E] flex items-center justify-center -rotate-6">
              <Flame className="w-6 h-6 text-[#F2B544]" />
            </div>
            <div className="font-display text-3xl">KEBAB BRO'S</div>
          </div>
          <p className="opacity-70 max-w-md leading-relaxed">
            Street-Food-Charme vom Marktplatz Coesfeld. Prall gefüllte Döner, vegane Optionen, knuspriges Brot, freundlicher Service.
          </p>
          <div className="flex gap-3 mt-6">
            <SocialBtn icon={<Instagram />} />
            <SocialBtn icon={<Facebook />} />
            <SocialBtn icon={<Mail />} />
          </div>
        </div>
        <div>
          <div className="font-display text-xl mb-4 text-[#F2B544]">KONTAKT</div>
          <div className="space-y-2 text-sm opacity-80">
            <div className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" /> Markt 3<br />48653 Coesfeld</div>
            <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> 02541 8444390</div>
            <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> info@kebab-bros-coesfeld.de</div>
          </div>
        </div>
        <div>
          <div className="font-display text-xl mb-4 text-[#F2B544]">ÖFFNUNGSZEITEN</div>
          <div className="space-y-1 text-sm opacity-80">
            <div className="flex justify-between"><span>Mo - Fr</span><span>11:30 - 21:30</span></div>
            <div className="flex justify-between"><span>Samstag</span><span>13:00 - 21:30</span></div>
            <div className="flex justify-between"><span>Sonntag</span><span>13:00 - 21:30</span></div>
          </div>
          <button onClick={() => onNav("admin")} className="mt-5 text-xs text-[#F2B544] hover:underline flex items-center gap-1.5">
            <Lock className="w-3 h-3" /> Admin-Bereich
          </button>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-5 flex flex-wrap items-center justify-between gap-4 text-xs opacity-60">
          <div>© {new Date().getFullYear()} Kebab Bro's Coesfeld. Alle Rechte vorbehalten.</div>
          <div className="flex gap-5">
            <button onClick={() => onNav("about")} className="hover:text-[#F2B544]">Impressum</button>
            <button className="hover:text-[#F2B544]">Datenschutz</button>
            <button className="hover:text-[#F2B544]">AGB</button>
          </div>
        </div>
      </div>
    </footer>
  );
}

const SocialBtn = ({ icon }) => (
  <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#C1292E] flex items-center justify-center transition">
    {React.cloneElement(icon, { className: "w-4 h-4" })}
  </button>
);

/* =========================================================================
   TOAST
   ========================================================================= */
function Toast({ msg }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] px-5 py-3 bg-[#171413] text-[#FDF9F1] rounded-full shadow-2xl anim-up font-medium text-sm flex items-center gap-2">
      <Sparkles className="w-4 h-4 text-[#F2B544]" /> {msg}
    </div>
  );
}
