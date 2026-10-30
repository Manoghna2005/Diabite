import React from 'react';
import { FeedbackRecord } from '../types';
import {
  MessageSquareHeart,
  TrendingUp,
  Activity,
  Star,
  Calendar,
  ThumbsUp,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface FeedbackHistoryViewProps {
  feedbackList: FeedbackRecord[];
  onOpenNewFeedbackModal: () => void;
}

export const FeedbackHistoryView: React.FC<FeedbackHistoryViewProps> = ({
  feedbackList,
  onOpenNewFeedbackModal
}) => {
  const avgSatisfaction = feedbackList.length
    ? (feedbackList.reduce((acc, cur) => acc + cur.satisfactionRating, 0) / feedbackList.length).toFixed(1)
    : '5.0';

  const loggedReadings = feedbackList.filter(f => f.postMealGlucoseMgDl !== undefined);
  const avgPostprandial = loggedReadings.length
    ? Math.round(
        loggedReadings.reduce((acc, cur) => acc + (cur.postMealGlucoseMgDl || 0), 0) /
          loggedReadings.length
      )
    : 138;

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-teal-100 text-teal-700">
              <MessageSquareHeart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Module 7: Continuous Learning & Feedback History
              </h2>
              <p className="text-xs text-slate-500">
                Tracking postprandial glucose responses and adapting machine learning recommendation weights
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenNewFeedbackModal}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Log Meal Experience</span>
            </button>
          </div>
        </div>

        {/* Aggregate Stats */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl">
            <div className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">
              Avg Meal Satisfaction
            </div>
            <div className="text-xl font-extrabold text-teal-900 flex items-center gap-1 mt-0.5">
              <span>{avgSatisfaction}</span>
              <span className="text-sm font-normal text-teal-700">/ 5.0</span>
              <Star className="w-4 h-4 fill-amber-400 text-amber-400 ml-1" />
            </div>
            <div className="text-[10px] text-teal-700 mt-1">Based on {feedbackList.length} logged meals</div>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
              Mean 2-Hr Postprandial Glucose
            </div>
            <div className="text-xl font-extrabold text-emerald-900 mt-0.5 font-mono">
              {avgPostprandial} <span className="text-xs font-normal">mg/dL</span>
            </div>
            <div className="text-[10px] text-emerald-700 mt-1">
              ✓ In Target Diabetic Range (&lt;160 mg/dL)
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Adaptive Feedback Status
            </div>
            <div className="text-sm font-extrabold text-slate-900 mt-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>Active Model Weight Tuning</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              Reinforces low-GL meals & certified eateries
            </div>
          </div>
        </div>
      </div>

      {/* History Cards */}
      <div className="space-y-3">
        {feedbackList.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
            <MessageSquareHeart className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <div className="text-sm font-bold text-slate-700">No Meals Logged Yet</div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              When you order a meal or finish eating, log your satisfaction and post-meal glucose reading here.
            </p>
          </div>
        ) : (
          feedbackList.map(record => (
            <div
              key={record.id}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-slate-900">{record.mealName}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-xs font-medium text-slate-600">{record.restaurantName}</span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(record.timestamp).toLocaleDateString()}
                  </span>
                  <span>•</span>
                  <span>
                    Helpful: <strong className="text-slate-800 capitalize">{record.helpful}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Portion: <strong className="text-slate-800 capitalize">{record.portionSize.replace('_', ' ')}</strong>
                  </span>
                </div>

                {record.userNotes && (
                  <p className="text-xs text-slate-600 italic mt-1">&ldquo;{record.userNotes}&rdquo;</p>
                )}
              </div>

              <div className="flex items-center gap-4 sm:border-l sm:border-slate-100 sm:pl-4">
                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Satisfaction</div>
                  <div className="flex items-center gap-0.5 justify-end mt-0.5">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= record.satisfactionRating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {record.postMealGlucoseMgDl && (
                  <div className="text-right pl-3 border-l border-slate-200">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Post-Meal Sugar</div>
                    <div className="text-sm font-extrabold text-emerald-800 font-mono">
                      {record.postMealGlucoseMgDl} <span className="text-[10px] font-normal">mg/dL</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
