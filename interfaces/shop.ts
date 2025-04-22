export interface IShop {
    _id?: string
    name?: string
    email?: string
    phone?: string
    logo?: { public_id: string, url: string }
    logoWhite?: { public_id: string, url: string }
    bank?: IBank
}

export interface IBank {
    bank: string
    name: string
    account: string
    accountNumber: string
    rut: string
    email: string
}