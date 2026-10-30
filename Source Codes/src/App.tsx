import React, { useState, useMemo } from 'react';
import {
  UserProfile,
  McdmWeights,
  MealItem,
  Restaurant,
  RecommendationResult,
  FeedbackRecord
} from './types';
import { DEFAULT_USER_PROFILE, DEFAULT_MCDM_WEIGHTS } from './data/sampleProfiles';
import { MEAL_DATABASE } from './data/meals';
import { RESTAURANTS_DATABASE } from './data/restaurants';
import { runMcdmRecommendation } from './services/mcdmEngine';

// Components
import { Header } from './components/Header';
import { UserProfileModal } from './components/UserProfileModal';
import { McdmWeightsPanel } from './components/McdmWeightsPanel';
import { RecommendationList } from './components/RecommendationList';
import { MealDatabaseExplorer } from './components/MealDatabaseExplorer';
import { RestaurantExplorer } from './components/RestaurantExplorer';
import { MealDetailModal } from './components/MealDetailModal';
import { OrderingModal } from './components/OrderingModal';
import { FeedbackModal } from './components/FeedbackModal';
import { FeedbackHistoryView } from './components/FeedbackHistoryView';
import { ProjectReportViewer } from './components/ProjectReportViewer';
import { AiDietitianChat } from './components/AiDietitianChat';
import { DemoGuideBanner } from './components/DemoGuideBanner';

