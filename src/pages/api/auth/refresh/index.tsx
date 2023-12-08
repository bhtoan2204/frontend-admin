import { NextApiRequest, NextApiResponse } from "next/dist/shared/lib/utils";
import { parseCookies, setCookie } from 'nookies';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<any> {
    if(req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' })
        return
    }
    try{
        const cookiess  = parseCookies({ req });
        const refreshToken = cookiess.refreshToken;

        const apiResponse = await fetch('http://localhost:8080/auth/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + refreshToken,
            },
        });

        if (apiResponse.ok) {
            const data = await apiResponse.json();

            setCookie({ res }, 'accessToken', data.accessToken, {
                maxAge: 1 * 24 * 60 * 60,
            });
    
            setCookie({ res }, 'refreshToken', data.refreshToken, {
                maxAge: 3 * 24 * 60 * 60,
            });

            res.status(200).json({ 
                message: 'Refresh token run successfully',
                accessToken: data.accessToken,
                refreshToken: data.refreshToken });
        }
        else {
            const errorData = await apiResponse.json();
            res.status(apiResponse.status).json({ error: errorData.message });
        }
    }
    catch(error){
        console.error('Error during refresh:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}