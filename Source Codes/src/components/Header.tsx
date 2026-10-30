import React from 'react';
import { UserProfile, McdmWeights } from '../types';
import { DEFAULT_MCDM_WEIGHTS } from '../data/sampleProfiles';
import {
  Activity,
  Sliders,
  FileText,
  User,
  MapPin,
  Sparkles,
  UtensilsCrossed,
  Store,
  MessageSquareHeart,
  HeartPulse
} from 'lucide-react';

export type AppTab = 'recommendations' | 'meals' | 'restaurants' | 'weights' | 'feedback' | 'report';

interface HeaderProps {
  user: UserProfile;
  activeTab: AppTab;
  onSelectTab?: (tab: AppTab) => void;
  setActiveTab?: (tab: AppTab) => void;
  onOpenProfile?: () => void;
  onOpenProfileModal?: () => void;
  onOpenWeights?: () => void;
  onOpenWeightsModal?: () => void;
  onOpenDietitian?: () => void;
  onOpenDietitianModal?: () => void;
  mcdmWeights?: McdmWeights;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  activeTab,
  onSelectTab,
  setActiveTab,
  onOpenProfile,
  onOpenProfileModal,
  onOpenWeights,
  onOpenWeightsModal,
  onOpenDietitian,
  onOpenDietitianModal,
  mcdmWeights = DEFAULT_MCDM_WEIGHTS
}) => {
  const handleSelectTab = (tab: AppTab) => {
    if (onSelectTab) onSelectTab(tab);
    else if (setActiveTab) setActiveTab(tab);
  };

  const handleOpenProfile = () => {
    if (onOpenProfileModal) onOpenProfileModal();
    else if (onOpenProfile) onOpenProfile();
  };

  const handleOpenWeights = () => {
    if (onOpenWeightsModal) onOpenWeightsModal();
    else if (onOpenWeights) onOpenWeights();
  };

  const handleOpenDietitian = () => {
    if (onOpenDietitianModal) onOpenDietitianModal();
    else if (onOpenDietitian) onOpenDietitian();
  };

  const currentWeights = mcdmWeights || DEFAULT_MCDM_WEIGHTS;
  const healthPercent = Math.round((currentWeights.healthScore ?? 0.40) * 100);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar: Brand + User context badges + Actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-sm shrink-0">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                  DiaBite<span className="text-teal-600">.ai</span>
                </h1>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                  MCDM Recommender
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                  ICMR-NIN & USDA Certified
                </span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-1">
                Context-Aware Personalized Food Recommendation & Smart Ordering for Diabetic Patients
              </p>
            </div>
          </div>

          {/* Quick Context Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleOpenProfile}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Click to edit patient profile"
            >
              <User className="w-3.5 h-3.5 text-teal-600" />
              <span className="font-semibold text-slate-900">{user.name}</span>
              <span className="text-slate-400">•</span>
              <span className="capitalize">{user.diabetesType.replace('type', 'Type ')}</span>
              <span className="text-slate-400">•</span>
              <span className="text-emerald-700 font-semibold">BMI {user.bmi}</span>
            </button>

            <button
              onClick={handleOpenProfile}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Click to change location or budget"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>{user.currentLocation?.area || 'Location'}</span>
              <span className="text-slate-400">•</span>
              <span className="font-semibold text-slate-900">₹{user.budgetPerMeal} cap</span>
            </button>

            <button
              onClick={handleOpenWeights}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 transition-colors cursor-pointer"
              title="Configure MCDM formula criteria weights"
            >
              <Sliders className="w-3.5 h-3.5 text-teal-700" />
              <span className="hidden sm:inline">MCDM Weights:</span>
              <span className="font-semibold">Health {healthPercent}%</span>
            </button>

            <button
              onClick={handleOpenDietitian}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 shadow-xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>AI Dietitian</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 sm:space-x-3 overflow-x-auto py-2 scrollbar-none">
          <button
            onClick={() => handleSelectTab('recommendations')}
            className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'recommendations'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Smart Recommendations</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'recommendations' ? 'bg-teal-700 text-teal-100' : 'bg-slate-200 text-slate-700'
              }`}
            >
              MCDM
            </span>
          </button>

          <button
            onClick={() => handleSelectTab('meals')}
            className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'meals'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Meal Database</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'meals' ? 'bg-teal-700 text-teal-100' : 'bg-slate-200 text-slate-700'
              }`}
            >
              GI / GL
            </span>
          </button>

          <button
            onClick={() => handleSelectTab('restaurants')}
            className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'restaurants'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Nearby Restaurants</span>
          </button>

          <button
            onClick={() => handleSelectTab('weights')}
            className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'weights'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>MCDM Weights Tuning</span>
          </button>

          <button
            onClick={() => handleSelectTab('feedback')}
            className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'feedback'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <MessageSquareHeart className="w-4 h-4" />
            <span>Feedback & Glucose Logs</span>
          </button>

          <button
            onClick={() => handleSelectTab('report')}
            className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'report'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Project Report & Plan</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
