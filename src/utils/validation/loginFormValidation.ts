import { emailRegex, passwordRegex } from "../../Constants/regex";

export const validateEmail = (email: string) => {
     return emailRegex.test(String(email).toLowerCase());
}

export const validatePassword = (password: string) => {
    return passwordRegex.test(password);
}