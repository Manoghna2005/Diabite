import React, { useState } from 'react';
import {
  FileText,
  Award,
  BookOpen,
  Cpu,
  Layers,
  Sparkles,
  GitBranch,
  Database,
  ArrowRight,
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';

export const ProjectReportViewer: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'overview' | 'modules' | 'mcdm' | 'architecture' | 'evaluation'>('overview');
  const [copied, setCopied] = useState(false);

  const copyFullReport = () => {
    const reportText = `PROJECT REPORT:
Context-Aware Personalized Food Recommendation and Smart Ordering System for Diabetic Patients Using Multi-Criteria Decision Making

1. TITLE & ABSTRACT:
Managing diabetes requires careful food selection, but existing food delivery applications primarily focus on convenience rather than health. They rarely recommend meals based on an individual's diabetic condition, nutritional requirements, budget, location, or nearby restaurant availability.
This project proposes an intelligent recommendation system that analyzes a user's health profile, food preferences, budget, and current location to recommend suitable diabetic-friendly meals available from nearby restaurants. The system ranks meals using multiple criteria such as estimated glycemic impact, nutritional value, price, distance, restaurant rating, and delivery time. It also provides direct ordering links through food delivery platforms. An explainable recommendation module describes why each meal is recommended, improving user trust and decision-making.

2. PROBLEM STATEMENT & RESEARCH GAP:
Existing platforms prioritize popularity or customer ratings rather than personalized health needs. They fail to optimize diabetic dietary requirements, budget constraints, restaurant proximity, delivery time, food availability, and explainable health reasoning simultaneously.

3. MULTI-CRITERIA DECISION MAKING (MCDM) FORMULATION:
Overall Score = 40% Health Score + 20% Budget Compatibility + 15% Distance + 10% Restaurant Rating + 10% Delivery Time + 5% User Preference Match.
Normalized Benefit Criteria: r_ij = (x_ij - min) / (max - min)
Normalized Cost Criteria: r_ij = (max - x_ij) / (max - min)
Aggregate Score = sum(W_j * r_ij)

4. SYSTEM MODULES:
Module 1: User Profile (Age, BMI, Diabetes Type, Allergies, Budget, Location)
Module 2: Meal Database (ICMR-NIN, GI, GL, Fiber, Macros)
Module 3: Restaurant Discovery (Proximity, Coordinates, Availability, Prices)
Module 4: Recommendation Engine (Weighted Sum Model / TOPSIS)
Module 5: Explainable Recommendation (XAI Clinical Justification)
Module 6: Ordering Support (Zomato, Swiggy, Google Maps, Diabetic Order Notes)
Module 7: Feedback Module (Portion satisfaction, 2-hr postprandial glucose tracking, adaptive learning)`;

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-100 text-teal-800">
                Academic Project Report & Research Plan
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                Final-Year Engineering & Research Paper Plan
              </span>
            </div>
            <h2 className="text-xl font-black text-slate-900 mt-1.5 leading-tight">
              Context-Aware Personalized Food Recommendation and Smart Ordering System for Diabetic Patients Using Multi-Criteria Decision Making
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Author: AI Studio Research Team • Datasets: ICMR-NIN (National Institute of Nutrition) & USDA FoodData Central
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={copyFullReport}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Synopsis' : 'Copy Project Text'}</span>
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-2 mt-5 border-t border-slate-100 pt-4 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveSection('overview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
              activeSection === 'overview'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            1. Title, Abstract & Objectives
          </button>
          <button
            onClick={() => setActiveSection('modules')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
              activeSection === 'modules'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            2. System Modules (1 to 7)
          </button>
          <button
            onClick={() => setActiveSection('mcdm')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
              activeSection === 'mcdm'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            3. MCDM Mathematical Formulation
          </button>
          <button
            onClick={() => setActiveSection('architecture')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
              activeSection === 'architecture'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            4. Architecture & Tech Stack
          </button>
          <button
            onClick={() => setActiveSection('evaluation')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
              activeSection === 'evaluation'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            5. Outcomes & Future Enhancements
          </button>
        </div>
      </div>

      {/* Tab 1: Overview, Abstract, Problem Statement */}
      {activeSection === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-600" />
              <span>Section 2: Abstract</span>
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed text-justify">
              Managing diabetes requires careful food selection, but existing food delivery applications primarily focus on convenience rather than health. They rarely recommend meals based on an individual&apos;s diabetic condition, nutritional requirements, budget, location, or nearby restaurant availability.
            </p>
            <p className="text-xs text-slate-700 leading-relaxed text-justify">
              This project proposes an intelligent recommendation system that analyzes a user&apos;s health profile, food preferences, budget, and current location to recommend suitable diabetic-friendly meals available from nearby restaurants. The system ranks meals using multiple criteria such as estimated glycemic impact, nutritional value, price, distance, restaurant rating, and delivery time. It also provides direct ordering links through food delivery platforms. An explainable recommendation module describes why each meal is recommended, improving user trust and decision-making.
            </p>

            <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900">
              <span className="font-bold">Suggested Research Paper Title:</span>
              <p className="italic mt-0.5">
                &ldquo;Context-Aware Explainable Food and Restaurant Recommendation System for Diabetic Patients Using Multi-Criteria Decision Making and Personalized Nutrition Analytics&rdquo;
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-600" />
                <span>Section 3: Problem Statement</span>
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                Individuals with diabetes often struggle to identify healthy meal options while ordering food online. Existing platforms prioritize popularity, promotions, or customer ratings rather than personalized health needs.
              </p>
              <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="font-semibold text-slate-900">Current systems do not simultaneously consider:</div>
                <ul className="list-disc list-inside space-y-1 pl-1">
                  <li>Diabetic dietary requirements (Glycemic Index & Glycemic Load)</li>
                  <li>Budget constraints and affordability</li>
                  <li>Restaurant proximity & delivery transit time</li>
                  <li>Real-time food availability from local menus</li>
                  <li>Explainable health reasoning (XAI)</li>
                </ul>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>Section 4 & 7: Objectives & Novelty</span>
              </h3>
              <div className="grid grid-cols-1 gap-2 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span><strong>Personalized Nutrition:</strong> Recommends meals based on clinical profile, diabetes type, and allergies.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span><strong>Dual Recommendation:</strong> Recommends both the optimal meal and the nearest compliant restaurant.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span><strong>Explainable AI (XAI):</strong> Transparently explains why a dish was selected (fiber, GL, price, speed).</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span><strong>Continuous Reinforcement:</strong> Dynamically adjusts future weights based on user satisfaction and 2-hr post-meal glucose logs.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: System Modules 1 to 7 */}
      {activeSection === 'modules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Module 1 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">MODULE 1</span>
              <span className="text-xs text-slate-400 font-mono">User Profile</span>
            </div>
            <h4 className="text-sm font-extrabold text-slate-900">User Health & Context Profile</h4>
            <p className="text-xs text-slate-600">Collects user biomarkers and parameters:</p>
            <div className="flex flex-wrap gap-1 text-[11px]">
              {['Age', 'Gender', 'Weight & Height', 'Calculated BMI', 'Diabetes Type', 'Dietary Preference', 'Allergies', 'Meal Budget', 'Cuisine Preference', 'GPS Coordinates'].map(item => (
                <span key={item} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Module 2 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">MODULE 2</span>
              <span className="text-xs text-slate-400 font-mono">Nutrition Base</span>
            </div>
            <h4 className="text-sm font-extrabold text-slate-900">Meal & Nutrition Database</h4>
            <p className="text-xs text-slate-600">Certified by ICMR-NIN & USDA FoodData Central:</p>
            <div className="flex flex-wrap gap-1 text-[11px]">
              {['Calories', 'Protein (g)', 'Fat (g)', 'Total Carbs', 'Dietary Fiber', 'Net Carbs', 'Estimated GI', 'Glycemic Load (GL)', 'Standard Portion', 'Diabetic Score'].map(item => (
                <span key={item} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Module 3 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">MODULE 3</span>
              <span className="text-xs text-slate-400 font-mono">Spatial Engine</span>
            </div>
            <h4 className="text-sm font-extrabold text-slate-900">Restaurant Discovery Engine</h4>
            <p className="text-xs text-slate-600">Discovers nearby eateries preparing the recommended dishes:</p>
            <div className="flex flex-wrap gap-1 text-[11px]">
              {['Restaurant Name', 'Haversine Distance', 'Dish Price (₹)', 'Est Delivery Time', 'Hygiene Grade', 'Rating ★', 'Live Stock Status'].map(item => (
                <span key={item} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Module 4 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">MODULE 4</span>
              <span className="text-xs text-slate-400 font-mono">MCDM Engine</span>
            </div>
            <h4 className="text-sm font-extrabold text-slate-900">Recommendation Algorithm</h4>
            <p className="text-xs text-slate-600">Multi-Criteria Decision Making (Weighted Sum Model):</p>
            <div className="text-xs font-mono bg-slate-50 p-2 rounded border border-slate-200 text-slate-800">
              Score = 0.40(Health) + 0.20(Budget) + 0.15(Dist) + 0.10(Rating) + 0.10(Speed) + 0.05(Pref)
            </div>
          </div>

          {/* Module 5 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">MODULE 5</span>
              <span className="text-xs text-slate-400 font-mono">Explainable AI</span>
            </div>
            <h4 className="text-sm font-extrabold text-slate-900">Explainable Recommendation (XAI)</h4>
            <p className="text-xs text-slate-600">Clear justifications to instill patient confidence:</p>
            <ul className="list-disc list-inside text-xs text-slate-600 space-y-0.5">
              <li>Low Glycemic Load (GL 7.8)</li>
              <li>High soluble fiber (6.8g)</li>
              <li>Within user budget limit</li>
              <li>Proximity under 1.5 km</li>
            </ul>
          </div>

          {/* Module 6 & 7 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">MODULES 6 & 7</span>
              <span className="text-xs text-slate-400 font-mono">Order & Learn</span>
            </div>
            <h4 className="text-sm font-extrabold text-slate-900">Ordering Support & Feedback Loop</h4>
            <p className="text-xs text-slate-600">Actionable links & continuous improvement:</p>
            <div className="flex flex-wrap gap-1 text-[11px]">
              {['Zomato Search Link', 'Swiggy Search Link', 'Google Maps Link', 'Diabetic Order Note', 'Portion Evaluation', '2hr Postprandial Glucose Log', 'Dynamic Weight Tuning'].map(item => (
                <span key={item} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: MCDM Formulation */}
      {activeSection === 'mcdm' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-100 text-teal-800">
              Section 12: Mathematical Formulation
            </span>
            <h3 className="text-lg font-black text-slate-900 mt-1">
              Multi-Criteria Decision Making (MCDM) & Weighted Sum Model (WSM)
            </h3>
            <p className="text-xs text-slate-500">
              Theoretical rigor for ranking $m$ meal-restaurant alternatives across $n$ conflicting criteria.
            </p>
          </div>

          {/* Equation 1: Decision Matrix */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs space-y-2">
            <div className="text-teal-800 font-bold">1. Decision Matrix Definition ($X$):</div>
            <p className="text-slate-700">
              Let $A = &#123;A_1, A_2, ..., A_m&#125; be the set of available candidate meal-restaurant pairs, and $C = &#123;C_1, C_2, ..., C_6&#125; be the decision criteria:
            </p>
            <div className="bg-white p-3 rounded border border-slate-200 overflow-x-auto text-[11px] leading-relaxed">
              X = [ x_ij ] where i ∈ [1, m] (alternatives), j ∈ [1, 6] (criteria)<br />
              C1 = Health Score (Benefit) &nbsp;&nbsp;|&nbsp;&nbsp; C2 = Budget Compatibility (Benefit)<br />
              C3 = Distance in km (Cost) &nbsp;&nbsp;|&nbsp;&nbsp; C4 = Restaurant Rating (Benefit)<br />
              C5 = Delivery Time (Cost) &nbsp;&nbsp;|&nbsp;&nbsp; C6 = User Preference Match (Benefit)
            </div>
          </div>

          {/* Equation 2: Normalization */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs space-y-2">
            <div className="text-teal-800 font-bold">2. Normalization Equations (r_ij):</div>
            <p className="text-slate-700">
              To eliminate dimension disparities (e.g., currency ₹ vs km vs rating ★), all values are normalized to $[0, 1]$:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
              <div className="bg-white p-2.5 rounded border border-slate-200">
                <div className="font-bold text-emerald-800">For Benefit Criteria (Health, Budget, Rating, Preference):</div>
                <div className="mt-1">r_ij = (x_ij - min(x_j)) / (max(x_j) - min(x_j))</div>
              </div>
              <div className="bg-white p-2.5 rounded border border-slate-200">
                <div className="font-bold text-rose-800">For Cost Criteria (Distance, Delivery Time):</div>
                <div className="mt-1">r_ij = (max(x_j) - x_ij) / (max(x_j) - min(x_j))</div>
              </div>
            </div>
          </div>

          {/* Equation 3: Aggregation */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs space-y-2">
            <div className="text-teal-800 font-bold">3. Weighted Aggregation & Final Ranking:</div>
            <p className="text-slate-700">
              The overall score $S_i$ for alternative $A_i$ is computed via:
            </p>
            <div className="bg-teal-900 text-teal-100 p-3 rounded font-bold text-xs">
              S_i = ∑ [ W_j · r_ij ] &nbsp;&nbsp;subject to&nbsp;&nbsp; ∑ W_j = 1.0
            </div>
            <p className="text-slate-600 text-[11px]">
              With default research parameters: W_Health = 0.40, W_Budget = 0.20, W_Dist = 0.15, W_Rating = 0.10, W_Delivery = 0.10, W_Pref = 0.05.
            </p>
          </div>
        </div>
      )}

      {/* Tab 4: Architecture Flowchart & Tech Stack */}
      {activeSection === 'architecture' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-teal-600" />
                <span>Section 9: System Architecture Flowchart</span>
              </h3>
              <span className="text-xs text-slate-500 font-mono">End-to-End Pipeline</span>
            </div>

            {/* Visual Flowchart Blocks */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3 overflow-x-auto text-xs">
              <div className="bg-white p-3 rounded-xl border border-slate-300 text-center w-full md:w-36 shadow-xs">
                <div className="font-bold text-slate-900">User Context</div>
                <div className="text-[10px] text-slate-500 mt-1">Health • Budget • GPS • Diet</div>
              </div>

              <ArrowRight className="w-4 h-4 text-teal-600 shrink-0 rotate-90 md:rotate-0" />

              <div className="bg-teal-50 p-3 rounded-xl border border-teal-300 text-center w-full md:w-44 shadow-xs">
                <div className="font-bold text-teal-900">Recommendation Engine</div>
                <div className="text-[10px] text-teal-700 mt-1">Nutritional & Spatial MCDM Filter</div>
              </div>

              <ArrowRight className="w-4 h-4 text-teal-600 shrink-0 rotate-90 md:rotate-0" />

              <div className="bg-white p-3 rounded-xl border border-slate-300 text-center w-full md:w-40 shadow-xs">
                <div className="font-bold text-slate-900">Multi-Criteria Ranking</div>
                <div className="text-[10px] text-slate-500 mt-1">40/20/15/10/10/5 Normalized WSM</div>
              </div>

              <ArrowRight className="w-4 h-4 text-teal-600 shrink-0 rotate-90 md:rotate-0" />

              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-300 text-center w-full md:w-36 shadow-xs">
                <div className="font-bold text-emerald-900">Explainable AI (XAI)</div>
                <div className="text-[10px] text-emerald-700 mt-1">Clinical Reasons & Safety</div>
              </div>

              <ArrowRight className="w-4 h-4 text-teal-600 shrink-0 rotate-90 md:rotate-0" />

              <div className="bg-slate-900 text-white p-3 rounded-xl text-center w-full md:w-36 shadow-xs">
                <div className="font-bold">Ordering Support</div>
                <div className="text-[10px] text-slate-300 mt-1">Zomato • Swiggy • Maps</div>
              </div>
            </div>
          </div>

          {/* Section 10: Tech Stack Table */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-teal-600" />
              <span>Section 10: Technology Stack</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-slate-400 text-[10px] uppercase font-bold">Frontend Framework</div>
                <div className="text-sm font-extrabold text-slate-900 mt-0.5">React.js + Tailwind CSS</div>
                <div className="text-[11px] text-slate-500 mt-1">Responsive, accessible UI with Lucide & Motion</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-slate-400 text-[10px] uppercase font-bold">Backend & API</div>
                <div className="text-sm font-extrabold text-slate-900 mt-0.5">Node.js / Express + Python</div>
                <div className="text-[11px] text-slate-500 mt-1">RESTful endpoints, spatial distance calculator</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-slate-400 text-[10px] uppercase font-bold">Intelligence & Reasoning</div>
                <div className="text-sm font-extrabold text-slate-900 mt-0.5">Google Gemini 3.8 Flash</div>
                <div className="text-[11px] text-slate-500 mt-1">Server-side Clinical Dietitian consultation & XAI</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-slate-400 text-[10px] uppercase font-bold">Data & Spatial APIs</div>
                <div className="text-sm font-extrabold text-slate-900 mt-0.5">ICMR-NIN, Maps, Zomato</div>
                <div className="text-[11px] text-slate-500 mt-1">Haversine GPS indexing & delivery search links</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Outcomes & Future Enhancements */}
      {activeSection === 'evaluation' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-teal-600" />
              <span>Section 14: Expected Outcomes</span>
            </h3>
            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-900">Faster & Safer Meal Decision-Making</div>
                <div className="text-slate-600 mt-0.5">
                  Diabetic users reduce meal selection time from 25+ minutes down to 3 minutes by pre-filtering high-GI items.
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-900">Clinically Reduced Postprandial Spikes</div>
                <div className="text-slate-600 mt-0.5">
                  Meals prioritized have Glycemic Load ≤ 10 and ≥ 6g dietary fiber, mitigating glucose variability and HbA1c elevation.
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-900">High Transparency & Explainability</div>
                <div className="text-slate-600 mt-0.5">
                  Transparent justification eliminates the &quot;black box&quot; barrier, building patient trust and adherence.
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>Section 15: Future Enhancements (Roadmap)</span>
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-700">
              <li className="p-2.5 bg-teal-50/50 rounded-xl border border-teal-200 flex items-start gap-2">
                <span className="font-bold text-teal-700">1.</span>
                <span><strong>Wearable CGM Integration:</strong> Ingest real-time Continuous Glucose Monitor (Dexcom / Abbott FreeStyle Libre) streams to predict post-meal glucose trajectory.</span>
              </li>
              <li className="p-2.5 bg-teal-50/50 rounded-xl border border-teal-200 flex items-start gap-2">
                <span className="font-bold text-teal-700">2.</span>
                <span><strong>Computer Vision Meal Recognition:</strong> Camera photo snap to estimate portion sizes and detect hidden sauces or sugars.</span>
              </li>
              <li className="p-2.5 bg-teal-50/50 rounded-xl border border-teal-200 flex items-start gap-2">
                <span className="font-bold text-teal-700">3.</span>
                <span><strong>Multi-condition Comorbidity Support:</strong> Extend MCDM to simultaneous conditions like Hypertension (DASH diet low-sodium), CKD (potassium/phosphorus control), and PCOS.</span>
              </li>
              <li className="p-2.5 bg-teal-50/50 rounded-xl border border-teal-200 flex items-start gap-2">
                <span className="font-bold text-teal-700">4.</span>
                <span><strong>Direct Restaurant API Integration:</strong> Verified nutritional APIs with cloud kitchens to guarantee exact low-oil preparation.</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
