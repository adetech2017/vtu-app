
const getAuthToken = async () => {
    try {
        // Implement your logic to obtain the authorization token here
        // For example, fetch the token from a secure storage or an authentication service
        const response = await fetch('https://sandbox.worldroambuddy.com:3001/api/v1/wl-account/authenticate', {
            method: 'POST',
            body: JSON.stringify({
                username: 'wasiujimoh@yahoo.com',
                password: '123RoamTech456' 
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        const authToken = data.data.access_token; // Extract the authorization token from the response

        //console.log(data.data.access_token);
        return authToken;
    } catch (error) {
        console.error('Error fetching authentication token:', error);
        throw error;
    }
};

export default getAuthToken;
