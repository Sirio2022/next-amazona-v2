import Link from 'next/link'


export default function Header() {
    return (
        <header>
            <nav>
                <div className='navbar justify-between bg-base-300'>
                    <Link href='/' className='btn btn-ghost text-lg'>
                        Amazing Ecommerce
                    </Link>

                    <ul className='flex'>
                        <li>
                            <Link href='/cart' className='btn btn-ghost rounded-btn'>
                                Cart
                            </Link>
                        </li>
                        <li>
                            <Link href='/login' className='btn btn-ghost rounded-btn'>
                                Login
                            </Link>
                        </li>
                    </ul>

                </div>
            </nav>
        </header>
    )
}
