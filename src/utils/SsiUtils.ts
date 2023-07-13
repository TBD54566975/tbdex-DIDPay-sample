import { JSONPath } from '@astronautlabs/jsonpath'

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
    
    JSONPath.value(vc.credentialSubject, path, value)
  }
}