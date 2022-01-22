import * as yup from "yup"

export const articleSchema = yup.object().shape({
    article: yup.string()
        .required("artcile required")
        .max(930, "Your article can't have more than 930 chars"),
})