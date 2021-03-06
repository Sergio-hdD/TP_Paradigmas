export const ACTIONS = {
    NOTIFY: 'NOTIFY',
    AUTH: 'AUTH',
    ADD_BOOKS: 'ADD_BOOKS',
    ADD_CATEGORIES: 'ADD_CATEGORIES',
    ADD_CART: 'ADD_CART',
    ADD_MODAL: 'ADD_MODAL',
    ADD_ORDERS: 'ADD_ORDERS',
    ADD_GRID: 'ADD_GRID',
}

export const addToCart = (book, cart) => {
    if (book.inStock === 0)
        return ({ type: 'NOTIFY', payload: { error: 'This book is out of stock.', show: true } })

    const check = cart.every(item => {
        return book.id !== item.id
    })

    if (!check)
        return ({ type: 'NOTIFY', payload: { error: 'This book has been added to cart.', show: true} })

    return ({ type: 'ADD_CART', payload: [...cart, { ...book, quantity: 1 }] })

}

export const deleteItem = (data, id, type) => {
    const newData = data.filter(item => item.id !== id)

    return ({ type: type, payload: newData })
}

export const updateItem = (data, id, post, type) => {
    const newData = data.map(item => (item.id === id ? post : item))

    return ({ type, payload: newData })
}