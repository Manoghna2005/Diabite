import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "DiaBite Recommendation Engine" });
  });

  // Server-side Gemini AI Clinical Dietitian & Explanation Endpoint
  app.post("/api/gemini/dietitian", async (req, res) => {
    try {
      const { userProfile, meal, question, promptType } = req.body;

      const ai = getAiClient();
      if (!ai) {
        // Provide intelligent fallback if API key is not configured yet
        return res.json({
          source: "rule-based-fallback",
          response: generateRuleBasedDietitianAdvice(userProfile, meal, question, promptType),
        });
      }

      let systemPrompt = `You are Dr. Sunita Rao, an expert Clinical Endocrinologist and Certified Diabetes Care & Education Specialist (CDCES) affiliated with ICMR-NIN guidelines.
You provide evidence-based, compassionate, and precise dietary guidance for patients with Type 1, Type 2, Pre-diabetes, or Gestational Diabetes.
Always emphasize glycemic index (GI), glycemic load (GL), postprandial glucose control, soluble fiber, and balanced macronutrients.
Format your responses with clear markdown, bullet points, and practical restaurant ordering tips.`;

      let userMessage = "";
      if (promptType === "explain-recommendation") {
        userMessage = `Patient Profile:
- Diabetes Type: ${userProfile?.diabetesType || "Type 2"}
- Age: ${userProfile?.age || 45}, BMI: ${userProfile?.bmi || 25.4} (${userProfile?.bmiCategory || "Normal"})
- Dietary Preference: ${userProfile?.dietaryPreference || "Vegetarian"}
- Allergies: ${userProfile?.allergies?.join(", ") || "None"}
- Target Calorie: ${userProfile?.targetCalories || 500} kcal/meal

Recommended Meal:
- Dish: ${meal?.name} (${meal?.cuisine})
- Portion: ${meal?.portion}
- Nutrition: Calories: ${meal?.calories} kcal, Carbs: ${meal?.carbs}g, Fiber: ${meal?.fiber}g, Protein: ${meal?.protein}g, Fat: ${meal?.fat}g
- Estimated GI: ${meal?.gi}, Glycemic Load (GL): ${meal?.gl}
- Restaurant: ${meal?.restaurantName} (₹${meal?.price}, ${meal?.distance} km away)

Task: Provide a concise clinical explanation (3-4 points) explaining why this meal is safe and suitable for this patient's diabetic management, how its fiber/protein balances the glycemic spike, and 1 actionable customized instruction they can give to the restaurant when ordering (e.g. asking for less oil or extra vegetables).`;
      } else {
        userMessage = `Patient Context:
- Diabetes Type: ${userProfile?.diabetesType || "Type 2"}
- Fasting Blood Sugar: ${userProfile?.recentFastingGlucose || "N/A"} mg/dL
- Dietary Preference: ${userProfile?.dietaryPreference || "Vegetarian"}
- Current Selected Meal: ${meal ? `${meal.name} (Carbs: ${meal.carbs}g, GL: ${meal.gl})` : "General inquiry"}

Patient Question: "${question}"

Please answer with medical accuracy, encouraging practical advice, and guidelines based on ICMR-NIN & ADA standards. Keep response under 200 words.`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: [
          { role: "user", parts: [{ text: `${systemPrompt}\n\n${userMessage}` }] },
        ],
      });

      const responseText = response.text || "No response generated.";
      return res.json({
        source: "gemini-3.8-flash",
        response: responseText,
      });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      return res.status(500).json({
        error: error.message || "Failed to generate dietary consultation",
        fallback: generateRuleBasedDietitianAdvice(req.body.userProfile, req.body.meal, req.body.question, req.body.promptType),
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`DiaBite server running on http://0.0.0.0:${PORT}`);
  });
}

function generateRuleBasedDietitianAdvice(userProfile: any, meal: any, question: string, promptType: string): string {
  if (promptType === "explain-recommendation" && meal) {
    const glLevel = meal.gl <= 10 ? "Low" : meal.gl <= 19 ? "Medium" : "High";
    return `### Clinical Dietitian Assessment (ICMR-NIN Protocol)
- **Controlled Glycemic Response:** This meal has an estimated Glycemic Load of **${meal.gl} (${glLevel})**. Because it delivers **${meal.fiber}g of dietary fiber**, it effectively buffers the digestion of carbohydrates and prevents steep postprandial glucose spikes.
- **Macronutrient Balance:** With **${meal.protein}g of protein** and only **${meal.calories} kcal**, it preserves satiety while fitting into your recommended diabetic meal target.
- **Restaurant Proximity & Freshness:** Sourced from **${meal.restaurantName}** (${meal.distance} km away), ensuring the meal arrives hot and retains nutritional bio-availability.
- **Actionable Ordering Tip:** *When placing the order, request: "Please prepare with low oil and serve condiments/chutneys on the side."*`;
  }

  return `### Dietary Consultation
For patients managing ${userProfile?.diabetesType || "diabetes"}, meal timing and portion control are critical.
When selecting meals:
- Prioritize dishes with a **Glycemic Load < 10** and at least **5g of fiber**.
- If your recent blood sugar is running higher, pair complex carbohydrates (like millets, whole legumes) with lean proteins and green leafy vegetables to slow gastric emptying.
- Stay hydrated and take a light 10-15 minute stroll after your meal to enhance peripheral insulin sensitivity.`;
}

startServer();
