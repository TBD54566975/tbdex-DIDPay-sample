import type { PresentationDefinitionV2 } from '@tbd54566975/tbdex'
import type { PresentationSubmission } from '@sphereon/pex-models'
import type { IVerifiableCredential } from '@sphereon/ssi-types'
import type { SignatureInput } from '@tbd54566975/dwn-sdk-js'
import type { Profile } from '@tbd54566975/web5-user-agent'

import * as secp256k1 from '@noble/secp256k1'

import { sha256 } from '@noble/hashes/sha256'
import { JSONPath } from '@astronautlabs/jsonpath'
import { Encoder } from '@tbd54566975/dwn-sdk-js'

export function createVc(signerDid, data, fieldNameToJsonPathMap) {
  const vc = {
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
    ],
    'id'                : 'happy-credential',
    'type'              : ['VerifiableCredential'],
    'issuer'            : signerDid,
    'issuanceDate'      : new Date().toISOString(),
    'credentialSubject' : {
      'id': signerDid,
    }
  }

  for (const property in data) {
    const path = fieldNameToJsonPathMap[property]
    const value = data[property]
    
    JSONPath.value(vc, path, value)
  }

  return vc
}

type CreateJwtOpts = {
  payload: any,
  subject?: string
  issuer?: string
  profile: Profile
}

export async function createJwt(opts: CreateJwtOpts) {
  const jwtPayload = {
    iss : opts.issuer,
    sub : opts.subject,
    ...opts.payload,
  }

  const signatureMaterial = getSignatureMaterial(opts.profile)

  const payloadBytes = Encoder.objectToBytes(jwtPayload)
  const payloadBase64url = Encoder.bytesToBase64Url(payloadBytes)

  const headerBytes = Encoder.objectToBytes(signatureMaterial.protectedHeader)
  const headerBase64url = Encoder.bytesToBase64Url(headerBytes)

  const signatureInput = `${headerBase64url}.${payloadBase64url}`
  const signatureInputBytes = Encoder.stringToBytes(signatureInput)


  const hashedSignatureInputBytes = sha256(signatureInputBytes)
  const hashedSignatureInputHex = secp256k1.etc.bytesToHex(hashedSignatureInputBytes)

  const privateKeyBytes = Encoder.base64UrlToBytes(signatureMaterial.privateJwk.d)
  const privateKeyHex = secp256k1.etc.bytesToHex(privateKeyBytes)

  const signature = await secp256k1.signAsync(hashedSignatureInputHex, privateKeyHex)
  const signatureBytes = signature.toCompactRawBytes()
  const signatureBase64url = Encoder.bytesToBase64Url(signatureBytes)

  return `${headerBase64url}.${payloadBase64url}.${signatureBase64url}`
}

export function decodeJwt(jwt) {
  const [encodedHeader, encodedPayload, encodedSignature] = jwt.split('.')

  return {
    header  : Encoder.base64UrlToObject(encodedHeader),
    payload : Encoder.base64UrlToObject(encodedPayload),
    encodedSignature
  }
} 

function getSignatureMaterial(profile: Profile) {
  const { keys } = profile.did
  const [ key ] = keys
  const { privateKeyJwk } = key

  const kidFragment = privateKeyJwk.kid || key.id
  const kid = `${profile.did.id}#${kidFragment}`

  const dwnSignatureInput = {
    privateJwk      : privateKeyJwk,
    protectedHeader : { alg: privateKeyJwk.crv, kid }
  }

  return dwnSignatureInput
}

type CreateVpOpts = {
  signerDid: string
  psub: PresentationSubmission
  vcs: IVerifiableCredential[]
}

export function createVp(opts: CreateVpOpts) {
  return {
    '@context'                : ['https://www.w3.org/2018/credentials/v1'],
    'type'                    : ['VerifiablePresentation'],
    'holder'                  : opts.signerDid,
    'presentation_submission' : opts.psub,
    'verifiableCredential'    : opts.vcs
  }
}

export function createJsonSchemaFromPresentationDefinition(pd: PresentationDefinitionV2) {
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