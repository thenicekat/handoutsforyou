import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-auth';
import { getServerSession } from "next-auth/next";
import { authOptions } from "./[...nextauth]";

export type BaseResponseData = {
    message: string,
    error: boolean
}

export type SessionUser = {
    name: string;
    email: string;
    image?: string | null;
}

export type CustomSession = {
    user: SessionUser;
    expires: string;
}

export async function validateAPISession<T extends BaseResponseData>(
    req: NextApiRequest,
    res: NextApiResponse<T>
): Promise<CustomSession | null> {
    const nextAuthSession = await getServerSession(req, res, authOptions);
    if (nextAuthSession?.user?.email) {
        return {
            user: {
                name: nextAuthSession.user.name || '',
                email: nextAuthSession.user.email,
                image: nextAuthSession.user.image
            },
            expires: nextAuthSession.expires
        };
    }

    // Fallback to header-based validation for API routes
    const isValidated = req.headers['x-auth-validated'] === 'true';
    const email = req.headers['x-auth-email'];
    const name = req.headers['x-auth-name'];

    if (!isValidated || !email) {
        res.status(401).json({
            message: 'Unauthorized, Please login and try again',
            error: true,
            ...('data' in res ? { data: [] } : {})
        } as T);
        return null;
    }

    return {
        user: {
            name: name as string || '',
            email: email as string,
            image: null
        },
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions);
    if (session?.user?.email) {
        // Return consistent session format
        return res.json({
            user: {
                name: session.user.name || '',
                email: session.user.email,
                image: session.user.image
            },
            expires: session.expires
        });
    }
    return res.json(null);
}
