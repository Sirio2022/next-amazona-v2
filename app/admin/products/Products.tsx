'use client';

import { Product } from '@/lib/models/ProductModel';
import { formatId } from '@/lib/utils';
import { Span } from 'next/dist/trace';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import useSWR, { mutate } from 'swr';
import useSWRMutation from 'swr/mutation';

export default function Products() {
    const { data: products, error } = useSWR('/api/admin/products', async (url) => {
        const res = await fetch(url);
        return res.json();
    });

    const router = useRouter();

    const { trigger: deleteProduct } = useSWRMutation(
        `/api/admin/products/`, async (url, { arg }: { arg: { productId: string } }) => {
            const toastId = toast.loading('Deleting product...');
            const res = await fetch(`${url}/${arg.productId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',

                },

            });
            const data = await res.json();
            res.ok ? toast.success('Product deleted successfully!', { id: toastId }) : toast.error(data.message, { id: toastId });
            mutate('/api/admin/products');
        },
    );

    const { trigger: createProduct, isMutating: isCreating } = useSWRMutation(
        `/api/admin/products/`, async (url) => {

            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',

                },

            });
            const data = await res.json();
            res.ok ? toast.success('Product created successfully!') : toast.error(data.message);
            router.push(`/admin/products/${data.product._id}`);
        },
    );



    if (error) return error.message;
    if (!products) return 'Loading...';

    return (
        <div>
            <div className='flex justify-between items-center'>
                <h1 className='py-4 text-2xl'>
                    Products
                </h1>
                <button
                    disabled={isCreating}
                    onClick={() => createProduct()}
                    className='btn btn-primary btn-sm'
                >
                    {isCreating && <span className='loading loading-spinner'></span>}
                    Create
                </button>
            </div>

            <div className='overflow-x-auto'>
                <table className='table table-zebra'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>PRICE</th>
                            <th>CATEGORY</th>
                            <th>COUNT IN STOCK</th>
                            <th>RATING</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>

                    <tbody>
                        {products.map((product: Product) => (
                            <tr key={product._id}>
                                <td>{formatId(product._id!)}</td>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td>{product.category}</td>
                                <td>{product.countInStock}</td>
                                <td>{product.rating}</td>
                                <td>
                                    <Link
                                        href={`/admin/products/${product._id}`}
                                        type='button'
                                        className='btn btn-ghost btn-sm'
                                    >
                                        Edit
                                    </Link>
                                    {' '}
                                    <button
                                        type='button'
                                        onClick={() => deleteProduct({ productId: product._id! })}
                                        className='btn btn-error btn-sm'
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}