import { Metadata } from "next";
import Form from "./Form";

export const metadata: Metadata = {
    title: 'Profile',
    description: 'Profile page',
    keywords: 'profile',
};

export default function Profile() {

    return <Form />
}