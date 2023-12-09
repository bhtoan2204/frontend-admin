import { NextApiRequest, NextApiResponse } from "next/dist/shared/lib/utils";
import { parseCookies } from 'nookies';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PATCH') {
        res.status(405).json({ error: 'Method not allowed' })
        return
    }
    try {
        const cookiess = parseCookies({ req });
        const accessToken = cookiess.accessToken;
        const { fullname, birthday } = req.body;

        const apiResponse = await fetch('http://localhost:8080/user/edit_profile', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + accessToken,
            },
            body: JSON.stringify({
                fullname: fullname,
                birthday: birthday
            })
        })

        if (apiResponse.ok) {
            const data = await apiResponse.json();
            res.status(200).json({
                message: 'Update profile successfully',
                data: data
            });
        }
        else {
            const errorData = await apiResponse.json();
            res.status(apiResponse.status).json({ error: errorData.message });
        }
    }
    catch (error) {
        console.error('Error during refresh:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}