import PageProduct from "@/components/products/PageProduct"
import { Design, ICategory, IProduct } from "@/interfaces"
import type { Metadata } from 'next'
import Slider from "@/components/home/Slider"
import Categories from "@/components/home/Categories"
import Link from "next/link"
import Products from "@/components/categories/Products"
import { ContactPage } from "@/components/contact"
import Subscribe from "@/components/ui/Subscribe"
import Image from 'next/image'
import Cate from '@/components/categories/Categories'
import Prod from '@/components/home/Products'
import { H1, H2 } from "@/components/ui"

export const revalidate = 60

async function fetchProduct (product: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${product}`, { cache: 'no-cache' })
  return res.json()
}

async function fetchDesign () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/design`, { cache: 'no-cache' })
  return res.json()
}

async function fetchProducts () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, { cache: 'no-cache' })
  return res.json()
}

async function fetchCategories () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, { cache: 'no-cache' })
  return res.json()
}
 
export async function generateMetadata({
  params
}: {
  params: { product: string }
}): Promise<Metadata> {

  const id = params.product
  const product: IProduct = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, { next: { revalidate: 3600 } }).then((res) => res.json())
 
  return {
    title: product.titleSeo !== '' ? product.titleSeo : product.name,
    description: product.descriptionSeo !== '' ? product.descriptionSeo : `Esta es la pagina del producto ${product.name}`,
    openGraph: {
      title: product.titleSeo !== '' ? product.titleSeo : product.name,
      description: product.descriptionSeo !== '' ? product.descriptionSeo : `Esta es la pagina del producto ${product.name}`,
      images: [product.images[0].url],
      url: `${process.env.NEXT_PUBLIC_WEB_URL}/tienda/${product.category.slug}/${product.slug}`
    }
  }
}

