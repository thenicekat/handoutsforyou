import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import { capitalize } from '../constants'

type ResponseData = {
    message: string,
    error: boolean
}

const MAX_RETRIES = 5;
const INITIAL_RETRY_DELAY = 1000;

async function fetchWithRetry(url: string, options: RequestInit, retries = MAX_RETRIES): Promise<Response> {
    try {
        return await fetch(url, options);
    } catch (error) {
        if (retries === 0) {
            throw error;
        }

        const delay = INITIAL_RETRY_DELAY * Math.pow(2, MAX_RETRIES - retries);
        await new Promise(resolve => setTimeout(resolve, delay));

        return fetchWithRetry(url, options, retries - 1);
    }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
        res.status(400).json({
            message: 'Unauthorized, Please login and try again',
            error: true
        })
        return
    }
    const { name, email } = session.user
    const { testimonial, userId } = req.body

    if (!testimonial) {
        res.status(422).json({ message: 'Invalid Request - testimonial missing', error: true })
        return
    }
    if (!userId) {
        res.status(422).json({ message: 'Invalid Request - User missing', error: true })
        return
    }
    if (!name || !email) {
        res.status(422).json({ message: 'Invalid Request - Auth missing', error: true })
        return
    }

    try {
        const response = await fetchWithRetry('https://yearbooknostalgia.com/portal/write-testimonial-post', {
            method: 'POST',
            headers: {
                'Accept': '*/*',
                'Accept-Language': 'en-US,en;q=0.8',
                'Origin': 'https://yearbooknostalgia.com',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Sec-CH-UA': '"Brave";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
                'Referer': 'https://yearbooknostalgia.com/portal/testimonial-post?user_id=0&user_name=Name&user_email=email',
                'Sec-CH-UA-Mobile': '?0',
                'Sec-CH-UA-Platform': '"macOS"',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin',
                'Sec-GPC': '1',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: new URLSearchParams({
                'user_name': capitalize(session.user.name),
                'user_email': session.user.email,
                'user_id': userId?.toString(),
                'comment': testimonial,
            }).toString(),
        });

        if (response.status != 200) {
            res.status(response.status).json({
                message: `Received unexpected response ${response.status} from server.`,
                error: true
            })
            return
        }
        res.status(200).json({
            message: 'success',
            error: false
        })
        return
    } catch (error) {
        res.status(500).json({
            message: `Upstream server RIPed, Request failed after multiple attempts.`,
            error: true
        })
        return
    }
}
