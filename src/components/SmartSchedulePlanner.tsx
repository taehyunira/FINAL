import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Sparkles, TrendingUp, X, RefreshCw, AlertCircle, Zap } from 'lucide-react';

interface SmartSchedulePlannerProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerateSchedule: (schedule: {
    numberOfPosts: number;
    startDate: string;
  }) => void;
  onPreviewChange?: (preview: { numberOfPosts: number; startDate: string } | null) => void;
}

interface BestTime {
  day: string;
  time: string;
  label: string;
  reason: string;
  engagement: string;
}

const BEST_POSTING_TIMES: BestTime[] = [
  {
    day: 'friday',
    time: '18:00',
    label: 'Friday at 6:00 PM',
    reason: 'Weekend anticipation drives high interaction',
    engagement: 'Very High'
  },
  {
    day: 'wednesday',
    time: '12:00',
    label: 'Wednesday at 12:00 PM',
    reason: 'Peak mid-week engagement during lunch break',
    engagement: 'High'
  },
  {
    day: 'tuesday',
    time: '10:00',
    label: 'Tuesday at 10:00 AM',
    reason: 'Morning productivity hours with fresh audience',
    engagement: 'High'
  },
  {
    day: 'thursday',
    time: '15:00',
    label: 'Thursday at 3:00 PM',
    reason: 'Afternoon energy boost time',
    engagement: 'Medium-High'
  },
  {
    day: 'saturday',
    time: '11:00',
    label: 'Saturday at 11:00 AM',
    reason: 'Weekend browsing with relaxed audience',
    engagement: 'Medium-High'
  },
  {
    day: 'monday',
    time: '09:00',
    label: 'Monday at 9:00 AM',
    reason: 'Start of week, professional audience active',
    engagement: 'Medium'
  },
  {
    day: 'sunday',
    time: '19:00',
    label: 'Sunday at 7:00 PM',
    reason: 'Evening wind-down before new week',
    engagement: 'Medium'
  }
];

export function SmartSchedulePlanner({ isOpen, onClose, onGenerateSchedule, onPreviewChange }: SmartSchedulePlannerProps) {
  const [numberOfPosts, setNumberOfPosts] = useState(3);
  const [startDate, setStartDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (isOpen && onPreviewChange) {
      onPreviewChange({ numberOfPosts, startDate });
    } else if (!isOpen && onPreviewChange) {
      onPreviewChange(null);
    }
  }, [isOpen, numberOfPosts, startDate, onPreviewChange]);

  const getSelectedDays = () => {
    return BEST_POSTING_TIMES.slice(0, numberOfPosts);
  };

  const handleGenerate = () => {
    onGenerateSchedule({
      numberOfPosts,
      startDate
    });
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
      onClose();
    }, 4000);
  };

  const getPostFrequency = () => {
    if (numberOfPosts === 1) return 'Once per week';
    if (numberOfPosts === 7) return 'Daily (7 days per week)';
    return `${numberOfPosts} times per week`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Smart Schedule Planner</h2>
              <p className="text-sm text-gray-600">Create a recurring posting schedule automatically</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
            <h3 className="font-semibold text-gray-800 mb-2 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              Smart Weekly Scheduler
            </h3>
            <p className="text-xs text-gray-600">
              Schedule posts throughout the week on the best days for engagement. Choose 1-7 posts per week, and we'll automatically assign them to optimal posting times.
            </p>
          </div>

          <div>
            <label htmlFor="numberOfPosts" className="block text-sm font-medium text-gray-700 mb-2">
              Posts Per Week: {numberOfPosts}
            </label>
            <input
              id="numberOfPosts"
              type="range"
              min="1"
              max="7"
              value={numberOfPosts}
              onChange={(e) => setNumberOfPosts(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1 post</span>
              <span>7 posts (daily)</span>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              {getPostFrequency()}
            </p>
          </div>

          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
            <h3 className="font-semibold text-gray-800 mb-3 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-600" />
              Your Selected Posting Schedule
            </h3>
            <div className="space-y-2">
              {getSelectedDays().map((slot, idx) => (
                <div
                  key={idx}
                  className="bg-white p-3 rounded-lg border border-purple-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-800 text-sm capitalize">{slot.label}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          slot.engagement === 'Very High' ? 'bg-green-100 text-green-700' :
                          slot.engagement === 'High' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {slot.engagement}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">{slot.reason}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl border border-green-200">
            <h3 className="font-semibold text-gray-800 mb-2 text-sm">Schedule Summary</h3>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>📊 Frequency: <span className="font-medium">{getPostFrequency()}</span></li>
              <li>📅 Start Date: <span className="font-medium">{new Date(startDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}</span></li>
              <li>📝 Total Posts: <span className="font-medium">{numberOfPosts} post{numberOfPosts !== 1 ? 's' : ''}</span></li>
            </ul>
          </div>

          {showNotification && (
            <div className="relative overflow-hidden rounded-2xl animate-pulse">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 animate-pulse opacity-80"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 animate-pulse"></div>
              <div className="relative p-8 bg-gradient-to-br from-yellow-100 via-red-50 to-orange-100 border-8 border-red-500 rounded-2xl shadow-2xl transform scale-105">
                <div className="absolute -top-2 -left-2 w-12 h-12 bg-yellow-400 rounded-full animate-ping"></div>
                <div className="absolute -top-2 -right-2 w-12 h-12 bg-red-500 rounded-full animate-ping"></div>
                <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-green-500 rounded-full animate-ping"></div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-blue-500 rounded-full animate-ping"></div>

                <div className="flex items-center justify-center gap-4 mb-4">
                  <Zap className="w-12 h-12 text-yellow-500 animate-bounce" fill="currentColor" />
                  <AlertCircle className="w-14 h-14 text-red-600 animate-pulse" fill="currentColor" />
                  <RefreshCw className="w-12 h-12 text-green-600 animate-spin" />
                  <Sparkles className="w-10 h-10 text-blue-600 animate-bounce" fill="currentColor" />
                  <Zap className="w-12 h-12 text-purple-500 animate-bounce" fill="currentColor" />
                </div>

                <div className="bg-gradient-to-r from-yellow-300 via-red-300 to-orange-300 p-1 rounded-xl mb-4 animate-pulse">
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-yellow-600 to-green-600 text-center mb-2 animate-pulse">
                      SCHEDULE GENERATED!
                    </p>
                  </div>
                </div>

                <div className="bg-red-600 p-1 rounded-xl shadow-2xl animate-pulse">
                  <div className="bg-gradient-to-r from-yellow-200 via-orange-200 to-red-200 p-6 rounded-lg">
                    <p className="text-2xl font-black text-red-900 text-center leading-tight animate-pulse">
                      REFRESH THE PAGE NOW!
                    </p>
                    <p className="text-lg font-bold text-gray-900 text-center mt-3">
                      Close this page and open it back to see your updated schedule and alarm
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 mt-4">
                  <RefreshCw className="w-8 h-8 text-red-600 animate-spin" />
                  <p className="text-xl font-bold text-red-700 animate-bounce">Action Required</p>
                  <RefreshCw className="w-8 h-8 text-red-600 animate-spin" />
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={showNotification}
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={showNotification}
            >
              <Sparkles className="w-4 h-4" />
              Generate Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
