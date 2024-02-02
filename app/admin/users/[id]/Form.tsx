'use client'

import useSWRMutation from "swr/mutation"
import useSWR from "swr"
import toast from "react-hot-toast"
import Link from "next/link"
import { ValidationRule, useForm } from "react-hook-form"
import { use, useEffect } from "react"
import { User } from "@/lib/models/UserModel"
import { formatId } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { set } from "mongoose"
import { Span } from "next/dist/trace"

export default function UserEditForm({ userId }: { userId: string }) {
    const { data: user, error } = useSWR(`/api/admin/users/${userId}`, async (url) => {
        const res = await fetch(url)
        return res.json()
    })

    const router = useRouter()

    const { trigger: updateUser, isMutating: isUpdating } = useSWRMutation(`/api/admin/users/${userId}`, async (url, { arg }: { arg: User }) => {
        const res = await fetch(`${url}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(arg)
        })
        const data = await res.json()
        if (!res.ok) return toast.error(data.message)

        toast.success('User updated successfully')
        router.push('/admin/users')

    })

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<User>()

    useEffect(() => {
        if (!user) return
        setValue('name', user.name)
        setValue('email', user.email)
        setValue('isAdmin', user.isAdmin)
    }, [user, setValue])

    const formSubmit = async (formData: any) => {
        await updateUser(formData)
    }

    if (error) return error.message
    if (!user) return 'Loading...'

    const FormInput = ({
        id,
        name,
        required,
        pattern,
    }: {
        id: keyof User
        name: string
        required?: boolean
        pattern?: ValidationRule<RegExp>
    }) => (
        <div className="md:flex my-3">
            <label htmlFor={id} className="label md:w-1/5">
                {name}
            </label>

            <div className="md:4/5">
                <input
                    type="text"
                    id={id}
                    className="input input-bordered w-full max-w-md"
                    {...register(id, {
                        required: required && `${name} is required`,
                        pattern
                    })}

                />
                {
                    errors[id]?.message && (
                        <div className="text-error">
                            {errors[id]?.message}
                        </div>
                    )
                }

            </div>

        </div>
    )

    return (
        <div>
            <h1 className="py-4 text-2xl">
                Edit User
            </h1>

            <div>
                <form onSubmit={handleSubmit(formSubmit)}>
                    <FormInput id="name" name="Name" required />
                    <FormInput id="email" name="Email" required />
                    <div className="md:flex my-3">
                        <label htmlFor="isAdmin" className="label md:w-1/5">
                            Admin
                        </label>

                        <div className="md:4/5">
                            <input
                                type="checkbox"
                                id="isAdmin"
                                className="toggle"
                                {...register('isAdmin')}
                            />
                        </div>

                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isUpdating}
                    >
                        {isUpdating && <span className="loading loading-spinner"></span>}
                        Update User
                    </button>
                    <Link href="/admin/users" className="btn ml-4">
                        Cancel
                    </Link>
                </form>
            </div>
        </div>
    )
}