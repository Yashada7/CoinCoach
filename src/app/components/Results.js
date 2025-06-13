"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Divider,
  Grid,
  Tooltip,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  AttachMoney,
  SentimentSatisfied,
  SentimentVeryDissatisfied,
  Psychology,
  Share,
  EmojiEvents,
  ShowChart,
  Savings,
  AccountBalance,
  MoneyOff,
  BarChart,
  School,
  EditNote,
} from "@mui/icons-material";
import { useAuth } from "../components/auth/AuthContext";
import UserDataProvider from "./dashboard/UserDataProvider";

const Results = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userData } = UserDataProvider();
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [debt] = useState(Number(searchParams.get("debt")) || 0);
  const [focus] = useState(Number(searchParams.get("focus")) || 0);
  const [happiness] = useState(Number(searchParams.get("happiness")) || 0);
  const [score] = useState(Number(searchParams.get("score")) || 0);
  const [questionSet] = useState(searchParams.get("questionSet") || "adult");
  const [loading, setLoading] = useState(true);
  const [gameHistory, setGameHistory] = useState([]);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [learningResourcesOpen, setLearningResourcesOpen] = useState(false);
  const [bestScore, setBestScore] = useState(0);
  const [totalGamesPlayed, setTotalGamesPlayed] = useState(0);

  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setLoading(false);
      
      // Show feedback dialog after 3 seconds if score is available
      if (score > 0) {
        setTimeout(() => {
          setFeedbackDialogOpen(true);
        }, 3000);
      }
    }, 1500);

    // Fetch game history if user is logged in
    if (user?.email) {
      fetchGameHistory(user.email);
    }

    return () => clearTimeout(timer);
  }, [user, score]);

  const fetchGameHistory = async (email) => {
    try {
      const response = await fetch(`/api/user/gamehistory?email=${encodeURIComponent(email)}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data?.gameHistory?.length > 0) {
          setGameHistory(data.gameHistory);
          setBestScore(data.bestGameScore || 0);
          setTotalGamesPlayed(data.totalGamesPlayed || 0);
        }
      }
    } catch (error) {
      console.error("Error fetching game history:", error);
    }
  };

  const formatRupees = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "success.main";
    if (score >= 50) return "warning.main";
    return "error.main";
  };

  const getScoreMessage = (score) => {
    if (score >= 80) return "Excellent! You have great financial habits.";
    if (score >= 50) return "Good job. There's room for improvement in your financial decisions.";
    return "You might want to reconsider your financial approach.";
  };

  const getFinancialTips = () => {
    let tips = [];
    
    // Age-specific tips
    if (questionSet === "under18") {
      tips.push("Start saving early! Even small amounts add up over time.");
      tips.push("Learn to distinguish between needs and wants before spending.");
    } else if (questionSet === "adult") {
      tips.push("Consider building an emergency fund worth 3-6 months of expenses.");
      tips.push("Try to maximize employer retirement matches - it's free money!");
    } else if (questionSet === "senior") {
      tips.push("Review your investment risk tolerance as you approach retirement.");
      tips.push("Consider consulting a financial advisor about estate planning.");
    }
    
    // Debt-related tips
    if (debt > 50000) {
      tips.push("Consider debt consolidation strategies to manage your high debt levels.");
      tips.push("Create a strict budget to avoid accumulating more debt.");
    } else if (debt > 10000) {
      tips.push("Work on paying off your debts systematically, starting with high-interest ones.");
    } else {
      tips.push("Great job keeping your debt low! Continue to avoid unnecessary loans.");
    }
    
    // Focus-related tips
    if (focus < 50) {
      tips.push("Try setting specific financial goals to improve focus on your finances.");
    } else {
      tips.push("Your financial focus is good. Consider setting more challenging financial goals.");
    }
    
    // Happiness-related tips
    if (happiness < 50) {
      tips.push("Remember that financial well-being contributes to happiness, but it's not everything.");
      tips.push("Set aside a small 'fun budget' each month for activities you enjoy.");
    }
    
    return tips.slice(0, 5); // Return maximum 5 tips
  };

  // Get learning resources based on user's age group and game performance
  const getLearningResources = () => {
    const resources = [];
    
    if (questionSet === "under18") {
      resources.push({
        title: "Teen Financial Literacy 101",
        description: "Learn the basics of saving, budgeting, and smart spending for teens.",
        icon: <School />
      });
      
      if (score < 60) {
        resources.push({
          title: "Understanding Money for Young People",
          description: "Simple lessons on how money works and how to make good choices.",
          icon: <EditNote />
        });
      }
    } else if (questionSet === "adult") {
      resources.push({
        title: "Personal Finance Management",
        description: "Advanced strategies for budgeting, investing, and planning for major life expenses.",
        icon: <AttachMoney />
      });
      
      if (debt > 30000) {
        resources.push({
          title: "Debt Management Strategies",
          description: "Effective approaches to reducing debt and improving your financial health.",
          icon: <MoneyOff />
        });
      }
    } else if (questionSet === "senior") {
      resources.push({
        title: "Retirement Planning Essentials",
        description: "Optimize your finances for retirement and legacy planning.",
        icon: <AccountBalance />
      });
      
      if (score < 70) {
        resources.push({
          title: "Financial Security in Later Years",
          description: "Protecting your assets and making your savings last longer.",
          icon: <Savings />
        });
      }
    }
    
    // Add common resources for all age groups
    resources.push({
      title: "Building Better Financial Habits",
      description: "Daily practices that can transform your financial future.",
      icon: <Psychology />
    });
    
    return resources;
  };

  const saveGameResults = async () => {
    if (!user?.email) return;
    
    try {
      const gameData = {
        email: user.email,
        gameResult: {
          score,
          debt,
          focus,
          happiness,
          questionSet,
          date: new Date().toISOString()
        }
      };
      
      
      const response = await fetch('/api/user/savegame', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameData),
      });
      
      if (!response.ok) {
        console.error('Failed to save game results');
      }
    } catch (error) {
      console.error('Error saving game results:', error);
    }
  };

  const handlePlayAgain = () => {
    router.push('/game');
  };

  const handleShareResults = () => {
    setShareDialogOpen(true);
  };

  const handleCloseShareDialog = () => {
    setShareDialogOpen(false);
  };

  const handleCloseFeedbackDialog = () => {
    setFeedbackDialogOpen(false);
    setFeedbackSubmitted(true);
  };

  const handleOpenLearningResources = () => {
    setLearningResourcesOpen(true);
  };

  const handleCloseLearningResources = () => {
    setLearningResourcesOpen(false);
  };

  const copyShareText = () => {
    const shareText = `I just scored ${score} in the Financial Decision Game! My financial wellness stats: Debt: ${formatRupees(debt)}, Focus: ${focus}%, Happiness: ${happiness}%. Try it yourself!`;
    navigator.clipboard.writeText(shareText);
    handleCloseShareDialog();
  };

  useEffect(() => {
    // Save game results when component mounts
    if (score > 0 && user?.email) {
      saveGameResults();
    }
  }, [score, user]);

  // Loading screen
  if (loading) {
    return (
      <Container sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '80vh' 
      }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 3 }}>
          Calculating your financial wellness...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 4, background: 'linear-gradient(to right bottom, #f5f7fa, #ffffff)' }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
          Financial Game Results
        </Typography>
        
        <Typography variant="body1" align="center" sx={{ mb: 4, color: 'text.secondary' }}>
          Based on your choices in the {questionSet === "under18" ? "Teen" : questionSet === "adult" ? "Adult" : "Senior"} scenario
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 150,
              height: 150,
            }}
          >
            <CircularProgress
              variant="determinate"
              value={100}
              size={150}
              thickness={4}
              sx={{ color: theme.palette.grey[200], position: 'absolute' }}
            />
            <CircularProgress
              variant="determinate"
              value={score}
              size={150}
              thickness={4}
              sx={{ color: getScoreColor(score), position: 'absolute' }}
            />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: getScoreColor(score) }}>
                {score}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                SCORE
              </Typography>
            </Box>
          </Box>
        </Box>
        
        <Typography variant="h6" align="center" gutterBottom sx={{ color: getScoreColor(score) }}>
          {getScoreMessage(score)}
        </Typography>
        
        <Divider sx={{ my: 3 }} />
        
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Card elevation={2} sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <AttachMoney color="error" sx={{ fontSize: 40 }} />
                <Typography variant="h6" gutterBottom>Debt</Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: debt > 50000 ? 'error.main' : 'text.primary' }}>
                  {formatRupees(debt)}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {debt > 50000 ? "High debt level" : debt > 10000 ? "Moderate debt" : "Low debt - good job!"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Card elevation={2} sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Psychology color="primary" sx={{ fontSize: 40 }} />
                <Typography variant="h6" gutterBottom>Focus</Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: focus < 40 ? 'error.main' : focus < 70 ? 'warning.main' : 'success.main' }}>
                  {focus}%
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {focus < 40 ? "Needs improvement" : focus < 70 ? "Good attention" : "Excellent focus"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Card elevation={2} sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                {happiness >= 60 ? (
                  <SentimentSatisfied color="success" sx={{ fontSize: 40 }} />
                ) : (
                  <SentimentVeryDissatisfied color="error" sx={{ fontSize: 40 }} />
                )}
                <Typography variant="h6" gutterBottom>Happiness</Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: happiness < 40 ? 'error.main' : happiness < 70 ? 'warning.main' : 'success.main' }}>
                  {happiness}%
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {happiness < 40 ? "Financial stress detected" : happiness < 70 ? "Moderate satisfaction" : "Great financial wellbeing"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Financial Tips for You
          </Typography>
          <List>
            {getFinancialTips().map((tip, index) => (
              <ListItem key={index} sx={{ bgcolor: 'background.paper', mb: 1, borderRadius: 1, boxShadow: 1 }}>
                <ListItemIcon>
                  <TrendingUp color="primary" />
                </ListItemIcon>
                <ListItemText primary={tip} />
              </ListItem>
            ))}
          </List>
        </Box>
        
        {user?.email && gameHistory.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Your Progress
            </Typography>
            <Paper sx={{ p: 2, bgcolor: 'background.paper' }}>
              <Typography variant="body1">
              <p>Total Games Played: {Number(user.totalGamesPlayed) || 0}</p>

              </Typography>
              <Typography variant="body1">
                Your best score: <strong>{bestScore}</strong> {score > bestScore && score > 0 && "(New personal best!)"}
              </Typography>
              <Typography variant="body1">
                Average score: <strong>
                  {gameHistory.reduce((sum, game) => sum + game.score, 0) / gameHistory.length}
                </strong>
              </Typography>
            </Paper>
          </Box>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handlePlayAgain}
            startIcon={<BarChart />}
            size={isMobile ? "small" : "medium"}
          >
            Play Again
          </Button>
          <Button 
            variant="outlined" 
            onClick={handleShareResults}
            startIcon={<Share />}
            size={isMobile ? "small" : "medium"}
          >
            Share Results
          </Button>
          <Button 
            variant="outlined" 
            color="secondary"
            onClick={handleOpenLearningResources}
            startIcon={<School />}
            size={isMobile ? "small" : "medium"}
          >
            Learning Resources
          </Button>
        </Box>
      </Paper>
      
      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onClose={handleCloseShareDialog}>
        <DialogTitle>Share Your Results</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Share your financial game results with friends and family!
          </DialogContentText>
          <Paper sx={{ p: 2, mt: 2, bgcolor: 'background.paper' }}>
            <Typography variant="body1">
              I just scored <strong>{score}</strong> in the Financial Decision Game! My financial wellness stats: Debt: {formatRupees(debt)}, Focus: {focus}%, Happiness: {happiness}%. Try it yourself!
            </Typography>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseShareDialog}>Cancel</Button>
          <Button onClick={copyShareText} color="primary">
            Copy Text
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Feedback Dialog */}
      <Dialog 
        open={feedbackDialogOpen && !feedbackSubmitted} 
        onClose={handleCloseFeedbackDialog}
      >
        <DialogTitle>How did we do?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Would you like to give us feedback on the financial learning experience?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFeedbackDialog}>No Thanks</Button>
          <Button onClick={handleCloseFeedbackDialog} color="primary">
            Give Feedback
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Learning Resources Dialog */}
      <Dialog
        open={learningResourcesOpen}
        onClose={handleCloseLearningResources}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Learning Resources</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Based on your age group and game performance, here are some resources that might help improve your financial knowledge:
          </DialogContentText>
          <List>
            {getLearningResources().map((resource, index) => (
              <Paper key={index} elevation={1} sx={{ mb: 2, overflow: 'hidden' }}>
                <ListItem>
                  <ListItemIcon>
                    {resource.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={resource.title} 
                    secondary={resource.description}
                    primaryTypographyProps={{ fontWeight: 'bold' }}
                  />
                </ListItem>
              </Paper>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLearningResources}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Results;