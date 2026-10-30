import React, { useState } from 'react';
import { Restaurant, UserProfile, MealItem } from '../types';
import { RESTAURANTS_DATABASE } from '../data/restaurants';
import { MEAL_DATABASE } from '../data/meals';
import { calculateDistanceKm } from '../services/mcdmEngine';
import { generateDeliveryLinks } from '../services/deliveryLinks';
import {
  Store,
  MapPin,
  Star,
  Clock,
  ExternalLink,
  ShieldCheck,
  Search,
  Navigation,
  Compass,
  Utensils
} from 'lucide-react';

interface RestaurantExplorerProps {
  user: UserProfile;
  onSelectMeal: (meal: MealItem) => void;
  onSelectOrderFromRestaurant: (meal: MealItem, restaurant: Restaurant, price: number) => void;
}

export const RestaurantExplorer: React.FC<RestaurantExplorerProps> = ({
  user,
  onSelectMeal,
  onSelectOrderFromRestaurant
}) => {
  const [search, setSearch] = useState('');
  const [maxDistance, setMaxDistance] = useState<number>(5);

  const restaurantsWithCalculatedDistances = RESTAURANTS_DATABASE.map(rest => {
    let dist = calculateDistanceKm(
      user.currentLocation.lat,
      user.currentLocation.lng,
      rest.lat,
      rest.lng
    );
    if (dist < 0.4) dist = 0.8;
    const transitMins = (dist / rest.averageDeliverySpeedKmh) * 60;
    const deliveryMins = Math.round(12 + transitMins);

    return {
      ...rest,
      calculatedDistKm: dist,
      calculatedDeliveryMins: deliveryMins
    };
  })
    .filter(rest => {
      const matchesSearch =
        rest.name.toLowerCase().includes(search.toLowerCase()) ||
        rest.area.toLowerCase().includes(search.toLowerCase()) ||
        rest.cuisineTypes.some(c => c.toLowerCase().includes(search.toLowerCase()));

      return matchesSearch && rest.calculatedDistKm <= maxDistance;
    })
    .sort((a, b) => a.calculatedDistKm - b.calculatedDistKm);

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-teal-100 text-teal-700">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Module 3: Nearby Restaurant Discovery
              </h2>
              <p className="text-xs text-slate-500">
                Dynamic proximity calculations relative to {user.currentLocation.name} ({user.currentLocation.city})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <Compass className="w-4 h-4 text-teal-600" />
            <span>Active GPS: {user.currentLocation.lat}, {user.currentLocation.lng}</span>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search restaurants by name, area, or cuisine..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-slate-600 whitespace-nowrap">
              Max Radius: {maxDistance} km
            </label>
            <input
              type="range"
              min={1}
              max={15}
              value={maxDistance}
              onChange={e => setMaxDistance(Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Visual Proximity Map Mockup */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-sm border border-slate-800">
        <div className="flex items-center justify-between text-xs mb-3">
          <span className="font-bold flex items-center gap-1.5 text-teal-400">
            <MapPin className="w-4 h-4" />
            Spatial Proximity Radar (Geographic Distribution)
          </span>
          <span className="text-slate-400 text-[11px]">
            Showing {restaurantsWithCalculatedDistances.length} discovered outlets within {maxDistance} km
          </span>
        </div>

        {/* Simulated Canvas Map View */}
        <div className="h-44 w-full bg-slate-950 rounded-xl border border-slate-800 relative overflow-hidden flex items-center justify-center p-4">
          {/* Radar grid lines */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-24 h-24 rounded-full border border-teal-500/20" />
            <div className="w-48 h-48 rounded-full border border-teal-500/15" />
            <div className="w-72 h-72 rounded-full border border-teal-500/10" />
            <div className="absolute w-full h-px bg-slate-800" />
            <div className="absolute h-full w-px bg-slate-800" />
          </div>

          {/* User Location Center Pin */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-4 h-4 rounded-full bg-teal-400 ring-4 ring-teal-400/30 animate-pulse" />
            <span className="text-[10px] font-bold bg-slate-900/90 text-teal-300 px-1.5 py-0.5 rounded mt-1 border border-teal-500/40">
              You ({user.currentLocation.area})
            </span>
          </div>

          {/* Dynamic restaurant pins scattered based on calculated distances */}
          {restaurantsWithCalculatedDistances.slice(0, 6).map((rest, index) => {
            // Compute a polar coordinate representation
            const angle = (index * (360 / Math.min(6, restaurantsWithCalculatedDistances.length))) * (Math.PI / 180);
            const radius = Math.min(85, (rest.calculatedDistKm / maxDistance) * 75 + 25);
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            return (
              <div
                key={rest.id}
                className="absolute z-10 flex flex-col items-center cursor-pointer group"
                style={{ transform: `translate(${x}px, ${y}px)` }}
                title={`${rest.name} (${rest.calculatedDistKm} km)`}
              >
                <div className="w-3 h-3 rounded-full bg-amber-400 ring-2 ring-amber-400/30 group-hover:scale-125 transition-transform" />
                <span className="text-[9px] font-semibold bg-slate-900/90 text-slate-200 px-1.5 py-0.5 rounded mt-0.5 border border-slate-700 whitespace-nowrap opacity-80 group-hover:opacity-100">
                  {rest.name.split(' ')[0]} ({rest.calculatedDistKm}km)
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Restaurants List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {restaurantsWithCalculatedDistances.map(rest => (
          <div
            key={rest.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-teal-400 transition-all space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">{rest.name}</h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 flex-wrap">
                  <span className="font-semibold text-slate-800">{rest.area}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-amber-600 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    {rest.rating} ({rest.ratingCount.toLocaleString()})
                  </span>
                  <span>•</span>
                  <span className="text-teal-700 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Grade {rest.hygieneGrade}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-black text-teal-700 font-mono">
                  {rest.calculatedDistKm} km
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-1 justify-end">
                  <Clock className="w-3 h-3" />
                  ~{rest.calculatedDeliveryMins} mins
                </div>
              </div>
            </div>

            {/* Menu Offerings for Diabetic Patients */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
                <span>Diabetic Menu Offerings Available</span>
                <span className="text-teal-700">{rest.offerings.length} Options</span>
              </div>

              <div className="space-y-1.5">
                {rest.offerings.map(offering => {
                  const meal = MEAL_DATABASE.find(m => m.id === offering.mealId);
                  if (!meal) return null;

                  return (
                    <div
                      key={offering.mealId}
                      className="flex items-center justify-between py-1 px-2 rounded-lg bg-white border border-slate-200 text-xs"
                    >
                      <div>
                        <button
                          onClick={() => onSelectMeal(meal)}
                          className="font-bold text-slate-900 hover:text-teal-700 text-left"
                        >
                          {meal.name}
                        </button>
                        <div className="text-[10px] text-slate-500">
                          GL: {meal.gl} • {meal.portion}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900">₹{offering.price}</span>
                        <button
                          onClick={() => onSelectOrderFromRestaurant(meal, rest, offering.price)}
                          className="px-2 py-1 text-[11px] font-bold bg-teal-600 hover:bg-teal-700 text-white rounded transition-colors"
                        >
                          Order
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Links */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 text-xs">
              {(() => {
                const links = generateDeliveryLinks(rest);
                return (
                  <>
                    <a
                      href={links.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 cursor-pointer"
                    >
                      <Navigation className="w-3.5 h-3.5 text-blue-600" />
                      <span>Directions</span>
                    </a>
                    <span className="text-slate-300">•</span>
                    <a
                      href={links.zomatoCityUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Zomato</span>
                    </a>
                    <span className="text-slate-300">•</span>
                    <a
                      href={links.swiggyCityUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-orange-600 hover:text-orange-700 font-semibold cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Swiggy</span>
                    </a>
                  </>
                );
              })()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
