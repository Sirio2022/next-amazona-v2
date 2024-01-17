'use client'
import useCartService from "@/lib/hooks/useCartStore"
import Link from "next/link"
import { useEffect, useState } from "react"

const Menu = () => {
    const { items } = useCartService()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <div>
            <ul className="flex items-stretch">
                <li>
                    <Link className="btn btn-ghost rounded-btn" href='/cart'>
                        Cart
                        {
                            mounted && items.length !== 0 && (
                                <div className="badge badge-accent">
                                    {
                                        items.reduce((acc, item) => acc + item.quantity, 0)
                                    }{' '}

                                </div>
                            )
                        }
                    </Link>
                </li>
                <li>
                    <Link className="btn btn-ghost rounded-btn" href='/login'>
                        Login
                    </Link>
                </li>
            </ul>
        </div>
    )
}

export default Menu