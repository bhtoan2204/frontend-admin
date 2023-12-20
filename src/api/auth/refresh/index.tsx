export const fetchRefresh = async (refreshToken: string) => {
    try {
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
            return { data, status: apiResponse.status };
        }
        else {
            const errorData = await apiResponse.json();
            return { errorData, status: apiResponse.status };
        }
    }
    catch (error) {
        return { error, status: 500 };
    }
}