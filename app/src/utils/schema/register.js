import * as yup from "yup"

export const registerSchema = yup.object().shape({
    pseudo: yup.string()
        .required("pseudo is required")
        .max(50, "Pseudo can't be longer than 50 chars"),
    password: yup.string()
        .max(255, "bio  can't be longer than 255 chars"),
})