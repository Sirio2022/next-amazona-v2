import ProductItem from "@/components/products/ProductItem";
import productService from "@/lib/services/productService";
import { convertDocToObj } from "@/lib/utils";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || 'Next.js Ecommerce',
  description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Next.js Ecommerce, Typescript, Tailwind CSS, Daysy UI, Zustand, MongoDB, NextAuth.js',
}


export default async function Home() {

  const featuredProducts = await productService.getFeatured()
  const latestProducts = await productService.getLatest()




  return (
    <>
      <div className="w-full carousel rounded-box mt-4">

        {
          featuredProducts.map((product, index) => (
            <div
              key={product._id}
              id={`slide-${index}`}
              className="carousel-item relative w-full"

            >
              <Link href={`/products/${product.slug}`}>

                <Image
                  className="w-full md:h-96 lg:h-auto object-cover rounded-box "
                  src={product.banner ?? ''}
                  alt={product.name}
                  width={1500}
                  height={400}
                />

              </Link>


              <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                <a href={`#slide-${index === 0 ? featuredProducts.length - 1 : index - 1}`} className="btn btn-circle">
                  &larr;
                </a>
                <a href={`#slide-${index === featuredProducts.length - 1 ? 0 : index + 1}`} className="btn btn-circle">
                  &rarr;
                </a>
              </div>

            </div>
          ))
        }

      </div>




      <h2 className='text-2xl py-2'>
        Latest Products
      </h2>

      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {
          latestProducts.map((product) => <ProductItem product={convertDocToObj(product)} key={product.slug} />)
        }
      </div>
    </>
  )
}
