import { Restaurant, PresetLocation } from '../types';

export const PRESET_LOCATIONS: PresetLocation[] = [
  {
    name: 'VIT Chennai (Kelambakkam - Vandalur Rd)',
    area: 'VIT Chennai / Kelambakkam',
    city: 'Chennai',
    lat: 12.8406,
    lng: 80.1534
  },
  {
    name: 'Kelambakkam Junction (OMR)',
    area: 'Kelambakkam',
    city: 'Chennai',
    lat: 12.7870,
    lng: 80.2195
  },
  {
    name: 'Navalur / Siruseri SIPCOT (OMR)',
    area: 'Navalur (OMR)',
    city: 'Chennai',
    lat: 12.8465,
    lng: 80.2265
  },
  {
    name: 'T. Nagar (Panagal Park)',
    area: 'T. Nagar',
    city: 'Chennai',
    lat: 13.0418,
    lng: 80.2341
  },
  {
    name: 'Indiranagar 100ft Road',
    area: 'Indiranagar',
    city: 'Bengaluru',
    lat: 12.9784,
    lng: 77.6408
  },
  {
    name: 'Koramangala 5th Block',
    area: 'Koramangala',
    city: 'Bengaluru',
    lat: 12.9352,
    lng: 77.6245
  },
  {
    name: 'Connaught Place Inner Circle',
    area: 'Connaught Place',
    city: 'New Delhi',
    lat: 28.6315,
    lng: 77.2167
  }
];

