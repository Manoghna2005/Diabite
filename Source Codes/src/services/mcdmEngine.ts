import {
  UserProfile,
  MealItem,
  Restaurant,
  McdmWeights,
  RecommendationResult,
  LocationCoords
} from '../types';
import { MEAL_DATABASE } from '../data/meals';
import { RESTAURANTS_DATABASE } from '../data/restaurants';

export const DEFAULT_MCDM_WEIGHTS: McdmWeights = {
  healthScore: 0.40,
  budgetCompatibility: 0.20,
  distanceProximity: 0.15,
  restaurantRating: 0.10,
  deliveryTime: 0.10,
  userPreferenceMatch: 0.05
};

export const WEIGHT_PRESETS: Record<string, { label: string; description: string; weights: McdmWeights }> = {
  balanced: {
    label: 'Standard Balanced (Project Spec)',
    description: '40% Health, 20% Budget, 15% Distance, 10% Rating, 10% Delivery, 5% Preference',
    weights: {
      healthScore: 0.40,
      budgetCompatibility: 0.20,
      distanceProximity: 0.15,
      restaurantRating: 0.10,
      deliveryTime: 0.10,
      userPreferenceMatch: 0.05
    }
  },
  strictGlycemic: {
    label: 'Strict Glycemic Control',
    description: 'Prioritizes lowest Glycemic Load and highest fiber for elevated blood glucose days',
    weights: {
      healthScore: 0.60,
      budgetCompatibility: 0.10,
      distanceProximity: 0.10,
      restaurantRating: 0.05,
      deliveryTime: 0.10,
      userPreferenceMatch: 0.05
    }
  },
  budgetSaver: {
    label: 'Budget Conscious',
    description: 'Prioritizes maximum affordability and meal value under tight budget limits',
    weights: {
      healthScore: 0.30,
      budgetCompatibility: 0.40,
      distanceProximity: 0.10,
      restaurantRating: 0.05,
      deliveryTime: 0.10,
      userPreferenceMatch: 0.05
    }
  },
  expressDelivery: {
    label: 'Fastest Proximity & Delivery',
    description: 'For busy days when meals are needed urgently within 20 minutes',
    weights: {
      healthScore: 0.30,
      budgetCompatibility: 0.15,
      distanceProximity: 0.25,
      restaurantRating: 0.05,
      deliveryTime: 0.20,
      userPreferenceMatch: 0.05
    }
  }
};

/**
 * Calculates Haversine distance in kilometers between two geo-coordinates
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

/**
 * Normalizes values between min and max into a [0, 1] range
 */
export function normalizeBenefit(value: number, min: number, max: number): number {
  if (max <= min) return 1.0;
  const clamped = Math.max(min, Math.min(max, value));
  return (clamped - min) / (max - min);
}

export function normalizeCost(value: number, min: number, max: number): number {
  if (max <= min) return 1.0;
  const clamped = Math.max(min, Math.min(max, value));
  return (max - clamped) / (max - min);
}

/**
 * Executes the Multi-Criteria Decision Making (MCDM) algorithm:
 * Pairs each available meal with nearby restaurants,
 * filters by allergy and diet restrictions,
 * calculates 6 criterion scores,
 * aggregates using Weighted Sum Model (WSM),
 * and generates Explainable AI justifications.
 */
