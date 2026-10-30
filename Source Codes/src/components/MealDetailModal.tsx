import React from 'react';
import { MealItem, Restaurant } from '../types';
import {
  X,
  ShieldCheck,
  Zap,
  Wheat,
  Activity,
  Award,
  Store,
  MapPin,
  ExternalLink,
  Info
} from 'lucide-react';

interface MealDetailModalProps {
  meal: MealItem | null;
  isOpen: boolean;
  onClose: () => void;
  restaurants: Restaurant[];
  onSelectRestaurantForOrder?: (meal: MealItem, restaurant: Restaurant, price: number) => void;
}

export const MealDetailModal: React.FC<MealDetailModalProps> = ({
  meal,
  isOpen,
  onClose,
  restaurants,
  onSelectRestaurantForOrder
}) => {
  if (!isOpen || !meal) return null;

  // Find restaurants offering this meal
  const offeringRestaurants = restaurants
    .map(r => {
      const offering = r.offerings.find(o => o.mealId === meal.id);
      return offering ? { restaurant: r, offering } : null;
    })
    .filter(Boolean) as { restaurant: Restaurant; offering: any }[];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-8 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800">
                {meal.cuisine}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-700">
                {meal.category.toUpperCase()}
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mt-1">{meal.name}</h2>
            {meal.regionalName && (
              <p className="text-xs text-slate-500 font-medium">{meal.regionalName}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* Scientific Glycemic Profile Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-center">
              <div className="text-[11px] font-semibold text-teal-800 uppercase tracking-wider">
                Glycemic Index (GI)
              </div>
              <div className="text-xl font-extrabold text-teal-900 mt-0.5">{meal.gi}</div>
              <div className="text-[10px] font-bold text-teal-700 uppercase">{meal.giCategory} GI (≤55)</div>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
              <div className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">
                Glycemic Load (GL)
              </div>
              <div className="text-xl font-extrabold text-emerald-900 mt-0.5">{meal.gl}</div>
              <div className="text-[10px] font-bold text-emerald-700 uppercase">{meal.glCategory} GL (≤10)</div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <div className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                Calories / Portion
              </div>
              <div className="text-xl font-extrabold text-slate-900 mt-0.5">{meal.calories}</div>
              <div className="text-[10px] text-slate-500 truncate">{meal.portion}</div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center">
              <div className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">
                Dietary Fiber
              </div>
              <div className="text-xl font-extrabold text-amber-900 mt-0.5">{meal.fiber}g</div>
              <div className="text-[10px] font-bold text-amber-700">Slow Absorption</div>
            </div>
          </div>

          {/* Macronutrients Bar */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Macronutrient Breakdown (per standard portion)
            </h3>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div>
                  <span className="text-slate-500 block">Total Carbs</span>
                  <span className="font-extrabold text-slate-900">{meal.carbs}g</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Dietary Fiber</span>
                  <span className="font-extrabold text-emerald-700">+{meal.fiber}g</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Net Carbs</span>
                  <span className="font-extrabold text-teal-700">{meal.netCarbs}g</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Protein</span>
                  <span className="font-extrabold text-blue-700">{meal.protein}g</span>
                </div>
              </div>

              {/* Progress bar visual */}
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden flex">
                <div
                  className="bg-teal-500 h-full"
                  style={{ width: `${(meal.netCarbs / (meal.netCarbs + meal.protein + meal.fat)) * 100}%` }}
                  title="Net Carbs"
                />
                <div
                  className="bg-blue-500 h-full"
                  style={{ width: `${(meal.protein / (meal.netCarbs + meal.protein + meal.fat)) * 100}%` }}
                  title="Protein"
                />
                <div
                  className="bg-amber-500 h-full"
                  style={{ width: `${(meal.fat / (meal.netCarbs + meal.protein + meal.fat)) * 100}%` }}
                  title="Fat"
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>■ Net Carbs</span>
                <span>■ Protein ({meal.protein}g)</span>
                <span>■ Fat ({meal.fat}g)</span>
              </div>
            </div>
          </div>

          {/* Clinical Diabetic Health Benefits */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Evidence-Based Clinical Diabetic Benefits</span>
            </h3>
            <ul className="space-y-2">
              {meal.diabeticBenefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Ingredients & Reference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="font-bold text-slate-900 uppercase tracking-wider block mb-1">
                Key Ingredients
              </span>
              <div className="flex flex-wrap gap-1">
                {meal.keyIngredients.map((ing, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px]"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-900 uppercase tracking-wider block mb-1">
                Nutritional Citation (ICMR-NIN)
              </span>
              <div className="p-2 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-600 font-mono">
                {meal.icmrNinReference}
              </div>
            </div>
          </div>

          {/* Available Nearby Restaurants Section */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Store className="w-4 h-4 text-teal-600" />
              <span>Nearby Restaurants Serving This Dish</span>
            </h3>
            {offeringRestaurants.length === 0 ? (
              <p className="text-xs text-slate-500">No current partner restaurants listing this meal.</p>
            ) : (
              <div className="space-y-2">
                {offeringRestaurants.map(({ restaurant, offering }) => (
                  <div
                    key={restaurant.id}
                    className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between hover:border-teal-400 transition-colors"
                  >
                    <div>
                      <div className="font-bold text-sm text-slate-900">{restaurant.name}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-2">
                        <span>{restaurant.area}</span>
                        <span>•</span>
                        <span>{restaurant.rating}★ ({restaurant.ratingCount})</span>
                      </div>
                      {offering.preparationNote && (
                        <div className="text-[11px] text-teal-700 mt-0.5 font-medium">
                          Note: {offering.preparationNote}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap justify-end">
                      <span className="text-base font-extrabold text-slate-900 mr-1">₹{offering.price}</span>
                      <a
                        href={`https://www.swiggy.com/city/${(restaurant.city || 'chennai').toLowerCase()}/search?query=${encodeURIComponent(`${restaurant.swiggySearchKeyword || restaurant.name} ${meal.name}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 bg-[#FC8019] hover:bg-[#e47112] text-white font-bold text-xs rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                        title="Search and order on Swiggy"
                      >
                        <span>Swiggy</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <a
                        href={`https://www.zomato.com/${(restaurant.city || 'chennai').toLowerCase()}/restaurants?q=${encodeURIComponent(`${restaurant.zomatoSearchKeyword || restaurant.name} ${meal.name}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 bg-[#E23744] hover:bg-[#c92e3a] text-white font-bold text-xs rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                        title="Search and order on Zomato"
                      >
                        <span>Zomato</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      {onSelectRestaurantForOrder && (
                        <button
                          type="button"
                          onClick={() => {
                            onSelectRestaurantForOrder(meal, restaurant, offering.price);
                            onClose();
                          }}
                          className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                        >
                          Prep Note
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 rounded-lg"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
