import { API_BASE } from "../Constants";

/**
 * the response has 3 very important data: 
 * 1. status (number)
 * 2. statustext
 * 3. ok
 * ** so we need to handle all cases (branches) based on different status
 */

export async function loginAPI(email, password) {
    let loginEndpointLink = `${API_BASE}/Accounting/login`
    const response = await fetch(loginEndpointLink, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });

    const responseObj = await response;
    return responseObj;
}