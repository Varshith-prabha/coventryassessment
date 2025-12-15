function ProgressTracking() {
  // Sample data - in real app, this would come from API
  const weeklyProgress = [
    { day: 'Mon', workouts: 2, completed: true },
    { day: 'Tue', workouts: 1, completed: true },
    { day: 'Wed', workouts: 3, completed: true },
    { day: 'Thu', workouts: 2, completed: false },
    { day: 'Fri', workouts: 1, completed: false },
    { day: 'Sat', workouts: 0, completed: false },
    { day: 'Sun', workouts: 0, completed: false },
  ];

  const totalWorkouts = weeklyProgress.reduce((sum, day) => sum + day.workouts, 0);
  const completedDays = weeklyProgress.filter(day => day.completed).length;
  const completionRate = Math.round((completedDays / 7) * 100);

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 border border-white/20">
      <div className="mb-6">
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Weekly Progress
        </h2>
        <p className="text-gray-600 text-sm">Track your daily workout logs</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border-2 border-purple-200">
          <div className="text-2xl font-bold text-purple-700">{totalWorkouts}</div>
          <div className="text-xs text-purple-600 font-medium">Total Workouts</div>
        </div>
        <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-4 border-2 border-pink-200">
          <div className="text-2xl font-bold text-pink-700">{completedDays}</div>
          <div className="text-xs text-pink-600 font-medium">Days Completed</div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-200">
          <div className="text-2xl font-bold text-blue-700">{completionRate}%</div>
          <div className="text-xs text-blue-600 font-medium">Completion Rate</div>
        </div>
      </div>

      {/* Weekly Calendar */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">This Week</h3>
        <div className="grid grid-cols-7 gap-2">
          {weeklyProgress.map((day, index) => (
            <div
              key={index}
              className={`rounded-xl p-3 text-center border-2 transition-all ${
                day.completed
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 shadow-md'
                  : day.workouts > 0
                  ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="text-xs font-semibold text-gray-600 mb-1">{day.day}</div>
              <div className="text-lg font-bold text-gray-800">{day.workouts}</div>
              <div className="text-xs text-gray-500 mt-1">
                {day.completed ? '✓ Done' : day.workouts > 0 ? 'Pending' : 'No workout'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProgressTracking;




