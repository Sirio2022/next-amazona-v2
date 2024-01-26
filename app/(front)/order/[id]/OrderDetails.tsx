'use client';
import { OrderItem } from "@/lib/models/OrderModel";
import { formatoMoneda } from "@/lib/utils";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useSession } from "next-auth/react"
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import useSWR, { mutate } from "swr"


export default function OrderDetails({
    orderId,
    paypalClientId,
}: {
    orderId: string
    paypalClientId: string
}) {

    const { data: session } = useSession()

    async function createPaypalOrder() {
        const res = await fetch(`/api/orders/${orderId}/create-paypal-order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const order = await res.json();
        return order.id;

    }

    async function onAppovePayPalOrder(data: any) {
        const res = await fetch(`/api/orders/${orderId}/capture-paypal-order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .then((orderData) => {
                toast.success('Order is paid successfully')
                mutate(`/api/orders/${orderId}`, orderData)
            })
    }

    const { data, error } = useSWR(
        `/api/orders/${orderId}`,
        async (url) => {
            const res = await fetch(url)

            const data = await res.json()

            return data
        },
    )
    if (error) return <div>{error.message}</div>
    if (!data) return 'Loading...'

    const {
        paymentMethod,
        shippingAddress,
        items,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        iseDelivered,
        deliveredAt,
        isPaid,
        paidAt,
    } = data


    return (
        <div>
            <h1 className="text-2xl py-4">
                Order {orderId}
            </h1>

            <div className="grid md:grid-cols-4 md:gap-5 my-4">
                <div className="md:col-span-3">
                    <div className="card bg-base-300">
                        <div className="card-body">
                            <h2 className="card-title">
                                Shipping Address
                            </h2>
                            <p>
                                {shippingAddress.fullName}
                            </p>
                            <p>
                                {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
                            </p>
                            {iseDelivered ? (
                                <div className="text-success">
                                    Delivered at {deliveredAt}
                                </div>
                            ) : (
                                <div className="text-error">
                                    Not Delivered
                                </div>

                            )}

                        </div>

                    </div> {/* end card */}

                    <div className="card bg-base-300 mt-4">
                        <div className="card-body">
                            <h2 className="card-title">
                                Payment Method
                            </h2>
                            <p>
                                {paymentMethod}
                            </p>
                            {isPaid ? (
                                <div className="text-success">
                                    Paid at {paidAt}
                                </div>
                            ) : (
                                <div className="text-error">
                                    Not Paid
                                </div>

                            )}

                        </div>
                    </div> {/* end card */}

                    <div className="card bg-base-300 mt-4">
                        <div className="card-body">
                            <h2 className="card-title">Items</h2>

                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Item</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item: OrderItem) => (
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
                                                        {item.name} ({item.color} {item.size})
                                                    </span>
                                                </Link>
                                            </td>
                                            <td>
                                                {item.quantity}
                                            </td>
                                            <td>
                                                {formatoMoneda(item.price)}
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                        </div>

                    </div>
                </div>

                <div>
                    <div className="card bg-base-300 my-4 md:my-0 lg:my-0">
                        <div className="card-body">
                            <h2 className="card-title">
                                Order Summary
                            </h2>

                            <ul>
                                <li>
                                    <div className="mb-2 flex justify-between">
                                        <div>Items</div>
                                        <div>{formatoMoneda(itemsPrice)}</div>
                                    </div>
                                </li>

                                <li>
                                    <div className="mb-2 flex justify-between">
                                        <div>
                                            Tax
                                        </div>

                                        <div>{formatoMoneda(taxPrice)}</div>

                                    </div>
                                </li>

                                <li>
                                    <div className="mb-2 flex justify-between">
                                        <div>Shipping</div>
                                        <div>{formatoMoneda(shippingPrice)}</div>
                                    </div>
                                </li>

                                <li>
                                    <div className="mb-2 flex justify-between">
                                        <div>Total</div>
                                        <div>{formatoMoneda(totalPrice)}</div>
                                    </div>
                                </li>
                                {!isPaid && paymentMethod === 'PayPal' && (
                                    <li>
                                        <PayPalScriptProvider
                                            options={{
                                                clientId: paypalClientId,
                                            }}
                                        >
                                            <PayPalButtons
                                                createOrder={createPaypalOrder}
                                                onApprove={onAppovePayPalOrder}
                                            />
                                        </PayPalScriptProvider>
                                    </li>
                                )}
                            </ul>

                        </div>

                    </div>
                </div>

            </div>
        </div>
    )
}
