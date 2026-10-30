import React from 'react';
import { McdmWeights } from '../types';
import { WEIGHT_PRESETS } from '../services/mcdmEngine';
import { DEFAULT_MCDM_WEIGHTS } from '../data/sampleProfiles';
import { Sliders, RotateCcw, HelpCircle, Check, Sparkles, X } from 'lucide-react';

interface McdmWeightsPanelProps {
  weights: McdmWeights;
  onChangeWeights: (weights: McdmWeights) => void;
  isOpen?: boolean;
  onClose?: () => void;
  onResetWeights?: () => void;
  asModal?: boolean;
}

export const McdmWeightsPanel: React.FC<McdmWeightsPanelProps> = ({
  weights = DEFAULT_MCDM_WEIGHTS,
  onChangeWeights,
  isOpen = true,
  onClose,
  onResetWeights,
  asModal = false
}) => {
  if (asModal && !isOpen) return null;

  const currentWeights = weights || DEFAULT_MCDM_WEIGHTS;

  const handleSliderChange = (key: keyof McdmWeights, val: number) => {
    onChangeWeights({
      ...currentWeights,
      [key]: val / 100,
    });
  };

  const handleApplyPreset = (presetKey: string) => {
    const preset = WEIGHT_PRESETS[presetKey];
    if (preset) {
      onChangeWeights({ ...preset.weights });
    }
  };

  const totalPercentage = Math.round(
    ((currentWeights.healthScore ?? 0.4) +
      (currentWeights.budgetCompatibility ?? 0.2) +
      (currentWeights.distanceProximity ?? 0.15) +
      (currentWeights.restaurantRating ?? 0.1) +
      (currentWeights.deliveryTime ?? 0.1) +
      (currentWeights.userPreferenceMatch ?? 0.05)) *
      100
  );

  const panelContent = (
    <div className="bg-white w-full rounded-2xl shadow-xs border border-slate-200 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-teal-100 text-teal-700">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              Module 4: Multi-Criteria Decision Making (MCDM) Tuner
            </h2>
            <p className="text-xs text-slate-500">
              Tune criteria weights or select clinical presets to simulate recommendation rankings
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onResetWeights && (
            <button
              type="button"
              onClick={onResetWeights}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6 flex-1 overflow-y-auto">
        {/* Mathematical Formula Preview */}
        <div className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs space-y-2">
          <div className="text-teal-400 font-bold flex items-center justify-between">
            <span>MCDM Formula (Weighted Sum Model):</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                totalPercentage === 100
                  ? 'bg-emerald-800 text-emerald-200'
                  : 'bg-amber-800 text-amber-200'
              }`}
            >
              Sum = {totalPercentage}% {totalPercentage === 100 ? '(Balanced)' : '(Unbalanced)'}
            </span>
          </div>
          <div className="text-[11px] text-slate-300 leading-relaxed">
            Overall Score = ({Math.round(currentWeights.healthScore * 100)}% × Health) + (
            {Math.round(currentWeights.budgetCompatibility * 100)}% × Budget) + (
            {Math.round(currentWeights.distanceProximity * 100)}% × Proximity) + (
            {Math.round(currentWeights.restaurantRating * 100)}% × Rating) + (
            {Math.round(currentWeights.deliveryTime * 100)}% × Speed) + (
            {Math.round(currentWeights.userPreferenceMatch * 100)}% × Preference)
          </div>
        </div>

        {/* Presets */}
        <div>
          <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
            Clinical & Lifestyle Presets
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {Object.entries(WEIGHT_PRESETS).map(([key, preset]) => (
              <button
                key={key}
                type="button"
                onClick={() => handleApplyPreset(key)}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-teal-400 bg-slate-50 hover:bg-teal-50/50 text-left transition-all cursor-pointer"
              >
                <div className="font-bold text-xs text-slate-900 flex items-center justify-between">
                  <span>{preset.label}</span>
                  <span className="text-[10px] text-teal-700 bg-teal-100/70 px-1.5 py-0.5 rounded">
                    Preset
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">{preset.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Sliders */}
        <div className="space-y-4 pt-2 border-t border-slate-200">
          <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
            Fine-Tune Individual Criterion Weights
          </label>

          {/* 1. Health Score */}
          <div className="space-y-1.5 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-slate-800">
                1. Diabetic Health Compatibility (GI, GL, Fiber)
              </span>
              <span className="font-mono font-bold text-teal-700">
                {Math.round(currentWeights.healthScore * 100)}%
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={80}
              step={5}
              value={Math.round(currentWeights.healthScore * 100)}
              onChange={e => handleSliderChange('healthScore', Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">
              Prioritizes Glycemic Load ≤ 10, low saturated fats, and high dietary fiber content.
            </p>
          </div>

          {/* 2. Budget Compatibility */}
          <div className="space-y-1.5 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-slate-800">
                2. Budget Compatibility (Per-meal spending limit)
              </span>
              <span className="font-mono font-bold text-teal-700">
                {Math.round(currentWeights.budgetCompatibility * 100)}%
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={50}
              step={5}
              value={Math.round(currentWeights.budgetCompatibility * 100)}
              onChange={e => handleSliderChange('budgetCompatibility', Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">
              Penalizes meals that exceed user budget limit and rewards economical nutrient-dense options.
            </p>
          </div>

          {/* 3. Distance Proximity */}
          <div className="space-y-1.5 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-slate-800">
                3. Proximity / Geographic Distance (km)
              </span>
              <span className="font-mono font-bold text-teal-700">
                {Math.round(currentWeights.distanceProximity * 100)}%
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={40}
              step={5}
              value={Math.round(currentWeights.distanceProximity * 100)}
              onChange={e => handleSliderChange('distanceProximity', Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">
              Calculates shortest Haversine transit distance from user current location coordinates.
            </p>
          </div>

          {/* 4. Restaurant Rating */}
          <div className="space-y-1.5 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-slate-800">
                4. Restaurant Rating & Hygiene Grade
              </span>
              <span className="font-mono font-bold text-teal-700">
                {Math.round(currentWeights.restaurantRating * 100)}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={30}
              step={5}
              value={Math.round(currentWeights.restaurantRating * 100)}
              onChange={e => handleSliderChange('restaurantRating', Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">
              Incorporates customer review rating stars (out of 5.0) and food safety audit scores.
            </p>
          </div>

          {/* 5. Delivery Time */}
          <div className="space-y-1.5 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-slate-800">
                5. Delivery Transit Speed (estimated minutes)
              </span>
              <span className="font-mono font-bold text-teal-700">
                {Math.round(currentWeights.deliveryTime * 100)}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={30}
              step={5}
              value={Math.round(currentWeights.deliveryTime * 100)}
              onChange={e => handleSliderChange('deliveryTime', Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">
              Crucial for diabetic patients who must adhere to strict meal timing schedules with medication.
            </p>
          </div>

          {/* 6. User Preference Match */}
          <div className="space-y-1.5 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-slate-800">
                6. User Dietary & Regional Cuisine Match
              </span>
              <span className="font-mono font-bold text-teal-700">
                {Math.round(currentWeights.userPreferenceMatch * 100)}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={25}
              step={5}
              value={Math.round(currentWeights.userPreferenceMatch * 100)}
              onChange={e => handleSliderChange('userPreferenceMatch', Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">
              Matches preferred cuisine types (South Indian, North Indian, Healthy Bowls) and dietary restrictions.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      {onClose && (
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-xs transition-colors cursor-pointer"
          >
            Apply & Recalculate Scores
          </button>
        </div>
      )}
    </div>
  );

  if (asModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
        <div className="w-full max-w-xl max-h-[90vh] my-8 flex flex-col">
          {panelContent}
        </div>
      </div>
    );
  }

  return panelContent;
};
