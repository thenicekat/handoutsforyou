import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";
import { authOptions } from "./[...nextauth]";

export type BaseResponseData = {
    message: string,
    error: boolean
}

export async function validateAPISession<T extends BaseResponseData>(
    req: NextApiRequest,
    res: NextApiResponse<T>
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

    return session;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<BaseResponseData>
) {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        return res.status(401).json({
            message: 'Unauthorized',
            error: true
        });
    }

    return res.status(200).json({
        message: 'Authenticated',
        error: false
    });
}
