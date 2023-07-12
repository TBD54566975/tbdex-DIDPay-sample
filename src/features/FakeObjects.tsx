import {
  TbDEXMessage,
  MessageTypes,
  Offering,
  Rfq,
  Quote,
  PaymentMethodKind,
  OrderStatus,
  Status,
} from '@tbd54566975/tbdex'
import moment from 'moment'

export function generateUniqueId(): string {
  const timestamp: number = new Date().getTime()
  const randomId: string = Math.random().toString(36).substr(2, 9)
  return `${timestamp}-${randomId}`
}

export function getCurrentTimestamp() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  const milliseconds = String(now.getMilliseconds()).padStart(3, '0')

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`
}

function generateRandomTimestamp(
  minTimestamp: string,
  maxTimestamp: string
): string {
  const minTime = moment(minTimestamp)
  const maxTime = moment(maxTimestamp)
  const duration = maxTime.diff(minTime)
  const randomDuration = Math.random() * duration
  const randomTimestamp = minTime
    .clone()
    .add(randomDuration, 'milliseconds')
    .format('YYYY-MM-DDTHH:mm:ss.SSSSSSZ')

  return randomTimestamp
}

const minTimestamp = '2023-01-01T00:00:00.000Z'
const maxTimestamp = '2023-12-31T23:59:59.999Z'

const kycRequirements = {
  comment: 'Note: VP, OIDC, DIDComm, or CHAPI outer wrapper would be here.',
  presentation_definition: {
    id: '32f54163-7166-48f1-93d8-ff217bdb0653',
    input_descriptors: [
      {
        id: 'wa_driver_license',
        name: 'Washington State Business License',
        purpose:
          'We can only allow licensed Washington State business representatives into the WA Business Conference',
        constraints: {
          fields: [
            {
              path: [
                '$.credentialSubject.dateOfBirth',
                '$.credentialSubject.dob',
                '$.vc.credentialSubject.dateOfBirth',
                '$.vc.credentialSubject.dob',
              ],
            },
          ],
        },
      },
    ],
  },
}

export const fakeOfferings: Offering[] = [
  // {
  //   id: generateUniqueId(),
  //   description: 'TBD',
  //   baseCurrency: 'BTC',
  //   quoteCurrency: 'USD',
  //   unitPrice: '30025.50',
  //   baseFee: '15',
  //   min: '100',
  //   max: '20000',
  //   kycRequirements: JSON.stringify(kycRequirements),
  //   payinMethods: [
  //     {
  //       kind: PaymentMethodKind.DEBIT_CARD,
  //       paymentPresentationRequestJwt: 'string',
  //     },
  //     {
  //       kind: PaymentMethodKind.SQUARE_PAY,
  //       paymentPresentationRequestJwt: 'string',
  //     },
  //   ],
  //   payoutMethods: [
  //     {
  //       kind: PaymentMethodKind.BITCOIN_ADDRESS,
  //       paymentPresentationRequestJwt: 'string',
  //       fee: {
  //         flatFee: '5',
  //       },
  //     },
  //   ],
  //   createdTime: generateRandomTimestamp(minTimestamp, maxTimestamp),
  // },
  // {
  //   id: generateUniqueId(),
  //   description: 'TBD',
  //   baseCurrency: 'BTC',
  //   quoteCurrency: 'MXN',
  //   unitPrice: '514279.77',
  //   baseFee: '235',
  //   min: '1000',
  //   max: '400000',
  //   kycRequirements: JSON.stringify(kycRequirements),
  //   payinMethods: [
  //     {
  //       kind: PaymentMethodKind.DEBIT_CARD,
  //       paymentPresentationRequestJwt: 'string',
  //       fee: {
  //         flatFee: '20',
  //       },
  //     },
  //   ],
  //   payoutMethods: [
  //     {
  //       kind: PaymentMethodKind.BITCOIN_ADDRESS,
  //       paymentPresentationRequestJwt: 'string',
  //       fee: {
  //         flatFee: '10',
  //       },
  //     },
  //   ],
  //   createdTime: generateRandomTimestamp(minTimestamp, maxTimestamp),
  // },
  // {
  //   id: generateUniqueId(),
  //   description: 'TBD',
  //   baseCurrency: 'USD',
  //   quoteCurrency: 'GHA',
  //   unitPrice: '11.3',
  //   baseFee: '2',
  //   min: '10',
  //   max: '950',
  //   kycRequirements: JSON.stringify(kycRequirements),
  //   payinMethods: [
  //     {
  //       kind: PaymentMethodKind.DEBIT_CARD,
  //       paymentPresentationRequestJwt: 'string',
  //     },
  //     {
  //       kind: PaymentMethodKind.SQUARE_PAY,
  //       paymentPresentationRequestJwt: 'string',
  //       fee: {
  //         flatFee: '8',
  //       },
  //     },
  //   ],
  //   payoutMethods: [
  //     {
  //       kind: PaymentMethodKind.BITCOIN_ADDRESS,
  //       paymentPresentationRequestJwt: 'string',
  //       fee: {
  //         flatFee: '45',
  //       },
  //     },
  //   ],
  //   createdTime: generateRandomTimestamp(minTimestamp, maxTimestamp),
  // },
  // {
  //   id: generateUniqueId(),
  //   description: 'TBD',
  //   baseCurrency: 'BTC',
  //   quoteCurrency: 'GHA',
  //   unitPrice: '339288.15',
  //   baseFee: '175',
  //   min: '900',
  //   max: '9000',
  //   kycRequirements: JSON.stringify(kycRequirements),
  //   payinMethods: [
  //     {
  //       kind: PaymentMethodKind.DEBIT_CARD,
  //       paymentPresentationRequestJwt: 'string',
  //       fee: {
  //         flatFee: '30',
  //       },
  //     },
  //   ],
  //   payoutMethods: [
  //     {
  //       kind: PaymentMethodKind.BITCOIN_ADDRESS,
  //       paymentPresentationRequestJwt: 'string',
  //       fee: {
  //         flatFee: '50',
  //       },
  //     },
  //   ],
  //   createdTime: generateRandomTimestamp(minTimestamp, maxTimestamp),
  // },
]

type ThreadData = {
  rfq?: TbDEXMessage<'rfq'>;
  quote?: TbDEXMessage<'quote'>;
  orderStatuses: TbDEXMessage<'orderStatus'>[];
};

export function populateThreadMap(n: number) {
  const threadMap = new Map<string, ThreadData>()

  // for (let i = 0; i < n; i++) {
  //   const threadId = generateUniqueId();
  //   const rfqId = generateUniqueId();
  //   const quoteId = generateUniqueId();

  //   const rfqTimestamp = generateRandomTimestamp(
  //     '2023-06-01T00:00:00.000Z',
  //     '2023-06-10T23:59:59.999Z'
  //   );
  //   const orderStatusTimestamp = generateRandomTimestamp(
  //     '2023-06-11T23:59:59.999Z',
  //     '2023-06-21T23:59:59.999Z'
  //   );
  //   const quoteTimestamp = generateRandomTimestamp(
  //     '2023-06-22T00:00:00.000Z',
  //     '2023-06-30T23:59:59.999Z'
  //   );

  //   const rfq: Rfq = {
  //     baseCurrency: 'BTC',
  //     quoteCurrency: 'USD',
  //     amount: '15000',
  //     kycProof: '',
  //     payinMethod: {
  //       kind: PaymentMethodKind.DEBIT_CARD,
  //       paymentVerifiablePresentationJwt: 'string',
  //     },
  //     payoutMethod: {
  //       kind: PaymentMethodKind.BITCOIN_ADDRESS,
  //       paymentVerifiablePresentationJwt: 'string',
  //     },
  //   };
  //   const rfqMsg: TbDEXMessage<'rfq'> = {
  //     id: rfqId,
  //     threadId: threadId,
  //     parentId: threadId,
  //     from: 'did:ion:myDid',
  //     to: 'did:ion:pfiDid',
  //     type: 'rfq',
  //     body: rfq,
  //     createdTime: rfqTimestamp,
  //   };

  //   const quote: Quote = {
  //     expiryTime: generateRandomTimestamp(
  //       '2023-06-30T00:00:00.000Z',
  //       '2023-07-02T23:59:59.999Z'
  //     ),
  //     totalFee: '15500',
  //     amount: '0.5',
  //     paymentInstructions: {
  //       payin: {
  //         link: 'stripe.com/xyz',
  //         instruction: 'Pay with debit card using link',
  //       },
  //       payout: {
  //         link: 'bitcoinaddress.com/xyz',
  //         instruction: 'Receive payment by entering bitcoin address',
  //       },
  //     },
  //   };
  //   const quoteMsg: TbDEXMessage<'quote'> = {
  //     id: quoteId,
  //     threadId: threadId,
  //     parentId: rfqId,
  //     from: 'did:ion:myDid',
  //     to: 'did:ion:pfiDid',
  //     type: 'quote',
  //     body: quote,
  //     createdTime: quoteTimestamp,
  //   };

  //   let orderStatus: OrderStatus;
  //   if (i % 3 === 0) {
  //     orderStatus = {
  //       orderStatus: Status.COMPLETED,
  //     };
  //   } else if (i % 3 === 1) {
  //     orderStatus = {
  //       orderStatus: Status.FAILED,
  //     };
  //   } else {
  //     orderStatus = {
  //       orderStatus: Status.PENDING,
  //     };
  //   }

  //   const orderStatusMsg: TbDEXMessage<'orderStatus'> = {
  //     id: generateUniqueId(),
  //     threadId: threadId,
  //     parentId: quoteId,
  //     from: 'did:ion:myDid',
  //     to: 'did:ion:pfiDid',
  //     type: 'orderStatus',
  //     body: orderStatus,
  //     createdTime: orderStatusTimestamp,
  //   };

  //   const message = {
  //     rfq: rfqMsg,
  //     quote: quoteMsg,
  //     orderStatuses: [orderStatusMsg],
  //   };

  //   threadMap.set(generateUniqueId(), message);
  // }

  return threadMap
}
