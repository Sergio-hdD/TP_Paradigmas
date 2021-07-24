import { createContext, useEffect, useReducer } from 'react'
import reducers from './Reducers'
import { getData, postData } from '../utils/fetchData'

export const DataContext = createContext()

export const DataProvider = ({ children }) => {

    const initialState = { notify: { show: false }, auth: {}, modal: [{ show: false }], books: [], categories: [], cart: [], orders: [], grid: true }

    const [state, dispatch] = useReducer(reducers, initialState)

    const { cart } = state

    useEffect(() => {

        const token = localStorage.getItem('jwt');

        if (token) {

            postData('users/auth', token).then(res => {

                if (res.msg) return localStorage.removeItem('jwt')

                dispatch({
                    type: "AUTH",
                    payload: {
                        token: token,
                        user: res.user
                    }
                })

                getData('orders')
                    .then(res => {
                        if (res.msg) return dispatch({ type: 'NOTIFY', payload: { error: res.msg } })
                        dispatch({ type: 'ADD_ORDERS', payload: res })
                    })

            })
        } else {
            dispatch({ type: 'ADD_ORDERS', payload: [] })
        }

        getData('categories').then(res => {
            if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })

            dispatch({
                type: "ADD_CATEGORIES",
                payload: res
            })

        })

    }, [])


    useEffect(() => {
        const __books__cart01 = JSON.parse(localStorage.getItem('__books__cart01'))

        if (__books__cart01) dispatch({ type: 'ADD_CART', payload: __books__cart01 })
    }, [])

    useEffect(() => {
        localStorage.setItem('__books__cart01', JSON.stringify(cart))
    }, [cart])


    useEffect(() => {

        getData('books').then(res => {
            dispatch({
                type: "ADD_BOOKS",
                payload: res
            })
        })

    }, [])

    return (
        <DataContext.Provider value={{ state, dispatch }}>
            {children}
        </DataContext.Provider>
    )

}