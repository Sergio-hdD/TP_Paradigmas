import { createContext, useEffect, useReducer } from 'react'
import reducers from './Reducers'
import { getData } from '../utils/fetchData'

export const DataContext = createContext()

export const DataProvider = ({ children }) => {

    const initialState = { notify: { show: false }, auth: {}, modal: [{ show: false }], books: [], cart: [] }

    const [state, dispatch] = useReducer(reducers, initialState)

    const { cart } = state

    useEffect(() => {
        const __books__cart01 = JSON.parse(localStorage.getItem('__books__cart01'))

        if (__books__cart01) dispatch({ type: 'ADD_CART', payload: __books__cart01 })
    }, [])

    useEffect(() => {
        localStorage.setItem('__books__cart01', JSON.stringify(cart))
    }, [cart])


    /*
    useEffect(() => {

        const getToken = async () => {
            
            const token = localStorage.getItem('tokenStore');

            if (token) {

                const verified = await axios.get('/users/verify', {
                    headers: {
                        Authorization: token
                    }
                })

                if (verified) {
                    dispatch({
                        type: "AUTH",
                        payload: {
                            user: {
                                username: verified.data.user.username,
                                token
                            }
                        }
                    })
                } else {
                    localStorage.clear()
                }
            }
        }

        getToken()

    }, [])

    */

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