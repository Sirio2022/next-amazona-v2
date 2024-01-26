import AddToCart from "@/components/products/AddToCart"
import { convertDocToObj, formatoMoneda } from "@/lib/utils"
import productService from "@/lib/services/productService"
import Image from "next/image"
import Link from "next/link"


export async function generateMetadata({
    params
}: {
    params: {
        slug: string
    }
}) {
    const product = await productService.getBySlug(params.slug)

    if (!product) {
        return {
            title: 'Product not found'
        }
    }

    return {
        title: product.name,
        description: product.description
    }
}

export default async function ProductDetails({ params }: { params: { slug: string } }) {


    const product = await productService.getBySlug(params.slug)

    if (!product) {
        return <div>Product not found</div>
    }

    return (
        <>
            <div className="my-2">
                <Link href="/">
                    Go Back
                </Link>
            </div>

            <div className="grid md:grid-cols-4 md:gap-4">
                <div className="md:col-span-2">
                    <Image src={product.image} alt={product.name} width={640} height={640} sizes="100vw" style={{ width: '100%', height: 'auto' }} />
                </div>

                <div>
                    <ul className="space-y-4">
                        <li>
                            <h1 className="text-2xl font-bold">{product.name}</h1>
                        </li>
                        <li>
                            {product.rating} of {product.numReviews} reviews
                        </li>
                        <li>
                            {product.brand}
                        </li>
                        <li>
                            <div className="divider"></div>
                        </li>
                        <li>
                            Description: <p>
                                {product.description}
                            </p>
                        </li>
                        <li>
                            <h2 className="text-lg font-bold">${product.price}</h2>
                        </li>
                        <li>
                            <p>{product.description}</p>
                        </li>

                    </ul>
                </div>

                <div>
                    <div className="card bg-base-300 shadow-xl mt-3 mb-3 md:mt-0">
                        <div className="card-body">
                            <div className="mb-2 flex justify-between">
                                <div>
                                    Price
                                </div>
                                <div>
                                    {formatoMoneda(product.price)}
                                </div>

                            </div>

                            <div className="mb-2 flex justify-between">
                                <div>
                                    Status
                                </div>
                                <div>
                                    {product.countInStock > 0 ? 'In Stock' : 'Unavailable'}
                                </div>

                            </div>

                            {
                                product.countInStock !== 0 && (
                                    <div className="card-actions justify-center">

                                        <AddToCart item={{
                                            ...convertDocToObj(product),
                                            quantity: 0,
                                            color: '',
                                            size: ''
                                        }} />
                                    </div>
                                )
                            }
                        </div>
                    </div>


                </div>
            </div>
        </>
    )
}
