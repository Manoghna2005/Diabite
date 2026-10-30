import React, { useState } from 'react';
import { UserProfile, DiabetesType, DietaryPreference, PresetLocation } from '../types';
import { PRESET_LOCATIONS } from '../data/restaurants';
import { calculateBmi } from '../services/mcdmEngine';
import {
  X,
  User,
  HeartPulse,
  Scale,
  DollarSign,
  MapPin,
  Utensils,
  AlertTriangle,
  Compass,
  Check
} from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSave: (updated: UserProfile) => void;
}

const ALLERGY_OPTIONS = [
  'Gluten',
  'Dairy (Lactose)',
  'Peanuts',
  'Soy',
  'Eggs',
  'Shellfish',
  'Legumes'
];

const CUISINE_OPTIONS = [
  'South Indian',
  'North Indian',
  'Healthy Bowls',
  'Continental',
  'Traditional Millets',
  'Salads & Soups'
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onSave
}) => {
  const [formData, setFormData] = useState<UserProfile>({ ...user });
  const [isLocating, setIsLocating] = useState(false);

  if (!isOpen) return null;

  const handleHeightWeightChange = (field: 'heightCm' | 'weightKg', val: number) => {
    const updated = {
      ...formData,
      [field]: val
    };
    const { bmi, category } = calculateBmi(
      field === 'weightKg' ? val : formData.weightKg,
      field === 'heightCm' ? val : formData.heightCm
    );
    updated.bmi = bmi;
    updated.bmiCategory = category;
    setFormData(updated);
  };

  const toggleAllergy = (allergy: string) => {
    const exists = formData.allergies.includes(allergy);
    setFormData({
      ...formData,
      allergies: exists
        ? formData.allergies.filter(a => a !== allergy)
        : [...formData.allergies, allergy]
    });
  };

  const toggleCuisine = (cuisine: string) => {
    const exists = formData.preferredCuisines.includes(cuisine);
    setFormData({
      ...formData,
      preferredCuisines: exists
        ? formData.preferredCuisines.filter(c => c !== cuisine)
        : [...formData.preferredCuisines, cuisine]
    });
  };

  const handlePresetLocation = (loc: PresetLocation) => {
    setFormData({
      ...formData,
      currentLocation: {
        name: loc.name,
        area: loc.area,
        city: loc.city,
        lat: loc.lat,
        lng: loc.lng
      }
    });
  };

  const handleGetGpsLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setIsLocating(false);
        const lat = Number(pos.coords.latitude.toFixed(4));
        const lng = Number(pos.coords.longitude.toFixed(4));

        // Check if user is near VIT Chennai / Kelambakkam (approx 12.8°N, 80.15°E)
        const isNearVitChennai =
          Math.abs(lat - 12.8406) < 0.15 && Math.abs(lng - 80.1534) < 0.15;
        const isNearChennai =
          Math.abs(lat - 13.0) < 0.4 && Math.abs(lng - 80.2) < 0.4;

        let areaName = 'Local Vicinity (GPS)';
        let cityName = 'Current City';

        if (isNearVitChennai) {
          areaName = 'VIT Chennai / Kelambakkam';
          cityName = 'Chennai';
        } else if (isNearChennai) {
          areaName = 'Chennai Region';
          cityName = 'Chennai';
        }

        setFormData({
          ...formData,
          currentLocation: {
            name: `Live Device GPS (${lat}, ${lng})`,
            area: areaName,
            city: cityName,
            lat,
            lng
          }
        });
      },
      err => {
        setIsLocating(false);
        console.warn('GPS location error:', err);
        // Default to VIT Chennai Kelambakkam
        setFormData({
          ...formData,
          currentLocation: {
            name: 'VIT Chennai (Kelambakkam - Vandalur Rd)',
            area: 'VIT Chennai / Kelambakkam',
            city: 'Chennai',
            lat: 12.8406,
            lng: 80.1534
          }
        });
        alert('Browser GPS permission was denied or restricted in preview iframe. Automatically selected VIT Chennai / Kelambakkam location!');
      },
      { timeout: 8000 }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-teal-100 text-teal-700">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Module 1: Diabetic Patient Profile</h2>
              <p className="text-xs text-slate-500">
                Context-aware parameters feeding the Multi-Criteria Recommendation Engine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section 1: Demographics & Diabetes Status */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-teal-600" />
              <span>Demographics & Clinical Profile</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Patient Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Age (Years)</label>
                <input
                  type="number"
                  value={formData.age}
                  min={12}
                  max={100}
                  onChange={e => setFormData({ ...formData, age: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
                <select
                  value={formData.gender}
                  onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-hidden bg-white"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Diabetes Type & Medication */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Diabetes Classification
                </label>
                <select
                  value={formData.diabetesType}
                  onChange={e => setFormData({ ...formData, diabetesType: e.target.value as DiabetesType })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-hidden bg-white"
                >
                  <option value="type2">Type 2 Diabetes Mellitus</option>
                  <option value="type1">Type 1 Diabetes Mellitus</option>
                  <option value="prediabetes">Pre-diabetes (Impaired Glucose Tolerance)</option>
                  <option value="gestational">Gestational Diabetes</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current Regimen / Therapy
                </label>
                <select
                  value={formData.medicationType}
                  onChange={e => setFormData({ ...formData, medicationType: e.target.value as any })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-hidden bg-white"
                >
                  <option value="Oral Hypoglycemics (Metformin)">Oral Hypoglycemics (e.g. Metformin)</option>
                  <option value="Insulin">Insulin Dependent</option>
                  <option value="Diet Controlled">Diet & Lifestyle Controlled</option>
                  <option value="Combination">Combination Therapy</option>
                </select>
              </div>
            </div>

            {/* Height, Weight, and Dynamic BMI */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Height (cm)</label>
                  <input
                    type="number"
                    value={formData.heightCm}
                    min={100}
                    max={230}
                    onChange={e => handleHeightWeightChange('heightCm', Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    value={formData.weightKg}
                    min={30}
                    max={200}
                    onChange={e => handleHeightWeightChange('weightKg', Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg bg-white"
                  />
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
                  <div className="text-xs text-slate-500 font-medium">Calculated BMI</div>
                  <div className="text-lg font-extrabold text-slate-900">
                    {formData.bmi}{' '}
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        formData.bmiCategory === 'Normal'
                          ? 'bg-emerald-100 text-emerald-800'
                          : formData.bmiCategory === 'Overweight'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {formData.bmiCategory}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Glucose Values */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Recent Fasting Glucose (mg/dL)
                </label>
                <input
                  type="number"
                  value={formData.recentFastingGlucose || 120}
                  min={60}
                  max={350}
                  onChange={e => setFormData({ ...formData, recentFastingGlucose: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Recent 2-Hour Postprandial Glucose (mg/dL)
                </label>
                <input
                  type="number"
                  value={formData.recentPostprandialGlucose || 160}
                  min={80}
                  max={450}
                  onChange={e => setFormData({ ...formData, recentPostprandialGlucose: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Dietary Preferences & Allergies */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Utensils className="w-4 h-4 text-teal-600" />
              <span>Dietary Preferences & Allergens</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Dietary Lifestyle</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['veg', 'vegan', 'eggetarian', 'non-veg'] as DietaryPreference[]).map(pref => (
                  <button
                    key={pref}
                    type="button"
                    onClick={() => setFormData({ ...formData, dietaryPreference: pref })}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold border capitalize transition-all ${
                      formData.dietaryPreference === pref
                        ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {pref === 'veg' ? 'Pure Vegetarian' : pref === 'non-veg' ? 'Non-Vegetarian' : pref}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Known Allergies & Intolerances (Strict Exclusion in MCDM)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {ALLERGY_OPTIONS.map(allergy => {
                  const selected = formData.allergies.includes(allergy);
                  return (
                    <button
                      key={allergy}
                      type="button"
                      onClick={() => toggleAllergy(allergy)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1 ${
                        selected
                          ? 'bg-rose-50 text-rose-800 border-rose-300 font-semibold'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {selected && <Check className="w-3 h-3 text-rose-600" />}
                      {allergy}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Preferred Cuisines (Boosts MCDM Preference Score)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {CUISINE_OPTIONS.map(cuisine => {
                  const selected = formData.preferredCuisines.includes(cuisine);
                  return (
                    <button
                      key={cuisine}
                      type="button"
                      onClick={() => toggleCuisine(cuisine)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1 ${
                        selected
                          ? 'bg-teal-50 text-teal-800 border-teal-300 font-semibold'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {selected && <Check className="w-3 h-3 text-teal-600" />}
                      {cuisine}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 3: Budget & Location Context */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-teal-600" />
              <span>Budget & Geographic Location Context</span>
            </h3>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Target Budget Limit per Meal
                </label>
                <span className="text-sm font-extrabold text-teal-700">₹{formData.budgetPerMeal}</span>
              </div>
              <input
                type="range"
                min={70}
                max={450}
                step={10}
                value={formData.budgetPerMeal}
                onChange={e => setFormData({ ...formData, budgetPerMeal: Number(e.target.value) })}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
                <span>₹70 (Ultra-saver)</span>
                <span>₹150 (Typical Meal)</span>
                <span>₹300 (Gourmet / High-protein)</span>
                <span>₹450</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  <span>Current Patient Location (Determines Haversine Distance & Delivery Time)</span>
                </label>
                <button
                  type="button"
                  onClick={handleGetGpsLocation}
                  disabled={isLocating}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-800 bg-teal-50 px-2 py-1 rounded-md border border-teal-200"
                >
                  <Compass className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                  <span>{isLocating ? 'Locating...' : 'Use Device GPS'}</span>
                </button>
              </div>

              {/* Current Active Location Display */}
              <div className="p-3 bg-teal-50/60 border border-teal-200 rounded-lg text-xs flex items-center justify-between mb-2.5">
                <div>
                  <span className="font-bold text-slate-900">{formData.currentLocation.name}</span>
                  <span className="text-slate-500"> ({formData.currentLocation.city})</span>
                </div>
                <span className="font-mono text-slate-500 text-[11px]">
                  {formData.currentLocation.lat.toFixed(3)}, {formData.currentLocation.lng.toFixed(3)}
                </span>
              </div>

              {/* Quick Preset Hubs */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PRESET_LOCATIONS.map(loc => {
                  const isCurrent =
                    formData.currentLocation.lat === loc.lat &&
                    formData.currentLocation.lng === loc.lng;
                  return (
                    <button
                      key={loc.name}
                      type="button"
                      onClick={() => handlePresetLocation(loc)}
                      className={`px-2.5 py-1.5 rounded-lg text-left text-xs border transition-colors ${
                        isCurrent
                          ? 'bg-teal-600 text-white border-teal-600 font-semibold shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="font-bold truncate">{loc.area}</div>
                      <div className={`text-[10px] truncate ${isCurrent ? 'text-teal-100' : 'text-slate-400'}`}>
                        {loc.city}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3 sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition-colors"
            >
              Apply Profile & Recalculate Recommendations
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
