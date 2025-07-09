'use client'

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import Link from 'next/link';
import { 
  UserIcon, 
  LockClosedIcon, 
  EyeIcon, 
  EyeSlashIcon 
} from '@heroicons/react/24/outline';

const LoginPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle errors
  const handleError = (error, fallbackMessage) => {
    const message = error.message || fallbackMessage;
    setErrorMessage(message);
    toast.error(message, {
      style: {
        background: '#FEF2F2',
        color: '#B91C1C',
        border: '1px solid #FECACA',
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setErrorMessage("");

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });
      
      if (result?.error) {
        throw new Error(result.error);
      }
      
      const response = await fetch('/api/auth/session');
      const session = await response.json();
      
      toast.success("Welcome back!", {
        style: {
          background: '#272727',
          color: '#EFD09E',
          border: '1px solid #D4AA7D',
        },
      });
      
      switch (session.user.role) {
        case 'admin':
          router.push('/admin/dashboard');
          break;
        case 'student':
          router.push('/profile');
          break;
        default:
          router.push('/dashboard');
      }
    } catch (error) {
      handleError(error, 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-center" />
      
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`block w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all duration-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 ${
                    errors.email 
                      ? "border-red-400 focus:border-red-500 bg-red-50" 
                      : "border-gray-200 focus:border-amber-400 hover:border-gray-300"
                  }`}
                  placeholder="Enter your email"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <UserIcon className={`h-5 w-5 ${errors.email ? 'text-red-400' : 'text-gray-400'}`} />
                </div>
              </div>
              {errors.email && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`block w-full pl-12 pr-12 py-3 rounded-xl border-2 transition-all duration-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 ${
                    errors.password 
                      ? "border-red-400 focus:border-red-500 bg-red-50" 
                      : "border-gray-200 focus:border-amber-400 hover:border-gray-300"
                  }`}
                  placeholder="Enter your password"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <LockClosedIcon className={`h-5 w-5 ${errors.password ? 'text-red-400' : 'text-gray-400'}`} />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="text-sm text-red-600 text-center bg-red-50 p-3 rounded-lg">
                {errorMessage}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 rounded-xl text-white font-semibold text-sm transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
              style={{
                background: isLoading 
                  ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)' 
                  : 'linear-gradient(135deg, #272727 0%, #1f1f1f 100%)',
                boxShadow: isLoading 
                  ? 'none' 
                  : '0 4px 20px rgba(39, 39, 39, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </div>
        </form>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/register" className="font-medium text-amber-600 hover:text-amber-500 transition-colors">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;