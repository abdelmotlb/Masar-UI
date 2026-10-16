import { API_BASE, LoginAttrs } from "../Constants";
import {getCurrentUserTokenFromCookies, handleGotResponse, handleSendRequest} from "./api-functions"
/**
 * the response has 3 very important data: 
 * 1. status (number)
 * 2. statustext
 * 3. ok
 * ** so we need to handle all cases (branches) based on different status
 */
let fileEndpointLink = `${API_BASE}/Topic`

/** get full data of a specific file: 
 * 1. file data
 * 2. exchanges data:
 *    * 2.1. incoming mail data
 *    * 2.2. outgoing mail data (procedures)
 */
export async function getFullDataOfFileAPI(fileNumber) {

    const response = await handleSendRequest(
        async () => await fetch(
            `${fileEndpointLink}/get-by-topic-number/${fileNumber}`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${getCurrentUserTokenFromCookies()}`,
                    "Content-Type": "application/json"
                }
            }
        )
    );

    let data = await handleGotResponse(response);
    return data;
}


/** AVAILABLE FILE OPERATIONS */
export async function CreateNewTopicAPI(NewTopicObj) {
    const response = await handleSendRequest(
        async () => await fetch(fileEndpointLink, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getCurrentUserTokenFromCookies()}`,
            },
            body: JSON.stringify(NewTopicObj),
        })
    )
    
    let data = await handleGotResponse(response);
    return data;
}

export async function updateFileAPI(editedFileData) {
    const response = await handleSendRequest(
        async () => await fetch(fileEndpointLink, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getCurrentUserTokenFromCookies()}`,
            },
            body: JSON.stringify(editedFileData),
        })
    )

    let data = await handleGotResponse(response);
    return data;
}

export async function getPageOfFilesAPI(page, pageSize) {

    const response = await handleSendRequest(
        async () => await fetch(
            `${fileEndpointLink}/get-page/${page}/${pageSize}`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${getCurrentUserTokenFromCookies()}`
                }
            }
        )
    );
    
    let data = await handleGotResponse(response);
    return data;
}

/** AVAILABLE INCOMING MAIL OPERATIONS (PART 1) */
export async function createExchangeAPI(topicId, exchange) {

    const response = await handleSendRequest(
        async () => await fetch(
            `${API_BASE}/Exchange/topic/${topicId}`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getCurrentUserTokenFromCookies()}`
                },

                body: JSON.stringify(exchange)
            }
        )
    )

    let data = await handleGotResponse(response);
    return data;
}

export async function updateIncomingMailFieldAPI(exchangeId, field, value) {
    const response = await handleSendRequest(
        async () => await fetch(
            `${API_BASE}/Exchange/${exchangeId}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getCurrentUserTokenFromCookies()}`,
                },
                body: JSON.stringify({ [field]: value }),
            }
        )
    );

    return await handleGotResponse(response);
}

export async function deleteExchangeAPI(exchangeId) {
    const response = await handleSendRequest(
        async () => await fetch(
            `${API_BASE}/Exchange/${exchangeId}`,
            {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${getCurrentUserTokenFromCookies()}`,
                },
            }
        )
    );

    return await handleGotResponse(response);
}


/** AVAILABLE PROCEDURE OPERATIONS (PART 2) */
export async function createProcedureAPI(exchangeId, procedure) {
    const response = await handleSendRequest(
        async () => await fetch(
            `${API_BASE}/Exchange/${exchangeId}/procedures`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCurrentUserTokenFromCookies()}`,
                },
                body: JSON.stringify(procedure),
            }
        )
    )

    let data = await handleGotResponse(response);
    return data;
}

export async function updateProcedureAPI(exchangeId, procedureId, procedure) {
    const response = await handleSendRequest(
        async () => await fetch(
            `${API_BASE}/Exchange/${exchangeId}/procedures/${procedureId}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCurrentUserTokenFromCookies()}`,
                },
                body: JSON.stringify(procedure),
            }
        )
    );

    return await handleGotResponse(response);
}

export async function deleteProcedureAPI(exchangeId, procedureId) {
    const response = await handleSendRequest(
        async () => await fetch(
            `${API_BASE}/Exchange/${exchangeId}/procedures/${procedureId}`,
            {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getCurrentUserTokenFromCookies()}`,
                },
            }
        )
    );

    return await handleGotResponse(response);
}