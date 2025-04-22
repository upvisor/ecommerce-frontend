export interface IProduct {
    _id?: string
    state: boolean
    name: string
    description: string
    images: { public_id: string, url: string }[]
    price: string
    beforePrice?: string
    stock: { date: Date, stock: string }[]
    slug: string
    variations?: IVariation[]
    packs?: IPack[]
}

export interface IVariation {
    name: string
    image?: { public_id: string, url: string }
    stock: { date: Date, stock: string }[]
}

export interface IPack {
    quantity: string
    price: string
    image?: { public_id: string, url: string }
}