export default function App() {
  // Core user & algorithm state
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [mcdmWeights, setMcdmWeights] = useState<McdmWeights>(DEFAULT_MCDM_WEIGHTS);
  const [activeTab, setActiveTab] = useState<
    'recommendations' | 'meals' | 'restaurants' | 'weights' | 'feedback' | 'report'
  >('recommendations');

  // Modal States
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedMealForDetail, setSelectedMealForDetail] = useState<MealItem | null>(null);
  const [selectedItemForOrder, setSelectedItemForOrder] = useState<RecommendationResult | null>(null);
  const [isOrderingModalOpen, setIsOrderingModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [recentOrderForFeedback, setRecentOrderForFeedback] = useState<RecommendationResult | null>(null);
  const [isDietitianChatOpen, setIsDietitianChatOpen] = useState(false);
  const [activeMealForDietitian, setActiveMealForDietitian] = useState<MealItem | null>(null);

  // Initial Feedback records to demonstrate Module 7
  const [feedbackList, setFeedbackList] = useState<FeedbackRecord[]>([
    {
      id: 'fb-1',
      timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      mealId: 'meal-02',
      mealName: 'Ragi (Finger Millet) Dosa with Mint Chutney',
      restaurantId: 'rest-02',
      restaurantName: 'Murugan Idli Shop',
      helpful: 'yes',
      portionSize: 'just_right',
      satisfactionRating: 5,
      tasteRating: 5,
      postMealGlucoseMgDl: 132,
      userNotes: 'Excellent satiety. 2hr postprandial stayed well below 140 mg/dL target.'
    },
    {
      id: 'fb-2',
      timestamp: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
      mealId: 'meal-03',
      mealName: 'Foxtail Millet Pongal with Mixed Vegetable Sambhar',
      restaurantId: 'rest-03',
      restaurantName: 'Sangeetha Veg Restaurant',
      helpful: 'yes',
      portionSize: 'just_right',
      satisfactionRating: 4,
      tasteRating: 5,
      postMealGlucoseMgDl: 144,
      userNotes: 'Delicious cumin and pepper tempering. No sluggish feeling after lunch.'
    }
  ]);

  // Execute MCDM Algorithm via useMemo
  const recommendations = useMemo(() => {
    return runMcdmRecommendation(userProfile, mcdmWeights, MEAL_DATABASE, RESTAURANTS_DATABASE);
  }, [userProfile, mcdmWeights]);

  // Handlers
  const handleOpenOrder = (rec: RecommendationResult) => {
    setSelectedItemForOrder(rec);
    setIsOrderingModalOpen(true);
  };

  const handleOrderComplete = (rec: RecommendationResult, customNote: string) => {
    setIsOrderingModalOpen(false);
    setRecentOrderForFeedback(rec);
    setIsFeedbackModalOpen(true);
  };

  const handleSelectRestaurantOrder = (meal: MealItem, restaurant: Restaurant, price: number) => {
    // Construct recommendation result structure
    const dummyRec: RecommendationResult = {
      meal,
      restaurant,
      price,
      distanceKm: 1.2,
      deliveryTimeMins: 22,
      mcdmScore: 9.0,
      rank: 1,
      criteriaNormalized: {
        health: 0.9,
        budget: 0.85,
        distance: 0.8,
        rating: 0.9,
        delivery: 0.85,
        preference: 1.0
      },
      criteriaWeighted: {
        health: 3.6,
        budget: 1.7,
        distance: 1.2,
        rating: 0.9,
        delivery: 0.85,
        preference: 0.5
      },
      explainableReasons: [
        `Low Glycemic Load (${meal.gl})`,
        `High Fiber (${meal.fiber}g)`,
        `Priced at ₹${price}`,
        'Clean hygiene standard'
      ],
      diabeticAdvisory: `Glycemic Load is ${meal.gl} (${meal.glCategory}). Safe for diabetes management.`,
      customOrderNote: 'Cook with minimal oil / steamed preparation. No added sugar.'
    };
    handleOpenOrder(dummyRec);
  };

  const handleOpenDietitian = (meal?: MealItem) => {
    setActiveMealForDietitian(meal || null);
    setIsDietitianChatOpen(true);
  };

  const handleAddFeedback = (record: FeedbackRecord) => {
    setFeedbackList(prev => [record, ...prev]);

    // Adaptive reinforcement:
    // If post-meal glucose spiked > 180, gently increase Health weight
    if (record.postMealGlucoseMgDl && record.postMealGlucoseMgDl > 180) {
      setMcdmWeights(prev => ({
        ...prev,
        healthScore: Math.min(0.6, Number((prev.healthScore + 0.05).toFixed(2))),
        budgetCompatibility: Math.max(0.1, Number((prev.budgetCompatibility - 0.05).toFixed(2)))
      }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-teal-200">
      {/* Module Navigation Header */}
      <Header
        user={userProfile}
        mcdmWeights={mcdmWeights}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenWeightsModal={() => setActiveTab('weights')}
        onOpenDietitianModal={() => handleOpenDietitian()}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {/* Presentation Demo Banner for Easy 1-Click Showcase */}
        <DemoGuideBanner
          currentUser={userProfile}
          onSelectUser={setUserProfile}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onOpenOrderFirstMeal={() => {
            if (recommendations.length > 0) {
              handleOpenOrder(recommendations[0]);
            }
          }}
        />

        {activeTab === 'recommendations' && (
          <RecommendationList
            recommendations={recommendations}
            user={userProfile}
            onSelectMealDetail={meal => setSelectedMealForDetail(meal)}
            onSelectOrder={handleOpenOrder}
            onConsultDietitian={meal => handleOpenDietitian(meal)}
          />
        )}

        {activeTab === 'meals' && (
          <MealDatabaseExplorer
            onSelectMeal={meal => setSelectedMealForDetail(meal)}
          />
        )}

        {activeTab === 'restaurants' && (
          <RestaurantExplorer
            user={userProfile}
            onSelectMeal={meal => setSelectedMealForDetail(meal)}
            onSelectOrderFromRestaurant={handleSelectRestaurantOrder}
          />
        )}

        {activeTab === 'weights' && (
          <div className="max-w-4xl mx-auto">
            <McdmWeightsPanel
              weights={mcdmWeights}
              onChangeWeights={setMcdmWeights}
              onResetWeights={() => setMcdmWeights(DEFAULT_MCDM_WEIGHTS)}
            />
          </div>
        )}

        {activeTab === 'feedback' && (
          <FeedbackHistoryView
            feedbackList={feedbackList}
            onOpenNewFeedbackModal={() => {
              if (recommendations.length > 0) {
                setRecentOrderForFeedback(recommendations[0]);
                setIsFeedbackModalOpen(true);
              }
            }}
          />
        )}

        {activeTab === 'report' && <ProjectReportViewer />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Context-Aware Smart Food Recommendation & Ordering System for Diabetic Patients (MCDM & XAI)
          </span>
          <span className="font-mono text-[11px] text-slate-400">
            Nutritional Database Grounded in ICMR-NIN & USDA FoodData Central
          </span>
        </div>
      </footer>

      {/* Modals */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={userProfile}
        onSave={setUserProfile}
      />

      <MealDetailModal
        isOpen={!!selectedMealForDetail}
        onClose={() => setSelectedMealForDetail(null)}
        meal={selectedMealForDetail}
        restaurants={RESTAURANTS_DATABASE}
        onSelectRestaurantForOrder={handleSelectRestaurantOrder}
      />

      <OrderingModal
        isOpen={isOrderingModalOpen}
        onClose={() => setIsOrderingModalOpen(false)}
        item={selectedItemForOrder}
        user={userProfile}
        onCompleteOrder={handleOrderComplete}
      />

      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        recentOrder={recentOrderForFeedback || (recommendations.length > 0 ? recommendations[0] : null)}
        user={userProfile}
        onSubmitFeedback={handleAddFeedback}
      />

      <AiDietitianChat
        isOpen={isDietitianChatOpen}
        onClose={() => setIsDietitianChatOpen(false)}
        user={userProfile}
        activeMeal={activeMealForDietitian}
      />
    </div>
  );
}
