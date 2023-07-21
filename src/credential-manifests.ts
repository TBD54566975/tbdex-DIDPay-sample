export const KycCredential = {
  'id': 'idk',
  'spec_version': 'https://identity.foundation/credential-manifest/spec/v1.0.0/',
  'issuer': {
    'id': 'self-issued',
    'name': 'Self-Issued',
    'styles': {
      'background': {
        'color': '#101010'
      },
      'text': {
        'color': '#a6aebd'
      }
    }
  },
  'output_descriptors': [
    {
      'id': 'KycCredential',
      'schema': 'TODO: Fill out',
      'styles': {
        'background': {
          'color': '#101010'
        },
        'text': {
          'color': '#a6aebd'
        }
      },
      'display': {
        'title': {
          'path': [
            '$.credentialSubject.givenName',
            '$.vc.credentialSubject.givenName'
          ],
          'schema': {
            'type': 'string'
          }
        },
        'subtitle': {
          'path': [
            '$.credentialSubject.familyName',
            '$.vc.credentialSubject.familyName'
          ],
          'schema': {
            'type': 'string'
          }
        },
        'description': {
          'path': [
            '$.credentialSubject.description',
            '$.vc.credentialSubject.description'
          ],
          'schema': {
            'type': 'string'
          }
        },
        'properties': [
          {
            'path': [
              '$.credentialSubject.address.region',
              '$.vc.credentialSubject.region'
            ],
            'schema': {
              'type': 'string'
            },
            'label': 'Region'
          },
          {
            'path': [
              '$.credentialSubject.address.postalCode',
              '$.vc.credentialSubject.postalCode'
            ],
            'schema': {
              'type': 'string'
            },
            'label': 'Postal Code'
          },
          {
            'path': [
              '$.credentialSubject.address.country',
              '$.vc.credentialSubject.country'
            ],
            'schema': {
              'type': 'string'
            },
            'label': 'Country'
          }
        ]
      }
    }
  ]
}
