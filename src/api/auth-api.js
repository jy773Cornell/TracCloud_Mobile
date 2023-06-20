export const getCSRFToken = async () => {
    const requestOptions = {
        method: "GET", headers: {
            'Accept': 'application/json', "Content-Type": "application/json",
        },
    };

    try {
        // const response = await fetch("http://127.0.0.1:8000/api/csrf/get/", requestOptions)
        const response = await fetch("https://tracloud.azurewebsites.net/api/csrf/get/", requestOptions)
        if (response.ok) {
            return (response.json());
        } else {
            const error = await response.json();
            console.log(error);
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

export const loginUser = async ({username, password}) => {
    const csrfResponse = await getCSRFToken();
    if (!csrfResponse.csrfToken) {
        return ({error: "csrfToken not found"})
    }

    const csrfToken = csrfResponse.csrfToken;
    const requestOptions = {
        method: "POST", headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json",
            'X-CSRFToken': csrfToken,
        }, body: JSON.stringify({
            username: username, password: password, remember: true,
        }),
    };

    try {
        // const response = await fetch("http://127.0.0.1:8000/api/login/", requestOptions)
        const response = await fetch("https://tracloud.azurewebsites.net/api/login/", requestOptions)
        if (response.ok) {
            return (response.json());
        } else {
            const error = await response.json();
            console.log(error);
            if (response.status === 404) {
                return {error: "username",}
            } else if (response.status === 403) {
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

