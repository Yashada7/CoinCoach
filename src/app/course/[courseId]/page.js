"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../components/auth/AuthContext";
import useModuleProgress from "../../../hooks/useModuleProgress";
import { motion } from "framer-motion";
import { FaArrowLeft, FaCheckCircle, FaArrowRight, FaCheck } from "react-icons/fa";

// Import your module components
import TimeValueOfMoneyModule from "../../components/youngCourses/belowEighteen";
import InflationImpactModule from "../../components/youngCourses/inflation";
import OpportunityCostModule from "../../components/youngCourses/opportunityCost";
import InterestsModule from "../../components/youngCourses/interests";
import BankStatementModule from "../../components/youngCourses/bankStatementt";
import UpiPaymentModule from "../../components/youngCourses/upiPayment";
import TaxesBasicsModule from "../../components/youngCourses/taxesbasics";
import MutualBasicsModule from "../../components/youngCourses/mutualbasics";

// Define the courses and their respective modules with component references
const courseModules = {
  "money-basics": {
    title: "Money Basics",
    modules: [
      {
        id: "time-value-money",
        title: "Time Value of Money",
        component: TimeValueOfMoneyModule
      },
      {
        id: "inflation-impact",
        title: "Inflation Impact",
        component: InflationImpactModule
      }
    ]
  },
  "financial-concepts": {
    title: "Financial Concepts",
    modules: [
      {
        id: "opportunity-cost",
        title: "Opportunity Cost",
        component: OpportunityCostModule
      },
      {
        id: "interest-calculations",
        title: "Simple & Compound Interest",
        component: InterestsModule
      }
    ]
  },
  "banking-essentials": {
    title: "Banking Essentials",
    modules: [
      {
        id: "bank-statements",
        title: "Bank Statements",
        component: BankStatementModule
      },
      {
        id: "digital-payments",
        title: "Digital Payments",
        component: UpiPaymentModule
      }
    ]
  },
  "financial-planning": {
    title: "Financial Planning",
    modules: [
      {
        id: "taxation-basics",
        title: "Basics of Taxation",
        component: TaxesBasicsModule
      },
      {
        id: "mutual-funds",
        title: "Mutual Funds Basics",
        component: MutualBasicsModule
      }
    ]
  }
};

