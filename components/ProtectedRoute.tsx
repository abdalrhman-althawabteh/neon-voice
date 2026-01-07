import React, { useEffect, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    timeoutMinutes?: number;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    timeoutMinutes = 30 // Default 30 minutes 
}) => {
    const { user, loading, signOut } = useAuth();
    const [isInactive, setIsInactive] = useState(false);

    // Timer reference
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const resetTimer = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        if (user) {
            timerRef.current = setTimeout(() => {
                setIsInactive(true);
                signOut();
            }, timeoutMinutes * 60 * 1000);
        }
    };

    useEffect(() => {
        // Events to track activity
        const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'];

        const handleActivity = () => {
            resetTimer();
        };

        // Attach listeners
        events.forEach(event => {
            window.addEventListener(event, handleActivity);
        });

        // Initial start
        resetTimer();

        // Cleanup
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            events.forEach(event => {
                window.removeEventListener(event, handleActivity);
            });
        };
    }, [user, timeoutMinutes, signOut]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
            </div>
        );
    }

    if (!user || isInactive) {
        return <Navigate to="/auth" replace />;
    }

    return <>{children}</>;
};
