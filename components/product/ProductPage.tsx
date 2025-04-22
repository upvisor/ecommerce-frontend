"use client"
import { City, IOrder, IProduct, IShipping, Region } from '@/interfaces'
import React, { useEffect, useState } from 'react'
import "swiper/css"
import "swiper/css/pagination"
import styles from './ProductSlider.module.css'
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"
import Image from 'next/image'
import { NumberFormat } from '@/utils'
import axios from 'axios'
import { Input, Spinner2 } from '../ui'
import { useRouter } from 'next/navigation'

interface Props {
  product: IProduct
}

export const ProductPage: React.FC<Props> = ({ product }) => {

  const [order, setOrder] = useState<IOrder>({ product: '', quantity: '', pack: [{ quantity: '', image: '', price: '', variations: [] }], date: undefined, firstName: '', lastName: '', email: '', phone: '', address: '', city: '', region: '', shipping: { method: '', price: '', state: '' }, pay: { method: '', state: '' } })
  const [regions, setRegions] = useState<Region[]>([])
  const [citys, setCitys] = useState<City[]>([])
  const [shipping, setShipping] = useState<IShipping[]>([])
  const [generalStock, setGeneralStock] = useState<string>('')
  const [variationStock, setVariationStock] = useState<{ variation: String, date: Date; stock: string; }[]>([])
  const [token, setToken] = useState('')
  const [url, setUrl] = useState('')
  const [link, setLink] = useState('')
  const [submitLoading, setSubmitLoading] = useState(false)

  const router = useRouter()

  const requestRegions = async () => {
    const request = await axios.get('https://testservices.wschilexpress.com/georeference/api/v1.0/regions', {
      headers: {
        'Cache-Control': 'no-cache',
        'Ocp-Apim-Subscription-Key': process.env.NEXT_PUBLIC_CHILEXPRESS_COBERTURA
      }
    })
    setRegions(request.data.regions)
  }

  useEffect(() => {
    requestRegions()
  }, [])

  const setStock = () => {
    if (order.date) {
      const selectedStock = product.stock.find(stock => {
        const stockDate = new Date(stock.date)
        return stockDate.toISOString().split('T')[0] === new Date(order.date!).toISOString().split('T')[0]
      })
      if (selectedStock) {
        setGeneralStock(selectedStock.stock);
      }
      let variationStock: { variation: String, date: Date; stock: string; }[] = []
      product.variations!.map(variation => {
        const arrayStock = variation.stock.find(stk => {
          const variationStockDate = new Date(stk.date)
          return variationStockDate.toISOString().split('T')[0] === new Date(order.date!).toISOString().split('T')[0];
        })
        if (arrayStock) {
          variationStock.push({ ...arrayStock, variation: variation.name })
        }
      })
      setVariationStock(variationStock)
    }
  }

  useEffect(() => {
    setStock()
  }, [order.date, product]);

  const regionChange = async (e: any) => {
    const region = regions?.find(region => region.regionName === e.target.value)
    const request = await axios.get(`https://testservices.wschilexpress.com/georeference/api/v1.0/coverage-areas?RegionCode=${region?.regionId}&type=0`, {
      headers: {
        'Cache-Control': 'no-cache',
        'Ocp-Apim-Subscription-Key': process.env.NEXT_PUBLIC_CHILEXPRESS_COBERTURA
      }
    })
    setCitys(request.data.coverageAreas)
    setOrder({ ...order, region: e.target.value })
  }

  const cityChange = async (e: any) => {
    const city = citys?.find(city => city.countyName === e.target.value)
    const request = await axios.post('https://testservices.wschilexpress.com/rating/api/v1.0/rates/courier', {
      "originCountyCode": "QNOR",
      "destinationCountyCode": city?.countyCode,
      "package": {
          "weight": "1",
          "height": "10",
          "width": "10",
          "length": "2"
      },
      "productType": 3,
      "contentType": 1,
      "declaredWorth": "2333",
      "deliveryTime": 0
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Ocp-Apim-Subscription-Key': process.env.NEXT_PUBLIC_CHILEXPRESS_COTIZADOR
      }
    })
    setShipping(request.data.data.courierServiceOptions)
    setOrder({ ...order, city: e.target.value })
  }

  const transbankSubmit = async () => {
    if (!submitLoading) {
      setSubmitLoading(true)
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/sell`, order)
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/client`, { firstName: order.firstName, lastName: order.lastName, email: order.email, phone: order.phone, address: order.address, details: order.detail, city: order.city, region: order.region })
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/product-stock/${product._id}`, { pack: order.pack, date: order.date, stock: 'less' })
      localStorage.setItem('sell', JSON.stringify(res.data))
      const form = document.getElementById('formTransbank') as HTMLFormElement
      if (form) {
        form.submit()
      }
    }
  }

  const mercadoSubmit = async () => {
    if (!submitLoading) {
      setSubmitLoading(true)
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/sell`, order)
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/client`, { firstName: order.firstName, lastName: order.lastName, email: order.email, phone: order.phone, address: order.address, details: order.detail, city: order.city, region: order.region })
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/product-stock/${product._id}`, { pack: order.pack, date: order.date, stock: 'less' })
      localStorage.setItem('sell', JSON.stringify(res.data))
      window.location.href = link
    }
  }

  return (
    <div className='flex bg-logo/30 p-0 sm:py-4' style={{ minHeight: 'calc(100vh - 138px)' }}>
      <div className='flex max-w-[1280px] p-4 w-full m-auto flex-col sm:flex-row sm:gap-6'>
        <div className='w-full sm:w-1/2'>
          <div className='sticky top-10'>
            <Swiper
              className={`${styles.mySwiper} rounded-3xl`}
              pagination={{
                clickable: true,
              }}
              modules={[Pagination, Navigation]}
            >
              {
                product.images?.map(image => {
                  return (
                    <SwiperSlide key={ image.public_id } className='rounded-3xl'>
                      <Image src={image.url} alt='Imagen producto' width={650} height={650} className='mb-8 rounded-3xl' />
                    </SwiperSlide>
                  )
                })
              }
            </Swiper>
          </div>
        </div>
        <div className='flex flex-col gap-6 w-full sm:w-1/2'>
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-2'>
              <h1 className='text-2xl font-semibold'>{ product.name }</h1>
              <p>{product.description}</p>
              <p>Stock: {generalStock}</p>
            </div>
            <div className='flex flex-col gap-2'>
              <p className='font-medium text-lg'>¿Cuando quieres recibir tus NY Cookies?</p>
              <div className='flex gap-2'>
                {
                  product.stock.map(stock => (
                    <button onClick={(e: any) => {
                      e.preventDefault()
                      const oldPack = [...order.pack]
                      oldPack.push({ image: '', price: '', quantity: '', variations: [] })
                      setOrder({ ...order, date: stock.date, pack: oldPack })
                    }} className={`border border-main w-16 h-16 rounded-full transition-colors duration-150 ${order.date === stock.date ? 'bg-main text-white' : 'bg-transparent text-main'} hover:bg-main hover:text-white`}>
                      <p className='m-auto'>{new Date(stock.date).getDate()}</p>
                      <p className='m-auto'> {new Date(stock.date).getMonth() === 0 ? 'ENE' : new Date(stock.date).getMonth() === 1 ? 'FEB' : new Date(stock.date).getMonth() === 2 ? 'MAR' : new Date(stock.date).getMonth() === 3 ? 'ABR' : new Date(stock.date).getMonth() === 4 ? 'MAY' : new Date(stock.date).getMonth() === 5 ? 'JUN' : new Date(stock.date).getMonth() === 6 ? 'JUL' : new Date(stock.date).getMonth() === 7 ? 'AGO' : new Date(stock.date).getMonth() === 8 ? 'SEP' : new Date(stock.date).getMonth() === 9 ? 'OCT' : new Date(stock.date).getMonth() === 10 ? 'NOV' : new Date(stock.date).getMonth() === 11 ? 'DIC' : ''}</p>
                    </button>
                  ))
                }
              </div>
              <p className='text-sm'>*En caso de compra desde regiones esta sera la fecha de despacho</p>
            </div>
            {
              product.packs?.length
                ? (
                  <div className='flex flex-col gap-2'>
                    <p className='font-medium text-lg'>¿Cuantas unidades o packs de Cookies quieres?</p>
                    <div className='flex gap-2'>
                      {
                        product.packs.map(pack => (
                          <div className='flex flex-col gap-1 max-w-[120px]'>
                            <button onClick={(e: any) => {
                              e.preventDefault()
                              const oldPack = [...order.pack]
                              oldPack.push({ image: pack.image!.url, quantity: pack.quantity, price: pack.price, variations: [] })
                              setOrder({ ...order, pack: oldPack })
                            }} className={`border-4 rounded-xl w-fit overflow-hidden transition-colors duration-150 hover:border-main`}>
                              <Image src={pack.image!.url} alt={`Imagen pack de ${pack.quantity} del producto ${product.name}`} width={100} height={100} />
                            </button>
                            <p className='text-sm mx-auto'>{pack.quantity} {Number(pack.quantity) === 1 ? 'unidad' : 'unidades'}</p>
                            <p className='text-sm mx-auto text-center'>${NumberFormat(Number(pack.price))}</p>
                            {
                              Number(pack.quantity) !== 1
                                ? <p className='bg-main py-1 px-2 text-sm text-white'>Ahorra ${NumberFormat(((Number(product.packs!.find(pack => Number(pack.quantity) === 1)!.price) * Number(pack.quantity)) - Number(pack.price)))}</p>
                                : ''
                            }
                          </div>
                        ))
                      }
                    </div>
                  </div>
                )
                : ''
            }
            {
              order.pack.length
                ? (() => {
                  // Contadores separados para 'Selecciona tu Cookie' y 'Arma tu pack'
                  let cookieCounter = 1;
                  let packCounter = 1;
          
                  return order.pack.map((pk, i) => {
                    if (pk.quantity !== '') {
                      // Determinar el texto dependiendo de la cantidad
                      const text =
                        Number(pk.quantity) > 1
                          ? `Arma tu pack ${packCounter++}`  // Incrementar packCounter después de usarlo
                          : `Selecciona tu Cookie ${cookieCounter++}`;  // Incrementar cookieCounter después de usarlo
          
                      return (
                        <>
                          <div className='flex gap-4'>
                            <p className='font-medium text-lg'>{text}</p>
                            <button onClick={(e: any) => {
                              e.preventDefault()
                              const oldPack = [...order.pack]
                              const newPack = oldPack.filter((pack, ind) => ind !== i)
                              setOrder({ ...order, pack: newPack })
                              setGeneralStock((Number(generalStock) + pk.variations.length).toString())
                              if (pk.variations.length) {
                                // Crea una copia del array de variaciones para evitar mutaciones directas
                                const updatedVariationStock = [...variationStock];
                              
                                // Itera sobre cada variación en el pack que se está eliminando
                                pk.variations.forEach((variation) => {
                                  // Encuentra el índice de la variación en el array de stock de variaciones
                                  const variationIndex = updatedVariationStock.findIndex(
                                    (stock) => stock.variation === variation.name
                                  );
                              
                                  // Si se encuentra la variación, ajusta el stock sumando uno
                                  if (variationIndex !== -1) {
                                    updatedVariationStock[variationIndex].stock = (
                                      Number(updatedVariationStock[variationIndex].stock) + 1
                                    ).toString();
                                  }
                                });
                              
                                // Actualiza el estado de `variationStock` con el nuevo array
                                setVariationStock(updatedVariationStock);
                              }
                            }}>
                              <svg
                                className='m-auto'
                                style={{ display: 'block' }}
                                width='15'
                                height='15'
                                viewBox='0 0 12 15'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                              >
                                <path
                                  d='M1.70817 13C1.70817 13.8708 2.12917 14.25 3 14.25H10C10.8708 14.25 11.2082 13.8708 11.2082 13V3.16667H1.70817V13ZM3 4.5H10V8.5V13H3V8.5V4.5ZM9.229 0.791667L8.43734 0H4.479L3.68734 0.791667H0.916504V2H11.9998V0.791667H9.229Z'
                                  fill='currentColor'
                                ></path>
                              </svg>
                            </button>
                          </div>
                          <div className='flex gap-2 flex-wrap'>
                            {product.variations?.map((variation, index) => (
                              <div key={index} className='flex flex-col gap-1 w-full max-w-[100px]'>
                                <button
                                  onClick={(e: any) => {
                                    e.preventDefault();
                                    const oldPack = [...order.pack];

                                    if (Number(product.packs!.find(pack => Number(pack.quantity) === Number(pk.quantity))!.quantity) > Number(pk.variations.length)) {
                                      // Lógica cuando hay más de una variación
                                      oldPack[i].variations.push({ name: variation.name, image: variation.image!.url });
                                      setOrder({ ...order, product: product.name, pack: oldPack });
                                      setGeneralStock((Number(generalStock) - 1).toString());

                                      if (variationStock.length) {
                                        const vari = [...variationStock];
                                        vari[index].stock = (Number(vari[index].stock) - 1).toString();
                                        setVariationStock(vari);
                                      }
                                    } else if (Number(pk.quantity) === 1) {
                                      // Lógica cuando hay exactamente una variación
                                      const findIndex = variationStock.findIndex(varia => varia.variation === oldPack[i].variations[0].name);
                                      oldPack[i].variations[0] = { name: variation.name, image: variation.image!.url };
                                      setOrder({ ...order, product: product.name, pack: oldPack });

                                      if (variationStock.length) {
                                        const vari = [...variationStock];
                                        // Restaurar stock de la variación anterior
                                        if (findIndex !== -1) {
                                          vari[findIndex].stock = (Number(vari[findIndex].stock) + 1).toString();
                                        }
                                        // Reducir stock de la nueva variación
                                        vari[index].stock = (Number(vari[index].stock) - 1).toString();
                                        setVariationStock(vari);
                                      }
                                    }
                                  }}
                                  className={`border-4 w-fit rounded-xl ${
                                    Number(pk.quantity) === 1 && pk.variations.length && variation.name === pk.variations[0].name
                                      ? 'border-main'
                                      : ''
                                  } overflow-hidden transition-colors duration-150 hover:border-main`}
                                >
                                  <Image
                                    src={variation.image!.url}
                                    alt={`Imagen variación ${variation.name} del producto ${product.name}`}
                                    width={100}
                                    height={100}
                                  />
                                </button>
                                <p className='text-sm m-auto text-center'>{variation.name}</p>
                                <p className='text-sm m-auto text-center'>
                                  Stock: {variationStock.find(stock => stock.variation === variation.name)?.stock}
                                </p>
                              </div>
                            ))}
                          </div>
                          {
                            Number(pk.quantity) > 1
                              ? pk.variations.length
                                ? (
                                  (
                                    <div className='p-4 bg-logo rounded-lg w-full max-w-[348px] flex gap-2 flex-wrap justify-around'>
                                      {pk.variations.map((variation, index) => (
                                        <div className='flex flex-col gap-1'>
                                          <Image
                                            src={variation.image}
                                            alt={`Imagen variación para pack ${variation.name}`}
                                            width={100}
                                            height={100}
                                          />
                                          <p className='text-sm m-auto'>{variation.name}</p>
                                          <button
                                            onClick={(e: any) => {
                                              e.preventDefault();
                                              const oldPk = [...order.pack];
                                              
                                              // Utiliza el resultado del filtro para actualizar oldPk[i].variations
                                              oldPk[i].variations = oldPk[i].variations.filter((vari, ind) => ind !== index);
                                              
                                              setOrder({ ...order, pack: oldPk });
                                              setGeneralStock((Number(generalStock) + 1).toString());
                                          
                                              if (variationStock.length) {
                                                const vari = [...variationStock];
                                                const variIndex = vari.findIndex(
                                                  (varia) => varia.variation === variation.name
                                                );
                                                const stock = Number(vari[variIndex].stock);
                                                vari[variIndex].stock = (Number(stock) + 1).toString();
                                                setVariationStock(vari);
                                              }
                                            }}
                                          >
                                            <svg
                                              className='m-auto'
                                              style={{ display: 'block' }}
                                              width='12'
                                              height='15'
                                              viewBox='0 0 12 15'
                                              fill='none'
                                              xmlns='http://www.w3.org/2000/svg'
                                            >
                                              <path
                                                d='M1.70817 13C1.70817 13.8708 2.12917 14.25 3 14.25H10C10.8708 14.25 11.2082 13.8708 11.2082 13V3.16667H1.70817V13ZM3 4.5H10V8.5V13H3V8.5V4.5ZM9.229 0.791667L8.43734 0H4.479L3.68734 0.791667H0.916504V2H11.9998V0.791667H9.229Z'
                                                fill='currentColor'
                                              ></path>
                                            </svg>
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  )
                                )
                                : ''
                              : ''
                          }
                        </>
                      );
                    }
                  });
                })()
                : ''
            }
          </div>
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-2'>
              <p className='font-medium text-lg'>Envío:</p>
              <p>Región:</p>
              {
                regions.length
                  ? (
                    <select onChange={regionChange} className='w-80 p-1.5 border rounded-md'>
                      <option>Seleccionar Región</option>
                      {
                        regions.map(region => (
                          <option value={region.regionName}>{region.regionName.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</option>
                        ))
                      }
                    </select>
                  )
                  : ''
              }
              {
                citys.length
                  ? (
                    <>
                      <p>Ciudad:</p>
                      <select onChange={cityChange} className='w-80 p-1.5 border rounded-md'>
                        <option>Seleccionar ciudad</option>
                        {
                          citys.map(city => (
                            <option value={city.countyName}>{city.coverageName.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</option>
                          ))
                        }
                      </select>
                    </>
                  )
                  : ''
              }
            </div>
            {
              shipping.length
                ? (
                  <div className='flex flex-col gap-2'>
                    <div className='flex flex-col gap-2'>
                      <p>Opciones de envíos:</p>
                      <div className='flex flex-col border border-[#c2c2c2] bg-white rounded-md'>
                        {
                          shipping.map((ship, index) => (
                            <div onClick={() => setOrder({ ...order, shipping: { method: ship.serviceDescription, price: ship.serviceValue, state: 'No empaquetado' } })} className={`${index < shipping.length - 1 ? 'border-b border-[#c2c2c2]' : ''} w-full p-4 cursor-pointer flex justify-between`}>
                              <div className='flex gap-2'>
                                <input type='radio' value={ship.serviceDescription} checked={order.shipping.method === ship.serviceDescription} onChange={(e: any) => setOrder({ ...order, shipping: { method: ship.serviceDescription, price: ship.serviceValue, state: 'No empaquetado' } })} />
                                <p>{ship.serviceDescription.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</p>
                              </div>
                              <p>${NumberFormat(Number(ship.serviceValue))}</p>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  </div>
                )
                : ''
            }
          </div>
          <div className='flex flex-col gap-2'>
            <p className='font-medium text-lg'>Información:</p>
            {
              order.shipping.method !== ''
                ? (
                  <>
                    <div className='flex gap-2 flex-col sm:flex-row'>
                      <div className='flex flex-col gap-2 w-full'>
                        <p>Nombre</p>
                        <Input type='text' placeholder='Nombre' change={(e: any) => setOrder({ ...order, firstName: e.target.value })} value={order.firstName} />
                      </div>
                      <div className='flex flex-col gap-2 w-full'>
                        <p>Apellido</p>
                        <Input type='text' placeholder='Apellido' change={(e: any) => setOrder({ ...order, lastName: e.target.value })} value={order.lastName} />
                      </div>
                    </div>
                    <div className='flex flex-col gap-2 w-full'>
                      <p>Email</p>
                      <Input type='text' placeholder='Email' change={(e: any) => setOrder({ ...order, email: e.target.value })} value={order.email} />
                    </div>
                    <div className='flex flex-col gap-2 w-full'>
                      <p>Teléfono</p>
                      <div className='flex gap-2 w-full'>
                        <p className='my-auto'>+56</p>
                        <Input type='text' placeholder='Teléfono' change={(e: any) => setOrder({ ...order, phone: e.target.value })} value={order.phone} config='w-full' />
                      </div>
                    </div>
                    <div className='flex flex-col gap-2 w-full'>
                      <p>Dirección</p>
                      <Input type='text' placeholder='Dirección' change={(e: any) => setOrder({ ...order, address: e.target.value })} value={order.address} />
                    </div>
                    <div className='flex flex-col gap-2 w-full'>
                      <p>Detalle</p>
                      <Input type='text' placeholder='Detalle' change={(e: any) => setOrder({ ...order, detail: e.target.value })} value={order.detail!} />
                    </div>
                  </>
                )
                : <p className='text-sm p-6 bg-black/5 rounded-md'>Completa la información anterior para ingresar tus datos</p>
            }
          </div>
          <div className='flex flex-col gap-2'>
            <p className='font-medium text-lg'>Pago:</p>
            {
              order.shipping.method !== ''
                ? (
                  <div className='flex flex-col border border-[#c2c2c2] bg-white rounded-md'>
                    <div className='flex gap-2 p-4 justify-between border-b border-[#c2c2c2] cursor-pointer' onClick={async (e: any) => {
                      setOrder({ ...order, pay: { method: 'Webpay', state: 'Pago iniciado' } })
                      const pago = {
                        amount: Number(order.shipping.price) + Number(order.pack.reduce((prev, curr) => prev + Number(curr.price), 0)),
                        returnUrl: `${process.env.NEXT_PUBLIC_WEB_URL}/procesando-pago`
                      }
                      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/transbank/create`, pago)
                      setToken(response.data.token)
                      setUrl(response.data.url)
                    }}>
                      <div className='flex gap-2'>
                        <input type='radio' value='Webpay' name='pay' checked={order.pay.method === 'Webpay'} />
                        <p>WebPay</p>
                      </div>
                    </div>
                    <div className='flex gap-2 p-4 justify-between cursor-pointer' onClick={async () => {
                      setOrder({ ...order, pay: { method: 'Transferencia', state: 'Datos entregados' } })
                    }}>
                      <div className='flex gap-2'>
                        <input type='radio' value='MercadoPago' name='pay' checked={order.pay.method === 'Transferencia'} />
                        <p>Transferencia bancaria</p>
                      </div>
                    </div>
                  </div>
                )
                : <p className='text-sm p-6 bg-black/5 rounded-md'>Completa la información anterior para ingresar  el metodo de pago</p>
            }
          </div>
          {
            order.pay.method === ''
              ? <button type='button' onClick={(e: any) => e.preventDefault()} className='h-12 font-medium w-full rounded-md bg-main/50 text-white cursor-not-allowed'>{submitLoading ? <Spinner2 /> : 'Pagar'}</button>
              : order.pay.method === 'Webpay'
                ? (
                  <form action={url} method="POST" id='formTransbank' className='max-h-[48px]'>
                    <input type="hidden" name="token_ws" value={token} />
                    <button type='button' onClick={transbankSubmit} className={`${submitLoading ? 'cursor-not-allowed' : 'hover:bg-transparent hover:text-main'} h-12 font-medium w-full rounded-md bg-main transition-all duration-200 border border-main text-white`}>{submitLoading ? <Spinner2 /> : 'Pagar'}</button>
                  </form>
                )
                : order.pay.method === 'MercadoPago'
                  ? link !== ''
                    ? <button type='button' onClick={mercadoSubmit} className={`${submitLoading ? 'cursor-not-allowed' : 'hover:bg-transparent hover:text-main'} h-12 font-medium w-full rounded-md bg-main transition-all duration-200 border border-main text-white`}>{submitLoading ? <Spinner2 /> : 'Pagar'}</button>
                    : <button type='button' onClick={(e: any) => e.preventDefault()} className='h-12 font-medium w-full rounded-md bg-main/50 text-white cursor-not-allowed'>{submitLoading ? <Spinner2 /> : 'Pagar'}</button>
                  : order.pay.method === 'Transferencia'
                    ? <button type='button' onClick={async (e: any) => {
                      e.preventDefault()
                      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/sell`, order)
                      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/client`, { firstName: order.firstName, lastName: order.lastName, email: order.email, phone: order.phone, address: order.address, details: order.detail, city: order.city, region: order.region })
                      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/product-stock/${product._id}`, { pack: order.pack, date: order.date, stock: 'less' })
                      localStorage.setItem('sell', JSON.stringify(res.data))
                      router.push('/gracias-por-comprar')
                    }} className={`${submitLoading ? 'cursor-not-allowed' : 'hover:bg-transparent hover:text-main'} h-12 font-medium w-full rounded-md bg-main transition-all duration-200 border border-main text-white`}>{submitLoading ? <Spinner2 /> : 'Pagar'}</button>
                    : <button type='button' onClick={(e: any) => e.preventDefault()} className='h-12 font-medium w-full rounded-md bg-main/50 text-white cursor-not-allowed'>{submitLoading ? <Spinner2 /> : 'Pagar'}</button>
          }
        </div>
      </div>
    </div>
  )
}
