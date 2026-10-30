import React, { useState } from 'react';
import { FeedbackRecord, RecommendationResult, UserProfile } from '../types';
import {
  X,
  MessageSquareHeart,
  Star,
  Activity,
  ThumbsUp,
  MinusCircle,
  ThumbsDown,
  CheckCircle2,
  TrendingUp,
  Sparkles
} from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  recentOrder: RecommendationResult | null;
  user: UserProfile;
  onSubmitFeedback: (record: FeedbackRecord) => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  recentOrder,
  user,
  onSubmitFeedback
}) => {
  const [helpful, setHelpful] = useState<'yes' | 'somewhat' | 'no'>('yes');
  const [portionSize, setPortionSize] = useState<'too_small' | 'just_right' | 'too_large'>('just_right');
  const [satisfactionRating, setSatisfactionRating] = useState<number>(5);
  const [tasteRating, setTasteRating] = useState<number>(5);
  const [postMealGlucose, setPostMealGlucose] = useState<number | ''>(138);
  const [userNotes, setUserNotes] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !recentOrder) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const record: FeedbackRecord = {
      id: `fb-${Date.now()}`,
      timestamp: new Date().toISOString(),
      mealId: recentOrder.meal.id,
      mealName: recentOrder.meal.name,
      restaurantId: recentOrder.restaurant.id,
      restaurantName: recentOrder.restaurant.name,
      helpful,
      portionSize,
      satisfactionRating,
      tasteRating,
      postMealGlucoseMgDl: postMealGlucose ? Number(postMealGlucose) : undefined,
      userNotes: userNotes.trim() || undefined
    };

    setSubmitted(true);
    onSubmitFeedback(record);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-8 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-teal-100 text-teal-700">
              <MessageSquareHeart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Module 7: Continuous Feedback Loop</h2>
              <p className="text-xs text-slate-500">
                Reinforces machine learning & MCDM weights for {recentOrder.meal.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4 my-auto">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Feedback Logged & Model Updated!</h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Your satisfaction rating and 2-hr post-meal glucose response have been incorporated into your personalized preference matrix.
            </p>
            <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 flex items-center gap-2 max-w-xs mx-auto text-left">
              <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
              <span>
                Reinforced <strong>{recentOrder.restaurant.name}</strong> with +8% affinity bonus for upcoming meal recommendations.
              </span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
            {/* Meal summary pill */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900">{recentOrder.meal.name}</span>
                <span className="text-slate-500"> from {recentOrder.restaurant.name}</span>
              </div>
              <span className="font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                GL: {recentOrder.meal.gl}
              </span>
            </div>

            {/* 1. Was recommendation helpful? */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Was this diabetic recommendation helpful?
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setHelpful('yes')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold border flex items-center justify-center gap-1.5 transition-colors ${
                    helpful === 'yes'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Yes, Helpful</span>
                </button>

                <button
                  type="button"
                  onClick={() => setHelpful('somewhat')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold border flex items-center justify-center gap-1.5 transition-colors ${
                    helpful === 'somewhat'
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <MinusCircle className="w-3.5 h-3.5" />
                  <span>Somewhat</span>
                </button>

                <button
                  type="button"
                  onClick={() => setHelpful('no')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold border flex items-center justify-center gap-1.5 transition-colors ${
                    helpful === 'no'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                  <span>Not Really</span>
                </button>
              </div>
            </div>

            {/* 2. Portion Size Satisfaction */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Portion Size Evaluation (Diabetic Satiety)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPortionSize('too_small')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-colors ${
                    portionSize === 'too_small'
                      ? 'bg-teal-600 text-white border-teal-600'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  Too Small
                </button>

                <button
                  type="button"
                  onClick={() => setPortionSize('just_right')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-colors ${
                    portionSize === 'just_right'
                      ? 'bg-teal-600 text-white border-teal-600'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  Just Right (Optimal)
                </button>

                <button
                  type="button"
                  onClick={() => setPortionSize('too_large')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-colors ${
                    portionSize === 'too_large'
                      ? 'bg-teal-600 text-white border-teal-600'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  Too Large
                </button>
              </div>
            </div>

            {/* 3. Taste & Overall Satisfaction Ratings */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Taste Rating
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setTasteRating(star)}
                      className="p-1 text-slate-300 hover:text-amber-400"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= tasteRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Meal Satisfaction
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setSatisfactionRating(star)}
                      className="p-1 text-slate-300 hover:text-teal-500"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= satisfactionRating ? 'fill-teal-500 text-teal-500' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. 2-Hour Postprandial Blood Glucose Log */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-rose-600" />
                  <span>2-Hour Post-Meal Glucose Reading (Optional)</span>
                </label>
                <span className="text-[11px] text-slate-500">mg/dL</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={70}
                  max={450}
                  value={postMealGlucose}
                  onChange={e => setPostMealGlucose(e.target.value ? Number(e.target.value) : '')}
                  placeholder="e.g. 135"
                  className="w-32 px-3 py-1.5 text-sm font-bold border border-slate-300 rounded-lg bg-white"
                />
                <div className="text-xs text-slate-500">
                  {typeof postMealGlucose === 'number' && (
                    <span
                      className={`font-semibold ${
                        postMealGlucose < 140
                          ? 'text-emerald-700'
                          : postMealGlucose < 180
                          ? 'text-amber-700'
                          : 'text-rose-700'
                      }`}
                    >
                      {postMealGlucose < 140
                        ? '✓ Target Normal (<140 mg/dL)'
                        : postMealGlucose < 180
                        ? '⚠ Acceptable Diabetic Target (<180 mg/dL)'
                        : '⚠ Elevated (>180 mg/dL)'}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-[11px] text-slate-400">
                Helps the recommendation engine identify which food groups maintain steady blood glucose curves.
              </p>
            </div>

            {/* 5. Qualitative Feedback */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Additional Notes
              </label>
              <textarea
                value={userNotes}
                onChange={e => setUserNotes(e.target.value)}
                placeholder="e.g. Sambar was spicy, dosa remained crisp, felt energetic without afternoon fatigue."
                rows={2}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              />
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl shadow-xs transition-colors"
              >
                Submit Feedback & Adapt Model
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
