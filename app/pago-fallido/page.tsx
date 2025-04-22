"use client"
import { IProduct } from '@/interfaces'
import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

export default function PageBuyError () {

  const [linkProduct, setLinkProduct] = useState('')

  const updateStock = async () => {
    const sell = JSON.parse(localStorage.getItem('sell')!)
    const { data }: { data: IProduct } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/product-name/${sell.product}`)
    await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/product-stock/${data._id}`, { pack: sell.pack, date: sell.date, stock: 'add' })
    setLinkProduct(data.slug)
    localStorage.setItem('sell', '')
  }

  useEffect(() => {
    updateStock()
  }, [])

  return (
    <div className='flex px-2 my-auto'>
      <div className='w-full max-w-[1280px] m-auto py-20 flex flex-col gap-4'>
        <h1 className='text-4xl font-medium text-center'>Ha habido un error con el pago</h1>
        <p className='text-lg text-center'>Lamentablemente el pago de tu compra ha fallado, puedes volver a intentarlo haciendo clic en el siguiente boton</p>
        <Link href={`/${linkProduct}`} className='px-6 py-1.5 border m-auto border-main transition-colors duration-200 w-fit rounded-md bg-main flex text-white hover:bg-transparent hover:text-main'><p className='m-auto'>Volver a intentarlo</p></Link>
      </div>
    </div>
  )
}