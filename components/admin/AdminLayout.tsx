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
        <></>
    )
};


export default AdminLayout;
