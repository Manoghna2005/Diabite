import React, { useState } from 'react';
import { MealItem } from '../types';
import { MEAL_DATABASE } from '../data/meals';
import {
  Search,
  Filter,
  ArrowUpDown,
  UtensilsCrossed,
  ShieldCheck,
  Wheat,
  Activity,
  Flame,
  Award,
  Sparkles
} from 'lucide-react';

interface MealDatabaseExplorerProps {
  onSelectMeal: (meal: MealItem) => void;
}

export const MealDatabaseExplorer: React.FC<MealDatabaseExplorerProps> = ({ onSelectMeal }) => {
  const [search, setSearch] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState('all');
  const [dietFilter, setDietFilter] = useState('all');
  const [glFilter, setGlFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'gl_asc' | 'fiber_desc' | 'protein_desc' | 'calories_asc'>('gl_asc');

  const filteredMeals = MEAL_DATABASE.filter(meal => {
    const matchesSearch =
      meal.name.toLowerCase().includes(search.toLowerCase()) ||
      (meal.regionalName && meal.regionalName.toLowerCase().includes(search.toLowerCase())) ||
      meal.keyIngredients.some(i => i.toLowerCase().includes(search.toLowerCase()));

    const matchesCuisine = cuisineFilter === 'all' || meal.cuisine.toLowerCase() === cuisineFilter.toLowerCase();
    const matchesDiet = dietFilter === 'all' || meal.category === dietFilter;
    const matchesGl = glFilter === 'all' || meal.glCategory === glFilter;

    return matchesSearch && matchesCuisine && matchesDiet && matchesGl;
  }).sort((a, b) => {
    if (sortBy === 'gl_asc') return a.gl - b.gl;
    if (sortBy === 'fiber_desc') return b.fiber - a.fiber;
    if (sortBy === 'protein_desc') return b.protein - a.protein;
    if (sortBy === 'calories_asc') return a.calories - b.calories;
    return 0;
  });

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-teal-100 text-teal-700">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  Module 2: ICMR-NIN & USDA Diabetic Meal Database
                </h2>
                <p className="text-xs text-slate-500">
                  Clinical nutritional profiles, estimated Glycemic Index (GI), and Glycemic Load (GL)
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Formula: GL = (GI × Net Carbs) / 100</span>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5">
          {/* Search Bar */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search dishes, millets, ingredients..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            />
          </div>

          {/* Cuisine Filter */}
          <div>
            <select
              value={cuisineFilter}
              onChange={e => setCuisineFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
            >
              <option value="all">All Cuisines</option>
              <option value="South Indian">South Indian</option>
              <option value="North Indian">North Indian</option>
              <option value="Healthy Bowls">Healthy Bowls</option>
              <option value="Continental">Continental</option>
            </select>
          </div>

          {/* Diet Filter */}
          <div>
            <select
              value={dietFilter}
              onChange={e => setDietFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
            >
              <option value="all">All Dietary Types</option>
              <option value="veg">Pure Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="eggetarian">Eggetarian</option>
              <option value="non-veg">Non-Vegetarian</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
            >
              <option value="gl_asc">Lowest Glycemic Load (GL)</option>
              <option value="fiber_desc">Highest Fiber (g)</option>
              <option value="protein_desc">Highest Protein (g)</option>
              <option value="calories_asc">Lowest Calories</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Dishes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMeals.map(meal => (
          <div
            key={meal.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-teal-400 hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div>
              {/* Category & Cuisine Badges */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                    {meal.cuisine}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-teal-800 border border-teal-200">
                    {meal.category}
                  </span>
                </div>
                <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {meal.diabeticScore} / 10 Score
                </span>
              </div>

              {/* Title */}
              <h3 className="text-sm font-extrabold text-slate-900 line-clamp-1">{meal.name}</h3>
              {meal.regionalName && (
                <p className="text-[11px] text-slate-500 font-medium line-clamp-1">{meal.regionalName}</p>
              )}

              {/* Glycemic Metrics Pill */}
              <div className="mt-3 grid grid-cols-3 gap-2 text-center p-2 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <div className="text-[10px] text-slate-400 font-medium">GI (Index)</div>
                  <div className="text-xs font-extrabold text-slate-800">{meal.gi}</div>
                  <div className="text-[9px] font-bold text-teal-700 uppercase">{meal.giCategory}</div>
                </div>
                <div className="border-x border-slate-200">
                  <div className="text-[10px] text-slate-400 font-medium">GL (Load)</div>
                  <div className="text-xs font-extrabold text-emerald-700">{meal.gl}</div>
                  <div className="text-[9px] font-bold text-emerald-700 uppercase">{meal.glCategory}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-medium">Fiber</div>
                  <div className="text-xs font-extrabold text-amber-700">+{meal.fiber}g</div>
                  <div className="text-[9px] text-slate-500">Dietary</div>
                </div>
              </div>

              {/* Macros Row */}
              <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-600 px-1">
                <span>{meal.calories} kcal</span>
                <span>•</span>
                <span>{meal.protein}g Protein</span>
                <span>•</span>
                <span>{meal.netCarbs}g Net Carbs</span>
              </div>

              <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {meal.description}
              </p>
            </div>

            {/* Bottom Button */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono truncate max-w-[140px]">
                {meal.portion}
              </span>
              <button
                onClick={() => onSelectMeal(meal)}
                className="px-3 py-1.5 text-xs font-bold text-teal-800 hover:text-white bg-teal-50 hover:bg-teal-600 border border-teal-200 hover:border-teal-600 rounded-lg transition-colors"
              >
                View Scientific Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
