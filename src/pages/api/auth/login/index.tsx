import { NextApiRequest, NextApiResponse } from "next/dist/shared/lib/utils";

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<any> {
    console.log("Login api called")
    if(req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' })
        return
    }
    try{
        const {email, password} = req.body;

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
            if (typeof window !== 'undefined') {
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);
            }
        
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