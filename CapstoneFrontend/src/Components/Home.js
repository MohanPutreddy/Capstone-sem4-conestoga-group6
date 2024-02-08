import React from "react";
import { useState } from "react";
import Login from "./Login";
import SignUp from "./SignUp";

export default function Home() {
  const [showLogin, setShowLogin] = useState(true);

  const handleGoToSignup = () => {
    setShowLogin(false);
  };

  const handleGoToLogin = () => {
    setShowLogin(true);
  };

  return (
    <div>
      {showLogin ? (
        <Login onGoToSignup={handleGoToSignup} />
      ) : (
        <SignUp onGoToLogin={handleGoToLogin} />
      )}
    </div>
  );
}
