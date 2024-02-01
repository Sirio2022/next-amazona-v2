'use client'

import useSWRMutation from "swr/mutation"
import useSWR, { mutate } from "swr"
import toast from "react-hot-toast"
import Link from "next/link"
import { ValidationRule, useForm } from "react-hook-form"
import { useEffect } from "react"
import { Product } from "@/lib/models/ProductModel"
import { formatId } from "@/lib/utils"
import { useRouter } from "next/navigation"

export default function ProductEditForm({ productId }: { productId: string }) {
    const { data: product, error } = useSWR<Product>(`/api/admin/products/${productId}`, async (url: string) => {
        const res = await fetch(url)
        return res.json()
    })

    const router = useRouter()

    const { trigger: updateProduct, isMutating: isUpdating } = useSWRMutation(`/api/admin/products/${productId}`,
        async (url, { arg }) => {
            const res = await fetch(`${url}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(arg)
            })
                .then(res => res.json())
                .then((product) => {
                    toast.success('Product updated successfully')
                    mutate(`/api/admin/products/${productId}`, product)
                    router.push('/admin/products')
                })
        }
    )


    const { register, handleSubmit, formState: { errors }, setValue } = useForm<Product>()

    useEffect(() => {
        if (!product) return
        setValue('name', product.name)
        setValue('slug', product.slug)
        setValue('price', product.price)
        setValue('image', product.image)
        setValue('category', product.category)
        setValue('brand', product.brand)
        setValue('countInStock', product.countInStock)
        setValue('description', product.description)
    }, [product, setValue])

    const formSubmit = async (formData: any) => {
        await updateProduct(formData)
    }

    if (error) return error.message
    if (!product) return 'Loading...'

    const FormInput = ({
        id,
        name,
        required,
        pattern,
    }: {
        id: keyof Product;
        name: string;
        required?: boolean;
        pattern?: ValidationRule<RegExp>;
    }


    ) => (
        <div className="md:flex mb-6">
            <label htmlFor={id} className="label md:w-1/5">{name}</label>
            <div className="md:w-4/5">
                <input
                    type="text"
                    className="input input-bordered w-full max-w-md"
                    id={id}
                    {...register(id, { required: required && `${name} is required`, pattern })}
                />
                {errors[id]?.message && (
                    <div className="text-error">{errors[id]?.message}</div>
                )}
            </div>
        </div>

    )

    const uploadHandler = async (e: any) => {
        const toastId = toast.loading('Uploading image...')

        try {
            const resSign = await fetch('/api/cloudinary-sign', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    timestamp: Date.now()
                })
            })



            const { signature, timestamp } = await resSign.json()

            const file = e.target.files[0]

            const formData = new FormData()

            formData.append('file', file)
            formData.append('signature', signature)
            formData.append('timestamp', timestamp)
            formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!)
                        
            const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`, {
                method: 'POST',
                body: formData,
            })
            const data = await res.json()
            console.log(data);
            
            setValue('image', data.secure_url)
            toast.success('Image uploaded successfully', { id: toastId })
        } catch (error: any) {
            toast.error(error.message, { id: toastId })
        }
    }

    return (
        <div>
            <h1 className="text-2xl py-4">
                Edit Product: {formatId(productId)}
            </h1>

            <div>
                <form
                    onSubmit={handleSubmit(formSubmit)}
                    className="space-y-4"
                >
                    <FormInput id="name" name="Name" required />
                    <FormInput id='slug' name='Slug' required />
                    <FormInput id='price' name='Price' required />
                    <FormInput id='image' name='Image' required />
                    <div className="md:flex mb-6">
                        <label htmlFor="imageFile" className="label md:w-1/5">Upload Image</label>
                        <div className="md:w-4/5">
                            <input
                                type="file"
                                className="input input-bordered w-full max-w-md"
                                id="imageFile"
                                onChange={uploadHandler}
                            />
                        </div>
                    </div>
                    <FormInput id='category' name='Category' required />
                    <FormInput id='brand' name='Brand' required />
                    <FormInput id='countInStock' name='Count In Stock' required />
                    <FormInput id='description' name='Description' required />

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isUpdating}
                    >
                        {isUpdating && (
                            <span className="loading loading-spinner"></span>

                        )}
                        Update

                    </button>

                    <Link href="/admin/products" className="btn btn-error ml-4">
                        Cancel
                    </Link>
                </form>
            </div>
        </div>
    )








}