'use client';
import { NextApiRequest, NextApiResponse } from "next/dist/shared/lib/utils";

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<any> {
    if(req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' })
        return
    }
    try {
        const {email, password} = req.body;

        const apiResponse = await fetch('http://localhost:8080/auth/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                "Authorization": "Bearer " + localStorage.getItem('refreshToken')
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });
        
        if (apiResponse.ok) {
            const data = await apiResponse.json();

            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('isLoggedin', 'true');

        
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