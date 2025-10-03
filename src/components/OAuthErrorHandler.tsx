import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuthErrorHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check for OAuth error parameters in URL
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');
    
    if (error) {
      console.error('OAuth Error detected:', error, errorDescription);
      
      // Clear the error parameters from URL
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
      
      // Show user-friendly error message
      alert(`Authentication failed: ${errorDescription || error}. Please try again.`);
      
      // Redirect to auth page
      navigate('/auth', { replace: true });
    }
  }, [navigate]);

  return null;
};

export default OAuthErrorHandler;
