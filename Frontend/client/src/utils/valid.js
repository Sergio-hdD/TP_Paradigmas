export const validRegister = (name, email, password, cf_password) => {

    if (!name || !email || !password || !cf_password) {
        return 'Please add all fields.'
    }

    if (!validateEmail(email)) {
        return 'Invalid email.'
    }

    if (password.length < 6) {
        return 'Password must be at least 6 characters.'
    }

    if (password !== cf_password) {
        return 'Confirm password did not match.'
    }

}

export const validLogin = (email, password) => {

    if (!email || !password) {
        return 'Please add all fields.'
    }

    if (!validateEmail(email)) {
        return 'Invalid email.'
    }

}

export const validBook = (title, description, price, inStock) => {
    
    if (!title || !description || !price || !inStock) {
        return 'Please add all fields.'
    }

    if (price <= 0)  return 'The price must be greater than 0.'

    if(inStock <= 0 ) return 'The stock must be greater than 0'

}

export const validCheckoutAdress = (firstName, lastName, address, city, province, postalCode) => {
    
    if (!firstName || !lastName || !address || !city || !province || !postalCode) {
        return 'Please add all fields.'
    }

}

function validateEmail(email) {
    const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return reg.test(email);
}

