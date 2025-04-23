import Categories from "@/components/home/Categories"
import Products from "@/components/categories/Products"
import { ContactPage } from "@/components/contact"
import Slider from "@/components/home/Slider"
import { H1, H2 } from "@/components/ui"
import Subscribe from "@/components/ui/Subscribe"
import { Design, ICategory, IProduct } from "@/interfaces"
import Image from 'next/image'
import Link from "next/link"
import Cate from '@/components/categories/Categories'
import Prod from '@/components/home/Products'

async function fetchCategory (category: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${category}`, { cache: 'no-cache' })
  return res.json()
}

async function fetchCategories () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, { cache: 'no-cache' })
  return res.json()
}

async function fetchProductsCategory (category: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products-category/${category}`, { cache: 'no-cache' })
  return res.json()
}

async function fetchDesign () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/design`, { cache: 'no-cache' })
  return res.json()
}

export default async function CategoryPage({ params }: { params: { category: string } }) {

  const category: ICategory = await fetchCategory(params.category)

  const categories: ICategory[] = await fetchCategories()

  const productsCategory: IProduct[] = await fetchProductsCategory(category.category)

  const design: Design = await fetchDesign()

  return (
    <div className="flex flex-col gap-6">
      {
        design.categoryPage.map(page => (
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
                      if (productsCategory.length) {
                        return <Products key={content.content} products={ productsCategory } />
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
                              <H1 config="text-center">{category.category}</H1>
                              <p className="text-center">{category.description}</p>
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
                      if (productsCategory.length) {
                        return <Prod key={content.content} products={productsCategory} title={content.info.title!} filter={content.info.products!} categories={categories} />
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