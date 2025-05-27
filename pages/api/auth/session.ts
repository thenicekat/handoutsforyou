import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";
import { authOptions } from "./[...nextauth]";

export type BaseResponseData = {
    message: string,
    error: boolean
}

export async function validateAPISession<T extends BaseResponseData>(
    req: NextApiRequest,
    res: NextApiResponse<T>,
    options?: {
        requireHyderabadEmail?: boolean
    }
) {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session || !session.user?.email) {
        res.status(401).json({
            message: 'Unauthorized, Please login and try again',
            error: true,
            ...('data' in res ? { data: [] } : {})
        } as T);
        return null;
    }

    if (options?.requireHyderabadEmail && !session.user.email.includes('hyderabad')) {
        res.status(403).json({
            message: 'This feature is only available for BITS Hyderabad students.',
            error: true,
            ...('data' in res ? { data: [] } : {})
        } as T);
        return null;
    }

    return session;
} 