/**
 * Utility functions for generating high-accuracy Swiggy, Zomato, and Google Maps links
 * tailored for diabetic meal ordering with clean restaurant & dish keywords.
 */

import { Restaurant, MealItem } from '../types';

export interface DeliveryLinks {
  swiggyUrl: string;
  swiggyCityUrl: string;
  zomatoUrl: string;
  zomatoCityUrl: string;
  mapsUrl: string;
  searchQuery: string;
  cleanRestaurantName: string;
}

/**
 * Strips parentheses, special characters, and long parentheticals from restaurant name
 * e.g., "Vasanta Bhavan (Vandalur - Kelambakkam Road)" -> "Vasanta Bhavan"
 */
export function cleanName(name: string): string {
  return name.replace(/\(.*?\)/g, '').replace(/[-–]/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Normalizes city names for URL slugs
 */
export function getCitySlug(city?: string): string {
  if (!city) return 'chennai';
  const c = city.trim().toLowerCase();
  if (c.includes('chennai') || c.includes('kelambakkam') || c.includes('vit')) return 'chennai';
  if (c.includes('bengaluru') || c.includes('bangalore')) return 'bengaluru';
  if (c.includes('delhi')) return 'ncr';
  if (c.includes('mumbai')) return 'mumbai';
  if (c.includes('hyderabad')) return 'hyderabad';
  return c.replace(/[^a-z0-9]/g, '');
}

/**
 * Generates robust Swiggy, Zomato, and Google Maps URLs
 */
export function generateDeliveryLinks(
  restaurant: Restaurant,
  meal?: MealItem | null,
  options?: { dishSpecific?: boolean }
): DeliveryLinks {
  const baseName = cleanName(restaurant.name);
  const citySlug = getCitySlug(restaurant.city);
  
  // Choose best search query
  const queryRestaurant = restaurant.swiggySearchKeyword || `${baseName} ${restaurant.area || ''}`.trim();
  const query = options?.dishSpecific && meal
    ? `${baseName} ${meal.name}`.trim()
    : queryRestaurant;

  const encodedQuery = encodeURIComponent(query);
  const encodedFullMapQuery = encodeURIComponent(
    restaurant.googleMapsPlaceQuery || `${restaurant.name} ${restaurant.area} ${restaurant.city}`
  );

  return {
    // Swiggy: City specific search is the most direct & reliable
    swiggyCityUrl: `https://www.swiggy.com/city/${citySlug}/search?query=${encodedQuery}`,
    swiggyUrl: `https://www.swiggy.com/search?query=${encodedQuery}`,

    // Zomato: City restaurant query or general search
    zomatoCityUrl: `https://www.zomato.com/${citySlug}/restaurants?q=${encodedQuery}`,
    zomatoUrl: `https://www.zomato.com/search?q=${encodedQuery}`,

    // Google Maps: Location & Directions
    mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodedFullMapQuery}`,

    searchQuery: query,
    cleanRestaurantName: baseName
  };
}

/**
 * Standard diabetic custom cooking instruction note for Swiggy/Zomato "Cooking Instructions" box
 */
export function buildDiabeticNote(options: {
  oilFree?: boolean;
  noAddedSugar?: boolean;
  sauceOnSide?: boolean;
  lowSodium?: boolean;
}): string {
  const items: string[] = [];
  if (options.oilFree !== false) items.push('Minimal oil / steamed preparation');
  if (options.noAddedSugar !== false) items.push('Strictly NO added sugar in sambar, curries, or gravies');
  if (options.sauceOnSide !== false) items.push('Pack gravies and chutneys separately on the side');
  if (options.lowSodium) items.push('Light salt / low sodium');

  return `DIABETIC ORDER NOTE: ${items.join('. ')}. Patient management adherence requested.`;
}
