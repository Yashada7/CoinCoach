"use client";
import React, { useState, useEffect } from 'react';
import { Camera, Save, Edit3, User, Calendar, FileText, Mail, Phone, MapPin, DollarSign, Target, Award } from 'lucide-react';

export default function UserProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  
  const [profileData, setProfileData] = useState({
    firstName: 'Alexander',
    lastName: 'Morgan',
    email: 'alexander.morgan@email.com',
    phone: '+1 (555) 123-4567',
    age: 32,
    location: 'New York, NY',
    description: 'Experienced financial professional passionate about wealth building and strategic investment planning. Currently focused on portfolio optimization and long-term financial security.',
    profileImage: null,
    financialGoals: 'Achieve financial independence through diversified investments, real estate portfolio expansion, and comprehensive retirement planning.',
    experienceLevel: 'advanced',
    monthlyIncome: '12500',
    currentSavings: '85000'
  });

  // Enhanced mouse tracking for sophisticated interactions
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 100);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({
          ...prev,
          profileImage: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log('Profile saved:', profileData);
  };

  // Parallax effect for header
  const parallaxOffset = scrollY * 0.5;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {/* Subtle animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-blue-100/20 to-slate-100/20 rounded-full blur-3xl"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
            transition: 'transform 0.8s ease-out'
          }}
        />
        <div 
          className="absolute top-1/2 right-0 w-64 h-64 bg-gradient-to-l from-slate-100/30 to-blue-100/30 rounded-full blur-2xl"
          style={{
            transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * -0.01}px)`,
            transition: 'transform 1s ease-out'
          }}
        />
      </div>

      {/* Elegant top navigation bar with backdrop blur */}
      <div className={`bg-white/90 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50 transition-all duration-500 ${scrollY > 50 ? 'shadow-lg' : ''}`}>
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-end">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="group flex items-center space-x-2 px-6 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-900 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <Edit3 size={16} className="group-hover:rotate-12 transition-transform duration-300" />
              <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        {/* Hero Profile Section with enhanced animations */}
        <div className={`bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-200/50 overflow-hidden mb-8 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          {/* Elegant header with animated gradient and parallax */}
          <div 
            className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 px-8 py-16 relative overflow-hidden"
            style={{ transform: `translateY(${parallaxOffset}px)` }}
          >
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
            
            {/* Floating particles effect */}
            <div className="absolute inset-0">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${30 + (i % 3) * 20}%`,
                    animationDelay: `${i * 0.8}s`,
                    animationDuration: `${3 + i * 0.5}s`
                  }}
                />
              ))}
            </div>
            
            <div className="relative flex flex-col lg:flex-row items-center lg:items-end space-y-8 lg:space-y-0 lg:space-x-8">
              {/* Professional Profile Image with hover effects */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                <div className="w-36 h-36 rounded-full bg-white p-1 shadow-2xl ring-4 ring-white/30 transform group-hover:scale-105 transition-all duration-500 relative z-10">
                  {profileData.profileImage ? (
                    <img
                      src={profileData.profileImage}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center">
                      <User size={48} className="text-slate-600" />
                    </div>
                  )}
                </div>
                {isEditing && (
                  <label className="absolute -bottom-1 -right-1 bg-slate-800 rounded-full p-3 cursor-pointer hover:bg-slate-900 transition-all duration-300 shadow-xl hover:scale-110 hover:rotate-12 z-50 border-4 border-white">
                    <Camera size={18} className="text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              
              {/* Name and Location with typing animation effect */}
              <div className="flex-1 text-center lg:text-left">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <input
                        type="text"
                        value={profileData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="flex-1 px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm transition-all duration-300 focus:scale-105"
                        placeholder="First Name"
                      />
                      <input
                        type="text"
                        value={profileData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="flex-1 px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm transition-all duration-300 focus:scale-105"
                        placeholder="Last Name"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="transform transition-all duration-700 delay-300">
                    <h1 className="text-5xl font-bold text-white mb-3 tracking-tight bg-gradient-to-r from-white to-blue-100 bg-clip-text">
                      {profileData.firstName} {profileData.lastName}
                    </h1>
                    <p className="text-slate-300 flex items-center justify-center lg:justify-start space-x-2 text-lg">
                      <MapPin size={18} className="animate-pulse" />
                      <span>{profileData.location}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Enhanced Quick Stats with counters */}
              <div className="flex space-x-12">
                <div className="text-center group">
                  <div className="text-3xl font-bold text-white group-hover:scale-110 transition-transform duration-300">
                    ${parseInt(profileData.monthlyIncome).toLocaleString()}
                  </div>
                  <div className="text-sm text-slate-300 font-medium">Monthly Income</div>
                  <div className="w-full h-1 bg-white/20 rounded-full mt-2">
                    <div className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse" style={{width: '75%'}}></div>
                  </div>
                </div>
                <div className="text-center group">
                  <div className="text-3xl font-bold text-white group-hover:scale-110 transition-transform duration-300">
                    ${parseInt(profileData.currentSavings).toLocaleString()}
                  </div>
                  <div className="text-sm text-slate-300 font-medium">Total Savings</div>
                  <div className="w-full h-1 bg-white/20 rounded-full mt-2">
                    <div className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse" style={{width: '60%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid with staggered animations */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Primary Information */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information with hover effects */}
            <div className={`bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{transitionDelay: '200ms'}}>
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center shadow-inner">
                  <User size={24} className="text-slate-600" />
                </div>
                <h2 className="text-2xl font-semibold text-slate-800">Personal Information</h2>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-3 group">
                  <label className="text-sm font-medium text-slate-600 flex items-center space-x-2">
                    <Mail size={16} className="group-hover:text-blue-500 transition-colors duration-300" />
                    <span>Email Address</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-300 hover:shadow-md focus:scale-105"
                    />
                  ) : (
                    <div className="text-slate-800 font-medium text-lg group-hover:text-blue-600 transition-colors duration-300">{profileData.email}</div>
                  )}
                </div>
                
                <div className="space-y-3 group">
                  <label className="text-sm font-medium text-slate-600 flex items-center space-x-2">
                    <Phone size={16} className="group-hover:text-green-500 transition-colors duration-300" />
                    <span>Phone Number</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-300 hover:shadow-md focus:scale-105"
                    />
                  ) : (
                    <div className="text-slate-800 font-medium text-lg group-hover:text-green-600 transition-colors duration-300">{profileData.phone}</div>
                  )}
                </div>
                
                <div className="space-y-3 group">
                  <label className="text-sm font-medium text-slate-600 flex items-center space-x-2">
                    <Calendar size={16} className="group-hover:text-purple-500 transition-colors duration-300" />
                    <span>Age</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={profileData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-300 hover:shadow-md focus:scale-105"
                    />
                  ) : (
                    <div className="text-slate-800 font-medium text-lg group-hover:text-purple-600 transition-colors duration-300">{profileData.age} years old</div>
                  )}
                </div>
                
                <div className="space-y-3 group">
                  <label className="text-sm font-medium text-slate-600 flex items-center space-x-2">
                    <MapPin size={16} className="group-hover:text-red-500 transition-colors duration-300" />
                    <span>Location</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-300 hover:shadow-md focus:scale-105"
                    />
                  ) : (
                    <div className="text-slate-800 font-medium text-lg group-hover:text-red-600 transition-colors duration-300">{profileData.location}</div>
                  )}
                </div>
              </div>
            </div>

            {/* About Section with enhanced styling */}
            <div className={`bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{transitionDelay: '400ms'}}>
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center shadow-inner">
                  <FileText size={24} className="text-blue-600" />
                </div>
                <h2 className="text-2xl font-semibold text-slate-800">Professional Summary</h2>
              </div>
              
              {isEditing ? (
                <textarea
                  value={profileData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent resize-none transition-all duration-300 hover:shadow-md focus:scale-105"
                  placeholder="Describe your professional background and financial experience..."
                />
              ) : (
                <p className="text-slate-700 leading-relaxed text-lg hover:text-slate-900 transition-colors duration-300">{profileData.description}</p>
              )}
            </div>

            {/* Financial Goals */}
            <div className={`bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{transitionDelay: '600ms'}}>
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center shadow-inner">
                  <Target size={24} className="text-green-600" />
                </div>
                <h2 className="text-2xl font-semibold text-slate-800">Financial Objectives</h2>
              </div>
              
              {isEditing ? (
                <textarea
                  value={profileData.financialGoals}
                  onChange={(e) => handleInputChange('financialGoals', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent resize-none transition-all duration-300 hover:shadow-md focus:scale-105"
                  placeholder="Outline your financial goals and investment strategy..."
                />
              ) : (
                <p className="text-slate-700 leading-relaxed text-lg hover:text-slate-900 transition-colors duration-300">{profileData.financialGoals}</p>
              )}
            </div>
          </div>

          {/* Right Column - Financial Data with enhanced animations */}
          <div className="space-y-8">
            {/* Experience Level with enhanced gradient and color theming */}
            <div className={`bg-gradient-to-br from-purple-50/90 via-indigo-50/80 to-violet-50/70 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-200/50 p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{transitionDelay: '300ms'}}>
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-200 to-indigo-300 rounded-xl flex items-center justify-center shadow-lg">
                  <Award size={24} className="text-purple-700" />
                </div>
                <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-800 to-indigo-700 bg-clip-text text-transparent">Experience Level</h2>
              </div>
              
              {isEditing ? (
                <select
                  value={profileData.experienceLevel}
                  onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
                  className="w-full px-4 py-3 border border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:shadow-md focus:scale-105 bg-white/90"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              ) : (
                <div className="text-center">
                  <span className={`inline-block px-6 py-3 rounded-full text-lg font-bold transform hover:scale-110 transition-all duration-300 shadow-lg ${
                    profileData.experienceLevel === 'beginner' ? 'bg-gradient-to-r from-rose-100 via-pink-100 to-red-200 text-red-800 border border-red-200' :
                    profileData.experienceLevel === 'intermediate' ? 'bg-gradient-to-r from-amber-100 via-yellow-100 to-orange-200 text-orange-800 border border-orange-200' :
                    profileData.experienceLevel === 'advanced' ? 'bg-gradient-to-r from-sky-100 via-blue-100 to-indigo-200 text-indigo-800 border border-indigo-200' :
                    'bg-gradient-to-r from-emerald-100 via-green-100 to-teal-200 text-emerald-800 border border-emerald-200'
                  }`}>
                    {profileData.experienceLevel.charAt(0).toUpperCase() + profileData.experienceLevel.slice(1)}
                  </span>
                </div>
              )}
            </div>

            {/* Financial Overview with enhanced gradients and colors */}
            <div className={`bg-gradient-to-br from-emerald-50/90 via-teal-50/80 to-cyan-50/70 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-200/50 p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{transitionDelay: '500ms'}}>
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-200 to-teal-300 rounded-xl flex items-center justify-center shadow-lg">
                  <DollarSign size={24} className="text-emerald-700" />
                </div>
                <h2 className="text-xl font-semibold bg-gradient-to-r from-emerald-800 to-teal-700 bg-clip-text text-transparent">Financial Overview</h2>
              </div>
              
              <div className="space-y-8">
                <div className="group p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-emerald-100/50 hover:border-emerald-200 transition-all duration-300">
                  <label className="block text-sm font-medium text-emerald-700 mb-3 flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span>Monthly Income</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={profileData.monthlyIncome}
                      onChange={(e) => handleInputChange('monthlyIncome', e.target.value)}
                      className="w-full px-4 py-3 border border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 hover:shadow-md focus:scale-105 bg-white/90"
                      placeholder="0"
                    />
                  ) : (
                    <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                      ${parseInt(profileData.monthlyIncome).toLocaleString()}
                    </div>
                  )}
                </div>
                
                <div className="group p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-blue-100/50 hover:border-blue-200 transition-all duration-300">
                  <label className="block text-sm font-medium text-blue-700 mb-3 flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span>Current Savings</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={profileData.currentSavings}
                      onChange={(e) => handleInputChange('currentSavings', e.target.value)}
                      className="w-full px-4 py-3 border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:shadow-md focus:scale-105 bg-white/90"
                      placeholder="0"
                    />
                  ) : (
                    <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                      ${parseInt(profileData.currentSavings).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Save Button with sophisticated gradient */}
        {isEditing && (
          <div className="flex justify-center mt-12">
            <button
              onClick={handleSave}
              className="relative overflow-hidden flex items-center space-x-4 px-12 py-4 bg-gradient-to-r from-slate-800 via-indigo-800 to-purple-800 text-white rounded-2xl hover:from-slate-900 hover:via-indigo-900 hover:to-purple-900 transition-all duration-500 shadow-2xl hover:shadow-3xl hover:-translate-y-2 hover:scale-105 group"
            >
              {/* Animated background shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              <Save size={24} className="group-hover:rotate-12 transition-transform duration-300 relative z-10" />
              <span className="font-semibold text-lg relative z-10">Save Changes</span>
              
              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}