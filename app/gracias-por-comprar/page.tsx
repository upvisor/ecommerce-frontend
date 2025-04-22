"use client"
import { IOrder, IShop } from '@/interfaces'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

declare const fbq: Function

const PageBuySuccess = () => {

  const [viewData, setViewData] = useState(false)
  const [storeData, setStoreData] = useState<IShop>({})

  const updateClient = async () => {
    if (localStorage.getItem('sell')) {
      const sell: IOrder = JSON.parse(localStorage.getItem('sell')!)
      if (sell.pay.method === 'Webpay') {
        // fbq('track', 'Purchase', {contents: sell.cart, currency: "CLP", value: })
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/client/${sell.email}`, { tags: ['cliente'] })
        localStorage.setItem('sell', '')
      } else if (sell.pay.method === 'Transferencia') {
        setViewData(true)
        localStorage.setItem('sell', '')
      }
    }
  }

  useEffect(() => {
    updateClient()
  }, [])

  const getStoreData = async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/shop-data`)
    setStoreData(res.data)
  }

  useEffect(() => {
    getStoreData()
  }, [])

  return (
    <div className='flex px-2 my-auto'>
      <div className='w-full max-w-[1280px] m-auto py-20 flex flex-col gap-4'>
        <h1 className='text-4xl font-medium text-center'>Tu compra se ha realizado correctamente</h1>
        <p className='text-lg text-center'>Recibiras un correo con el detalle de tu pedido</p>
        {
          viewData
            ? (
              <div className='p-6 rounded-lg border shadow-md m-auto w-full max-w-[450px] flex flex-col gap-4'>
                <h2 className='text-xl font-medium text-center'>Datos para la transferencia</h2>
                <div className='flex flex-col gap-2'>
                  <div className='flex gap-2 justify-between'>
                    <p className='font-medium'>Banco:</p>
                    <p>{ storeData.bank?.bank }</p>
                  </div>
                  <div className='flex gap-2 justify-between'>
                    <p className='font-medium'>Nombre:</p>
                    <p>{ storeData.bank?.name }</p>
                  </div>
                  <div className='flex gap-2 justify-between'>
                    <p className='font-medium'>Cuenta:</p>
                    <p>{ storeData.bank?.account }</p>
                  </div>
                  <div className='flex gap-2 justify-between'>
                    <p className='font-medium'>Numero de cuenta:</p>
                    <p>{ storeData.bank?.accountNumber }</p>
                  </div>
                  <div className='flex gap-2 justify-between'>
                    <p className='font-medium'>Rut:</p>
                    <p>{ storeData.bank?.rut }</p>
                  </div>
                  <div className='flex gap-2 justify-between'>
                    <p className='font-medium'>Email:</p>
                    <p>{ storeData.bank?.email }</p>
                  </div>
                </div>
                <p className='text-sm text-neutral-700'>*Debes enviar el comprobante de la transferencia al email indicado o al WhatsApp {storeData.phone} con tu nombre y el numero de pedido</p>
              </div>
            )
            : ''
        }
      </div>
    </div>
  )
}

export default PageBuySuccess