import { createStrictAttributes } from "./utilities/general-utilities";

export const API_BASE = "http://localhost:5075/api";

export const RoutePaths = Object.freeze({
    LOGIN: "/login",
    ABOUT: "/about",
    HOME: "/home",
    FILE: "/file",
    NOTFOUND: "/notfound",
    EXCHANGE: "/exchange"
});

export const NotificationType = Object.freeze({
    SUCCESS: "success",
    ERROR: "error"
});


export const LoginAttrs = Object.freeze({
    USERNAME: "username",
    PASSWORD: "password",
    TOKEN: "token"
});

export const ModeOfOperation = Object.freeze({
    EDIT: "edit",
    CREATE: "create"
});

export const TablePageSize = 6;

const exchangeAttributeNames = {
    id: "id",

    inSerialNumberOfIncomingMail: "inSerialNumberOfIncomingMail",
    inSerialNumberDateOfIncomingMail: "inSerialNumberDateOfIncomingMail",

    outSerialNumberOfIncomingMail: "outSerialNumberOfIncomingMail",
    outSerialNumberDateOfIncomingMail: "outSerialNumberDateOfIncomingMail",

    incomingMailAuthority: "incomingMailAuthority",

    specialist: "specialist",

    dateOfFollowUp: "dateOfFollowUp",
    
};

export const ExchangeAttributes = createStrictAttributes(
    exchangeAttributeNames,
    "Exchange"
);