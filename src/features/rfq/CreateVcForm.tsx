import React, { useContext } from 'react'
import validator from '@rjsf/validator-ajv8'

import { PEXv2 } from '@sphereon/pex'
import { useState, useEffect } from 'react'

import { JsonSchemaForm } from '../../components/JsonSchemaForm'
import { getVcs, storeVc } from '../../utils/Web5Utils'
import { createVc, createVp, createJwt, createJsonSchemaFromPresentationDefinition } from '../../utils/SsiUtils'
import { RfqContext } from '../../context/RfqContext'
import { useWeb5Context } from '../../context/Web5Context'
import { SelectVcForm } from './SelectVcForm'


/**
 * TODO:
 * 1. Get all existing VCs (DONE)
 * 2. Eval kycRequirements (DONE)
 * 3. if no kyc cred present, render form (DONE)
 * 4. if kyc cred present, render dropdown
 */

const pex = new PEXv2()

type CreateVcFormProps = {
  onNext: () => void;
  onBack: () => void;
};

export function CreateVcForm(props: CreateVcFormProps) {
  const { web5, profile } = useWeb5Context()
  const { offering, vcs, setVcs, setKycProof } = useContext(RfqContext)
  const [initialized, setInitialized] = useState(false)

  const [formData, setFormData] = useState<any>({
    'First Name': 'Ephraim',
    'Middle Name': 'Bartholomew',
    'Last Name': 'Winthrop',
    'DOB': '03/28/1988',
    'Street Address': '2326 Hieronymous Boschart Boulevard',
    'City': 'Consequences',
    'State': 'New Mexico',
    'Zip Code': '78724',
    'Country': 'US'
  })
  const [currentVc, setCurrentVc] = useState<any>(undefined)
  const [vcFormSchema, setVcFormSchema] = useState<any>(undefined)
  const [fieldNameToJsonPathMap, setFieldNameToJsonPathMap] = useState(undefined)
  const [selectedVcs, setSelectedVcs] = useState(undefined)

  const kycRequirements = offering.kycRequirements

  const handleNext = async () => {
    let vcs
    if (vcFormSchema) {
      const vc = createVc(profile.did.id, formData, fieldNameToJsonPathMap)
      const vcJwt = await createJwt({
        profile: profile,
        payload: { vc },
        issuer: profile.did.id,
        subject: profile.did.id
      })
      vcs = [vcJwt]
    } else {
      vcs = selectedVcs
    } 

    const { verifiableCredential: matchedVcs, value: psub, errors } = pex.evaluateCredentials(offering.kycRequirements, vcs)
    if (!psub || errors.length > 0) {
      console.log(psub, errors)
        
      throw new Error('no creds match offering\'s kyc requirements')
    }
  
    const vp = createVp({ signerDid: profile.did.id, psub: psub, vcs: matchedVcs })
    const vpJwt = await createJwt({
      payload: { vp },
      issuer: profile.did.id,
      subject: profile.did.id,
      profile: profile
    })
    
    setKycProof(vpJwt)
    if (vcFormSchema) {
      storeVc(web5, vcs[0])
    } 
    props.onNext()
  }

  const handleBack = () => {
    props.onBack()
  }

  useEffect(() => {
    const init = async () => {
      const vcs = await getVcs(web5)      
      setVcs(vcs)
      return vcs
    }
    
    init().then((vcs) => {
      if (vcs.length === 0) {
        const { jsonSchema, fieldNameToJsonPathMap } = createJsonSchemaFromPresentationDefinition(kycRequirements)
        setVcFormSchema(jsonSchema)
        setFieldNameToJsonPathMap(fieldNameToJsonPathMap)
      } else {
        const { 
          verifiableCredential: matchedVcs,
          value: psub, 
          errors 
        } = pex.evaluateCredentials(offering.kycRequirements, vcs)

        if (!psub || errors.length > 0) {
          console.log(psub, errors)
          const { jsonSchema, fieldNameToJsonPathMap } = createJsonSchemaFromPresentationDefinition(kycRequirements)
          setVcFormSchema(jsonSchema)
          setFieldNameToJsonPathMap(fieldNameToJsonPathMap)
          // throw new Error('no creds match offering\'s kyc requirements')
        } else {
          setSelectedVcs(matchedVcs)
        }
      }
      setInitialized(true)
    })
  }, [])

  if (!initialized) {
    return <></>
  }

  return (
    <>
      <div className=" text-black pl-8 pr-8">
        {vcFormSchema ? 
          <JsonSchemaForm 
            schema={vcFormSchema}
            validator={validator}
            formData={formData}
            onChange={e => { 
              setFormData(e.formData)
            } 
            } /> :
          <SelectVcForm vcs={selectedVcs} setCurrentVc={setCurrentVc} onNext={props.onNext} onBack={props.onBack}/>
        }
      </div>
      <div className="mt-12 pl-8 pr-8 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-white"
          onClick={handleBack}>
          Back
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          onClick={handleNext}>
          Next
        </button>
      </div>
    </>
  )
}
