import React, { useState, Dispatch, SetStateAction } from 'react'
import { PaymentMethod } from '@tbd54566975/tbdex'


// interface RfqContextValue {
//     quoteCurrencyAmount: string;
//     setQuoteCurrencyAmount: Dispatch<SetStateAction<string>>;
//     // Add other state variables and functions here
//   }

// Create the context
export const RfqContext = React.createContext({ 
  offering: undefined,
  quoteAmount: undefined, 
  setQuoteAmount: undefined, 
  selectedPayinMethod: undefined,
  setSelectedPayinMethod: undefined, 
  selectedPayoutMethod: undefined,
  setSelectedPayoutMethod: undefined,
  selectedPayinKind: undefined,
  setSelectedPayinKind: undefined,
  payinDetails: undefined,
  setPayinDetails: undefined,
  selectedPayoutKind: undefined,
  setSelectedPayoutKind: undefined,
  payoutDetails: undefined,
  setPayoutDetails: undefined,
  vcs: undefined,
  setVcs: undefined
})

// TODO: in progress 
export const RfqProvider = ({ children, offering }) => {

  const [step, setStep] = useState(0)

  const [quoteAmount, setQuoteAmount] = useState('')

  const [selectedPayinMethod, setSelectedPayinMethod] = useState<PaymentMethod>(offering.payinMethods[0])
  const [selectedPayoutMethod, setSelectedPayoutMethod] = useState<PaymentMethod>(offering.payoutMethods[0])
  
  const [selectedPayinKind, setSelectedPayinKind] = useState<string>(offering.payinMethods[0].kind)
  const [payinDetails, setPayinDetails] = useState({})
  
  const [selectedPayoutKind, setSelectedPayoutKind] = useState<string>(offering.payoutMethods[0].kind)
  const [payoutDetails, setPayoutDetails] = useState({})

  const [vcs, setVcs] = useState([])
  
  const [paymentMethod, setPaymentMethod] = useState('')
  const [credentials, setCredentials] = useState({})

  return (
    <RfqContext.Provider
      value={{
        offering,
        quoteAmount,
        setQuoteAmount,
        selectedPayinMethod,
        setSelectedPayinMethod,
        selectedPayoutMethod,
        setSelectedPayoutMethod,
        selectedPayinKind,
        setSelectedPayinKind,
        payinDetails,
        setPayinDetails,
        selectedPayoutKind,
        setSelectedPayoutKind,
        payoutDetails,
        setPayoutDetails,
        vcs,
        setVcs
      }}
    >
      {children}
    </RfqContext.Provider>
  )
}