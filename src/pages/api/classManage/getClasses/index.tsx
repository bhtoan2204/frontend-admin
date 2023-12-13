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
        const { page, itemPerPage, is_active, is_descending } = req.body;

        console.log(page, itemPerPage, is_active, is_descending)

        const apiResponse = await fetch('http://localhost:8080/admin/class/getClasses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + accessToken,
            },
            body: JSON.stringify({
                page,
                itemPerPage,
                is_active,
                is_descending
            })
        });

        if (apiResponse.ok) {
            const data = await apiResponse.json();
            res.status(200).json({
                message: 'Get classes successfully',
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
