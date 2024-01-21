import { Metadata } from "next";
import Form from "./Form";

export const metadata: Metadata = {
    title: "Register",
    description: "Register page",
};

export default async function Register() {
    return <Form />
}