import { useEffect } from 'react';

// Generate session ID
const generateSessionId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Get or create session ID
const getSessionId = () => {
  if (typeof window === 'undefined') return '';
  
  let sessionId = sessionStorage.getItem('visit_session_id');
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem('visit_session_id', sessionId);
  }
  return sessionId;
};

export const useVisitTracker = () => {
  useEffect(() => {
    // Record visit when component mounts
    const recordVisit = async () => {
      try {
        const sessionId = getSessionId();
        const pageUrl = window.location.pathname + window.location.search;
        
        await fetch('/api/website-stats', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pageUrl,
            sessionId
          })
        });
      } catch (error) {
        console.error('Failed to record visit:', error);
      }
    };

    // Record visit immediately
    recordVisit();

    // Record visit every 5 minutes to update "current" count
    const interval = setInterval(recordVisit, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);
};

export default useVisitTracker;