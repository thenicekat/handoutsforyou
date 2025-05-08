import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import type { Session } from 'next-auth';

export function useAuth() {
    const { data: session, status } = useSession();
    const [cachedSession, setCachedSession] = useState<Session | null>(null);

    useEffect(() => {
        if (session) {
            setCachedSession(session);
        } else if (status === 'unauthenticated') {
            setCachedSession(null);
        }
    }, [session, status]);

    const isAuthenticated = useCallback(() => {
        return status === 'authenticated' && !!cachedSession;
    }, [cachedSession, status]);

    const getUser = useCallback(() => {
        return cachedSession?.user;
    }, [cachedSession]);

    return {
        session: cachedSession,
        status,
        isAuthenticated,
        getUser,
    };
} 