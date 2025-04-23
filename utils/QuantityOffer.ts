import { ICartProduct, IQuantityOffer } from "@/interfaces"

export const offer = (product: ICartProduct) => {
    let offerPrice: IQuantityOffer = {descount: 0, quantity: 0}
    if (product.quantityOffers && product.quantity > 1) {
      const filter = product.quantityOffers.filter(offer => offer.quantity <= product.quantity)
      if (filter.length > 1) {
        offerPrice = filter.reduce((prev, current) => (prev.quantity > current.quantity) ? prev : current)
      } else {
        offerPrice = filter[0]
      }
    }
    const finalPrice = offerPrice !== undefined ? Math.round(((product.price * product.quantity) / 100) * (100 - offerPrice.descount)) : product.price * product.quantity
    return finalPrice
}