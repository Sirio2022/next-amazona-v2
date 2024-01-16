'use client'

import useCartService from "@/lib/hooks/useCartStore"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function CartDetails() {
    const router = useRouter()

    const { items, itemsPrice, decrease, increase } = useCartService()

    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return <></>

    return (
        <>

            <h1 className="py-4 text-2xl">
                Shopping Cart

                {
                    items.length === 0 ? (
                        <div className="py-4">
                            Cart is empty.{' '}
                            <Link className="link" href="/">
                                Go shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-4 md:gap-5">
                            <div className="overflow-x-auto md:col-span-3">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Quantity</th>
                                            <th>Price</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            items.map((item) => (
                                                <tr key={item.slug}>
                                                    <td>
                                                        <Link
                                                            href={`/product/${item.slug}`}
                                                            className="flex items-center space-x-2"
                                                        >
                                                            <Image src={item.image} alt={item.name} width={50} height={50} />
                                                            <span className="px-2">{item.name} </span>

                                                        </Link>

                                                    </td>

                                                    <td>
                                                        <button className="btn" type="button" onClick={() => decrease(item)}>
                                                            -
                                                        </button>
                                                        <span className="px-2">{item.quantity}</span>
                                                        <button className="btn" type="button" onClick={() => increase(item)}>
                                                            +
                                                        </button>
                                                    </td>
                                                    <td>
                                                        ${item.price}
                                                    </td>

                                                </tr>
                                            ))
                                        }
                                    </tbody>

                                </table>
                            </div>

                            <div>
                                <div className="card bg-base-300">
                                    <div className="card-body">
                                        <ul>
                                            <li>
                                                <div className="pb-3 text-xl">
                                                    Subtotal ({items.reduce((a, c) => a + c.quantity, 0)} items) : ${itemsPrice}
                                                </div>
                                            </li>
                                            <li>
                                                <button className="btn btn-primary w-full" onClick={() => router.push('/shipping')}>
                                                    Proceed to Checkout
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </h1>
        </>
    )
}