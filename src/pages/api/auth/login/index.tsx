import { NextApiRequest, NextApiResponse } from "next/dist/shared/lib/utils";
import { setCookie } from 'nookies';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<any> {
    if(req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' })
        return
    }
    try {
        const { email, password } = req.body;

        const apiResponse = await fetch('http://localhost:8080/auth/local/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });
        
        if (apiResponse.ok) {
            const data = await apiResponse.json();

            setCookie({ res }, 'accessToken', data.accessToken, {
                maxAge: 1 * 24 * 60 * 60, // 1 day
                path: '/',
            });
    
            setCookie({ res }, 'refreshToken', data.refreshToken, {
                maxAge: 3 * 24 * 60 * 60, // 3 days
                path: '/',
            });
        
            res.status(200).json({ 
                message: 'Đăng nhập thành công',
                accessToken: data.accessToken,
                refreshToken: data.refreshToken });
        }
        else {
            const errorData = await apiResponse.json();
            res.status(apiResponse.status).json({ error: errorData.message });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}