import React, { useState, useMemo } from 'react';
import { RecommendationResult, UserProfile } from '../types';
import {
  Award,
  Sparkles,
  MapPin,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Info,
  CheckCircle2,
  Table as TableIcon,
  LayoutGrid,
  ShoppingBag,
  HeartPulse,
  DollarSign,
  Star,
  Zap,
  Search,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { generateDeliveryLinks, buildDiabeticNote } from '../services/deliveryLinks';

interface RecommendationListProps {
  recommendations: RecommendationResult[];
  user: UserProfile;
  onSelectMealDetail: (meal: any) => void;
  onSelectOrder: (rec: RecommendationResult) => void;
  onConsultDietitian: (meal: any) => void;
}

export const RecommendationList: React.FC<RecommendationListProps> = ({
  recommendations,
  user,
  onSelectMealDetail,
  onSelectOrder,
  onConsultDietitian
}) => {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'low-gl' | 'budget' | 'nearby'>('all');
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string } | null>(null);

  const handleQuickLaunch = (platform: 'Swiggy' | 'Zomato', url: string, rec: RecommendationResult) => {
    // Generate and copy diabetic instructions
    const diabeticNote = buildDiabeticNote({
      oilFree: true,
      noAddedSugar: true,
      sauceOnSide: true,
      lowSodium: false
    });

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(diabeticNote).catch(() => {});
    }

    setToastMessage({
      title: `Taking you to ${platform}...`,
      desc: `Diabetic kitchen note copied to clipboard! Paste it into the cooking notes.`
    });

    setTimeout(() => {
      setToastMessage(null);
    }, 4000);

    // Open target in new tab safely
    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch {
      // fallback handled by <a> href
    }
  };

  const filteredRecommendations = useMemo(() => {
    return recommendations.filter(rec => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        rec.meal.name.toLowerCase().includes(query) ||
        rec.restaurant.name.toLowerCase().includes(query) ||
        rec.meal.cuisine.toLowerCase().includes(query);

      if (!matchesSearch) return false;

      if (activeFilter === 'low-gl') return rec.meal.gl <= 10;
      if (activeFilter === 'budget') return rec.price <= user.budgetPerMeal;
      if (activeFilter === 'nearby') return rec.distanceKm <= 2.5;

      return true;
    });
  }, [recommendations, searchQuery, activeFilter, user.budgetPerMeal]);

  if (recommendations.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-white rounded-2xl border border-slate-200">
        <HeartPulse className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-900">No Meals Matching Current Constraints</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
          Your current dietary preference ({user.dietaryPreference}) or allergy exclusions filtered out all meals. Try adjusting your profile in Module 1.
        </p>
      </div>
    );
  }

  const toggleExpand = (id: string) => {
    setExpandedCardId(prev => (prev === id ? null : id));
  };

  return (
    <div className="space-y-4">
      {/* Top Controller: Results count + View switcher + Current context reminder */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-slate-900">
              Personalized Recommendations
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800">
              {recommendations.length} Ranked Options
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Ranked via Multi-Criteria Decision Making (MCDM) for {user.name} in {user.currentLocation.area}
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('cards')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'cards'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Cards</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'table'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Academic Matrix</span>
          </button>
        </div>
      </div>

      {/* Simple Search & Filter Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search meal, cuisine, or restaurant..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Recommended ({recommendations.length})
          </button>
          <button
            onClick={() => setActiveFilter('low-gl')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer ${
              activeFilter === 'low-gl'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Low Sugar (GL ≤ 10)</span>
          </button>
          <button
            onClick={() => setActiveFilter('budget')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer ${
              activeFilter === 'budget'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200'
            }`}
          >
            <span>Under ₹{user.budgetPerMeal}</span>
          </button>
          <button
            onClick={() => setActiveFilter('nearby')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer ${
              activeFilter === 'nearby'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <span>Within 2.5 km</span>
          </button>
        </div>
      </div>

      {filteredRecommendations.length === 0 ? (
        <div className="text-center py-12 px-4 bg-white rounded-2xl border border-slate-200">
          <HeartPulse className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-900">No Meals Match Your Search Filter</h3>
          <p className="text-xs text-slate-500 mt-1">Try clearing your search or choosing "All Recommended".</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveFilter('all');
            }}
            className="mt-3 px-3 py-1.5 text-xs font-bold bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'table' ? (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Section 13: Expected Output Table Specification
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              Formula Weights: 40% Health | 20% Budget | 15% Dist | 10% Rating | 10% Time | 5% Pref
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100 text-slate-900 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Meal</th>
                  <th className="py-3 px-4">Restaurant</th>
                  <th className="py-3 px-4 text-center">Health Score</th>
                  <th className="py-3 px-4 text-center">GL (Load)</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Distance</th>
                  <th className="py-3 px-4">MCDM Score</th>
                  <th className="py-3 px-4 text-right">Order Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredRecommendations.map(rec => (
                  <tr key={`${rec.meal.id}-${rec.restaurant.id}`} className="hover:bg-teal-50/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      #{rec.rank}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => onSelectMealDetail(rec.meal)}
                        className="font-bold text-slate-900 hover:text-teal-700 text-left transition-colors"
                      >
                        {rec.meal.name}
                      </button>
                      <div className="text-[10px] text-slate-500">{rec.meal.cuisine} • {rec.meal.portion}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{rec.restaurant.name}</div>
                      <div className="text-[10px] text-slate-500">{rec.restaurant.rating}★ ({rec.restaurant.area})</div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {rec.meal.diabeticScore} / 10
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        rec.meal.gl <= 10 ? 'bg-teal-100 text-teal-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {rec.meal.gl} ({rec.meal.glCategory})
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      ₹{rec.price}
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-mono">
                      {rec.distanceKm} km
                    </td>
                    <td className="py-3 px-4 font-extrabold text-teal-700 font-mono">
                      {rec.mcdmScore.toFixed(1)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {(() => {
                        const links = generateDeliveryLinks(rec.restaurant, rec.meal, { dishSpecific: true });
                        return (
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            <a
                              href={links.swiggyCityUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => handleQuickLaunch('Swiggy', links.swiggyCityUrl, rec)}
                              className="px-2 py-1 rounded bg-[#FC8019] hover:bg-[#e47112] text-white font-bold text-[11px] inline-flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                              title={`Order ${rec.meal.name} on Swiggy`}
                            >
                              <span>Swiggy</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                            <a
                              href={links.zomatoCityUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => handleQuickLaunch('Zomato', links.zomatoCityUrl, rec)}
                              className="px-2 py-1 rounded bg-[#E23744] hover:bg-[#c92e3a] text-white font-bold text-[11px] inline-flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                              title={`Order ${rec.meal.name} on Zomato`}
                            >
                              <span>Zomato</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                            <button
                              onClick={() => onSelectOrder(rec)}
                              className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                              title="Customize diabetic preparation notes"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* View Mode: Interactive Card View with Explainable AI Box */
        <div className="grid grid-cols-1 gap-4">
          {filteredRecommendations.map(rec => {
            const cardKey = `${rec.meal.id}-${rec.restaurant.id}`;
            const isExpanded = expandedCardId === cardKey;

            return (
              <div
                key={cardKey}
                className={`bg-white rounded-2xl border transition-all ${
                  rec.rank === 1
                    ? 'border-teal-400 ring-2 ring-teal-400/20 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                {/* Main Card Header */}
                <div className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    {/* Left: Rank + Meal & Restaurant Info */}
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-base shrink-0 ${
                          rec.rank === 1
                            ? 'bg-teal-600 text-white shadow-xs'
                            : rec.rank === 2
                            ? 'bg-teal-50 text-teal-800 border border-teal-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        #{rec.rank}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => onSelectMealDetail(rec.meal)}
                            className="text-base font-extrabold text-slate-900 hover:text-teal-700 text-left transition-colors"
                          >
                            {rec.meal.name}
                          </button>
                          {rec.rank === 1 && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-teal-100 text-teal-800 border border-teal-200 flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-teal-700" />
                              Top Match
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 flex-wrap font-medium">
                          <span className="text-slate-900 font-semibold">{rec.restaurant.name}</span>
                          <span className="text-[11px] text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                            {rec.restaurant.area}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-amber-600 font-semibold">
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            {rec.restaurant.rating} ({rec.restaurant.ratingCount.toLocaleString()})
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 font-semibold text-slate-700">
                            <MapPin className="w-3.5 h-3.5 text-amber-600" />
                            {rec.distanceKm} km away
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            ~{rec.deliveryTimeMins} mins
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Scores & Price */}
                    <div className="flex items-center sm:items-end flex-row sm:flex-col justify-between sm:justify-start gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <div className="text-xs text-slate-400 font-semibold">MCDM Score</div>
                          <div className="text-xl font-black text-teal-700 font-mono">
                            {rec.mcdmScore.toFixed(1)}
                            <span className="text-xs text-slate-400 font-normal"> / 10</span>
                          </div>
                        </div>
                        <div className="text-right pl-3 border-l border-slate-200">
                          <div className="text-xs text-slate-400 font-semibold">Price</div>
                          <div className="text-lg font-black text-slate-900">
                            ₹{rec.price}
                          </div>
                        </div>
                      </div>

                      {/* Glycemic Load Badge */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-700">GL:</span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-extrabold ${
                            rec.meal.gl <= 10
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {rec.meal.gl} ({rec.meal.glCategory.toUpperCase()})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Module 5: Explainable AI Justification Box */}
                  <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span className="flex items-center gap-1.5 text-teal-800">
                        <CheckCircle2 className="w-4 h-4 text-teal-600" />
                        Module 5: Why DiaBite Recommends This Meal
                      </span>
                      <button
                        onClick={() => toggleExpand(cardKey)}
                        className="text-[11px] text-teal-700 hover:text-teal-900 font-semibold flex items-center gap-1"
                      >
                        <span>{isExpanded ? 'Hide Criteria Matrix' : 'View Criteria Breakdown'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-700">
                      {rec.explainableReasons.map((reason, idx) => (
                        <div key={idx} className="flex items-start gap-1.5">
                          <span className="text-teal-600 font-bold">✓</span>
                          <span>{reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Expandable Detailed Criteria Breakdown */}
                  {isExpanded && (
                    <div className="mt-3 p-4 bg-teal-50/40 border border-teal-200 rounded-xl space-y-3 animate-in fade-in duration-200">
                      <div className="text-xs font-bold uppercase tracking-wider text-teal-950 flex items-center justify-between">
                        <span>Multi-Criteria Decision Analysis Breakdown (Weighted Normalized Scores)</span>
                        <span className="text-[10px] text-slate-500 font-mono">Weighted Sum Model</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                        <div className="bg-white p-2.5 rounded-lg border border-teal-100">
                          <div className="text-slate-500 text-[11px]">Health Compatibility (40%)</div>
                          <div className="flex justify-between items-center mt-1">
                            <span className="font-extrabold text-teal-800">{rec.criteriaWeighted.health} pts</span>
                            <span className="text-[10px] font-mono text-slate-400">Norm: {rec.criteriaNormalized.health}</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                            <div className="bg-teal-600 h-full rounded-full" style={{ width: `${rec.criteriaNormalized.health * 100}%` }} />
                          </div>
                        </div>

                        <div className="bg-white p-2.5 rounded-lg border border-teal-100">
                          <div className="text-slate-500 text-[11px]">Budget Match (20%)</div>
                          <div className="flex justify-between items-center mt-1">
                            <span className="font-extrabold text-teal-800">{rec.criteriaWeighted.budget} pts</span>
                            <span className="text-[10px] font-mono text-slate-400">Norm: {rec.criteriaNormalized.budget}</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                            <div className="bg-teal-600 h-full rounded-full" style={{ width: `${rec.criteriaNormalized.budget * 100}%` }} />
                          </div>
                        </div>

                        <div className="bg-white p-2.5 rounded-lg border border-teal-100">
                          <div className="text-slate-500 text-[11px]">Proximity / Distance (15%)</div>
                          <div className="flex justify-between items-center mt-1">
                            <span className="font-extrabold text-teal-800">{rec.criteriaWeighted.distance} pts</span>
                            <span className="text-[10px] font-mono text-slate-400">{rec.distanceKm} km</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                            <div className="bg-teal-600 h-full rounded-full" style={{ width: `${rec.criteriaNormalized.distance * 100}%` }} />
                          </div>
                        </div>

                        <div className="bg-white p-2.5 rounded-lg border border-teal-100">
                          <div className="text-slate-500 text-[11px]">Restaurant Rating (10%)</div>
                          <div className="flex justify-between items-center mt-1">
                            <span className="font-extrabold text-teal-800">{rec.criteriaWeighted.rating} pts</span>
                            <span className="text-[10px] font-mono text-slate-400">{rec.restaurant.rating}★</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                            <div className="bg-teal-600 h-full rounded-full" style={{ width: `${rec.criteriaNormalized.rating * 100}%` }} />
                          </div>
                        </div>

                        <div className="bg-white p-2.5 rounded-lg border border-teal-100">
                          <div className="text-slate-500 text-[11px]">Delivery Speed (10%)</div>
                          <div className="flex justify-between items-center mt-1">
                            <span className="font-extrabold text-teal-800">{rec.criteriaWeighted.delivery} pts</span>
                            <span className="text-[10px] font-mono text-slate-400">~{rec.deliveryTimeMins}m</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                            <div className="bg-teal-600 h-full rounded-full" style={{ width: `${rec.criteriaNormalized.delivery * 100}%` }} />
                          </div>
                        </div>

                        <div className="bg-white p-2.5 rounded-lg border border-teal-100">
                          <div className="text-slate-500 text-[11px]">Preference & Diet (5%)</div>
                          <div className="flex justify-between items-center mt-1">
                            <span className="font-extrabold text-teal-800">{rec.criteriaWeighted.preference} pts</span>
                            <span className="text-[10px] font-mono text-slate-400">Match</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                            <div className="bg-teal-600 h-full rounded-full" style={{ width: `${rec.criteriaNormalized.preference * 100}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectMealDetail(rec.meal)}
                        className="text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Info className="w-3.5 h-3.5 text-slate-500" />
                        <span>Nutrition Profile</span>
                      </button>

                      <button
                        onClick={() => onConsultDietitian(rec.meal)}
                        className="text-xs font-semibold text-teal-800 hover:text-teal-950 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                        <span>AI Clinical Insight</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {(() => {
                        const links = generateDeliveryLinks(rec.restaurant, rec.meal, { dishSpecific: true });
                        return (
                          <>
                            {/* Direct Swiggy Button */}
                            <a
                              href={links.swiggyCityUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => handleQuickLaunch('Swiggy', links.swiggyCityUrl, rec)}
                              className="text-xs font-bold text-white bg-[#FC8019] hover:bg-[#e47112] px-3 py-1.5 rounded-lg shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                              title={`Directly open and search ${rec.meal.name} on Swiggy`}
                            >
                              <span className="w-2 h-2 rounded-full bg-white/80" />
                              <span>Order on Swiggy</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>

                            {/* Direct Zomato Button */}
                            <a
                              href={links.zomatoCityUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => handleQuickLaunch('Zomato', links.zomatoCityUrl, rec)}
                              className="text-xs font-bold text-white bg-[#E23744] hover:bg-[#c92e3a] px-3 py-1.5 rounded-lg shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                              title={`Directly open and search ${rec.meal.name} on Zomato`}
                            >
                              <span className="w-2 h-2 rounded-full bg-white/80" />
                              <span>Order on Zomato</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>

                            {/* Full Custom Order & Prep Note Modal */}
                            <button
                              onClick={() => onSelectOrder(rec)}
                              className="text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-300 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                              title="Customize diabetic kitchen notes and record order"
                            >
                              <ShoppingBag className="w-3.5 h-3.5 text-teal-700" />
                              <span>Custom Prep</span>
                            </button>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-3 max-w-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <div className="font-bold text-emerald-400">{toastMessage.title}</div>
            <div className="text-slate-300 text-[11px] mt-0.5">{toastMessage.desc}</div>
          </div>
        </div>
      )}
    </div>
  );
};
