import { NextApiRequest, NextApiResponse } from "next/dist/shared/lib/utils";
import { parseCookies } from 'nookies';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<any> {
    if (req.method !== 'PATCH') {
        res.status(405).json({ error: 'Method not allowed' })
        return
    }
    try {
        const { old_password, password, rewrite_password } = req.body;
        const cookiess = parseCookies({ req });
        const accessToken = cookiess.accessToken;

        const apiResponse = await fetch('http://localhost:8080/user/change_password', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + accessToken,
            },
            body: JSON.stringify({
                old_password,
                password,
                rewrite_password
            })
        });

        if (apiResponse.ok) {
            const data = await apiResponse.json();

            res.status(200).json({
                message: 'Change password successful',
                data
            });
        }
        else {
            const errorData = await apiResponse.json();
            console.log(errorData)
            res.status(apiResponse.status).json({ error: errorData.message });
        }
    } catch (error) {
        console.error('Error during change password:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}