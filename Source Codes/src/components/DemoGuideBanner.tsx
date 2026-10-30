import React, { useState } from 'react';
import { UserProfile } from '../types';
import { SAMPLE_PROFILES } from '../data/sampleProfiles';
import {
  PlayCircle,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  User,
  HeartPulse,
  ShoppingBag,
  Activity,
  Sliders,
  X,
  HelpCircle,
  MapPin
} from 'lucide-react';
import { AppTab } from './Header';

interface DemoGuideBannerProps {
  currentUser: UserProfile;
  onSelectUser: (user: UserProfile) => void;
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  onOpenOrderFirstMeal: () => void;
}

export const DemoGuideBanner: React.FC<DemoGuideBannerProps> = ({
  currentUser,
  onSelectUser,
  activeTab,
  onSelectTab,
  onOpenOrderFirstMeal
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white rounded-2xl p-4 shadow-md mb-6 border border-teal-700/50">
      {/* Header of Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-400 text-teal-950 flex items-center justify-center font-bold shrink-0 shadow-xs">
            <PlayCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold tracking-wide">
                Quick Presentation Mode (Demo for Mam)
              </span>
              <span className="text-[10px] bg-teal-400/20 text-teal-200 border border-teal-400/30 px-2 py-0.5 rounded-full font-semibold">
                1-Click Flow
              </span>
            </div>
            <p className="text-xs text-teal-200/80">
              Click the 4 steps below to showcase the entire project smoothly in 2 minutes:
            </p>
          </div>
        </div>

        {/* Quick Patient & Location Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-semibold text-teal-300 mr-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5" /> Patient:
            </span>
            {SAMPLE_PROFILES.map(profile => {
              const isSelected = currentUser.id === profile.id;
              return (
                <button
                  key={profile.id}
                  type="button"
                  onClick={() => onSelectUser(profile)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-teal-400 text-teal-950 shadow-xs font-bold'
                      : 'bg-white/10 hover:bg-white/20 text-teal-100 border border-white/10'
                  }`}
                  title={`Switch profile to ${profile.name}`}
                >
                  {profile.name.split(' ')[0]} ({profile.diabetesType.replace('type', 'T')})
                </button>
              );
            })}
          </div>

          {/* Current Location Pill */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-xs font-semibold">
            <MapPin className="w-3 h-3 text-emerald-400" />
            <span>{currentUser.currentLocation.area}</span>
          </div>
        </div>
      </div>

      {/* 4 Clickable Demo Steps */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mt-3.5 pt-3.5 border-t border-teal-700/60">
        {/* Step 1 */}
        <button
          type="button"
          onClick={() => onSelectTab('recommendations')}
          className={`p-2.5 rounded-xl text-left transition-all border cursor-pointer ${
            activeTab === 'recommendations'
              ? 'bg-teal-700/70 border-teal-400 text-white shadow-xs ring-1 ring-teal-400/40'
              : 'bg-white/5 hover:bg-white/10 border-white/10 text-teal-100'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-teal-300 mb-1">
            <span>Step 1</span>
            <HeartPulse className="w-3.5 h-3.5" />
          </div>
          <div className="font-bold text-xs text-white">Smart Recommendations</div>
          <div className="text-[10px] text-teal-200/80 line-clamp-1 mt-0.5">
            Diabetic meals with Low GL (≤10)
          </div>
        </button>

        {/* Step 2 */}
        <button
          type="button"
          onClick={() => onSelectTab('weights')}
          className={`p-2.5 rounded-xl text-left transition-all border cursor-pointer ${
            activeTab === 'weights'
              ? 'bg-teal-700/70 border-teal-400 text-white shadow-xs ring-1 ring-teal-400/40'
              : 'bg-white/5 hover:bg-white/10 border-white/10 text-teal-100'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-teal-300 mb-1">
            <span>Step 2</span>
            <Sliders className="w-3.5 h-3.5" />
          </div>
          <div className="font-bold text-xs text-white">MCDM Algorithm Formula</div>
          <div className="text-[10px] text-teal-200/80 line-clamp-1 mt-0.5">
            Health 40% + Budget 20% + Dist 15%
          </div>
        </button>

        {/* Step 3 */}
        <button
          type="button"
          onClick={() => onOpenOrderFirstMeal()}
          className="p-2.5 rounded-xl text-left transition-all border bg-white/5 hover:bg-white/10 border-white/10 text-teal-100 cursor-pointer group hover:border-teal-400"
        >
          <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-teal-300 mb-1">
            <span>Step 3</span>
            <ShoppingBag className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          </div>
          <div className="font-bold text-xs text-white">1-Click Ordering & Notes</div>
          <div className="text-[10px] text-teal-200/80 line-clamp-1 mt-0.5">
            Zomato / Swiggy + Low-Oil prep
          </div>
        </button>

        {/* Step 4 */}
        <button
          type="button"
          onClick={() => onSelectTab('feedback')}
          className={`p-2.5 rounded-xl text-left transition-all border cursor-pointer ${
            activeTab === 'feedback'
              ? 'bg-teal-700/70 border-teal-400 text-white shadow-xs ring-1 ring-teal-400/40'
              : 'bg-white/5 hover:bg-white/10 border-white/10 text-teal-100'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-teal-300 mb-1">
            <span>Step 4</span>
            <Activity className="w-3.5 h-3.5" />
          </div>
          <div className="font-bold text-xs text-white">Glucose Feedback Loop</div>
          <div className="text-[10px] text-teal-200/80 line-clamp-1 mt-0.5">
            Logs 2-hr sugar & tunes future meals
          </div>
        </button>
      </div>
    </div>
  );
};
