import { auth } from '@/lib/auth';
import Link from 'next/link';

const AdminLayout = async ({
    activeItem = 'dashboard',
    children,
}: {
    activeItem?: string;
    children: React.ReactNode;
}) => {


    const session = await auth();


    if (!session || !session.user.isAdmin) {
        return (
            <div className='relative flex flex-grow p-4'>
                <div>
                    <h1 className='text-2xl'>
                        You are not authorized to view this page.

                    </h1>

                    <p>
                        Administration access is restricted to authorized users only.
                    </p>
                </div>

            </div>
        )
    }

    return (
        <div className='relative flex flex-grow'>
            <div className='w-full grid md:grid-cols-5'>
                <div className='bg-base-200'>
                    <ul className='menu'>
                        <li>
                            <Link
                                href='/admin/dashboard'
                                className={'dashboard' === activeItem ? 'active' : ''}
                            >
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link
                                href='/admin/orders'
                                className={'orders' === activeItem ? 'active' : ''}
                            >
                                Users
                            </Link>
                        </li>
                        <li>
                            <Link
                                href='/admin/products'
                                className={'products' === activeItem ? 'active' : ''}
                            >
                                Products
                            </Link>
                        </li>
                        <li>
                            <Link
                                href='/admin/users'
                                className={'users' === activeItem ? 'active' : ''}
                            >
                                Users
                            </Link>
                        </li>
                    </ul>

                </div>
                <div className='md:col-span-4 px-4'>
                    {children}
                </div>

            </div>
        </div>
    )
};


export default AdminLayout;