export const RESTAURANTS_DATABASE: Restaurant[] = [
  {
    id: 'rest-001',
    name: 'A2B - Adyar Ananda Bhavan',
    cuisineTypes: ['South Indian', 'Vegetarian', 'Diabetic Friendly'],
    area: 'Indiranagar',
    city: 'Bengaluru',
    lat: 12.9750,
    lng: 77.6380,
    rating: 4.6,
    ratingCount: 3420,
    hygieneGrade: 'A+',
    averageDeliverySpeedKmh: 18,
    googleMapsPlaceQuery: 'A2B Adyar Ananda Bhavan Indiranagar Bengaluru',
    zomatoSearchKeyword: 'A2B Adyar Ananda Bhavan',
    swiggySearchKeyword: 'A2B Adyar Ananda Bhavan',
    offerings: [
      { mealId: 'meal-001', price: 90, isAvailable: true, preparationNote: 'Steamed fresh every 20 mins with low-sodium sambar' },
      { mealId: 'meal-002', price: 130, isAvailable: true, preparationNote: 'Cooked on iron griddle with cold-pressed sesame oil' },
      { mealId: 'meal-005', price: 110, isAvailable: true, preparationNote: 'No sugar added, steamed veggies' }
    ]
  },
  {
    id: 'rest-002',
    name: 'Murugan Idli Shop',
    cuisineTypes: ['South Indian', 'Traditional Millets'],
    area: 'Indiranagar',
    city: 'Bengaluru',
    lat: 12.9810,
    lng: 77.6450,
    rating: 4.7,
    ratingCount: 4890,
    hygieneGrade: 'A+',
    averageDeliverySpeedKmh: 16,
    googleMapsPlaceQuery: 'Murugan Idli Shop Indiranagar Bengaluru',
    zomatoSearchKeyword: 'Murugan Idli Shop',
    swiggySearchKeyword: 'Murugan Idli Shop',
    offerings: [
      { mealId: 'meal-001', price: 95, isAvailable: true, preparationNote: 'Fluffy authentic steamed rice & urad dal cakes' },
      { mealId: 'meal-002', price: 140, isAvailable: true, preparationNote: 'Pure ragi grain batter, served with 4 diabetic chutneys' },
      { mealId: 'meal-003', price: 145, isAvailable: true, preparationNote: 'Gently tempered with fresh black pepper and ginger' }
    ]
  },
  {
    id: 'rest-003',
    name: 'Sangeetha Veg Restaurant',
    cuisineTypes: ['South Indian', 'Pure Veg', 'Nutritious Bowls'],
    area: 'Indiranagar',
    city: 'Bengaluru',
    lat: 12.9710,
    lng: 77.6350,
    rating: 4.5,
    ratingCount: 2910,
    hygieneGrade: 'A',
    averageDeliverySpeedKmh: 17,
    googleMapsPlaceQuery: 'Sangeetha Veg Restaurant Indiranagar',
    zomatoSearchKeyword: 'Sangeetha Veg Restaurant',
    swiggySearchKeyword: 'Sangeetha Veg Restaurant',
    offerings: [
      { mealId: 'meal-002', price: 135, isAvailable: true },
      { mealId: 'meal-003', price: 150, isAvailable: true, preparationNote: 'Specially recommended for diabetic patients by local dietitians' },
      { mealId: 'meal-006', price: 160, isAvailable: true, preparationNote: 'Served with oil-free tadka methi palak dal' },
      { mealId: 'meal-012', price: 180, isAvailable: true }
    ]
  },
  {
    id: 'rest-004',
    name: 'The Green Path - Organic State',
    cuisineTypes: ['Organic', 'Millets', 'Diabetic Wellness'],
    area: 'Indiranagar',
    city: 'Bengaluru',
    lat: 12.9850,
    lng: 77.6390,
    rating: 4.8,
    ratingCount: 1680,
    hygieneGrade: 'A+',
    averageDeliverySpeedKmh: 15,
    googleMapsPlaceQuery: 'The Green Path Organic Restaurant Bengaluru',
    zomatoSearchKeyword: 'The Green Path Organic',
    swiggySearchKeyword: 'The Green Path',
    offerings: [
      { mealId: 'meal-002', price: 160, isAvailable: true, preparationNote: '100% certified organic finger millet flour' },
      { mealId: 'meal-003', price: 175, isAvailable: true, preparationNote: 'Organic foxtail millet with sprouted green moong' },
      { mealId: 'meal-005', price: 140, isAvailable: true },
      { mealId: 'meal-008', price: 130, isAvailable: true, preparationNote: 'Fresh sprouts tossed with rock salt and organic lemon' }
    ]
  },
  {
    id: 'rest-005',
    name: 'Healthie & Salad Days Kitchen',
    cuisineTypes: ['Healthy Bowls', 'High Protein', 'Keto & Diabetic'],
    area: 'Indiranagar',
    city: 'Bengaluru',
    lat: 12.9730,
    lng: 77.6430,
    rating: 4.6,
    ratingCount: 2210,
    hygieneGrade: 'A+',
    averageDeliverySpeedKmh: 20,
    googleMapsPlaceQuery: 'Salad Days Indiranagar Bengaluru',
    zomatoSearchKeyword: 'Salad Days',
    swiggySearchKeyword: 'Salad Days',
    offerings: [
      { mealId: 'meal-007', price: 260, isAvailable: true, preparationNote: 'Royal Andean quinoa with organic low fat paneer' },
      { mealId: 'meal-008', price: 150, isAvailable: true, preparationNote: 'Packed with pomegranate seeds and mint lemon dressing' },
      { mealId: 'meal-011', price: 290, isAvailable: true, preparationNote: 'Herb roasted chicken breast with zero added refined sugars' }
    ]
  },
  {
    id: 'rest-006',
    name: 'Punjab Grill - Wellness Menu',
    cuisineTypes: ['North Indian', 'Tandoor & Grills'],
    area: 'Indiranagar',
    city: 'Bengaluru',
    lat: 12.9690,
    lng: 77.6460,
    rating: 4.7,
    ratingCount: 3890,
    hygieneGrade: 'A+',
    averageDeliverySpeedKmh: 16,
    googleMapsPlaceQuery: 'Punjab Grill Indiranagar Bengaluru',
    zomatoSearchKeyword: 'Punjab Grill',
    swiggySearchKeyword: 'Punjab Grill',
    offerings: [
      { mealId: 'meal-004', price: 180, isAvailable: true, preparationNote: 'Bengal gram chilla prepared with roasted cumin and paneer' },
      { mealId: 'meal-006', price: 190, isAvailable: true, preparationNote: 'Multigrain barley-wheat tandoori rotis with methi dal' },
      { mealId: 'meal-010', price: 170, isAvailable: true, preparationNote: '3-egg scramble with cold-pressed mustard oil' },
      { mealId: 'meal-012', price: 240, isAvailable: true, preparationNote: 'Brown basmati biryani with vegetable medley' }
    ]
  },
  {
    id: 'rest-007',
    name: 'EatFit - Fit Meals & Nutrition',
    cuisineTypes: ['Healthy Bowls', 'North Indian', 'Calorie Counted'],
    area: 'Indiranagar',
    city: 'Bengaluru',
    lat: 12.9770,
    lng: 77.6320,
    rating: 4.5,
    ratingCount: 8400,
    hygieneGrade: 'A+',
    averageDeliverySpeedKmh: 22,
    googleMapsPlaceQuery: 'EatFit Indiranagar Bengaluru',
    zomatoSearchKeyword: 'EatFit',
    swiggySearchKeyword: 'EatFit',
    offerings: [
      { mealId: 'meal-004', price: 149, isAvailable: true, preparationNote: 'Diabetic certified recipe with macro tracking' },
      { mealId: 'meal-006', price: 169, isAvailable: true },
      { mealId: 'meal-010', price: 159, isAvailable: true },
      { mealId: 'meal-012', price: 199, isAvailable: true, preparationNote: 'Cinnamon infused unpolished brown basmati' }
    ]
  },
  {
    id: 'rest-008',
    name: 'Smoke House Deli',
    cuisineTypes: ['Continental', 'European', 'Clean Eating'],
    area: 'Indiranagar',
    city: 'Bengaluru',
    lat: 12.9820,
    lng: 77.6350,
    rating: 4.6,
    ratingCount: 2750,
    hygieneGrade: 'A+',
    averageDeliverySpeedKmh: 17,
    googleMapsPlaceQuery: 'Smoke House Deli Indiranagar Bengaluru',
    zomatoSearchKeyword: 'Smoke House Deli',
    swiggySearchKeyword: 'Smoke House Deli',
    offerings: [
      { mealId: 'meal-007', price: 320, isAvailable: true },
      { mealId: 'meal-009', price: 380, isAvailable: true, preparationNote: 'Steamed sea bass with ginger scallion dressing & brown rice' },
      { mealId: 'meal-011', price: 340, isAvailable: true, preparationNote: 'Charcoal grilled chicken with rosemary & steamed beans' }
    ]
  },
  {
    id: 'rest-009',
    name: 'Sangeetha Veg Restaurant (OMR Navalur)',
    cuisineTypes: ['South Indian', 'Pure Veg', 'Nutritious Bowls'],
    area: 'Navalur (OMR)',
    city: 'Chennai',
    lat: 12.8460,
    lng: 80.2260,
    rating: 4.6,
    ratingCount: 4120,
    hygieneGrade: 'A+',
    averageDeliverySpeedKmh: 20,
    googleMapsPlaceQuery: 'Sangeetha Veg Restaurant OMR Navalur Chennai',
    zomatoSearchKeyword: 'Sangeetha Veg Restaurant Navalur',
    swiggySearchKeyword: 'Sangeetha Veg Restaurant Navalur',
    offerings: [
      { mealId: 'meal-001', price: 85, isAvailable: true, preparationNote: 'Fresh steamed idli with low-sodium vegetable sambar' },
      { mealId: 'meal-002', price: 120, isAvailable: true, preparationNote: 'Crisp ragi dosa with sugar-free tomato onion chutney' },
      { mealId: 'meal-003', price: 140, isAvailable: true, preparationNote: 'Foxtail millet pongal tempered with black pepper & curry leaves' },
      { mealId: 'meal-005', price: 110, isAvailable: true, preparationNote: 'Steamed vegetable salad bowl with lemon cumin drizzle' }
    ]
  },
  {
    id: 'rest-010',
    name: 'A2B - Adyar Ananda Bhavan (Kelambakkam)',
    cuisineTypes: ['South Indian', 'Vegetarian', 'Diabetic Friendly'],
    area: 'Kelambakkam',
    city: 'Chennai',
    lat: 12.7885,
    lng: 80.2180,
    rating: 4.5,
    ratingCount: 3890,
    hygieneGrade: 'A+',
    averageDeliverySpeedKmh: 22,
    googleMapsPlaceQuery: 'A2B Adyar Ananda Bhavan Kelambakkam Chennai',
    zomatoSearchKeyword: 'A2B Kelambakkam',
    swiggySearchKeyword: 'A2B Kelambakkam',
    offerings: [
      { mealId: 'meal-001', price: 90, isAvailable: true, preparationNote: 'Steamed idlis made fresh with zero soda' },
      { mealId: 'meal-002', price: 130, isAvailable: true, preparationNote: 'Finger millet dosa roasted with cold-pressed oil' },
      { mealId: 'meal-006', price: 150, isAvailable: true, preparationNote: 'Methi palak dal with 2 multigrain rotis' },
      { mealId: 'meal-008', price: 120, isAvailable: true, preparationNote: 'Fresh sprouted moong chat with lemon rock salt' }
    ]
  },
  {
    id: 'rest-011',
    name: 'EatFit - Fit & Healthy Bowls (Vandalur-Kelambakkam)',
    cuisineTypes: ['Healthy Bowls', 'High Protein', 'Keto & Diabetic'],
    area: 'VIT Chennai / Kelambakkam',
    city: 'Chennai',
    lat: 12.8390,
    lng: 80.1510,
    rating: 4.6,
    ratingCount: 2900,
    hygieneGrade: 'A+',
    averageDeliverySpeedKmh: 24,
    googleMapsPlaceQuery: 'EatFit Kelambakkam Vandalur Road Chennai',
    zomatoSearchKeyword: 'EatFit Kelambakkam',
    swiggySearchKeyword: 'EatFit Kelambakkam',
    offerings: [
      { mealId: 'meal-004', price: 149, isAvailable: true, preparationNote: 'High protein besan chilla with grated paneer' },
      { mealId: 'meal-006', price: 169, isAvailable: true, preparationNote: 'Whole wheat barley rotis with yellow tadka dal' },
      { mealId: 'meal-007', price: 239, isAvailable: true, preparationNote: 'Quinoa paneer wellness bowl with sauteed greens' },
      { mealId: 'meal-010', price: 159, isAvailable: true, preparationNote: 'Masala egg bhurji with 2 multigrain phulkas' }
    ]
  },
  {
    id: 'rest-012',
    name: 'Vasanta Bhavan (Vandalur - Kelambakkam Road)',
    cuisineTypes: ['South Indian', 'Traditional Millets', 'Pure Veg'],
    area: 'VIT Chennai / Kelambakkam',
    city: 'Chennai',
    lat: 12.8420,
    lng: 80.1560,
    rating: 4.4,
    ratingCount: 2150,
    hygieneGrade: 'A',
    averageDeliverySpeedKmh: 18,
    googleMapsPlaceQuery: 'Vasanta Bhavan Vandalur Kelambakkam Road Chennai',
    zomatoSearchKeyword: 'Vasanta Bhavan Kelambakkam',
    swiggySearchKeyword: 'Vasanta Bhavan Kelambakkam',
    offerings: [
      { mealId: 'meal-001', price: 80, isAvailable: true, preparationNote: 'Steamed idli served with no-sugar vegetable sambar' },
      { mealId: 'meal-002', price: 125, isAvailable: true, preparationNote: 'Ragi dosa with mint coriander chutney' },
      { mealId: 'meal-003', price: 135, isAvailable: true, preparationNote: 'Varagu / Kodo millet khichdi with roasted cumin' }
    ]
  }
];
