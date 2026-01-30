"use client";
import React, { useState, useEffect } from 'react';
import { BookOpen, Coins, Home, Users, Trophy, AlertCircle, ChevronRight } from 'lucide-react';

const SapnoKaSafar = () => {
  const [gameState, setGameState] = useState('welcome');
  const [currentYear, setCurrentYear] = useState(1);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [playerName, setPlayerName] = useState('');
  const [playerStats, setPlayerStats] = useState({
    money: 50000, // Starting money in INR
    totalDebt: 0,
    gpa: 8.0,
    happiness: 75,
    collegeChoice: null,
    expenses: [],
    income: 0
  });

  const colleges = [
    {
      id: 'iit',
      name: 'IIT Delhi',
      fees: 200000,
      prestige: 95,
      location: 'Delhi',
      description: 'Premier engineering institute with excellent placement record',
      avgSalary: 1500000
    },
    {
      id: 'du',
      name: 'Delhi University',
      fees: 50000,
      prestige: 80,
      location: 'Delhi',
      description: 'Prestigious central university with diverse courses',
      avgSalary: 800000
    },
    {
      id: 'local',
      name: 'Local Government College',
      fees: 25000,
      prestige: 60,
      location: 'Your City',
      description: 'Affordable education close to home',
      avgSalary: 400000
    },
    {
      id: 'private',
      name: 'Amity University',
      fees: 300000,
      prestige: 70,
      location: 'Noida',
      description: 'Private university with modern facilities',
      avgSalary: 600000
    }
  ];

  const yearlyEvents = {
    1: [
      {
        id: 'hostel',
        title: 'Accommodation Decision',
        description: 'Choose your living arrangement for first year',
        choices: [
          { text: 'College Hostel (₹60,000/year)', cost: 60000, happiness: 10 },
          { text: 'Shared PG (₹40,000/year)', cost: 40000, happiness: 5 },
          { text: 'Stay at Home (₹0)', cost: 0, happiness: -5 }
        ]
      },
      {
        id: 'smartphone',
        title: 'New Smartphone',
        description: 'Your old phone broke. College friends have latest phones.',
        choices: [
          { text: 'iPhone (₹80,000)', cost: 80000, happiness: 15 },
          { text: 'Samsung Galaxy (₹40,000)', cost: 40000, happiness: 10 },
          { text: 'Budget Phone (₹15,000)', cost: 15000, happiness: 0 },
          { text: 'Use borrowed phone', cost: 0, happiness: -10 }
        ]
      }
    ],
    2: [
      {
        id: 'internship',
        title: 'Summer Internship Opportunity',
        description: 'You got an internship offer, but it requires some investment',
        choices: [
          { text: 'Paid internship in Bangalore (₹20,000 income, ₹15,000 expenses)', cost: -5000, happiness: 20 },
          { text: 'Unpaid internship locally (₹5,000 expenses)', cost: 5000, happiness: 10 },
          { text: 'Skip internship, work part-time', cost: -15000, happiness: -5 }
        ]
      }
    ],
    3: [
      {
        id: 'placement',
        title: 'Placement Preparation',
        description: 'Final year placements are approaching. Invest in preparation?',
        choices: [
          { text: 'Premium coaching (₹50,000)', cost: 50000, happiness: 5, salaryBoost: 200000 },
          { text: 'Online courses (₹10,000)', cost: 10000, happiness: 0, salaryBoost: 50000 },
          { text: 'Self-study', cost: 0, happiness: -5, salaryBoost: 0 }
        ]
      }
    ],
    4: [
      {
        id: 'graduation',
        title: 'Graduation Celebration',
        description: 'You\'re graduating! How do you want to celebrate?',
        choices: [
          { text: 'Grand celebration with friends (₹25,000)', cost: 25000, happiness: 20 },
          { text: 'Simple family dinner (₹5,000)', cost: 5000, happiness: 10 },
          { text: 'No celebration, save money', cost: 0, happiness: -5 }
        ]
      }
    ]
  };

  const resetGame = () => {
    setGameState('welcome');
    setCurrentYear(1);
    setCurrentEventIndex(0);
    setPlayerName('');
    setPlayerStats({
      money: 50000,
      totalDebt: 0,
      gpa: 8.0,
      happiness: 75,
      collegeChoice: null,
      expenses: [],
      income: 0
    });
  };

  const WelcomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-white to-green-400 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-2xl w-full text-center">
        <div className="text-6xl mb-4">🎓</div>
        <h1 className="text-4xl font-bold text-orange-600 mb-4">Time for Payback!</h1>
        {/* <h2 className="text-2xl font-semibold text-gray-700 mb-6">Sapno Ka Safar</h2> */}
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Navigate through 4 years of college life in India. Make smart financial decisions, 
          balance your studies, and achieve your dreams while managing your budget wisely.
        </p>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter your name"
            className="px-6 py-3 text-lg border-2 border-orange-300 rounded-lg focus:border-orange-500 focus:outline-none"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            autoFocus
          />
          <button
            onClick={() => setGameState('college-selection')}
            disabled={!playerName.trim()}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Your Journey
          </button>
        </div>
      </div>
    </div>
  );

  const CollegeSelection = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Choose Your College</h2>
          <p className="text-lg text-gray-600">Your family has saved ₹{playerStats.money.toLocaleString('en-IN')} for your education</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {colleges.map((college) => (
            <div key={college.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-800">{college.name}</h3>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                    Prestige: {college.prestige}/100
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4">{college.description}</p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Annual Fees:</span>
                    <span className="font-semibold">₹{college.fees.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-semibold">{college.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg. Starting Salary:</span>
                    <span className="font-semibold">₹{college.avgSalary.toLocaleString('en-IN')}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    setPlayerStats(prev => ({
                      ...prev,
                      collegeChoice: college,
                      money: prev.money - college.fees
                    }));
                    setGameState('year-events');
                  }}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 transition-colors"
                >
                  Select This College
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const GameDashboard = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="text-center">
          <Coins className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <div className="text-sm text-gray-600">Money</div>
          <div className="font-bold text-lg">₹{playerStats.money.toLocaleString('en-IN')}</div>
        </div>
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <div className="text-sm text-gray-600">Debt</div>
          <div className="font-bold text-lg">₹{playerStats.totalDebt.toLocaleString('en-IN')}</div>
        </div>
        <div className="text-center">
          <BookOpen className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <div className="text-sm text-gray-600">GPA</div>
          <div className="font-bold text-lg">{playerStats.gpa.toFixed(1)}</div>
        </div>
        <div className="text-center">
          <Users className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <div className="text-sm text-gray-600">Happiness</div>
          <div className="font-bold text-lg">{playerStats.happiness}%</div>
        </div>
        <div className="text-center">
          <Trophy className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <div className="text-sm text-gray-600">Year</div>
          <div className="font-bold text-lg">{currentYear}/4</div>
        </div>
      </div>
    </div>
  );

  const handleChoice = (choice) => {
    const newMoney = playerStats.money - choice.cost;
    const newDebt = newMoney < 0 ? playerStats.totalDebt + Math.abs(newMoney) : playerStats.totalDebt;
    const finalMoney = Math.max(0, newMoney);

    setPlayerStats(prev => ({
      ...prev,
      money: finalMoney,
      happiness: Math.max(0, Math.min(100, prev.happiness + (choice.happiness || 0))),
      totalDebt: newDebt,
      expenses: [...prev.expenses, { 
        year: currentYear, 
        description: yearlyEvents[currentYear][currentEventIndex].title, 
        amount: choice.cost,
        salaryBoost: choice.salaryBoost || 0
      }]
    }));

    const events = yearlyEvents[currentYear] || [];
    
    if (currentEventIndex < events.length - 1) {
      setCurrentEventIndex(currentEventIndex + 1);
    } else {
      // Move to next year or graduation
      if (currentYear < 4) {
        setCurrentYear(currentYear + 1);
        setCurrentEventIndex(0);
        // Deduct yearly college fees
        setPlayerStats(prev => ({
          ...prev,
          money: Math.max(0, prev.money - prev.collegeChoice.fees),
          totalDebt: prev.money - prev.collegeChoice.fees < 0 
            ? prev.totalDebt + (prev.collegeChoice.fees - prev.money) 
            : prev.totalDebt
        }));
      } else {
        setGameState('graduation');
      }
    }
  };

  const YearEvents = () => {
    const events = yearlyEvents[currentYear] || [];
    const currentEvent = events[currentEventIndex];

    if (!currentEvent) {
      if (currentYear < 4) {
        setCurrentYear(currentYear + 1);
        setCurrentEventIndex(0);
        return <div className="min-h-screen flex items-center justify-center">Loading next year...</div>;
      } else {
        setGameState('graduation');
        return null;
      }
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-200 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Year {currentYear} - {playerStats.collegeChoice?.name}</h2>
            <p className="text-lg text-gray-600">Hello {playerName}! Make your choice wisely.</p>
          </div>

          <GameDashboard />

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">{currentEvent.title}</h3>
            <p className="text-lg text-gray-600 mb-6">{currentEvent.description}</p>

            <div className="space-y-4">
              {currentEvent.choices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => handleChoice(choice)}
                  className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{choice.text}</span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                  {choice.cost !== 0 && (
                    <div className="text-sm text-gray-500 mt-1">
                      {choice.cost > 0 ? `Cost: ₹${choice.cost.toLocaleString('en-IN')}` : `Income: ₹${Math.abs(choice.cost).toLocaleString('en-IN')}`}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const GraduationScreen = () => {
    const salaryBoosts = playerStats.expenses.reduce((total, expense) => total + (expense.salaryBoost || 0), 0);
    const finalSalary = playerStats.collegeChoice.avgSalary + salaryBoosts;
    const monthlyIncome = finalSalary / 12;
    const debtPayoffTime = playerStats.totalDebt > 0 ? Math.ceil(playerStats.totalDebt / (monthlyIncome * 0.3)) : 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-200 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-8xl mb-4">🎓</div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Congratulations {playerName}!</h2>
            <p className="text-xl text-gray-600">You have successfully completed your journey at {playerStats.collegeChoice?.name}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Your Final Report Card</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">College:</span>
                  <span className="font-semibold">{playerStats.collegeChoice?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Final GPA:</span>
                  <span className="font-semibold">{playerStats.gpa.toFixed(1)}/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Happiness Level:</span>
                  <span className="font-semibold">{playerStats.happiness}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Money Remaining:</span>
                  <span className="font-semibold">₹{playerStats.money.toLocaleString('en-IN')}</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Debt:</span>
                  <span className="font-semibold text-red-600">₹{playerStats.totalDebt.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Starting Salary:</span>
                  <span className="font-semibold text-green-600">₹{finalSalary.toLocaleString('en-IN')}/year</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Income:</span>
                  <span className="font-semibold">₹{monthlyIncome.toLocaleString('en-IN')}</span>
                </div>
                {debtPayoffTime > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Debt Payoff Time:</span>
                    <span className="font-semibold">{debtPayoffTime} months</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Life Lessons Learned:</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Financial planning is crucial for achieving your dreams</li>
              <li>• Every decision has consequences - both financial and personal</li>
              <li>• Balancing studies, happiness, and money management is an art</li>
              <li>• Investing in yourself (education, skills) pays long-term dividends</li>
              <li>• Sometimes the cheapest option isn't always the best choice</li>
            </ul>
          </div>

          <div className="text-center mt-8">
            <button
              onClick={resetGame}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all"
            >
              Play Again
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="font-sans">
      {gameState === 'welcome' && <WelcomeScreen />}
      {gameState === 'college-selection' && <CollegeSelection />}
      {gameState === 'year-events' && <YearEvents />}
      {gameState === 'graduation' && <GraduationScreen />}
    </div>
  );
};

export default SapnoKaSafar;