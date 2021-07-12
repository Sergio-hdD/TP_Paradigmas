import { createContext, useEffect, useReducer } from 'react'
import reducers from './Reducers'
import { getData } from '../utils/fetchData'

export const DataContext = createContext()

export const DataProvider = ({ children }) => {

    const initialState = { auth: {}, books: [] }

    const [state, dispatch] = useReducer(reducers, initialState)
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