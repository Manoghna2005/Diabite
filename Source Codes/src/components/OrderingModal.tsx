import React, { useState } from 'react';
import { RecommendationResult, UserProfile } from '../types';
import {
  X,
  ExternalLink,
  MapPin,
  Clock,
  ShieldCheck,
  Sparkles,
  ShoppingBag,
  Copy,
  Check,
  CheckCircle2,
  Navigation,
  ArrowRight,
  Info
} from 'lucide-react';
import { generateDeliveryLinks, buildDiabeticNote } from '../services/deliveryLinks';

interface OrderingModalProps {
  item: RecommendationResult | null;
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onCompleteOrder: (item: RecommendationResult, customNote: string) => void;
}

export const OrderingModal: React.FC<OrderingModalProps> = ({
  item,
  user,
  isOpen,
  onClose,
  onCompleteOrder
}) => {
  const [copiedNote, setCopiedNote] = useState(false);
  const [oilFree, setOilFree] = useState(true);
  const [noAddedSugar, setNoAddedSugar] = useState(true);
  const [sauceOnSide, setSauceOnSide] = useState(true);
  const [lowSodium, setLowSodium] = useState(false);
  const [searchByDish, setSearchByDish] = useState(true);
  const [isPlacing, setIsPlacing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [openedPlatform, setOpenedPlatform] = useState<string | null>(null);

  if (!isOpen || !item) return null;

  const { meal, restaurant, price, distanceKm, deliveryTimeMins } = item;

  const fullCustomNote = buildDiabeticNote({
    oilFree,
    noAddedSugar,
    sauceOnSide,
    lowSodium
  });

  const copyNoteToClipboard = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(fullCustomNote);
    }
    setCopiedNote(true);
    setTimeout(() => setCopiedNote(false), 3000);
  };

  const deliveryFee = distanceKm > 3 ? 35 : 20;
  const tax = Math.round(price * 0.05);
  const totalAmount = price + deliveryFee + tax;

  const links = generateDeliveryLinks(restaurant, meal, { dishSpecific: searchByDish });

  const handleLaunchPlatform = (platformName: string, targetUrl: string) => {
    // Copy diabetic note to clipboard first
    copyNoteToClipboard();
    setOpenedPlatform(platformName);

    // Open target in new tab
    try {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    } catch {
      // In case window.open is restricted, fallback is handled via anchor href
    }
  };

  const handleSimulateOrder = () => {
    setIsPlacing(true);
    setTimeout(() => {
      setIsPlacing(false);
      setOrderSuccess(true);
      setTimeout(() => {
        onCompleteOrder(item, fullCustomNote);
      }, 1800);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-8 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-teal-100 text-teal-700">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Module 6: Order via Swiggy / Zomato</h2>
              <p className="text-xs text-slate-500">
                Direct integration with food delivery platforms & custom diabetic prep
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {orderSuccess ? (
          <div className="p-8 text-center space-y-4 my-auto">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Order Dispatched Successfully!</h3>
            <p className="text-sm text-slate-600 max-w-xs mx-auto">
              Your diabetic-friendly order for <strong>{meal.name}</strong> from <strong>{restaurant.name}</strong> is being prepared with your custom instructions.
            </p>
            <div className="text-xs font-mono text-slate-500 bg-slate-100 p-2.5 rounded-lg">
              Estimated delivery: ~{deliveryTimeMins} minutes to {user.currentLocation.area}
            </div>
            <p className="text-xs text-teal-700 font-semibold animate-pulse">
              Redirecting to log satisfaction and blood glucose feedback...
            </p>
          </div>
        ) : (
          <div className="p-6 overflow-y-auto space-y-5 flex-1">
            {/* Meal & Restaurant Card */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    Rank #{item.rank} Recommended Meal
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1">{meal.name}</h3>
                  <p className="text-xs text-slate-600 font-medium">
                    {restaurant.name} • <span className="text-teal-700 font-semibold">{restaurant.area}</span>
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-extrabold text-slate-900">₹{price}</div>
                  <div className="text-xs text-emerald-700 font-bold">
                    GL: {meal.gl} ({meal.glCategory.toUpperCase()})
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-200 font-medium flex-wrap">
                <span className="flex items-center gap-1 font-semibold text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  {distanceKm} km away ({user.currentLocation.area})
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  ~{deliveryTimeMins} mins delivery
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  Hygiene Grade {restaurant.hygieneGrade}
                </span>
              </div>
            </div>

            {/* DIRECT ORDER ACTION BUTTONS - High Priority for User */}
            <div className="space-y-3 bg-gradient-to-br from-amber-50/60 via-orange-50/30 to-teal-50/40 p-4 rounded-xl border border-orange-200/80">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-orange-600" />
                  <span>Choose Delivery Partner to Open</span>
                </label>
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <label className="cursor-pointer flex items-center gap-1">
                    <input
                      type="radio"
                      name="searchType"
                      checked={searchByDish}
                      onChange={() => setSearchByDish(true)}
                      className="accent-teal-600"
                    />
                    <span>Search Dish</span>
                  </label>
                  <label className="cursor-pointer flex items-center gap-1">
                    <input
                      type="radio"
                      name="searchType"
                      checked={!searchByDish}
                      onChange={() => setSearchByDish(false)}
                      className="accent-teal-600"
                    />
                    <span>Search Restaurant</span>
                  </label>
                </div>
              </div>

              {/* Delivery platform big buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Swiggy Button */}
                <a
                  href={links.swiggyCityUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleLaunchPlatform('Swiggy', links.swiggyCityUrl)}
                  className="group flex items-center justify-between p-3 rounded-xl bg-[#FC8019] hover:bg-[#e47112] text-white shadow-sm transition-all hover:shadow-md cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-black text-sm">
                      S
                    </div>
                    <div>
                      <div className="text-xs font-extrabold flex items-center gap-1">
                        Order on Swiggy
                        <ExternalLink className="w-3.5 h-3.5 opacity-80 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                      <div className="text-[10px] text-orange-100 truncate max-w-[140px]">
                        {searchByDish ? `${meal.name}` : restaurant.name}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-orange-100 group-hover:translate-x-1 transition-transform" />
                </a>

                {/* Zomato Button */}
                <a
                  href={links.zomatoCityUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleLaunchPlatform('Zomato', links.zomatoCityUrl)}
                  className="group flex items-center justify-between p-3 rounded-xl bg-[#E23744] hover:bg-[#c92e3a] text-white shadow-sm transition-all hover:shadow-md cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-black text-sm">
                      Z
                    </div>
                    <div>
                      <div className="text-xs font-extrabold flex items-center gap-1">
                        Order on Zomato
                        <ExternalLink className="w-3.5 h-3.5 opacity-80 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                      <div className="text-[10px] text-rose-100 truncate max-w-[140px]">
                        {searchByDish ? `${meal.name}` : restaurant.name}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-rose-100 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              {/* Google Maps / Dine-in / Directions Button */}
              <div className="pt-1">
                <a
                  href={links.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5 text-blue-600" />
                  <span>View Restaurant Location & Directions on Google Maps</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>

              {openedPlatform && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-lg text-xs text-emerald-900 flex items-start gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>{openedPlatform} opened in a new tab!</strong>
                    <div className="text-[11px] text-emerald-800">
                      Diabetic cooking instructions copied to your clipboard — paste them in the restaurant cooking instructions field.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Diabetic Kitchen Instructions Generator */}
            <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-teal-700" />
                  Smart Diabetic Kitchen Instructions (For Delivery App)
                </span>
                <button
                  type="button"
                  onClick={copyNoteToClipboard}
                  className="text-xs font-semibold text-teal-800 hover:text-teal-950 flex items-center gap-1 cursor-pointer bg-white px-2 py-1 rounded border border-teal-300 shadow-2xs"
                >
                  {copiedNote ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedNote ? 'Copied to Clipboard!' : 'Copy Note'}</span>
                </button>
              </div>

              <p className="text-[11px] text-teal-800">
                Paste this note into the <em>"Add cooking instructions / Note for restaurant"</em> box on Swiggy or Zomato:
              </p>

              {/* Toggles */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer p-1.5 rounded hover:bg-teal-100/50">
                  <input
                    type="checkbox"
                    checked={oilFree}
                    onChange={e => setOilFree(e.target.checked)}
                    className="accent-teal-600 rounded"
                  />
                  <span>Minimal / No Oil</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer p-1.5 rounded hover:bg-teal-100/50">
                  <input
                    type="checkbox"
                    checked={noAddedSugar}
                    onChange={e => setNoAddedSugar(e.target.checked)}
                    className="accent-teal-600 rounded"
                  />
                  <span>Zero Added Sugar</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer p-1.5 rounded hover:bg-teal-100/50">
                  <input
                    type="checkbox"
                    checked={sauceOnSide}
                    onChange={e => setSauceOnSide(e.target.checked)}
                    className="accent-teal-600 rounded"
                  />
                  <span>Chutney/Gravy on side</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer p-1.5 rounded hover:bg-teal-100/50">
                  <input
                    type="checkbox"
                    checked={lowSodium}
                    onChange={e => setLowSodium(e.target.checked)}
                    className="accent-teal-600 rounded"
                  />
                  <span>Low Sodium / Salt</span>
                </label>
              </div>

              <div className="p-2.5 bg-white border border-teal-200 rounded-lg text-xs font-mono text-slate-700 select-all">
                {fullCustomNote}
              </div>
            </div>

            {/* Bill & Summary */}
            <div className="border-t border-slate-200 pt-3 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Meal Subtotal ({meal.portion})</span>
                <span>₹{price}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Partner Fee ({distanceKm} km)</span>
                <span>₹{deliveryFee}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & Restaurant Packing (5%)</span>
                <span>₹{tax}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-1 border-t border-slate-200">
                <span>Total Payable</span>
                <span className="text-teal-700">₹{totalAmount}</span>
              </div>
            </div>

            {/* In-app Order Simulation & Logging Button */}
            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleSimulateOrder}
                disabled={isPlacing}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{isPlacing ? 'Recording Order Details...' : 'Mark as Ordered & Log Blood Glucose Feedback'}</span>
              </button>
              <p className="text-[11px] text-center text-slate-400 mt-2">
                Simulates real-time restaurant dispatch and seamlessly opens the Module 7 postprandial glucose feedback tracker.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
