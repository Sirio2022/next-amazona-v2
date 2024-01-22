'use client'
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";


type Inputs = {
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
};


export default function Form() {

    const { data: session } = useSession();

    const params = useSearchParams();

    const router = useRouter();

    let callbackUrl = params.get('callbackUrl') || '/';

    const { register,
        handleSubmit,
        getValues,
        formState: { errors, isSubmitting } } = useForm<Inputs>({
            defaultValues: {
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
            },
        });

    useEffect(() => {
        if (session && session.user) {
            router.push(callbackUrl);
        }
    }, [session, router, callbackUrl, params]);

    const formSubmit: SubmitHandler<Inputs> = async (form) => {
        const { name, email, password } = form;

        try {

            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            if (response.ok) {
                return router.push(`/signin?callbackUrl=${callbackUrl}&success=Account created successfully!`)
            } else {
                const data = await response.json();
                throw new Error(data.message);
            }



        } catch (error: any) {
            toast.error(error.message || 'Something went wrong!')
        }
    };


    return (
        <div className="max-w-sm mx-auto card bg-base-300 my-4">
            <div className="card-body">
                <h1 className="card-title">Register</h1>
                <form onSubmit={handleSubmit(formSubmit)}>
                    <div className="my-2">
                        <label htmlFor="name" className="label">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="input input-bordered w-full max-w-sm"
                            placeholder="Name"
                            {...register("name", { required: 'Name is required' })}
                        />
                        {
                            errors.name?.message && (
                                <div className="text-error">
                                    {errors.name?.message}
                                </div>
                            )
                        }

                    </div>

                    <div className="my-2">
                        <label htmlFor="email" className="label">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="input input-bordered w-full max-w-sm"
                            placeholder="Email"
                            {...register("email", {
                                required: 'Email is required',
                                pattern: {
                                    value: /[a-z0-9]+@[a-z]+\.[a-z]/,
                                    message: 'Email is not valid'
                                },
                            })}
                        />
                        {
                            errors.email?.message && (
                                <div className="text-error">
                                    {errors.email?.message}
                                </div>
                            )
                        }
                    </div>

                    <div className="my-2">
                        <label htmlFor="password" className="label">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="input input-bordered w-full max-w-sm"
                            placeholder="Password"
                            {...register("password", {
                                required: 'Password is required',
                                minLength: {
                                    value: 6,
                                    message: 'Password must be at least 6 characters'
                                },
                            })}
                        />
                        {
                            errors.password?.message && (
                                <div className="text-error">
                                    {errors.password?.message}
                                </div>
                            )
                        }
                    </div>

                    <div className="my-2">
                        <label htmlFor="confirmPassword" className="label">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className="input input-bordered w-full max-w-sm"
                            placeholder="Confirm Password"
                            {...register("confirmPassword", {
                                required: 'Confirm Password is required',
                                validate: {
                                    value: (value) => value === getValues('password') || 'Passwords do not match',
                                },
                            })}
                        />
                        {
                            errors.confirmPassword?.message && (
                                <div className="text-error">
                                    {errors.confirmPassword?.message}
                                </div>
                            )
                        }
                    </div>


                    <div className="my-4">
                        <button
                            type="submit"
                            className="btn btn-primary btn-block"
                            disabled={isSubmitting}
                        >
                            {isSubmitting && (
                                <span className="loading loading-spinner"></span>
                            )}
                            Register
                        </button>
                    </div>

                    <div className="divider"></div>

                    <div>
                        Already have an account?{' '}
                        <Link className="link" href={`/signin?callbackUrl=${callbackUrl}`}>
                            Sign in
                        </Link>
                    </div>
                </form>

            </div>

        </div>
    )
}