export default async function ({ params }: { params: { product: string } }) {

  const product: IProduct = await fetchProduct(params.product)

  const design: Design = await fetchDesign()

  const products = await fetchProducts()

  const categories: ICategory[] = await fetchCategories()

  return (
    <div className="flex flex-col gap-6">
      <head>
        <meta property="product:price:amount" content={product.price.toString()} />
        <meta property="product:price:currency" content="clp" />
        <meta property="product:availability" content={product.stock > 0 ? 'in stock' : 'Out of stock'} />
        <meta property="product:retailer_item_id" content={product._id} />
      </head>
      <PageProduct product={product} design={design} products={products} categories={categories} />
      {
        design.productPage.map(page => (
          <>
                {
                  page.design.map(content => {
                    if (content.content === 'Carrusel') {
                      return <Slider key={content.content} info={ content.info } />
                    } else if (content.content === 'Categorias') {
                      if (categories.length) {
                        return <Categories key={content.content} info={ content.info } />
                      }
                    } else if (content.content === 'Bloque 1') {
                      return (
                        <div key={content.content} className="w-full py-12 px-2 flex md:py-24">
                          <div className="w-full flex max-w-[1360px] m-auto gap-8 flex-col text-center md:flex-row md:text-left">
                            <div className="w-full m-auto flex flex-col gap-4 md:w-1/2">
                              <H1>{content.info.title}</H1>
                              <p className={`transition-opacity duration-200 text-sm lg:text-[16px]`}>{content.info.description}</p>
                              <Link href={`${process.env.NEXT_PUBLIC_WEB_URL}${content.info.buttonLink!}`} className='bg-[#f6531a] border border-[#f6531a] w-fit transition-colors duration-200 text-white py-1.5 px-6 hover:bg-transparent rounded-md hover:text-[#f6531a] m-auto md:m-0'>{content.info.button}</Link>
                            </div>
                            <div className="w-full flex md:w-1/2">
                              {
                                content.info?.image?.url && content.info.image.url !== ''
                                  ? <Image className='h-fit m-auto' width={480} height={300} alt='Imagen slider prueba' src={content.info.image.url} />
                                  : ''
                              }
                            </div>
                          </div>
                        </div>
                      )
                    } else if (content.content === 'Bloque 2') {
                      return (
                        <div key={content.content} className="w-full flex py-12 px-2 md:py-24">
                          <div className="w-full flex max-w-[1360px] gap-8 m-auto flex-col text-center md:flex-row md:text-left">
                            <div className="w-full hidden md:w-1/2 md:flex">
                              {
                                content.info?.image?.url && content.info.image.url !== ''
                                  ? <Image className='h-fit m-auto' width={480} height={300} alt='Imagen slider prueba' src={content.info.image.url} />
                                  : ''
                              }
                            </div>
                            <div className="w-full m-auto flex flex-col gap-4 md:w-1/2">
                              <H1>{content.info.title}</H1>
                              <p className={`transition-opacity duration-200 text-sm lg:text-[16px]`}>{content.info.description}</p>
                              <Link href={`${process.env.NEXT_PUBLIC_WEB_URL}${content.info.buttonLink!}`} className='bg-[#f6531a] border border-[#f6531a] w-fit transition-colors duration-200 text-white py-1.5 px-6 hover:bg-transparent rounded-md hover:text-[#f6531a] m-auto md:m-0'>{content.info.button}</Link>
                            </div>
                            <div className="w-full flex md:w-1/2 md:hidden">
                              {
                                content.info?.image?.url && content.info.image.url !== ''
                                  ? <Image className='h-fit m-auto' width={480} height={300} alt='Imagen slider prueba' src={content.info.image.url} />
                                  : ''
                              }
                            </div>
                          </div>
                        </div>
                      )
                    } else if (content.content === 'Bloque 3') {
                      return (
                        <div key={content.content} className="w-full flex py-12 px-2 md:py-24">
                          <div className="text-center m-auto max-w-[1360px] w-full flex flex-col gap-8">
                            <div className='flex gap-4 flex-col'>
                              <H1>{content.info.title}</H1>
                              <p className={`transition-opacity duration-200 text-sm lg:text-[16px]`}>{content.info.description}</p>
                              <Link href={`${process.env.NEXT_PUBLIC_WEB_URL}${content.info.buttonLink!}`} className='bg-[#f6531a] border border-[#f6531a] w-fit m-auto transition-colors duration-200 text-white py-1.5 px-6 hover:bg-transparent rounded-md hover:text-[#f6531a]'>{content.info.button}</Link>
                            </div>
                            {
                              content.info?.image?.url && content.info.image.url !== ''
                                ? <Image className='h-fit mx-auto' width={480} height={300} alt='Imagen slider prueba' src={content.info.image.url} />
                                : ''
                            }
                          </div>
                        </div>
                      )
                    } else if (content.content === 'Bloque 4') {
                      return (
                        <div key={content.content} className="w-full flex py-12 px-2 md:py-24">
                          <div className="w-full text-center max-w-[1360px] m-auto flex flex-col gap-4">
                            <H1>{content.info.title}</H1>
                              <div className="flex gap-4 flex-col md:flex-row">
                                <div className="w-full flex flex-col gap-2 md:w-1/3">
                                  <H2>{content.info.subTitle}</H2>
                                  <p className='text-sm lg:text-[16px]'>{content.info.description}</p>
                                  <Link href={`${process.env.NEXT_PUBLIC_WEB_URL}${content.info.buttonLink!}`} className='bg-[#f6531a] border border-[#f6531a] w-fit m-auto transition-colors duration-200 text-white py-1.5 px-6 hover:bg-transparent rounded-md hover:text-[#f6531a]'>{content.info.button}</Link>
                                </div>
                                <div className="w-full flex flex-col gap-2 md:w-1/3">
                                  <H2>{content.info.subTitle2}</H2>
                                  <p className='text-sm lg:text-[16px]'>{content.info.description2}</p>
                                  <Link href={`${process.env.NEXT_PUBLIC_WEB_URL}${content.info.buttonLink2!}`} className='bg-[#f6531a] border border-[#f6531a] w-fit m-auto transition-colors duration-200 text-white py-1.5 px-6 hover:bg-transparent rounded-md hover:text-[#f6531a]'>{content.info.button2}</Link>
                                </div>
                                <div className="w-full flex flex-col gap-2 md:w-1/3">
                                  <H2>{content.info.subTitle3}</H2>
                                  <p className='text-sm lg:text-[16px]'>{content.info.description3}</p>
                                  <Link href={`${process.env.NEXT_PUBLIC_WEB_URL}${content.info.buttonLink3!}`} className='bg-[#f6531a] border border-[#f6531a] w-fit m-auto transition-colors duration-200 text-white py-1.5 px-6 hover:bg-transparent rounded-md hover:text-[#f6531a]'>{content.info.button3}</Link>
                                </div>
                              </div>
                              {
                                content.info?.image?.url && content.info.image.url !== ''
                                  ? <Image className='h-fit mx-auto mt-4' width={480} height={300} alt='Imagen slider prueba' src={content.info.image.url} />
                                  : ''
                              }
                          </div>
                        </div>
                      )
                    } else if (content.content === 'Bloque 5') {
                      return (
                        <div key={content.content} className="w-full flex py-12 px-2 md:py-24">
                          <div className="w-full text-center max-w-[1360px] m-auto flex flex-col gap-4">
                            <H1>{content.info.title}</H1>
                              <div className="flex gap-4 flex-col md:flex-row">
                                <div className="w-full flex flex-col gap-2 md:w-1/2">
                                  <H2>{content.info.subTitle}</H2>
                                  <p className='text-sm lg:text-[16px]'>{content.info.description}</p>
                                  <Link href={`${process.env.NEXT_PUBLIC_WEB_URL}${content.info.buttonLink!}`} className='bg-[#f6531a] border border-[#f6531a] w-fit m-auto transition-colors duration-200 text-white py-1.5 px-6 hover:bg-transparent rounded-md hover:text-[#f6531a]'>{content.info.button}</Link>
                                </div>
                                <div className="w-full flex flex-col gap-2 md:w-1/2">
                                  <H2>{content.info.subTitle2}</H2>
                                  <p className='text-sm lg:text-[16px]'>{content.info.description2}</p>
                                  <Link href={`${process.env.NEXT_PUBLIC_WEB_URL}${content.info.buttonLink2!}`} className='bg-[#f6531a] border border-[#f6531a] w-fit m-auto transition-colors duration-200 text-white py-1.5 px-6 hover:bg-transparent rounded-md hover:text-[#f6531a]'>{content.info.button}</Link>
                                </div>
                              </div>
                              {
                                content.info?.image?.url && content.info.image.url !== ''
                                  ? <Image className='h-fit mx-auto mt-4' width={480} height={300} alt='Imagen slider prueba' src={content.info.image.url} />
                                  : ''
                              }
                          </div>
                        </div>
                      )
                    } else if (content.content === 'Productos') {
                      if (products.length) {
                        return <Products key={content.content} products={ products } />
                      }
                    } else if (content.content === 'Contacto') {
                      return <ContactPage key={content.content} info={ content.info } />
                    } else if (content.content === 'Suscripción') {
                      return <Subscribe key={content.content} info={ content.info } />
                    } else if (content.content === 'Bloque 6') {
                      return (
                        <div key={content.content} className="w-full flex">
                          <div className={`${content.info.image?.url ? 'h-64 xl:h-80 2xl:h-96 text-white' : 'pt-10 pb-2'} w-full max-w-[1360px] m-auto flex flex-col gap-2`}>
                            <div className="m-auto flex flex-col gap-2">
                              <H1 config="text-center">{content.info.title}</H1>
                              <p className="text-center">{content.info.description}</p>
                            </div>
                          </div>
                          {
                            content.info.image?.url
                              ? <Image className={`absolute -z-10 w-full object-cover h-64 xl:h-80 2xl:h-96`} src={content.info.image?.url} alt='Banner categoria' width={1920} height={1080} />
                              : ''
                          }
                        </div>
                      )
                    } else if (content.content === 'Categorias 2') {
                      return <Cate key={content.content} categories={categories} />
                    } else if (content.content === 'Carrusel productos') {
                      if (products.length) {
                        return <Prod key={content.content} products={products} title={content.info.title!} filter={content.info.products!} categories={categories} product={product} />
                      }
                    }
                  })
                }
              </>
          )
        )
      }
    </div>
    
  )
}