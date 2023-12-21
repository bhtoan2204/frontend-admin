export const fetchUpdateProfile = async (fullname: string, birthday: Date, accessToken: string) => {
    try {
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

            return { data, status: apiResponse.status };
        }
        else {
            const errorData = await apiResponse.json();

            return { message: errorData, status: apiResponse.status };
        }
    }
    catch (error) {
        return { error, status: 500 };
    }
}