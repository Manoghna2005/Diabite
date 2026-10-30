import { UserProfile, McdmWeights } from '../types';
import { PRESET_LOCATIONS } from './restaurants';

export const DEFAULT_MCDM_WEIGHTS: McdmWeights = {
  healthScore: 0.40,
  budgetCompatibility: 0.20,
  distanceProximity: 0.15,
  restaurantRating: 0.10,
  deliveryTime: 0.10,
  userPreferenceMatch: 0.05
};

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'patient-01',
  name: 'Ramesh Kumar',
  age: 52,
  gender: 'male',
  weightKg: 78,
  heightCm: 172,
  bmi: 26.4,
  bmiCategory: 'Overweight',
  diabetesType: 'type2',
  dietaryPreference: 'veg',
  allergies: [],
  budgetPerMeal: 220,
  preferredCuisines: ['South Indian', 'Healthy Bowls', 'North Indian'],
  currentLocation: PRESET_LOCATIONS[0], // VIT Chennai (Kelambakkam - Vandalur Rd)
  targetCaloriesPerMeal: 450,
  recentFastingGlucose: 136,
  recentPostprandialGlucose: 168,
  medicationType: 'Oral Hypoglycemics (Metformin)'
};

export const SAMPLE_PROFILES: UserProfile[] = [
  DEFAULT_USER_PROFILE,
  {
    id: 'patient-02',
    name: 'Priya Sundaram',
    age: 38,
    gender: 'female',
    weightKg: 62,
    heightCm: 160,
    bmi: 24.2,
    bmiCategory: 'Normal',
    diabetesType: 'prediabetes',
    dietaryPreference: 'vegan',
    allergies: ['dairy'],
    budgetPerMeal: 280,
    preferredCuisines: ['Healthy Bowls', 'South Indian'],
    currentLocation: PRESET_LOCATIONS[1], // Kelambakkam Junction
    targetCaloriesPerMeal: 400,
    recentFastingGlucose: 108,
    recentPostprandialGlucose: 135,
    medicationType: 'Diet Controlled'
  },
  {
    id: 'patient-03',
    name: 'Vikram Mehta',
    age: 29,
    gender: 'male',
    weightKg: 74,
    heightCm: 178,
    bmi: 23.4,
    bmiCategory: 'Normal',
    diabetesType: 'type1',
    dietaryPreference: 'eggetarian',
    allergies: [],
    budgetPerMeal: 350,
    preferredCuisines: ['Continental', 'Healthy Bowls'],
    currentLocation: PRESET_LOCATIONS[2], // Navalur OMR
    targetCaloriesPerMeal: 550,
    recentFastingGlucose: 122,
    recentPostprandialGlucose: 145,
    medicationType: 'Insulin'
  }
];
