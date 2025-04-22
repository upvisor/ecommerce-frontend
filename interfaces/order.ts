export interface IOrder {
    buyOrder?: string
    product: string
    quantity: string
    pack: { quantity: string, image: string, price: string, variations: { name: string, image: string }[] }[]
    date: Date | undefined
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    detail?: string
    city: string
    region: string
    pay: { method: string, state: string }
    shipping: { method: string, price: string, state: string }
}