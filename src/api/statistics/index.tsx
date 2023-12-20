export const fetchStatistics = async (accessToken: string) => {
    try {
        const apiResponse = await fetch('http://localhost:8080/admin/accounts/getStatistics', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + accessToken,
            },
        });

        if (apiResponse.ok) {
            const data = await apiResponse.json();
            return { data, status: apiResponse.status };
        }
        else {
            const data = await apiResponse.json();
            return { data, status: apiResponse.status };
        }
    }
    catch (error) {
        return { error, status: 500 };
    }
}