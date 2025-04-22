import { ProductPage } from "@/components/product"
import { IProduct } from "@/interfaces"

async function fetchProduct (slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/${slug}`, { cache: 'no-cache' })
  return res.json()
}

export default async function Product ({ params }: { params: { slug: string } }) {

  const product: IProduct = await fetchProduct(params.slug)

  return (
    <ProductPage product={product} />
  )
}