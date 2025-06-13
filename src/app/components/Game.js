"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  LinearProgress,
  CircularProgress,
  Alert,
  Snackbar,
  Avatar,
  Tooltip,
  Chip
} from "@mui/material";
import { financialQuestions } from "./gameQuestions";
import UserDataProvider from "./dashboard/UserDataProvider";
import { useAuth } from "../components/auth/AuthContext";

const Game = () => {
  const router = useRouter();
  const { userData, loading: userDataLoading } = UserDataProvider() || { userData: null, loading: false };

  const { user } = useAuth();
  const [debt, setDebt] = useState(0);
  const [focus, setFocus] = useState(100);
  const [happiness, setHappiness] = useState(100);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuestionSet, setSelectedQuestionSet] = useState("adult"); // Default set
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState({ message: "", severity: "info" });
  const [gameHistory, setGameHistory] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [gameStartTime, setGameStartTime] = useState(null);

  // Fetch user data and set appropriate questions based on age
  useEffect(() => {
    const loadGame = async () => {
      try {
        setLoading(true);
        
        // Determine which question set to use based on age
        let questionSet = "adult"; // Default
        
        if (userData) {
          // Look for age in various locations in userData object
          const age = 
            userData.demographics?.age || 
            userData.age || 
            userData.profile?.age || 
            25; // Fallback age
          
          if (age < 18) {
            questionSet = "under18";
          } else if (age >= 18 && age <= 35) {
            questionSet = "adult";
          } else {
            questionSet = "senior";
          }
          
          console.log(`User age: ${age}, Selected question set: ${questionSet}`);
          setSelectedQuestionSet(questionSet);
        } else {
          // If no user data, use default adult questions
          console.log("No user data available, using default adult questions");
        }
        
        // Set the questions
        const questionSetData = financialQuestions[questionSet] || financialQuestions.adult;
        
        // Shuffle questions to provide variety
        const shuffledQuestions = [...questionSetData].sort(() => Math.random() - 0.5);
        setQuestions(shuffledQuestions);
        
        // Also fetch previous game history if user is logged in
        if (user?.email) {
          await fetchGameHistory(user.email);
        }
        
        // Record game start time
        setGameStartTime(new Date());
        
      } catch (error) {
        console.error('Error initializing game:', error);
        setError('Failed to initialize game with appropriate questions.');
        // Fallback to adult questions
        setQuestions(financialQuestions.adult);
      } finally {
        setLoading(false);
      }
    };

    // Only load game when user data is available
    if (!userDataLoading) {
      loadGame();
    }
  }, [userData, user, userDataLoading]);

  // Fetch user's previous game history
  const fetchGameHistory = async (email) => {
    try {
      const response = await fetch(`/api/user/gamehistory?email=${encodeURIComponent(email)}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data?.gameHistory?.length > 0) {
          setGameHistory(data.gameHistory);
          showFeedbackMessage("Previous game data loaded", "info");
        }
      } else {
        console.log("No previous game history found or error fetching");
      }
    } catch (error) {
      console.error("Error fetching game history:", error);
    }
  };

  // Save game result to MongoDB
  const saveGameResult = async () => {
    if (!user?.email) {
      showFeedbackMessage("Sign in to save your progress", "warning");
      return false;
    }
    
    try {
      const gameResult = {
        date: new Date().toISOString(),
        debt,
        focus,
        happiness,
        questionSet: selectedQuestionSet,
        score: calculateScore(),
        duration: gameStartTime ? Math.floor((new Date() - gameStartTime) / 1000) : 0, // Duration in seconds
        questionCount: questions.length,
        lastAnsweredQuestion: questionIndex
      };
      
      const response = await fetch('/api/user/savegame', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          gameResult
        }),
      });
      
      if (response.ok) {
        showFeedbackMessage("Game progress saved!", "success");
        return true;
      } else {
        showFeedbackMessage("Failed to save game progress", "error");
        return false;
      }
    } catch (error) {
      console.error("Error saving game result:", error);
      showFeedbackMessage("Error saving game progress", "error");
      return false;
    }
  };

  const makeChoice = (debtChange, focusChange, happinessChange) => {
    // Apply changes to game state
    const newDebt = debt + debtChange;
    const newFocus = Math.max(0, Math.min(100, focus + focusChange));
    const newHappiness = Math.max(0, Math.min(100, happiness + happinessChange));
    
    setDebt(newDebt);
    setFocus(newFocus);
    setHappiness(newHappiness);
    
    // Show relevant feedback based on choice impact
    let feedbackMessage = "Moving to next question...";
    let severity = "info";
    
    if (debtChange > 1000) {
      feedbackMessage = "Your debt has increased significantly!";
      severity = "warning";
    } else if (debtChange < -1000) {
      feedbackMessage = "Great job reducing your debt!";
      severity = "success";
    } else if (focusChange > 10 || happinessChange > 10) {
      feedbackMessage = "That was a good financial decision!";
      severity = "success";
    } else if (focusChange < -10 || happinessChange < -10) {
      feedbackMessage = "This choice has some negative impacts...";
      severity = "warning";
    }
    
    showFeedbackMessage(feedbackMessage, severity);
    
    // Advance to next question or complete game
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else {
      setIsGameComplete(true);
      saveGameResult();
      showFeedbackMessage("Game complete! See your results", "success");
    }
  };

  const calculateScore = () => {
    // Higher focus and happiness are good, lower debt is good
    const debtScore = Math.max(0, 100 - (debt / 100));
    return Math.floor((debtScore + focus + happiness) / 3);
  };

  const showFeedbackMessage = (message, severity) => {
    setFeedback({ message, severity });
    setShowFeedback(true);
  };

  const formatRupees = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleSeeResults = async () => {
    // Try to save game result and then proceed to results page
    await saveGameResult();
    
    router.push(
      `/results?debt=${encodeURIComponent(debt)}&focus=${encodeURIComponent(focus)}&happiness=${encodeURIComponent(happiness)}&score=${encodeURIComponent(calculateScore())}&questionSet=${encodeURIComponent(selectedQuestionSet)}`
    );
  };

  const resetGame = () => {
    setDebt(0);
    setFocus(100);
    setHappiness(100);
    setQuestionIndex(0);
    setIsGameComplete(false);
    setGameStartTime(new Date());
    
    // Shuffle questions again for variety
    const shuffledQuestions = [...financialQuestions[selectedQuestionSet]].sort(() => Math.random() - 0.5);
    setQuestions(shuffledQuestions);
    
    showFeedbackMessage("Game reset! Start fresh", "info");
  };

  if (loading || userDataLoading) {
    return (
      <Container style={{ textAlign: "center", marginTop: "100px" }}>
        <CircularProgress />
        <Typography variant="h6" style={{ marginTop: "20px" }}>
          Loading your financial journey...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container style={{ textAlign: "center", marginTop: "100px" }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => window.location.reload()}
          style={{ marginTop: "20px" }}
        >
          Try Again
        </Button>
      </Container>
    );
  }

  // Calculate progress percentage
  const progressPercentage = (questionIndex / questions.length) * 100;

  return (
    <Container style={{ textAlign: "center", marginTop: "30px", marginBottom: "50px" }}>
      <Snackbar 
        open={showFeedback} 
        autoHideDuration={4000} 
        onClose={() => setShowFeedback(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={feedback.severity} onClose={() => setShowFeedback(false)}>
          {feedback.message}
        </Alert>
      </Snackbar>

      <Typography variant="h3" style={{ padding: "30px", fontWeight: "bold" }}>
        Financial Decisions Game
      </Typography>

      {/* Age-based question set indicator */}
      <Box sx={{ mb: 3 }}>
        <Chip 
          label={
            selectedQuestionSet === "under18" ? "Teen Financial Decisions" : 
            selectedQuestionSet === "adult" ? "Young Adult Financial Choices" : 
            "Senior Financial Planning"
          }
          color="primary"
          size="medium"
          sx={{ fontSize: "1rem", py: 1, px: 2 }}
        />
      </Box>

      {userData && (
        <Card raised sx={{ padding: "20px", borderRadius: "12px", mb: 4, bgcolor: "#f8f9fa" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
              <Avatar 
                src={userData.profileImage || ""} 
                alt={userData.name || "User"} 
                sx={{ width: 56, height: 56, mr: 2 }} 
              />
              <Box textAlign="left">
                <Typography variant="h6">{userData.name || "User"}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Age Group: <Chip 
                    size="small" 
                    label={
                      selectedQuestionSet === "under18" ? "Teen" : 
                      selectedQuestionSet === "adult" ? "Young Adult" : "Mature Adult"
                    } 
                    color="primary" 
                  />
                </Typography>
              </Box>
            </Box>
            
            {gameHistory.length > 0 && (
              <Box mt={2}>
                <Typography variant="body2">
                  Previous best score: {Math.max(...gameHistory.map(game => game.score || 0))}
                </Typography>
                <Typography variant="body2">
                  Games played: {gameHistory.length}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      <Card raised sx={{ padding: "20px", borderRadius: "12px", mb: 4 }}>
        <CardContent>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Current Status
          </Typography>
          
          {/* Overall game progress */}
          <Box sx={{ width: '100%', mt: 1, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="textSecondary">Game Progress</Typography>
              <Typography variant="body2" color="textSecondary">
                {questionIndex + 1} of {questions.length} Questions
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={progressPercentage} 
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
          
          <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, justifyContent: "space-between", gap: 2, mt: 3 }}>
            <Box sx={{ width: "100%" }}>
              <Typography variant="h6">Debt</Typography>
              <Typography variant="h5" color={debt > 10000 ? "error" : "success"} fontWeight="bold">
                {formatRupees(debt)}
              </Typography>
            </Box>
            
            <Box sx={{ width: "100%" }}>
              <Typography variant="h6">Focus</Typography>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                <Box sx={{ width: "80%" }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={focus} 
                    sx={{ 
                      height: 12, 
                      borderRadius: 2,
                      backgroundColor: "#e0e0e0",
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: focus < 30 ? "red" : focus < 70 ? "orange" : "green",
                      }
                    }} 
                  />
                </Box>
                <Typography variant="h6" fontWeight="bold">
                  {focus}%
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ width: "100%" }}>
              <Typography variant="h6">Happiness</Typography>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                <Box sx={{ width: "80%" }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={happiness} 
                    sx={{ 
                      height: 12, 
                      borderRadius: 2,
                      backgroundColor: "#e0e0e0",
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: happiness < 30 ? "red" : happiness < 70 ? "orange" : "green",
                      }
                    }} 
                  />
                </Box>
                <Typography variant="h6" fontWeight="bold">
                  {happiness}%
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6" fontWeight="bold">
              Question {questionIndex + 1} of {questions.length}
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              Current Score: {calculateScore()}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {questions.length > 0 && questionIndex < questions.length && (
        <Card raised sx={{ mb: 4, borderRadius: "12px" }} key={questionIndex}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {questions[questionIndex].title}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2, mt: 2 }}>
              {questions[questionIndex].options.map((option, optIndex) => (
                <Button 
                  key={optIndex}
                  variant="contained" 
                  color={optIndex === 0 ? "primary" : "secondary"} 
                  fullWidth
                  onClick={() => makeChoice(
                    option.changes.debt, 
                    option.changes.focus, 
                    option.changes.happiness
                  )} 
                  sx={{ py: 2, fontSize: "17px" }}
                >
                  {option.text} 
                  <Box sx={{ mt: 1, fontSize: "0.85rem", opacity: 0.9 }}>
                    ({option.changes.debt > 0 ? `+${formatRupees(option.changes.debt)}` : 
                      option.changes.debt < 0 ? `-${formatRupees(Math.abs(option.changes.debt))}` : 
                      `${formatRupees(0)}`}
                    {option.changes.focus !== 0 ? `, Focus ${option.changes.focus > 0 ? '+' : ''}${option.changes.focus}` : ''}
                    {option.changes.happiness !== 0 ? `, Happiness ${option.changes.happiness > 0 ? '+' : ''}${option.changes.happiness}` : ''})
                  </Box>
                </Button>
              ))}
            </Box>
          </CardContent>
        </Card>
      )}

      {isGameComplete && (
        <Card raised sx={{ mb: 4, borderRadius: "12px", bgcolor: "#e8f5e9" }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom color="success.main">
              Game Complete!
            </Typography>
            <Typography variant="h5" gutterBottom>
              Your Final Score: {calculateScore()}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 3 }}>
              <Button
                variant="contained"
                color="success"
                size="large"
                onClick={handleSeeResults}
                sx={{ py: 2, px: 4 }}
              >
                See Full Results
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                onClick={resetGame}
                sx={{ py: 2, px: 4 }}
              >
                Play Again
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 3 }}>
        <Button
          variant="contained"
          color="info"
          onClick={resetGame}
          sx={{ py: 1.5, px: 3 }}
        >
          Reset Game
        </Button>
        <Button
          variant="contained"
          color="warning"
          onClick={() => router.push('/gamehome')}
          sx={{ py: 1.5, px: 3 }}
        >
          Exit Game
        </Button>
      </Box>
    </Container>
  );
};

export default Game;