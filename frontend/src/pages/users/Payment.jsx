import React, { useState } from 'react'
import StripeCheckout from 'react-stripe-checkout'

export default function Payment() {
    const [price, setprice] = useState(2000)
    function tokenHandler(token){
        console.log(token)
    }

    return (
        <div>
     
           <StripeCheckout
            token = {tokenHandler}
            amount = {price *100}
            currency = 'INR'
            stripeKey = 'pk_test_51JMFbSSB989OYEdn4pm6dEloaMJGGFv9K5g8MN5clOzJRZBDarNSHoPcFSvcjXGxeEEBJhD0PpSVmFrKKlTxdTT300hIUzLE0d'
            >


            </StripeCheckout>
        </div>
    )
}
