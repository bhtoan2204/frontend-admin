import { NextApiRequest, NextApiResponse } from "next/dist/shared/lib/utils";
import { destroyCookie, parseCookies } from 'nookies';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' })
        return
    }
    try {
        destroyCookie({ res }, 'accessToken');
        destroyCookie({ res }, 'refreshToken');
        console.log(parseCookies({ req }));
        res.status(200).json({ message: 'Logout successfully' });
    }
    catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ error });
    }
}