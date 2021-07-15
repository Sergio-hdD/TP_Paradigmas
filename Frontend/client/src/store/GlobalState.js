import { createContext, useEffect, useReducer } from 'react'
import reducers from './Reducers'
import { getData, postData } from '../utils/fetchData'

export const DataContext = createContext()

export const DataProvider = ({ children }) => {

    const initialState = { notify: { show: false }, auth: {}, modal: [{ show: false }], books: [], cart: [] }

    const [state, dispatch] = useReducer(reducers, initialState)

    const { cart } = state


    useEffect(() => {

        const token = localStorage.getItem('token');

        console.log(token)

        if (token) {

            getData('users', token).then(res => {
                if (res.error) return localStorage.removeItem('firstLogin')

                console.log( "asdfsdfsdf    " + res)
    
                dispatch({
                    type: "AUTH",
                    payload: {
                        token: res.access_token,
                        user: res.user
                    }
                })
    
            })
        }

    })

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