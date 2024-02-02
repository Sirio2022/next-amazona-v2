import { Product } from '@/lib/models/ProductModel'
import { formatoMoneda } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { Rating } from './Rating'

export default function ProductItem({ product }: { product: Product }) {
    return (
        <div className='card bg-base-300 shadow-xl mb-4'>
            <figure>
                <Link href={`/product/${product.slug}`}>
                    <Image src={product.image} alt={product.name} width={300} height={300} className='object-cover h-64 w-full' />
                </Link>
            </figure>

            <div className='card-body'>

                <Link href={`/product/${product.slug}`}>
                    <h2 className='card-title cursor-pointer font-normal'>{product.name}</h2>
                </Link>

                <Rating value={product.rating} caption={`${product.numReviews} reviews`} />

                <p className='card-text mb-2'>{product.brand}</p>

                <div className='card-actions flex items-center justify-between'>
                    <span className='text-2xl'>
                        {formatoMoneda(product.price)}
                    </span>{' '}
                </div>

            </div>


        </div>
    )
}
