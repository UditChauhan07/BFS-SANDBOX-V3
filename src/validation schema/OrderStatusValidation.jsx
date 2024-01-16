import * as Yup from "yup";

export const OrderStatusSchema = Yup.object().shape({
    description :Yup.string().required("Please enter description.").min(1, "Use 1 characters or more for description."),
    contact:Yup.string().required("Please select contact name.")
})