const { JSONPath } = require('@astronautlabs/jsonpath')

function createJsonSchemaFromPresentationDefinition(pd) {
  const fieldNameToJsonPathMap = {}
  const jsonSchema = {
    "$schema": "http://json-schema.org/draft-07/schema",
    "required": [],
    "additionalProperties": false,
    "type": "object",
    "properties": {}
  }

  
  const [ inputDescriptor ] = pd.input_descriptors
  const { constraints } = inputDescriptor

  for (let field of constraints.fields) {
    jsonSchema.properties[field.name] = field.filter

    if (!field.optional) {
      jsonSchema.required.push(field.name)
    }
    
    fieldNameToJsonPathMap[field.name] = field.path[0]
  }

  return { jsonSchema, fieldNameToJsonPathMap }
}

function createVc(data, fieldNameToJsonPathMap) {
  const vc = {
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
    ],
    'id'                : 'in-yo-face-cred',
    'type'              : ['VerifiableCredential', 'KycCredential'],
    'issuer'            : 'TODO',
    'issuanceDate'      : new Date().toISOString(),
    'credentialSubject': {
      'id': 'TODO'
    }
  }
  for (let property in data) {
    const path = fieldNameToJsonPathMap[property]
    const value = data[property]
    
    JSONPath.value(vc.credentialSubject, path, value)
  }

  return vc
}

const pd = {
  'id'                : '2eddf25f-f79f-4105-ac81-544c988f6d78',
  'name'              : 'Core Personal Identity Claims',
  'purpose'           : 'Claims for PFI to evaluate Alice',
  'input_descriptors' : [
    {
      'id'          : '707585e4-3d74-49e7-b21e-a8e1cbf8e31b',
      'purpose'     : 'Claims for PFI to evaluate Alice',
      'constraints' : {
        'subject_is_issuer': true,
        'fields': [
          {
            'path': ['$.credentialSubject.givenName'],
            'name': 'First Name',
            'filter': {
              'type': 'string'
            }
          },
          {
            'path': ['$.credentialSubject.middleName'],
            'name': 'Middle Name',
            'optional': true,
            'filter': {
              'type': 'string'
            }
          },
          {
            'path': ['$.credentialSubject.familyName'],
            'name': 'Last Name',
            'filter': {
              'type': 'string'
            }
          },
          {
            'path': ['$.credentialSubject.birthDate'],
            'name': 'DOB',
            'filter': {
              'type': 'string',
              format: 'date'
            }
          },
          {
            'path': ['$.credentialSubject.address.streetAddress'],
            'name': 'Street Address',
            'filter': {
              'type': 'string',
            }
          },
          {
            'path': ['$.credentialSubject.address.locality'],
            'name': 'City',
            'filter': {
              'type': 'string',
            }
          },
          {
            'path': ['$.credentialSubject.address.region'],
            'name': 'State',
            'filter': {
              'type': 'string'
            }
          },
          {
            'path': ['$.credentialSubject.address.postalCode'],
            'name': 'Zip Code',
            'filter': {
              'type': 'string'
            }
          },
          {
            'path': ['$.credentialSubject.address.region'],
            'name': 'Country',
            'filter': {
              'type' : 'string'
            }
          }
        ]
      }
    }
  ]
}

console.log('\n------------- PRESENTATION DEFINITION -------------\n')
console.log(JSON.stringify(pd, null, 2));


const { jsonSchema, fieldNameToJsonPathMap } = createJsonSchemaFromPresentationDefinition(pd)

console.log('\n------------- JSON SCHEMA -------------\n');
console.log(JSON.stringify(jsonSchema, null, 2));

console.log('\n------------- FIELD NAME -> JSON PATH MAP -------------\n');
console.log(JSON.stringify(fieldNameToJsonPathMap, null, 2));

const formDataExample = {
  'First Name': 'Ephraim',
  'Middle Name': 'Bartholomew',
  'Last Name': 'Winthrop',
  'DOB': '03/28/1988',
  'Street Address': '2326 Hieronymous Boschart Boulevard',
  'City': 'Consequences',
  'State': 'New Mexico',
  'Zip Code': '78724'
}

console.log('\n------------- FORM DATA EXAMPLE -------------\n');
console.log(JSON.stringify(formDataExample, null, 2));

const vc = createVc(formDataExample, fieldNameToJsonPathMap)

console.log('\n------------- VC -------------\n');
console.log(JSON.stringify(vc, null, 2));