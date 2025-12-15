import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api/auth';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    fitnessLevel: 'beginner',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (parseInt(formData.age) < 13 || parseInt(formData.age) > 100) {
      newErrors.age = 'Age must be between 13 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          age: parseInt(formData.age) || 0,
          fitnessLevel: formData.fitnessLevel,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        throw new Error('Invalid response from server');
      }

      if (response.ok) {
        setMessage({ type: 'success', text: data.message || 'Registration successful! Redirecting to login...' });
        // Reset form
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          age: '',
          fitnessLevel: 'beginner',
        });
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        const errorMessage = data.message || data.error || 'Registration failed. Please try again.';
        setMessage({ 
          type: 'error', 
          text: errorMessage
        });
        // Set server-side errors if provided
        if (data.errors && Array.isArray(data.errors)) {
          const serverErrors = {};
          data.errors.forEach(error => {
            if (error.toLowerCase().includes('email')) serverErrors.email = error;
            if (error.toLowerCase().includes('password')) serverErrors.password = error;
            if (error.toLowerCase().includes('age')) serverErrors.age = error;
            if (error.toLowerCase().includes('name')) serverErrors.name = error;
          });
          setErrors(prev => ({ ...prev, ...serverErrors }));
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'Network error. Please check if the backend server is running.';
      
      if (error.message.includes('fetch')) {
        errorMessage = 'Cannot connect to server. Make sure the backend is running on port 5000.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setMessage({ 
        type: 'error', 
        text: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md mx-auto relative z-10">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-10 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8 space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-lg mb-2">
              <span className="text-4xl">💪</span>
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                Gym Beginner
              </h1>
              <p className="text-purple-700 font-medium text-sm">Create your account and start your fitness journey</p>
            </div>
          </div>

          {/* Success/Error Message */}
          {message.text && (
            <div
              className={`p-4 rounded-xl border-2 animate-fade-in mb-6 ${
                message.type === 'success'
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border-green-300 shadow-md'
                  : 'bg-gradient-to-r from-red-50 to-rose-50 text-red-800 border-red-300 shadow-md'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{message.type === 'success' ? '✅' : '❌'}</span>
                <p className="text-sm font-semibold">{message.text}</p>
              </div>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-semibold text-purple-700 mb-2">
                <span className="flex items-center gap-2">
                  <span>👤</span>
                  Full Name
                </span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400 ${
                  errors.name 
                    ? 'border-red-400 bg-red-50' 
                    : 'border-purple-200 bg-purple-50/50 hover:border-purple-300 focus:bg-white focus:border-purple-400'
                }`}
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-2 text-xs text-red-600 font-medium flex items-center gap-1.5">
                  <span>⚠️</span> {errors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-blue-700 mb-2">
                <span className="flex items-center gap-2">
                  <span>📧</span>
                  Email Address
                </span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 ${
                  errors.email 
                    ? 'border-red-400 bg-red-50' 
                    : 'border-blue-200 bg-blue-50/50 hover:border-blue-300 focus:bg-white focus:border-blue-400'
                }`}
                placeholder="john.doe@example.com"
              />
              {errors.email && (
                <p className="mt-2 text-xs text-red-600 font-medium flex items-center gap-1.5">
                  <span>⚠️</span> {errors.email}
                </p>
              )}
            </div>

            {/* Age Field */}
            <div className="space-y-2">
              <label htmlFor="age" className="block text-sm font-semibold text-pink-700 mb-2">
                <span className="flex items-center gap-2">
                  <span>🎂</span>
                  Age
                </span>
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-400 ${
                  errors.age 
                    ? 'border-red-400 bg-red-50' 
                    : 'border-pink-200 bg-pink-50/50 hover:border-pink-300 focus:bg-white focus:border-pink-400'
                }`}
                placeholder="25"
                min="13"
                max="100"
                required
              />
              {errors.age && (
                <p className="mt-2 text-xs text-red-600 font-medium flex items-center gap-1.5">
                  <span>⚠️</span> {errors.age}
                </p>
              )}
            </div>

            {/* Fitness Level Field */}
            <div className="space-y-2">
              <label htmlFor="fitnessLevel" className="block text-sm font-semibold text-purple-700 mb-2">
                <span className="flex items-center gap-2">
                  <span>🏋️</span>
                  Fitness Level
                </span>
              </label>
              <select
                id="fitnessLevel"
                name="fitnessLevel"
                value={formData.fitnessLevel}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-purple-200 bg-purple-50/50 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400 hover:border-purple-300 focus:bg-white cursor-pointer"
              >
                <option value="beginner">🏃 Beginner</option>
                <option value="intermediate">💪 Intermediate</option>
                <option value="advanced">🔥 Advanced</option>
              </select>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-purple-700 mb-2">
                <span className="flex items-center gap-2">
                  <span>🔒</span>
                  Password
                </span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400 ${
                  errors.password 
                    ? 'border-red-400 bg-red-50' 
                    : 'border-purple-200 bg-purple-50/50 hover:border-purple-300 focus:bg-white focus:border-purple-400'
                }`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-2 text-xs text-red-600 font-medium flex items-center gap-1.5">
                  <span>⚠️</span> {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-blue-700 mb-2">
                <span className="flex items-center gap-2">
                  <span>🔐</span>
                  Confirm Password
                </span>
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 ${
                  errors.confirmPassword 
                    ? 'border-red-400 bg-red-50' 
                    : 'border-blue-200 bg-blue-50/50 hover:border-blue-300 focus:bg-white focus:border-blue-400'
                }`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="mt-2 text-xs text-red-600 font-medium flex items-center gap-1.5">
                  <span>⚠️</span> {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full font-bold py-4 px-6 rounded-xl transition-all duration-300 transform ${
                  loading
                    ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed text-white shadow-md'
                    : 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white shadow-lg hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-3">
                    <span>✨</span>
                    Create Account
                  </span>
                )}
              </button>
            </div>
          </form>

          {/* Login Link */}
          <div className="text-center pt-6 mt-6 border-t-2 border-purple-200">
            <p className="text-sm text-purple-700 font-medium">
              Already have an account?{' '}
              <a href="/login" className="text-blue-600 hover:text-blue-700 font-bold transition-colors duration-200 hover:underline">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;

