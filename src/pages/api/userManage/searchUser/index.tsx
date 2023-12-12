import { NextApiRequest, NextApiResponse } from "next/dist/shared/lib/utils";
import { parseCookies } from 'nookies';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }
    try {
        const cookiess = parseCookies({ req });
        const accessToken = cookiess.accessToken;
        const { text, page, perPage } = req.body;
        const apiResponse = await fetch('http://localhost:8080/admin/accounts/elasticSearchAccounts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + accessToken,
            },
            body: JSON.stringify({
                text: text,
                page: page,
                perPage: perPage
            })
        });

        if (apiResponse.ok) {
            const data = await apiResponse.json()
            res.status(200).json({
                data,
            });
        }
        else {
            const errorData = await apiResponse.json();
            res.status(apiResponse.status).json({ error: errorData.message });
        }
    }
    catch (error) {
        console.error('Error during ban account:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
