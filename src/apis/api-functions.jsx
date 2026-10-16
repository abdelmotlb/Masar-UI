import { LoginAttrs } from "../Constants";

export function getCurrentUserTokenFromCookies() {
    return localStorage.getItem(LoginAttrs.TOKEN)
}

export async function handleSendRequest(request) {
    let response = null;
    try {
        response = await request()
    } catch (error) {
        // Network error
        throw {
            status: 0,
            message: "Unable to connect to the server.",
            data: null,
        };
    }

    return response
}

export async function handleGotResponse(response) {
    let data = null;
    try {
        data = await response.json();
    } catch {
        console.log("Response does not contain JSON.");
    }


    /*** TO BE HANDLED */
    if (!response.ok) {
        throw {
            status: response.status,
            message: data?.message || "Something went wrong.",
            data,
        };
    }
    return data;
}