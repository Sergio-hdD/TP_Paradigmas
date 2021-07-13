import { useContext } from 'react'
import { DataContext } from '../store/GlobalState'
import SnackbarCustom from './SnackbarCustom'

const Notify = () => {

    const { state, dispatch } = useContext(DataContext)
    const { notify } = state

    return (
        <>
            {notify.error &&
                <SnackbarCustom
                    msg={{ msg: notify.error, title: "Error" }}
                    handleShow={() => dispatch({ type: 'NOTIFY', payload: {} })}
                    bgColor='error'
                />
            }
            {notify.success &&
                <SnackbarCustom
                    msg={{ msg: notify.success, title: "Success" }}
                    handleShow={() => dispatch({ type: 'NOTIFY', payload: {} })}
                    bgColor='success'
                />
            }
        </>
    )
}

export default Notify