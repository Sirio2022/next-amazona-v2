'use client';
import CheckoutSteps from "@/components/CheckoutSteps";
import useCartService from "@/lib/hooks/useCartStore"
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import useSWRMutation from "swr/mutation"


export default function Form() {

    const router = useRouter()

    const {
        paymentMethod,
        shippingAddress,
        items,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        clear,

    } = useCartService()

    const { trigger: placeOrder, isMutating: isPlacing } = useSWRMutation(
        '/api/orders/mine',
        async (url) => {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    paymentMethod,
                    shippingAddress,
                    items,
                    itemsPrice,
                    taxPrice,
                    shippingPrice,
                    totalPrice,
                })

            })
            const data = await res.json()
            if (res.ok) {
                clear()
                toast.success('Order placed successfully')
                router.push(`/order/${data.order._id}`)
            } else {
                toast.error(data.message)
            }
        },
    )

    useEffect(() => {
        if (!paymentMethod) {
            return router.push('/payment')
        }
        if (items.length === 0) {
            return router.push('/')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paymentMethod, router])

    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <></>
    }

    return (
        <div>
            <CheckoutSteps current={4} />

            <div className="grid md:grid-cols-4 md:gap-5 my-4">

                <div className="overflow-x-auto md:col-span-3">
                    <div className="card bg-base-300">
                        <div className="card-body">
                            <h2 className="card-title">
                                Shipping Address
                            </h2>
                            <p>
                                {shippingAddress?.fullName}
                            </p>
                            <p>
                                {shippingAddress?.address}, {shippingAddress?.city}, {shippingAddress?.postalCode}, {shippingAddress?.country}
                            </p>

                            <div>
                                <Link href="/shipping" className="btn">
                                    Edit
                                </Link>
                            </div>

                        </div>

                    </div>

                    <div className="card bg-base-300 my-4">
                        <div className="card-body">
                            <h2 className="card-title">
                                Payment Method
                            </h2>
                            <p>
                                {paymentMethod}
                            </p>

                            <div>
                                <Link href="/payment" className="btn">
                                    Edit
                                </Link>
                            </div>

                        </div>

                    </div>

                    <div className="card mg-base-300 mt-4">
                        <div className="card-body">
                            <h2 className="card-title">
                                Order Items
                            </h2>

                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Item</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item) => (
                                        <tr key={item.slug}>
                                            <td>
                                                <Link href={`/product/${item.slug}`} className="flex items-center">
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        width={50}
                                                        height={50}
                                                    />

                                                    <span className="px-2">
                                                        {item.name} {item.color} {item.size}
                                                    </span>

                                                </Link>
                                            </td>

                                            <td>
                                                {item.quantity}
                                            </td>

                                            <td>
                                                ${item.price}
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                        </div>

                    </div>



                </div>

                <div>
                    <div className="card bg-base-300">
                        <div className="card-body">
                            <h2 className="card-title">
                                Order Summary
                            </h2>

                            <ul className="space-y-3">
                                <li>
                                    <div className="flex justify-between">
                                        <div>
                                            {items.length} Items
                                        </div>
                                        <div>${itemsPrice.toFixed(2)}</div>
                                    </div>
                                </li>

                                <li>
                                    <div className="flex justify-between">
                                        <div>Tax</div>
                                        <div>
                                            ${taxPrice.toFixed(2)}

                                        </div>
                                    </div>
                                </li>

                                <li>
                                    <div className="flex justify-between">
                                        <div>Shipping</div>
                                        <div>
                                            ${shippingPrice.toFixed(2)}

                                        </div>
                                    </div>
                                </li>

                                <li>
                                    <div className="flex justify-between">
                                        <div>Total</div>
                                        <div>
                                            ${totalPrice.toFixed(2)}

                                        </div>
                                    </div>
                                </li>

                                <li>
                                    <button
                                        type="button"
                                        className="btn btn-primary w-full"
                                        onClick={() => placeOrder()}
                                        disabled={isPlacing}
                                    >
                                        {isPlacing && (
                                            <span className="loading loading-spinner"></span>
                                        )}
                                        Place Order
                                    </button>
                                </li>
                            </ul>

                        </div>

                    </div>
                </div>

            </div>
        </div>

    )
}
