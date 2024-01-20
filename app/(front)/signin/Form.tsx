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

    let callbackUrl = params.get('callbackUrl') || '/'

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

                {
                    params.get('error') && (
                        <div className="alert text-error flex justify-center items-center">
                            {params.get('error') === 'CredentialsSignin' ? 'Invalid credentials' : params.get('error')}

                        </div>
                    )
                }
                {
                    params.get('success') && (
                        <div className="alert alert-success">
                            {params.get('success')}
                        </div>
                    )
                }
                <form onSubmit={handleSubmit(formSubmit)}>

                    <div className="my-2">
                        <label htmlFor="email" className="label">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            {...register("email", {
                                required: 'Email is required',
                                pattern: {
                                    value: /[a-z0-9]+@[a-z]+\.[a-z]/,
                                    message: 'Email is not valid'
                                },
                            })}
                            className="input input-bordered max-w-sm w-full"
                        />
                        {errors.email?.message && (
                            <div className="text-error flex justify-center items-center">
                                {errors.email.message}
                            </div>

                        )}
                    </div>

                    <div className="my-2">
                        <label htmlFor="password" className="label">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            {...register("password", { required: 'Password is required' })}
                            className="input input-bordered w-full max-w-sm"
                        />
                        {errors.password?.message && (
                            <div className="text-error">
                                {errors.password.message}
                            </div>

                        )}

                    </div>

                    <div className="my-4">
                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting && (
                                <span className="loading loading-spinner"></span>
                            )}
                            Sign in
                        </button>
                    </div>

                </form>


            </div >
        </div >
    )
}
