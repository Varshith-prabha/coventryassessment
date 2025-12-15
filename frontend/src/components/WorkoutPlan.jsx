import { useNavigate } from 'react-router-dom';

function WorkoutPlan({ title, description, difficulty, duration, exercises, color }) {
  const navigate = useNavigate();
  const colorClasses = {
    purple: {
      bg: 'from-purple-500 to-purple-600',
      border: 'border-purple-300',
      text: 'text-purple-700',
      badge: 'bg-purple-100 text-purple-700',
    },
    pink: {
      bg: 'from-pink-500 to-pink-600',
      border: 'border-pink-300',
      text: 'text-pink-700',
      badge: 'bg-pink-100 text-pink-700',
    },
    blue: {
      bg: 'from-blue-500 to-blue-600',
      border: 'border-blue-300',
      text: 'text-blue-700',
      badge: 'bg-blue-100 text-blue-700',
    },
  };

  const colors = colorClasses[color] || colorClasses.purple;

  return (
    <div className={`bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl p-6 border-2 ${colors.border} hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]`}>
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className={`text-2xl font-extrabold ${colors.text}`}>{title}</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${colors.badge}`}>
            {difficulty}
          </span>
        </div>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>

      {/* Duration */}
      <div className="mb-4 flex items-center gap-2 text-gray-700">
        <span className="text-lg">⏱️</span>
        <span className="font-semibold">{duration}</span>
      </div>

      {/* Exercises List */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Exercises:</h4>
        <ul className="space-y-1">
          {exercises.map((exercise, index) => (
            <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
              <span className="text-purple-500">•</span>
              {exercise}
            </li>
          ))}
        </ul>
      </div>

      {/* Action Button */}
      <button
        onClick={() => navigate('/workout-session', { 
          state: { 
            workoutPlan: { title, description, difficulty, duration, exercises, color } 
          } 
        })}
        className={`w-full bg-gradient-to-r ${colors.bg} text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]`}
      >
        Start Workout
      </button>
    </div>
  );
}

export default WorkoutPlan;




