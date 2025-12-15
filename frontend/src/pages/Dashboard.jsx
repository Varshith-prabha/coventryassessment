import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressTracking from '../components/ProgressTracking';
import WorkoutPlan from '../components/WorkoutPlan';

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  // Sample workout plans data
  const workoutPlans = [
    {
      title: 'Beginner Full Body',
      description: 'Perfect for those just starting their fitness journey',
      difficulty: 'Beginner',
      duration: '30 minutes',
      exercises: ['Push-ups (3 sets)', 'Squats (3 sets)', 'Plank (30 sec)', 'Lunges (2 sets)'],
      color: 'purple',
    },
    {
      title: 'Cardio Blast',
      description: 'High-intensity cardio workout to boost your heart rate',
      difficulty: 'Intermediate',
      duration: '45 minutes',
      exercises: ['Jumping Jacks (5 sets)', 'Burpees (3 sets)', 'Mountain Climbers (3 sets)', 'High Knees (3 sets)'],
      color: 'pink',
    },
    {
      title: 'Strength Builder',
      description: 'Build muscle and increase strength with this plan',
      difficulty: 'Advanced',
      duration: '60 minutes',
      exercises: ['Deadlifts (4 sets)', 'Bench Press (4 sets)', 'Pull-ups (3 sets)', 'Leg Press (4 sets)'],
      color: 'blue',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-8 md:py-12">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-2">
            Dashboard
          </h1>
          <p className="text-purple-200 text-sm md:text-base">Welcome back! Track your progress and choose your workout</p>
        </div>

        {/* Progress Tracking Section - Top */}
        <div className="mb-8">
          <ProgressTracking />
        </div>

        {/* Workout Plans Section - Lower */}
        <div>
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-6 text-center">
            Workout Plans
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {workoutPlans.map((plan, index) => (
              <WorkoutPlan
                key={index}
                title={plan.title}
                description={plan.description}
                difficulty={plan.difficulty}
                duration={plan.duration}
                exercises={plan.exercises}
                color={plan.color}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;


