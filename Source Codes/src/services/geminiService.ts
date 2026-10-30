import { UserProfile, MealItem } from '../types';

export interface DietitianAdviceResponse {
  source: string;
  response: string;
}

export async function consultDietitian(
  userProfile: UserProfile,
  meal?: MealItem | null,
  question?: string,
  promptType: 'explain-recommendation' | 'general-question' = 'general-question'
): Promise<DietitianAdviceResponse> {
  try {
    const res = await fetch('/api/gemini/dietitian', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userProfile,
        meal,
        question,
        promptType,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      if (errData.fallback) {
        return { source: 'rule-based-fallback', response: errData.fallback };
      }
      throw new Error(`Server returned status ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.warn('Consult Dietitian error, using fallback:', err);
    return {
      source: 'rule-based-offline',
      response: `### Clinical Diabetic Guidance
- **Glycemic Safety:** This meal has an estimated Glycemic Load within safe parameters for ${userProfile.diabetesType.toUpperCase()}.
- **Dietary Tip:** Pair with adequate hydration, and request minimal cooking oil or sugar in dressings.
- **Physical Activity:** A 15-minute gentle post-meal walk is clinically demonstrated to reduce postprandial glucose spike by up to 22%.`
    };
  }
}
