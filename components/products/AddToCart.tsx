'use client'
import useCartService from "@/lib/hooks/useCartStore"
import { OrderItem } from "@/lib/models/OrderModel"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export default function AddToCart({ item }: { item: OrderItem }) {

    const router = useRouter()

    const { items, increase, decrease } = useCartService()

    const [existItem, setExistItem] = useState<OrderItem | undefined>()

    useEffect(() => {
        setExistItem(items.find((i) => i.slug === item.slug))
    }, [items, item])

    const addToCartHandler = () => {
        increase(item),
        decrease(item)

    }

    return (
        existItem ? (
            <div>
                <button className="btn" type="button" onClick={() => decrease(existItem)}>
                    -
                </button>
                <span className="px-2">{existItem.quantity}</span>
                <button className="btn" type="button" onClick={() => increase(existItem)}>
                    +
                </button>
            </div>
        ) : (
            <button onClick={addToCartHandler} className="btn btn-primary w-full" type="button">
                Add to Cart
            </button>
        )
    )
}