export const loginUser = async ({username, password}) => {
    const requestOptions = {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: username,
            password: password,
            remember: true,
        }),
    };

    try {
        // const response = await fetch("http://127.0.0.1:8000/api/login/", requestOptions)
        const response = await fetch("https://tracloud.azurewebsites.net/api/login/", requestOptions)
        if (response.ok) {
            return (response.json());
        } else {
            const error = await response.json();
            if (response.statusText === "Not Found") {
                return {error: "username",}
            } else if (response.statusText === "Forbidden") {
                return {error: "password",}
            }
            return {
                error: error.message || 'Something went wrong',
            }
        }
    } catch (error) {
        return {
            error: error.message,
        }
    }
}

