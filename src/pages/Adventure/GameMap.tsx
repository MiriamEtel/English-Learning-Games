import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import mapBackground from "../../assets/images/map.jpg";
import hero1 from "../../assets/images/hero1.png";
import hero2 from "../../assets/images/hero2.png";
import hero3 from "../../assets/images/hero3.png";
import hero4 from "../../assets/images/hero4.png";
import moveSound from "../../assets/sounds/move.mp3";

const locations = [
  { name: "🏡 הכפר השקט", x: 27, y: 35, message: "ברוך הבא לכפר! האנשים כאן חייכנים 😊" },
  { name: "🏰 הטירה הקסומה", x: 42, y: 17, message: "הגעת לטירה קסומה! מה מסתתר בפנים?" },
  { name: "🌳 היער הקסום", x: 42, y: 43, message: "עצים גבוהים ולחשושים... אולי חיות יער מסתתרות פה!" },
  { name: "המזרקה המסתורית", x: 12, y: 70, message: "מזרקה מסתורית מפכה" },
  { name: "💦 המפל הקסום", x: 74, y: 57, message: "מפל מבריק זורם כאן! תרגיש את רסיסי המים הקרים!" },
  { name: "🏆 שער הניצחון", x: 74, y: 16, message: "הגעת לסוף המסע! תוכל להגיע לפסגה?" },
];

const GameMap: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedHero = location.state?.hero || "hero1";
  const difficulty = location.state?.level || "easy";
  const [currentStep, setCurrentStep] = useState(location.state?.step || 0);
  const [posX, setPosX] = useState(locations[currentStep].x);
  const [posY, setPosY] = useState(locations[currentStep].y);
  const [isJumping, setIsJumping] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [awaitingMove, setAwaitingMove] = useState(true); // מחכה ללחיצה לפני התקדמות

  const heroImages: Record<string, string> = {
    hero1,
    hero2,
    hero3,
    hero4,
  };

  useEffect(() => {
    if (location.state?.step !== undefined) {
      setAwaitingMove(true); // מחכים ללחיצה כדי לזוז
      setCurrentStep(location.state?.step); // מבטיח שהדמות לא זזה לבד
      setPosX(locations[location.state?.step].x);
      setPosY(locations[location.state?.step].y);
    }
  }, [location.state?.step]);

  const handleNext = () => {
    if (!awaitingMove) return; // אם עדיין לא חיכינו ללחיצה, לא נמשיך

    setAwaitingMove(false); // מבטיח שהדמות לא תזוז פעמיים בלחיצה

    if (currentStep < locations.length - 1) {
      setIsJumping(true);
      setShowMessage(false);
      const audio = new Audio(moveSound);
      audio.play();

      const prevLocation = locations[currentStep];
      const nextLocation = locations[currentStep + 1];
      let steps = 10;
      let stepX = (nextLocation.x - prevLocation.x) / steps;
      let stepY = (nextLocation.y - prevLocation.y) / steps;
      let count = 0;

      const moveInterval = setInterval(() => {
        count++;
        setPosX((prevX) => prevX + stepX);
        setPosY((prevY) => prevY + stepY);

        if (count >= steps) {
          clearInterval(moveInterval);
          setIsJumping(false);
          setCurrentStep((prevStep) => prevStep + 1);
          setShowMessage(true);

          setTimeout(() => {
            navigate("/adventure-game", {
              state: { level: difficulty, step: currentStep + 1, hero: selectedHero, location: nextLocation.name },
            });
          }, 2000);
        }
      }, 100);
    } else {
      navigate("/adventure/completion");
    }
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        backgroundImage: `url(${mapBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        textAlign: "center",
        position: "relative",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          position: "absolute",
          top: 20,
          left: "50%",
          transform: "translateX(-50%)",
          color: "white",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          padding: "10px 20px",
          borderRadius: "10px",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        הגעת ל: {locations[currentStep].name}
      </Typography>

      {showMessage && (
        <Typography
          variant="h5"
          sx={{
            position: "absolute",
            bottom: "20%",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            color: "white",
            padding: "15px",
            borderRadius: "10px",
            fontWeight: "bold",
          }}
        >
          {locations[currentStep].message}
        </Typography>
      )}

      {/* דמות השחקן */}
      <img
        src={heroImages[selectedHero]}
        alt="דמות השחקן"
        style={{
          position: "absolute",
          width: "80px",
          left: `${posX}%`,
          top: `${posY}%`,
          transition: "top 0.2s ease-in-out, left 0.2s ease-in-out",
          transform: isJumping ? "translateY(-15px)" : "translateY(0px)",
        }}
      />

      {/* כפתור המשך */}
      <Button
        onClick={handleNext}
        sx={{
          position: "absolute",
          bottom: 30,
          backgroundColor: "#ffcc00",
          border: "none",
          padding: "15px 40px",
          fontSize: "1.5rem",
          fontWeight: "bold",
          color: "#333",
          borderRadius: "30px",
          cursor: "pointer",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            backgroundColor: "#ffdd44",
          },
        }}
      >
        המשך במסע →
      </Button>
    </Box>
  );
};

export default GameMap;
