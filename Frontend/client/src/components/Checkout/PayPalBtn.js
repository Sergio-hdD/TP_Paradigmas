import { useEffect, useRef } from 'react'
import { postData } from '../../utils/fetchData'
import { useHistory } from 'react-router'


const PaypalBtn = ({ total, state, dispatch, mobile, address }) => {

    const refPaypalBtn = useRef()

    const { auth, cart, orders } = state

    const router = useHistory()

    useEffect(() => {
        window.paypal.Buttons({
            createOrder: function (data, actions) {
                // This function sets up the details of the transaction, including the amount and line item details.
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: total
                        }
                    }]
                });
            },
            onApprove: function (data, actions) {
                // This function captures the funds from the transaction.

                return actions.order.capture().then(function (details) {

                    let user = auth.user

                    postData('orders', { address, mobile, cart, total, user, paymentId: details.id }, auth.token)
                    .then(res => {
                        if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err, show: true } })
                        
                        dispatch({ type: 'ADD_CART', payload: [] })
                        dispatch({ type: 'ADD_ORDERS', payload: [...orders, res] })
                        dispatch({ type: 'NOTIFY', payload: { success: 'Order created succesfully.', show: true } })

                        router.push('/profile')

                    })
                    
                    // This function shows a transaction success message to your buyer.
                });
            }
        }).render(refPaypalBtn.current);
        //This function displays Smart Payment Buttons on your web page.
    }, [])

    return (
        <div ref={refPaypalBtn}></div>
    )
}

export default PaypalBtn