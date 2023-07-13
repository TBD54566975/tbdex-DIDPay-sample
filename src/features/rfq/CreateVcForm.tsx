import type { PresentationDefinitionV2 } from '@tbd54566975/tbdex'

import React, { useContext } from 'react'
import validator from '@rjsf/validator-ajv8'

import { PEXv2 } from '@sphereon/pex'
import { JSONPath } from '@astronautlabs/jsonpath'
import { useState, useEffect } from 'react'

import { JsonSchemaForm } from '../../components/JsonSchemaForm'
import { getVcs } from '../../utils/Web5Utils'
import { createVc } from '../../utils/SsiUtils'
import { RfqContext } from '../../context/RfqContext'
import { useWeb5Context } from '../../context/Web5Context'


/**
 * TODO:
 * 1. Get all existing VCs (DONE)
 * 2. Eval kycRequirements
 * 3. if no kyc cred present, render form
 * 4. if kyc cred present, render dropdown
 */

const pex = new PEXv2()

type CreateVcFormProps = {
  onNext: (formData: any) => void;
  onBack: (formData: any) => void;
};

export function CreateVcForm(props: CreateVcFormProps) {
  const { web5, profile } = useWeb5Context()

  const [formData, setFormData] = useState<any>({})
  const [vcFormSchema, setVcFormSchema] = useState<any>(undefined)
  const [fieldNameToJsonPathMap, setFieldNameToJsonPathMap] = useState(undefined)

  const { offering, vcs, setVcs } = useContext(RfqContext)
  const kycRequirements = offering.kycRequirements

  const handleNext = () => {
    const vc = createVc(profile.did.id, formData, fieldNameToJsonPathMap)
    console.log('VC', vc)
    // props.onNext(formData)
  }

  const handleBack = (formData: any) => {
    props.onBack(undefined)
  }

  useEffect(() => {
    const init = async () => {
      const vcs = await getVcs(web5)
      setVcs(vcs)
    }
    init()
    
    if (vcs.length > 0) {
      const selectedVcs = pex.selectFrom(kycRequirements, vcs)
    } else {
      const { jsonSchema, fieldNameToJsonPathMap } = createJsonSchemaFromPresentationDefinition(kycRequirements)
      console.log(fieldNameToJsonPathMap, jsonSchema)
      setVcFormSchema(jsonSchema)
      setFieldNameToJsonPathMap(fieldNameToJsonPathMap)
    }
  }, [])

  return (
    <div className="mt-4 mb-8 pl-8 pr-8">
      <div className=" text-black">
        {vcFormSchema ? 
          <JsonSchemaForm 
            schema={vcFormSchema}
            validator={validator}
            formData={formData}
            onChange={e => setFormData(e.formData)}/> :
          <></>
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
    </div>
  )
}

function createJsonSchemaFromPresentationDefinition(pd: PresentationDefinitionV2) {
  const fieldNameToJsonPathMap = {}
  const jsonSchema = {
    '$schema': 'http://json-schema.org/draft-07/schema',
    'required': [],
    'additionalProperties': false,
    'type': 'object',
    'properties': {}
  }

  
  const [ inputDescriptor ] = pd.input_descriptors
  const { constraints } = inputDescriptor

  for (const field of constraints.fields) {
    jsonSchema.properties[field.name] = field.filter

    // if (!field.optional) {
    //   jsonSchema.required.push(field.name)
    // }
    
    fieldNameToJsonPathMap[field.name] = field.path[0]
  }

  return { jsonSchema, fieldNameToJsonPathMap }
}
