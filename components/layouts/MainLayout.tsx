import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { IShop } from '@/interfaces'

async function fetchStoreData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop-data`)
  return res.json()
}

export default async function MainLayout ({ children }: Readonly<{ children: React.ReactNode }>) {

  const storeData: IShop = await fetchStoreData()

  return (
    <div className='min-h-screen flex flex-col'>
      <div className='w-full bg-cover flex py-4 bg-center' style={{ backgroundImage: 'url("https://res.cloudinary.com/drcgtlzvn/image/upload/v1723512352/452146986_2447580435439880_5157844810239744909_n_1_nmtjwa.jpg")' }}>
        {
          storeData.logo && storeData.logo.url !== ''
            ? <Image src={storeData.logo.url} alt={`Logo ${storeData.name ? storeData.name?.toLocaleUpperCase() : 'Tienda'}`} width={500} height={300} className='m-auto w-[220px]' />
            : <p>{ storeData.name ? storeData.name?.toLocaleUpperCase() : 'TIENDA' }</p>
        }
      </div>
      { children }
      <div className='flex bg-[#222222] mt-auto'>
        <div className='py-6 px-4 m-auto flex flex-wrap gap-4'>
          <Link href='/politica-de-reembolso' className='text-sm text-white'>Política de reembolso</Link>
          <Link href='/politica-de-envio' className='text-sm text-white'>Política de envío</Link>
          <Link href='/politica-de-privacidad' className='text-sm text-white'>Política de privacidad</Link>
          <Link href='/terminos-del-servicio' className='text-sm text-white'>Terminos del servicio</Link>
        </div>
      </div>
    </div>
  )
}
