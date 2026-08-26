import React, { useEffect } from 'react';

const TimeTracker = () => {
  useEffect(() => {
    // Only track time if user is actually active (optional), but let's just do a simple timer
    const interval = setInterval(() => {
      const currentTime = parseInt(localStorage.getItem('studyTime') || '0', 10);
      localStorage.setItem('studyTime', (currentTime + 1).toString());
      
      // Dispatch custom event to notify other components (like Dashboard)
      window.dispatchEvent(new Event('studyTimeUpdated'));
    }, 1000); // 1 second interval

    return () => clearInterval(interval);
  }, []);

  return null; // This component doesn't render anything
};

export default TimeTracker;
