import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-auth';
import { getServerSession } from "next-auth/next";
import { authOptions } from "./[...nextauth]";

export type BaseResponseData = {
    message: string,
    error: boolean
}

export async function validateAPISession<T extends BaseResponseData>(
    req: NextApiRequest,
    res: NextApiResponse<T>
): Promise<Session | null> {
    // For API routes, use header-based validation
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
            email: email as string,
            name: name as string
        },
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
    };
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions);
    return res.json(session);
}
