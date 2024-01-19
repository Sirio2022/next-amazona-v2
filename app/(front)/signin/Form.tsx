'use client'
import { signIn, useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useForm, SubmitHandler } from "react-hook-form"


type Inputs = {
    email: string,
    password: string
}


export default function Form() {

    const { data: session } = useSession()

    const params = useSearchParams()

    let callbackUrl = params.get('callbackUrl' || '/') as string

    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<Inputs>({
        defaultValues: {
            email: '',
            password: ''
        }

    });

    useEffect(() => {
        if (session && session.user) {
            router.push(callbackUrl)
        }
    }, [session, router, callbackUrl, params])

    const formSubmit: SubmitHandler<Inputs> = (async (form) => {
        const { email, password } = form
        signIn('credentials', {
            email,
            password,

        })
    })


    return (
        <div className="max-w-sm mx-auto card bg-base-300 my-4">
            <div className="card-body">
                <h1 className="card-title">
                    Sign in
                </h1>

            </div>
        </div>
    )
}