// Enhanced custom hook for module progress tracking
function useModuleProgressTracking(courseId, totalModules) {
  const [currentModule, setCurrentModule] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedCourses, setCompletedCourses] = useState([]);
  const { user } = useAuth();

  // Fetch progress when component mounts
  useEffect(() => {
    if (user && courseId) {
      fetchProgress();
    } else if (!user) {
      setIsLoading(false);
    }
  }, [user, courseId]);

  // Fetch user's progress from API
  const fetchProgress = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/progress?uid=${user.uid}`);
      const data = await response.json();
      
      console.log("Fetched progress data:", data); // Debug log
      
      // Set completed courses from database
      const dbCompletedCourses = data.completedCourses || [];
      setCompletedCourses(dbCompletedCourses);
      
      // Check if current course is completed - check both array and module data
      const courseCompleted = dbCompletedCourses.includes(courseId);
      const moduleCompleted = data.modules?.[courseId]?.isCompleted || false;
      const finalCompletionStatus = courseCompleted || moduleCompleted;
      
      console.log("Completion check:", {
        courseId,
        courseCompleted,
        moduleCompleted,
        finalCompletionStatus
      });
      
      setIsCompleted(finalCompletionStatus);
      
      if (data.modules && data.modules[courseId]) {
        const courseProgress = data.modules[courseId];
        
        // If course is marked as completed, set progress to 100%
        if (finalCompletionStatus) {
          setProgress(100);
          setIsCompleted(true);
        } else {
          setProgress(courseProgress.progress || 0);
        }
        
        // Set the starting module based on previous progress
        if (courseProgress.completedSections) {
          const moduleToStart = Math.min(
            courseProgress.completedSections, 
            totalModules - 1
          );
          setCurrentModule(moduleToStart);
        }
      } else if (finalCompletionStatus) {
        // If course is completed but no module data exists, set to 100%
        setProgress(100);
        setIsCompleted(true);
      }
    } catch (error) {
      console.error("Error fetching progress:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Save progress for a specific module
  const saveProgress = async (moduleIndex, isComplete = false) => {
    if (!user) return false;
    
    // Calculate progress based on modules completed
    const completedSections = moduleIndex + 1;
    // If marking course as complete, set to 100%, otherwise calculate
    const newProgress = isComplete ? 100 : Math.round((completedSections / totalModules) * 100);
    
    console.log("Saving progress:", {
      courseId,
      moduleIndex,
      isComplete,
      newProgress,
      completedSections,
      totalModules
    });
    
    try {
      // Save to backend
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: user.uid,
          moduleId: courseId,
          moduleName: courseModules[courseId]?.title || courseId,
          completedSections: isComplete ? totalModules : completedSections,
          totalSections: totalModules,
          progress: newProgress,
          markAsComplete: isComplete
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save progress');
      }
      
      const result = await response.json();
      console.log("Save progress result:", result); // Debug log
      
      // Update local state based on API response
      setProgress(result.progress || newProgress);
      
      // If marking as complete, update local state
      if (isComplete && result.isCompleted) {
        setIsCompleted(true);
        setCompletedCourses(result.completedCourses || []);
      }
      
      return true;
    } catch (error) {
      console.error("Error saving progress:", error);
      return false;
    }
  };

  // Mark a module as complete
  const markModuleComplete = async (moduleIndex) => {
    return await saveProgress(moduleIndex);
  };
  
  // Mark the entire course as complete
  const markCourseComplete = async () => {
    const success = await saveProgress(totalModules - 1, true);
    if (success) {
      // Force refresh the progress data to ensure state is in sync
      console.log("Course marked complete, refreshing progress data...");
      await fetchProgress();
    }
    return success;
  };

  // Function to refresh progress data
  const refreshProgress = async () => {
    await fetchProgress();
  };

  return {
    currentModule,
    setCurrentModule,
    progress,
    isCompleted,
    completedCourses,
    markModuleComplete,
    markCourseComplete,
    isLoading,
    refreshProgress
  };
}

// Component for Module Content
function ModuleContent({ 
  module, 
  onNext, 
  onPrev, 
  isLastModule, 
  courseId, 
  moduleIndex, 
  totalModules, 
  onComplete,
  onMarkAsDone,
  isCompleted 
}) {
  const ModuleComponent = module.component;
  const router = useRouter();
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  
  const handleLastModule = async () => {
    await onComplete();
    router.push("/course");
  };

  const handleMarkAsDone = async () => {
    setIsMarkingComplete(true);
    try {
      console.log("Marking course as done...");
      await onMarkAsDone();
    } finally {
      setIsMarkingComplete(false);
    }
  };
  
  return (
    <div className="rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{module.title}</h2>
        {!isCompleted ? (
          <button
            onClick={handleMarkAsDone}
            disabled={isMarkingComplete}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaCheck className="mr-2" /> 
            {isMarkingComplete ? "Marking..." : "Mark as Done"}
          </button>
        ) : (
          <div className="flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg">
            <FaCheckCircle className="mr-2" /> Completed
          </div>
        )}
      </div>
      
      <div className="prose max-w-none">
        {/* Render the actual module component */}
        <ModuleComponent onNext={onNext} />
        
        {/* Navigation buttons */}
        <div className="mt-8 flex justify-between">
          {moduleIndex > 0 ? (
            <button
              onClick={onPrev}
              className="flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
            >
              <FaArrowLeft className="mr-2" /> Previous Module
            </button>
          ) : (
            <div></div> // Empty div for spacing when there's no prev button
          )}
          
          {isLastModule ? (
            <button
              onClick={handleLastModule}
              className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Complete Course and Return <FaCheckCircle className="ml-2" />
            </button>
          ) : (
            <button
              onClick={onNext}
              className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Next Module <FaArrowRight className="ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Course Completion Component
function CourseCompletion({ courseId, courseTitle }) {
  const router = useRouter();
  
  return (
    <div className="text-center">
      <div className="flex justify-center mb-6">
        <FaCheckCircle className="text-green-500 w-20 h-20" />
      </div>
      <h2 className="text-3xl font-bold mb-4">Course Completed!</h2>
      <p className="text-xl mb-8">
        Congratulations! You've completed the {courseTitle} course.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button
          onClick={() => router.push("/course")}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Back to All Courses
        </button>
      </div>
    </div>
  );
}

export default function CoursePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const courseId = params.courseId;
  
  // Get the course data based on courseId
  const courseData = courseModules[courseId];
  
  // If course doesn't exist, redirect to courses page
  useEffect(() => {
    if (!courseData) {
      router.push("/course");
    }
  }, [courseData, router]);
  
  // Use our custom hook for progress tracking
  const { 
    currentModule, 
    setCurrentModule, 
    progress, 
    isCompleted,
    completedCourses,
    markModuleComplete, 
    markCourseComplete,
    isLoading,
    refreshProgress
  } = useModuleProgressTracking(courseId, courseData?.modules?.length || 0);
  
  // Handle user not logged in
  if (!user && !isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-purple-700 mb-4">Login Required</h2>
          <p className="text-gray-700 mb-6">Please sign in to access your courses and track progress</p>
          <button 
            onClick={() => useAuth().openModal('login')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition duration-300"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }
  
  // Show loading state
  if (isLoading || !courseData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100 flex items-center justify-center">
        <div className="text-2xl text-purple-700">Loading course...</div>
      </div>
    );
  }
  
  // Handle next button click
  const handleNext = async () => {
    try {
      // Mark current module as complete
      await markModuleComplete(currentModule);
      
      // Move to next module if not at the end
      if (currentModule < courseData.modules.length - 1) {
        setCurrentModule(currentModule + 1);
      }
    } catch (error) {
      console.error("Error handling next:", error);
    }
  };
  
  // Handle previous button click
  const handlePrev = () => {
    if (currentModule > 0) {
      setCurrentModule(currentModule - 1);
    }
  };
  
  // Handle complete course button click (last module)
  const handleComplete = async () => {
    try {
      console.log("Completing course from last module...");
      // Mark the entire course as complete (100%)
      await markCourseComplete();
      // Router will navigate to /course page from the ModuleContent component
    } catch (error) {
      console.error("Error completing course:", error);
    }
  };

  // Handle mark as done button click
  const handleMarkAsDone = async () => {
    try {
      console.log("Marking course as done from button...");
      await markCourseComplete();
      // After marking as done, the state should automatically update
    } catch (error) {
      console.error("Error marking course as done:", error);
    }
  };
  
  // Check if current module is the last one
  const isLastModule = currentModule === courseData.modules.length - 1;
  
  console.log("Current course state:", {
    courseId,
    isCompleted,
    progress,
    currentModule,
    totalModules: courseData.modules.length
  });
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100 py-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Course Navigation Bar */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => router.push("/course")}
            className="flex items-center text-purple-700 hover:text-purple-900 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to Courses
          </button>
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-center">{courseData.title}</h1>
            {isCompleted && (
              <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                <FaCheckCircle className="mr-1" /> Completed
              </div>
            )}
          </div>
          <div className="w-24"></div> {/* Spacer for alignment */}
        </div>
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span>{progress}% Complete</span>
            <span>{Math.round(progress / 100 * courseData.modules.length)}/{courseData.modules.length} Modules</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        {/* Module Content or Completion Screen */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          key={`${currentModule}-${isCompleted}`} // Add key to trigger animation on module/completion change
        >
          {isCompleted && progress === 100 ? (
            <CourseCompletion courseId={courseId} courseTitle={courseData.title} />
          ) : (
            courseData.modules[currentModule] && (
              <ModuleContent 
                module={courseData.modules[currentModule]} 
                onNext={handleNext}
                onPrev={handlePrev}
                isLastModule={isLastModule}
                courseId={courseId}
                moduleIndex={currentModule}
                totalModules={courseData.modules.length}
                onComplete={handleComplete}
                onMarkAsDone={handleMarkAsDone}
                isCompleted={isCompleted}
              />
            )
          )}
        </motion.div>
      </div>
    </div>
  );
}