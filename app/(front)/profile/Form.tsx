'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import toast from "react-hot-toast"

export default function Form() {

    type Inputs = {
        name: string
        email: string
        password: string
        confirmPassword: string
    }

    const { data: session, update } = useSession()
    const router = useRouter()

    const { register, handleSubmit, getValues, setValue, formState: { errors, isSubmitting } } = useForm<Inputs>({
        defaultValues: {
            name: '',
            email: '',
            password: '',
        }
    })

    useEffect(() => {
        if (session && session.user) {
            setValue('name', session.user.name!)
            setValue('email', session.user.email!)
        }
    }, [session, setValue, router])

    const formSubmit: SubmitHandler<Inputs> = async (form) => {
        const { name, email, password } = form

        const res = await fetch('/api/auth/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                password
            })
        })
        if (res.status === 200) {
            toast.success('Profile updated successfully')
            const newSession = {
                ...session,
                user: {
                    ...session?.user,
                    name,
                    email
                }
            }
            await update(newSession)
            router.push('/')
        } else {
            const data = await res.json()
            toast.error(data.message || 'Something went wrong')
        }

        try {

        } catch (error: any) {
            const fail = error.response && error.response.data.message ? error.response.data.message : error.message
            toast.error(fail)
        }
    }

    return (
        <div className="max-w-sm mx-auto card bg-base-300 my-4">
            <div className="card-body">
                <h1 className="card-title">Profile</h1>

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
                            {...register('name', {
                                required: 'Name is required'
                            })}
                        />
                        {errors.name?.message && (
                            <div className="text-error">
                                {errors.name?.message}
                            </div>
                        )}

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
                            {...register('email', {
                                required: 'Email is required'
                            })}
                        />
                        {errors.email?.message && (
                            <div className="text-error">
                                {errors.email?.message}
                            </div>
                        )}
                    </div>

                    <div className="my-2">
                        <label htmlFor="password" className="label">
                            New Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="input input-bordered w-full max-w-sm"
                            placeholder="Password"
                            {...register('password', {
                                minLength: {
                                    value: 6,
                                    message: 'Password must be at least 6 characters'
                                },
                            })}
                        />
                        {errors.password?.message && (
                            <div className="text-error">
                                {errors.password?.message}
                            </div>
                        )}
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
                            {...register('confirmPassword', {
                                minLength: {
                                    value: 6,
                                    message: 'Password must be at least 6 characters'
                                },
                                validate: (value) => {
                                    const { password } = getValues()
                                    return password === value || 'Passwords do not match'
                                }
                            })}
                        />
                        {errors.confirmPassword?.message && (
                            <div className="text-error">
                                {errors.confirmPassword?.message}
                            </div>
                        )}
                    </div>

                    <div className="my-2">
                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting && (
                                <span className="loading loading-spinner"></span>
                            )}
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