export function runMcdmRecommendation(
  user: UserProfile,
  weights: McdmWeights = DEFAULT_MCDM_WEIGHTS,
  allMeals: MealItem[] = MEAL_DATABASE,
  allRestaurants: Restaurant[] = RESTAURANTS_DATABASE
): RecommendationResult[] {
  const pairs: { meal: MealItem; restaurant: Restaurant; price: number; distanceKm: number; deliveryTimeMins: number }[] = [];

  for (const restaurant of allRestaurants) {
    // Calculate realistic distance to user's location
    let dist = calculateDistanceKm(
      user.currentLocation.lat,
      user.currentLocation.lng,
      restaurant.lat,
      restaurant.lng
    );
    // If distance is zero or negligible, assign minimal 0.8km baseline
    if (dist < 0.3) dist = 0.8;

    // Delivery time = prep time (12 min) + transit time
    const speed = restaurant.averageDeliverySpeedKmh || 18;
    const transitMins = (dist / speed) * 60;
    const deliveryTimeMins = Math.round(12 + transitMins);

    for (const offering of restaurant.offerings) {
      if (!offering.isAvailable) continue;
      const meal = allMeals.find(m => m.id === offering.mealId);
      if (!meal) continue;

      // Strict Allergy Check: If meal allergens intersect with user allergies, eliminate
      const hasAllergyConflict = meal.allergenInfo.some(allergen =>
        user.allergies.some(userAllergy =>
          allergen.toLowerCase().includes(userAllergy.toLowerCase())
        )
      );
      if (hasAllergyConflict) continue;

      // Dietary Preference Check
      if (user.dietaryPreference === 'vegan' && meal.category !== 'vegan') continue;
      if (user.dietaryPreference === 'veg' && meal.category !== 'veg' && meal.category !== 'vegan') continue;
      if (user.dietaryPreference === 'eggetarian' && meal.category === 'non-veg') continue;

      pairs.push({
        meal,
        restaurant,
        price: offering.price,
        distanceKm: dist,
        deliveryTimeMins
      });
    }
  }

  // Multi-Criteria Scoring for each pair
  const scoredItems = pairs.map(pair => {
    const { meal, restaurant, price, distanceKm, deliveryTimeMins } = pair;

    // 1. Health Score (0 - 1)
    // Based on diabeticScore (0-10), penalized by Glycemic Load (GL)
    let healthNorm = meal.diabeticScore / 10;
    if (meal.gl > 15) {
      healthNorm -= 0.15;
    } else if (meal.gl <= 6) {
      healthNorm += 0.05;
    }
    if (meal.fiber >= 7) healthNorm += 0.05;
    healthNorm = Math.min(1.0, Math.max(0.1, healthNorm));

    // 2. Budget Compatibility (0 - 1)
    let budgetNorm = 0.5;
    if (price <= user.budgetPerMeal) {
      // Comfortably below or at budget: reward higher savings while not over-penalizing decent dishes
      const savingsRatio = (user.budgetPerMeal - price) / user.budgetPerMeal;
      budgetNorm = 0.75 + 0.25 * Math.min(1.0, savingsRatio);
    } else {
      // Over budget: penalize proportionally
      const overRatio = (price - user.budgetPerMeal) / user.budgetPerMeal;
      budgetNorm = Math.max(0.1, 0.70 - overRatio * 0.8);
    }

    // 3. Distance Proximity (0 - 1) [cost: lower is better]
    // Max reference distance = 10km
    const distanceNorm = normalizeCost(distanceKm, 0.5, 8.0);

    // 4. Restaurant Rating (0 - 1) [benefit: higher is better]
    const ratingNorm = normalizeBenefit(restaurant.rating, 3.5, 5.0);

    // 5. Delivery Time (0 - 1) [cost: faster is better]
    // 15 mins is best, 55 mins is worst
    const deliveryNorm = normalizeCost(deliveryTimeMins, 15, 55);

    // 6. User Preference Match (0 - 1)
    let preferenceNorm = 0.5;
    const isCuisinePreferred = user.preferredCuisines.some(c =>
      meal.cuisine.toLowerCase().includes(c.toLowerCase()) ||
      restaurant.cuisineTypes.some(rc => rc.toLowerCase().includes(c.toLowerCase()))
    );
    if (isCuisinePreferred) preferenceNorm += 0.4;
    if (user.dietaryPreference === meal.category) preferenceNorm += 0.1;
    preferenceNorm = Math.min(1.0, preferenceNorm);

    // Normalize weights so sum is 1.0
    const sumW =
      weights.healthScore +
      weights.budgetCompatibility +
      weights.distanceProximity +
      weights.restaurantRating +
      weights.deliveryTime +
      weights.userPreferenceMatch;

    const wH = weights.healthScore / sumW;
    const wB = weights.budgetCompatibility / sumW;
    const wD = weights.distanceProximity / sumW;
    const wR = weights.restaurantRating / sumW;
    const wT = weights.deliveryTime / sumW;
    const wP = weights.userPreferenceMatch / sumW;

    // Weighted Sum Model (WSM) Aggregation
    const wHealth = healthNorm * wH;
    const wBudget = budgetNorm * wB;
    const wDist = distanceNorm * wD;
    const wRating = ratingNorm * wR;
    const wDeliv = deliveryNorm * wT;
    const wPref = preferenceNorm * wP;

    const overallScore0To1 = wHealth + wBudget + wDist + wRating + wDeliv + wPref;
    const mcdmScore = Math.round(overallScore0To1 * 100) / 10; // Scaled to 0.0 - 10.0 scale

    // Explainable AI reasons generation
    const reasons: string[] = [];
    if (meal.gl <= 8) {
      reasons.push(`Low estimated glycemic load of ${meal.gl} minimizes post-meal blood sugar fluctuations.`);
    } else if (meal.gl <= 12) {
      reasons.push(`Moderate glycemic load (${meal.gl}) well balanced with complex carbohydrates.`);
    }

    if (meal.fiber >= 7) {
      reasons.push(`Rich in soluble dietary fiber (${meal.fiber}g) to delay gastric carbohydrate absorption.`);
    }

    if (price <= user.budgetPerMeal) {
      const savings = user.budgetPerMeal - price;
      if (savings > 0) {
        reasons.push(`Within your ₹${user.budgetPerMeal} budget (saves ₹${savings} at ₹${price}).`);
      } else {
        reasons.push(`Exactly matches your ₹${user.budgetPerMeal} meal budget limit.`);
      }
    } else {
      reasons.push(`Priced at ₹${price} (slightly exceeds your ₹${user.budgetPerMeal} target).`);
    }

    if (distanceKm <= 2.0) {
      reasons.push(`Close proximity: only ${distanceKm} km away from your location (~${deliveryTimeMins} mins delivery).`);
    } else {
      reasons.push(`Accessible restaurant (${distanceKm} km, est. ${deliveryTimeMins} mins delivery).`);
    }

    if (restaurant.rating >= 4.5) {
      reasons.push(`Highly rated restaurant (${restaurant.rating}★ with ${restaurant.ratingCount.toLocaleString()} reviews).`);
    }

    if (meal.protein >= 12) {
      reasons.push(`High protein content (${meal.protein}g) stimulates satiety and preserves muscle mass.`);
    }

    const diabeticAdvisory = meal.diabeticBenefits[0] || 'Suitable for low-glycemic dietary regimens.';
    const customOrderNote = `Diabetic Order: Please prepare with minimal cooking oil, no added white sugar in curries or accompaniments, and serve sauce/chutneys on the side.`;

    return {
      rank: 0,
      meal,
      restaurant,
      price,
      distanceKm,
      deliveryTimeMins,
      mcdmScore,
      criteriaNormalized: {
        health: Math.round(healthNorm * 100) / 100,
        budget: Math.round(budgetNorm * 100) / 100,
        distance: Math.round(distanceNorm * 100) / 100,
        rating: Math.round(ratingNorm * 100) / 100,
        delivery: Math.round(deliveryNorm * 100) / 100,
        preference: Math.round(preferenceNorm * 100) / 100,
      },
      criteriaWeighted: {
        health: Math.round(wHealth * 1000) / 100,
        budget: Math.round(wBudget * 1000) / 100,
        distance: Math.round(wDist * 1000) / 100,
        rating: Math.round(wRating * 1000) / 100,
        delivery: Math.round(wDeliv * 1000) / 100,
        preference: Math.round(wPref * 1000) / 100,
      },
      explainableReasons: reasons.slice(0, 5),
      diabeticAdvisory,
      customOrderNote
    };
  });

  // Sort descending by MCDM score
  scoredItems.sort((a, b) => b.mcdmScore - a.mcdmScore);

  // Assign ranks
  return scoredItems.map((item, index) => ({
    ...item,
    rank: index + 1
  }));
}

