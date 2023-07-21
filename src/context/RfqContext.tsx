import React, { useState } from 'react'
import { PaymentMethod } from '@tbd54566975/tbdex'

export const RfqContext = React.createContext({ 
  offering: undefined,
  baseAmount: undefined,
  setBaseAmount: undefined,
  quoteAmount: undefined, 
  setQuoteAmount: undefined, 
  selectedPayinMethod: undefined,
  setSelectedPayinMethod: undefined, 
  payinDetails: undefined,
  setPayinDetails: undefined,
  selectedPayoutMethod: undefined,
  setSelectedPayoutMethod: undefined,
  payoutDetails: undefined,
  setPayoutDetails: undefined,
  vcs: undefined,
  setVcs: undefined,
  kycProof: undefined,
  setKycProof: undefined
})

export const RfqProvider = ({ children, offering }) => {
  const [baseAmount, setBaseAmount] = useState('')
  const [quoteAmount, setQuoteAmount] = useState('')

  const [selectedPayinMethod, setSelectedPayinMethod] = useState<PaymentMethod>(offering.payinMethods[0])
  const [payinDetails, setPayinDetails] = useState({})
  
  const [selectedPayoutMethod, setSelectedPayoutMethod] = useState<PaymentMethod>(offering.payoutMethods[0])
  const [payoutDetails, setPayoutDetails] = useState({})

  const [vcs, setVcs] = useState([])
  const [kycProof, setKycProof] = useState(undefined)

  return (
    <RfqContext.Provider
      value={{
        offering,
        baseAmount,
        setBaseAmount,
        quoteAmount,
        setQuoteAmount,
        selectedPayinMethod,
        setSelectedPayinMethod,
        payinDetails,
        setPayinDetails,
        selectedPayoutMethod,
        setSelectedPayoutMethod,
        payoutDetails,
        setPayoutDetails,
        vcs,
        setVcs,
        kycProof,
        setKycProof
      }}
    >
      {children}
    </RfqContext.Provider>
  )
}
