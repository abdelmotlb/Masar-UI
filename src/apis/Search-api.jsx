import { API_BASE } from "../Constants";
import { handleGotResponse, handleSendRequest, getCurrentUserTokenFromCookies } from "./api-functions";

export async function searchAPI(query, scope, mode) {
    const searchParams = new URLSearchParams({ query, scope, mode });
    const response = await handleSendRequest(
        async () =>
            await fetch(`${API_BASE}/Search?${searchParams.toString()}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${getCurrentUserTokenFromCookies()}`,
                },
            })
    );

    const data = await handleGotResponse(response);
    const results = Array.isArray(data) ? data : data?.results;

    if (!Array.isArray(results)) {
        throw new Error("The search response must be an array of results.");
    }

    return results;
}