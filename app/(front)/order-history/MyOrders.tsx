'use client'

import { Order } from "@/lib/models/OrderModel"
import { formatearFecha, formatoMoneda } from "@/lib/utils"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import useSWR from "swr"

export default function MyOrders() {

    const router = useRouter()

    const { data: orders, error } = useSWR('/api/orders/mine', async (url) => {
        const res = await fetch(url)

        const data = await res.json()

        return data
    }
    )

    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return <></>

    if (error) return 'Error loading orders'
    if (!orders) return 'Loading...'

    return (

        <div className="overflow-x-auto">
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Paid</th>
                        <th>Delivered</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        orders.map((order: Order) => (

                            <tr key={orders._id}>
                                <td>
                                    {order._id.substring(20, 24)}
                                </td>
                                <td>
                                    {formatearFecha(order.createdAt)}
                                </td>
                                <td>
                                    {formatoMoneda(order.totalPrice)}
                                </td>
                                <td>
                                    {
                                        order.isPaid && order.paidAt ? `${formatearFecha(order.paidAt)}` : 'Not Paid'
                                    }
                                </td>

                                <td>
                                    {
                                        order.isDelivered && order.deliveredAt ? `${formatearFecha(order.deliveredAt)}` : 'Not Delivered'
                                    }
                                </td>

                                <td>
                                    <Link href={`/order/${order._id}`} passHref>
                                        Details
                                    </Link>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}