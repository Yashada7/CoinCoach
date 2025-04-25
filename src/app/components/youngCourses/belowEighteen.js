"use client"

import InflationImpactModule from "./inflation";
import { useState, useEffect } from "react";
import { FaChartLine, FaLightbulb } from "react-icons/fa";
import OpportunityCostModule from "./opportunityCost";
import SimpleVsCompoundInterest from "./interests";
import BankStatementModule from "./bankStatementt";
import DigitalPaymentsModule from "./upiPayment";
import BasicsOfTaxation from "./taxesbasics";
import MutualFundsModule from "./mutualbasics";
import { useAuth } from "../../components/auth/AuthContext";
import useModuleProgress from "../../../hooks/useModuleProgress";

export default function LearningModuleContainer() {
  const { user } = useAuth();
  const { currentModule, handleNext, isLoading } = useModuleProgress('below-eighteen');
  const totalModules = 8;

  // Handle next button click with progress saving
  const onModuleComplete = () => {
    handleNext(totalModules);
  };

  const getProgressPercentage = () => (currentModule / totalModules) * 100;

  // Show login prompt if user is not authenticated
  if (!user && !isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-purple-700 mb-4">Login Required</h2>
          <p className="text-gray-700 mb-6">Please sign in to track your learning progress</p>
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

  // Show loading state while fetching progress
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100 flex items-center justify-center">
        <div className="text-2xl text-purple-700">Loading your progress...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100 px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* 📊 Progress Bar */}
        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-500 transition-all duration-500"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
        <p className="text-right text-sm text-gray-600">
          Module {currentModule} of {totalModules}
        </p>

        {currentModule === 1 && <TimeValueOfMoneyModule onNext={onModuleComplete} />}
        {currentModule === 2 && <InflationImpactModule onNext={onModuleComplete} />}
        {currentModule === 3 && <OpportunityCostModule onNext={onModuleComplete} />}
        {currentModule === 4 && <SimpleVsCompoundInterest onNext={onModuleComplete} />}
        {currentModule === 5 && <BankStatementModule onNext={onModuleComplete} />}
        {currentModule === 6 && <DigitalPaymentsModule onNext={onModuleComplete} />}
        {currentModule === 7 && <BasicsOfTaxation onNext={onModuleComplete} />}
        {currentModule === 8 && <MutualFundsModule onNext={onModuleComplete} />}
      </div>
    </div>
  );
}


