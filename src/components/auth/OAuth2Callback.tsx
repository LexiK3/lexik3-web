// components/auth/OAuth2Callback.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { UnifiedAuthService } from '../../services/auth/unifiedAuthService';
import { setUser, setIsAuthenticated } from '../../store/slices/authSlice';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const OAuth2Callback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleOAuth2Callback = async () => {
      try {
        setIsLoading(true);
        setError('');

        // Get the full URL including hash and search params
        const currentUrl = window.location.href;
        
        // Handle OAuth2 callback
        const authResponse = await UnifiedAuthService.handleOAuth2Callback(currentUrl);
        
        // Update Redux state
        dispatch(setUser(authResponse.user));
        dispatch(setIsAuthenticated(true));
        
        // Redirect to dashboard or intended page
        const from = (location.state as any)?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
        
      } catch (err) {
        console.error('OAuth2 callback error:', err);
        setError(err instanceof Error ? err.message : 'OAuth2 authentication failed');
      } finally {
        setIsLoading(false);
      }
    };

    handleOAuth2Callback();
  }, [navigate, location, dispatch]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Completing OAuth2 authentication...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto">
          <ErrorMessage error={error} />
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default OAuth2Callback;
