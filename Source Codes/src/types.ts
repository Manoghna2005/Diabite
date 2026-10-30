export type DiabetesType = 'type1' | 'type2' | 'prediabetes' | 'gestational';

export type DietaryPreference = 'veg' | 'vegan' | 'eggetarian' | 'non-veg';

export interface LocationCoords {
  name: string;
  area: string;
  city: string;
  lat: number;
  lng: number;
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  weightKg: number;
  heightCm: number;
  bmi: number;
  bmiCategory: 'Underweight' | 'Normal' | 'Overweight' | 'Obese';
  diabetesType: DiabetesType;
  dietaryPreference: DietaryPreference;
  allergies: string[];
  budgetPerMeal: number; // in INR ₹
  preferredCuisines: string[];
  currentLocation: LocationCoords;
  targetCaloriesPerMeal: number;
  recentFastingGlucose?: number; // mg/dL
  recentPostprandialGlucose?: number; // mg/dL
  medicationType?: 'Insulin' | 'Oral Hypoglycemics (Metformin)' | 'Diet Controlled' | 'Combination';
}

export interface MealItem {
  id: string;
  name: string;
  regionalName?: string;
  cuisine: string;
  category: DietaryPreference;
  portion: string;
  calories: number; // kcal
  protein: number; // g
  fat: number; // g
  carbs: number; // g
  fiber: number; // g
  netCarbs: number; // g (carbs - fiber)
  gi: number; // Glycemic Index (0-100)
  giCategory: 'low' | 'medium' | 'high';
  gl: number; // Glycemic Load = (GI * netCarbs) / 100
  glCategory: 'low' | 'medium' | 'high';
  diabeticScore: number; // 0 - 10 scale computed using ICMR-NIN diabetic dietary guidelines
  description: string;
  keyIngredients: string[];
  diabeticBenefits: string[];
  allergenInfo: string[];
  icmrNinReference: string;
  imageIcon: string;
}

export interface RestaurantMealOffering {
  mealId: string;
  price: number; // in INR ₹
  isAvailable: boolean;
  preparationNote?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisineTypes: string[];
  area: string;
  city: string;
  lat: number;
  lng: number;
  rating: number; // e.g. 4.6
  ratingCount: number;
  hygieneGrade: 'A+' | 'A' | 'B';
  averageDeliverySpeedKmh: number;
  offerings: RestaurantMealOffering[];
  googleMapsPlaceQuery: string;
  zomatoSearchKeyword: string;
  swiggySearchKeyword: string;
}

export interface McdmWeights {
  healthScore: number; // default 0.40
  budgetCompatibility: number; // default 0.20
  distanceProximity: number; // default 0.15
  restaurantRating: number; // default 0.10
  deliveryTime: number; // default 0.10
  userPreferenceMatch: number; // default 0.05
}

export interface RecommendationResult {
  rank: number;
  meal: MealItem;
  restaurant: Restaurant;
  price: number;
  distanceKm: number;
  deliveryTimeMins: number;
  mcdmScore: number; // Normalized 0-10 scale
  criteriaNormalized: {
    health: number; // 0 - 1
    budget: number; // 0 - 1
    distance: number; // 0 - 1 (inverted: closer = higher)
    rating: number; // 0 - 1
    delivery: number; // 0 - 1 (inverted: faster = higher)
    preference: number; // 0 - 1
  };
  criteriaWeighted: {
    health: number;
    budget: number;
    distance: number;
    rating: number;
    delivery: number;
    preference: number;
  };
  explainableReasons: string[];
  diabeticAdvisory: string;
  customOrderNote: string;
}

export interface FeedbackRecord {
  id: string;
  timestamp: string;
  mealId: string;
  mealName: string;
  restaurantId: string;
  restaurantName: string;
  helpful: 'yes' | 'somewhat' | 'no';
  portionSize: 'too_small' | 'just_right' | 'too_large';
  satisfactionRating: number; // 1-5
  tasteRating: number; // 1-5
  postMealGlucoseMgDl?: number;
  userNotes?: string;
}

export interface PresetLocation {
  name: string;
  area: string;
  city: string;
  lat: number;
  lng: number;
}
