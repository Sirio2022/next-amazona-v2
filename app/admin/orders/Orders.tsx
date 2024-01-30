'use client'

import { Order } from '@/lib/models/OrderModel'
import { formatearFecha } from '@/lib/utils'
import Link from 'next/link'
import useSWR from 'swr'

export default function Orders() {
    const { data: orders, error } = useSWR('/api/admin/orders', async (url) => {
        const res = await fetch(url)
        return res.json()
    })

    if (error) return error.message
    if (!orders) return 'Loading...'

    return (
        <div>
            <h1 className='py-4 text-2xl'>
                Orders
            </h1>
            <div className='overflow-x-auto'>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>USER</th>
                            <th>DATE</th>
                            <th>TOTAL</th>
                            <th>PAID</th>
                            <th>DELIVERED</th>
                            <th>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order: Order) => (
                            <tr key={order._id}>
                                <td>..{order._id.substring(20, 24)}</td>
                                <td>{order.user?.name || 'Deleted user'}</td>
                                <td>{formatearFecha(order.createdAt)}</td>
                                <td>${order.totalPrice}</td>
                                <td>{order.isPaid ? formatearFecha(order.paidAt) : 'Not paid'}</td>
                                <td>{order.isDelivered ? formatearFecha(order.deliveredAt) : 'Not delivered'}</td>
                                <td>
                                    <Link href={`/order/${order._id}`} passHref>
                                        Details
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}