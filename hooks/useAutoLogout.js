import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

const AUTO_LOGOUT_TIME = 2 * 60 * 1000; // 10 minutes
const WARNING_TIME = 60 * 1000; // 1-minute warning

const useAutoLogout = () => {
  const [warningVisible, setWarningVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const router = useRouter();

  let logoutTimer, warningTimer, countdownInterval;

  const resetTimers = useCallback(() => {
    // Clear previous timers
    clearTimeout(logoutTimer);
    clearTimeout(warningTimer);
    clearInterval(countdownInterval);

    // Set warning timer
    warningTimer = setTimeout(() => {
      setWarningVisible(true);
      let countdown = 60;
      setTimeLeft(countdown);

      countdownInterval = setInterval(() => {
        countdown -= 1;
        setTimeLeft(countdown);
        if (countdown <= 0) clearInterval(countdownInterval);
      }, 1000);
    }, AUTO_LOGOUT_TIME - WARNING_TIME);

    // Set auto-logout timer
    logoutTimer = setTimeout(() => {
      handleLogout();
    }, AUTO_LOGOUT_TIME);
  }, []);

  const handleLogout = useCallback(() => {
    Cookies.remove("token");
    setWarningVisible(false);
    router.push("/");
  }, [router]);

  // ✅ **Define `stayLoggedIn` properly**
  const stayLoggedIn = useCallback(() => {
    setWarningVisible(false);
    resetTimers(); // Reset timers when the user stays logged in
  }, [resetTimers]);

  useEffect(() => {
    resetTimers(); // Start timers when component mounts

    const handleActivity = () => {
      resetTimers();
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);

    return () => {
      clearTimeout(logoutTimer);
      clearTimeout(warningTimer);
      clearInterval(countdownInterval);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
    };
  }, [resetTimers]);

  return { warningVisible, timeLeft, stayLoggedIn, logout: handleLogout };
};

export default useAutoLogout;