/**
 * Calculates BMI and classifies status
 */
export function calculateBmi(weightKg: number, heightCm: number): { bmi: number; category: UserProfile['bmiCategory'] } {
  if (!weightKg || !heightCm) return { bmi: 22.0, category: 'Normal' };
  const heightM = heightCm / 100;
  const bmi = Math.round((weightKg / (heightM * heightM)) * 10) / 10;

  let category: UserProfile['bmiCategory'] = 'Normal';
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi < 25.0) category = 'Normal';
  else if (bmi < 30.0) category = 'Overweight';
  else category = 'Obese';

  return { bmi, category };
}

/**
 * Generates initial default patient profile
 */
export function createDefaultUserProfile(): UserProfile {
  return {
    id: 'user-001',
    name: 'Rajesh Sharma',
    age: 48,
    gender: 'male',
    weightKg: 72,
    heightCm: 172,
    bmi: 24.3,
    bmiCategory: 'Normal',
    diabetesType: 'type2',
    dietaryPreference: 'veg',
    allergies: [],
    budgetPerMeal: 150, // ₹150 budget
    preferredCuisines: ['South Indian', 'Healthy Bowls', 'North Indian'],
    currentLocation: {
      name: 'Indiranagar 100ft Road',
      area: 'Indiranagar',
      city: 'Bengaluru',
      lat: 12.9784,
      lng: 77.6408
    },
    targetCaloriesPerMeal: 450,
    recentFastingGlucose: 132,
    recentPostprandialGlucose: 168,
    medicationType: 'Oral Hypoglycemics (Metformin)'
  };
}
