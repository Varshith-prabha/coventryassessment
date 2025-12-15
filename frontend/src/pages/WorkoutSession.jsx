import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function WorkoutSession() {
  const navigate = useNavigate();
  const location = useLocation();
  const workoutPlan = location.state?.workoutPlan;

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [isWorkoutComplete, setIsWorkoutComplete] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    if (!workoutPlan) {
      navigate('/dashboard');
    }
  }, [workoutPlan, navigate]);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(timer => timer + 1);
      }, 1000);
    } else if (!isTimerRunning && timer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartWorkout = () => {
    setIsTimerRunning(true);
  };

  const handleCompleteExercise = (exerciseIndex) => {
    if (!completedExercises.includes(exerciseIndex)) {
      setCompletedExercises([...completedExercises, exerciseIndex]);
    }
    
    // Move to next exercise
    if (exerciseIndex < workoutPlan.exercises.length - 1) {
      setCurrentExerciseIndex(exerciseIndex + 1);
    } else {
      // All exercises completed
      setIsWorkoutComplete(true);
      setIsTimerRunning(false);
    }
  };

  const handleSkipExercise = () => {
    if (currentExerciseIndex < workoutPlan.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    }
  };

  const handleFinishWorkout = () => {
    // TODO: Save workout data to backend
    navigate('/dashboard');
  };

  if (!workoutPlan) {
    return null;
  }

  const currentExercise = workoutPlan.exercises[currentExerciseIndex];
  const progress = ((completedExercises.length) / workoutPlan.exercises.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-8 md:py-12">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 mb-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                {workoutPlan.title}
              </h1>
              <p className="text-gray-600 text-sm mt-1">{workoutPlan.description}</p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl font-semibold text-gray-700 transition-colors"
            >
              ← Back
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress: {completedExercises.length} / {workoutPlan.exercises.length} exercises</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Timer */}
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{formatTime(timer)}</div>
              <div className="text-xs text-gray-600">Workout Time</div>
            </div>
            {!isTimerRunning && completedExercises.length === 0 && (
              <button
                onClick={handleStartWorkout}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
              >
                Start Workout
              </button>
            )}
          </div>
        </div>

        {/* Workout Complete Message */}
        {isWorkoutComplete ? (
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 text-center border border-white/20">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
              Workout Complete!
            </h2>
            <p className="text-gray-600 mb-6">Great job! You completed all exercises.</p>
            <div className="mb-6">
              <div className="text-2xl font-bold text-gray-800 mb-1">{formatTime(timer)}</div>
              <div className="text-sm text-gray-600">Total Workout Time</div>
            </div>
            <button
              onClick={handleFinishWorkout}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-bold rounded-xl hover:shadow-2xl transition-all transform hover:scale-105"
            >
              Finish & Return to Dashboard
            </button>
          </div>
        ) : (
          /* Current Exercise Card */
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
            <div className="text-center mb-6">
              <div className="text-sm text-gray-600 mb-2">
                Exercise {currentExerciseIndex + 1} of {workoutPlan.exercises.length}
              </div>
              <h2 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
                {currentExercise}
              </h2>
            </div>

            {/* Exercise Instructions */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 mb-6 border-2 border-purple-200">
              <h3 className="font-semibold text-gray-700 mb-2">Instructions:</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Perform the exercise with proper form</li>
                <li>• Take breaks as needed</li>
                <li>• Focus on quality over quantity</li>
                <li>• Complete all sets before moving on</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => handleCompleteExercise(currentExerciseIndex)}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-4 px-6 rounded-xl hover:shadow-lg transition-all transform hover:scale-105 active:scale-95"
              >
                ✓ Mark as Complete
              </button>
              {currentExerciseIndex < workoutPlan.exercises.length - 1 && (
                <button
                  onClick={handleSkipExercise}
                  className="px-6 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl transition-colors"
                >
                  Skip
                </button>
              )}
            </div>

            {/* Exercise List */}
            <div className="mt-8">
              <h3 className="font-semibold text-gray-700 mb-4">All Exercises:</h3>
              <div className="space-y-2">
                {workoutPlan.exercises.map((exercise, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      completedExercises.includes(index)
                        ? 'bg-green-50 border-green-300'
                        : index === currentExerciseIndex
                        ? 'bg-purple-50 border-purple-400 shadow-md'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">
                        {index + 1}. {exercise}
                      </span>
                      {completedExercises.includes(index) && (
                        <span className="text-green-600 font-bold">✓</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WorkoutSession;