function TimeValueOfMoneyModule({ onNext }) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleAnswer = (option) => {
    setSelectedOption(option);
    setShowAnswer(true);
  };

  return (
    <div className="space-y-20">

      {/* 🎬 Hero Section */}
      <section className="text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-purple-700 drop-shadow-sm">
          💸 Time Value of Money
        </h1>
        <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Imagine money as a time traveler. The earlier it starts its journey, the richer it becomes. Let's explore how your 💵 turns into 💰 over time.
        </p>
      </section>

      {/* 💡 Core Idea */}
      <section className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border-l-[6px] border-purple-500">
        <div className="flex items-center gap-3 text-purple-700 mb-4">
          <FaLightbulb className="text-2xl" />
          <h2 className="text-3xl font-semibold">The Big Brain Idea</h2>
        </div>
        <p className="text-gray-700 text-lg leading-relaxed">
          ₹1000 today is NOT the same as ₹1000 tomorrow. Why? Because today’s ₹1000 can be <strong>invested</strong> and earn more money. That’s the magic of <span className="text-purple-600 font-semibold">compounding</span>.
          <br /><br />
          Think of it like planting a money seed 🌱 — give it time, water (investment), and sunlight (patience)... and boom! It grows into a money tree 🌳.
        </p>
      </section>

      {/* 📐 Formula with Example */}
      <section className="grid md:grid-cols-2 items-center gap-10 bg-gradient-to-r from-purple-100 to-indigo-100 p-8 md:p-10 rounded-3xl shadow-lg">
        <div>
          <h3 className="text-2xl font-semibold text-indigo-800 mb-3">📚 The Golden Formula</h3>
          <p className="text-lg text-gray-700 mb-4">
            <strong>Future Value (FV)</strong> = PV × (1 + r)<sup>n</sup>
          </p>
          <ul className="list-disc text-gray-800 pl-5 space-y-2 text-base">
            <li><strong>PV:</strong> Present Value (what you invest today)</li>
            <li><strong>r:</strong> Interest Rate per year (e.g. 8% = 0.08)</li>
            <li><strong>n:</strong> Number of years</li>
          </ul>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border border-indigo-300">
          <h4 className="text-indigo-700 font-semibold mb-2 text-lg">🔍 Try This</h4>
          <p className="text-gray-700 leading-relaxed">
            You invest ₹1000 at 8% for 5 years:
            <br />
            <span className="block mt-2 text-xl text-purple-700 font-bold">
              ₹1000 × (1 + 0.08)<sup>5</sup> = ₹1,469.33
            </span>
            <br />
            That’s ₹469.33 earned... for doing nothing but being smart early. 🧠💵
          </p>
        </div>
      </section>

      {/* 😂 Real-Life Scenarios */}
      <section className="bg-white/90 p-8 rounded-3xl shadow-xl border-l-[6px] border-yellow-400">
        <div className="text-yellow-700 font-semibold text-2xl flex items-center gap-3 mb-4">
          <FaChartLine className="text-2xl" />
          Relatable + Hilarious Scenarios
        </div>
        <ul className="text-gray-800 space-y-5 text-lg leading-relaxed">
          <li>🧁 <strong>The Cupcake Dilemma:</strong> Spend ₹100 now on a cupcake, or invest it and get a full dessert buffet next year? 🍩🎂</li>
          <li>🎮 <strong>Gamer Logic:</strong> ₹2,000 on a game skin now or invest it and get a whole PS6 later? Think like a boss. 🕹️📈</li>
          <li>👵🏽 <strong>Grandma’s Gold:</strong> "Back in my day, ₹500 meant gold." Now? “Two samosas and a paper napkin.” Inflation’s a sneaky thief. 🥲</li>
        </ul>
      </section>

      {/* 🧠 Quick Quiz */}
      <section className="bg-indigo-50 p-6 md:p-8 rounded-xl shadow-lg border-l-4 border-purple-400">
        <h4 className="text-purple-700 font-semibold text-2xl mb-4">🧠 Quick Quiz!</h4>
        <p className="text-lg text-gray-800 mb-6">
          What happens if you invest ₹1000 for 10 years at 10% annual interest?
        </p>
        <div className="space-y-4">
          <button
            onClick={() => handleAnswer("wrong")}
            className={`w-full px-6 py-4 rounded-lg border transition ${
              selectedOption === "wrong" ? "bg-red-100" : "bg-white hover:bg-gray-100"
            }`}
          >
            💸 You lose money
          </button>
          <button
            onClick={() => handleAnswer("right")}
            className={`w-full px-6 py-4 rounded-lg border transition ${
              selectedOption === "right" ? "bg-green-100" : "bg-white hover:bg-gray-100"
            }`}
          >
            📈 Your money grows with interest
          </button>
        </div>
        {showAnswer && (
          <div className={`mt-4 p-4 rounded-xl text-lg font-medium text-center transition-all duration-300 ${
            selectedOption === "right" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {selectedOption === "right" ? "🎉 Correct! That's the power of compounding!" : "❌ Oops! Actually, compounding helps your money grow."}
          </div>
        )}
      </section>

      {/* ✨ Summary */}
      <section className="bg-indigo-100 p-6 md:p-8 rounded-xl border-l-4 border-indigo-500 text-gray-800">
        <h4 className="text-indigo-800 font-semibold text-2xl mb-2">💬 Final Words</h4>
        <p className="text-lg leading-relaxed">
          Every rupee has potential. When you give your money time, it gives you power in return. Start early. Be consistent. Watch it multiply like magic. ✨📈
        </p>
      </section>

      {/* 👉 Next Button */}
      <div className="flex justify-end mt-10">
        <button
          onClick={onNext}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition duration-300"
        >
          Next →
        </button>
      </div>
    </div>
  );
}