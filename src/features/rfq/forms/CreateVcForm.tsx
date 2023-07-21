import React, { useContext, useState, useEffect } from 'react'
import validator from '@rjsf/validator-ajv8'
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import { PEXv2 } from '@sphereon/pex'
import { DisplayVc } from '../../vc/DisplayVc'
import { JsonSchemaForm } from '../../../components/JsonSchemaForm'
import { RfqContext } from '../../../context/RfqContext'
import { useWeb5Context } from '../../../context/Web5Context'
import { getVcs, storeVc } from '../../../utils/web5-utils'
import { createVc, createVp, createJwt, createJsonSchemaFromPresentationDefinition } from '../../../utils/ssi-utils'

const pex = new PEXv2()

type CreateVcFormProps = {
  onNext: () => void;
  onBack: () => void;
}

export function CreateVcForm(props: CreateVcFormProps) {
  const { web5, profile } = useWeb5Context()
  const { offering, setVcs, setKycProof } = useContext(RfqContext)
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
  const [vcFormSchema, setVcFormSchema] = useState<any>(undefined)
  const [fieldNameToJsonPathMap, setFieldNameToJsonPathMap] = useState(undefined)
  const [selectedVcs, setSelectedVcs] = useState(undefined)

  const kycRequirements = offering.kycRequirements

  // TODO: instead, create the vc after review form is submitted
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
          <>
            <div className="border-l-4 border-yellow-300 bg-neutral-950 p-4 mt-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-400">
                    No verifiable credentials found. Create one now 🥰
                  </p>
                </div>
              </div>
            </div>
            <JsonSchemaForm 
              schema={vcFormSchema}
              validator={validator}
              formData={formData}
              onChange={e => { 
                setFormData(e.formData)
              } 
              } />
          </>
        : <DisplayVc vcs={selectedVcs} displayWarning={true} />
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
