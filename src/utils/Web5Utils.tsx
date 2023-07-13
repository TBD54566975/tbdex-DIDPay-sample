import {
  aliceProtocolDefinition,
  createMessage,
  Offering,
  PaymentMethodResponse,
  Rfq,
  TbDEXMessage,
} from '@tbd54566975/tbdex'

import { DateSort } from '@tbd54566975/dwn-sdk-js'
import { Web5 } from '@tbd54566975/web5'
import { getSubunits } from './CurrencyUtils'
import { RecordThread } from '../features/threads/Thread'
import { Record } from '@tbd54566975/web5/dist/types/record'


export async function getVcs(web5: Web5) {
  const { records, status: vcQueryStatus } = await web5.dwn.records.query({
    message: {
      filter: {
        dataFormat: 'application/vc+ld+json'
      }
    }
  })

  if (vcQueryStatus.code !== 200) {
    throw new Error(`failed to get pre-existing VCs. Error: ${JSON.stringify(vcQueryStatus, null, 2)}`)
  }

  const vcs = []

  for (const record of records) {
    const vc = await record.data.text()
    vcs.push(vc)
  }

  return vcs
}

export async function storeVc(web5: Web5, vcJwt: string) {
  const { status } = await web5.dwn.records.write({
    data    : vcJwt,
    message : {
      dataFormat: 'application/vc+ld+json'
    }
  })

  if (status.code !== 202) {
    throw new Error(`failed to write KYC VC to alice dwn. Error: ${JSON.stringify(status, null, 2)}`)
  }


}

export async function getThreads(web5: Web5) {
  const threads: { [key: string]: RecordThread } = {}

  const { records = [] } = await web5.dwn.records.query({
    message: {
      filter: {
        schema: aliceProtocolDefinition.types.RFQ.schema,
      },
    },
  })

  // TODO: filter by dateSort: DateSort.CreatedAscending

  for (const record of records) {
    const rfqMsg = (await record.data.json()) as TbDEXMessage<'rfq'>
    const threadId = rfqMsg.threadId
    threads[threadId] = {  rfqRecord: record, rfq: rfqMsg, orderStatuses: [] }
  }
  return threads
}

export async function getOfferings(web5: Web5, pfiDid: string) {
  const { records = [] } = await web5.dwn.records.query({
    from: pfiDid,
    message: {
      filter: {
        schema: 'https://tbd.website/resources/tbdex/Offering',
      },
    },
  })

  const offerings = []
  for (const record of records) {
    const offering = await record.data.json()
    offerings.push(offering)
  }

  return offerings
}

// export async function getChildRecords(
//   web5: Web5,
//   pfiDid: string,
//   record: any
// ): Promise<Array<any> | void> {
//   if (record.id) {
//     try {
//       const { records } = await web5.dwn.records.query({
//         from: pfiDid,
//         message: {
//           filter: {
//             parentId: record.id,
//           },
//         },
//       })

//       if (records) {
//         return records
//       }
//     } catch (error) {
//       // console.log('No child for record: ' + record.id);
//     }
//   }
//   return undefined
// }

export const getOfferingFromRfq = async (
  web5: Web5,
  rfqMsg: TbDEXMessage<'rfq'>,
) => {
  const { records = [] } = await web5.dwn.records.query({
    from: rfqMsg.to,
    message: {
      filter: {
        schema: 'https://tbd.website/resources/tbdex/Offering',
      },
    },
  })

  for (const record of records) {
    const offering = await record.data.json()
    if (offering.id === rfqMsg.body.offeringId) {
      return offering
    }
  }
}


export const threadInit = async (
  web5: Web5,
  recordThread: RecordThread,
  pfiDid: string,
  setRecordThread: React.Dispatch<React.SetStateAction<RecordThread>>,
) => {
  try {
    console.log('beginning thread init')
    const { records = [] } = await web5.dwn.records.query({
      from: pfiDid,
      message: {
        filter: {
          contextId: recordThread.rfqRecord.contextId
        },
        dateSort: DateSort.CreatedAscending
      },
    })

    for (const record of records) {
      const tbdexMsg = await record.data.json()
      console.log(tbdexMsg)
      if (tbdexMsg.type === 'quote') {
        setRecordThread({ ...recordThread, quote: tbdexMsg })      
      } else if (tbdexMsg.type === 'orderStatus') {
        setRecordThread({ ...recordThread, orderStatuses: [...recordThread.orderStatuses, tbdexMsg] })  
      } else if (tbdexMsg.type === 'close') {
        setRecordThread({ ...recordThread, close: tbdexMsg })      
      }
    }
    
  } catch (error) {
    // console.log('No child for record: ' + record.id);
  }

}

// export const pollThread = async (
//   web5: Web5,
//   recordThread: RecordThread,
//   setRecordThread: React.Dispatch<React.SetStateAction<RecordThread>>,
//   setOffering: React.Dispatch<React.SetStateAction<Offering | undefined>>,
//   setRfqMsg: React.Dispatch<
//     React.SetStateAction<TbDEXMessage<'rfq'> | undefined>
//   >,
//   setQuoteMsg: React.Dispatch<
//     React.SetStateAction<TbDEXMessage<'quote'> | undefined>
//   >,
//   setCloseMsg: React.Dispatch<
//     React.SetStateAction<TbDEXMessage<'close'> | undefined>
//   >,
//   interval: NodeJS.Timer
// ) => {
//   // TODO: take out of pollThread

//   // const offering = await getRfqOffering(
//   //   web5,
//   //   rfqMsg.to,
//   //   rfqMsg.body.offeringId
//   // )
//   // setOffering(offering)
//   // console.log('WHYYYYY')

//   if (!recordThread.quote) {
//     const records = await getChildRecords(web5, rfqMsg.to, recordThread.rfq)
//     if (records && records[0]) {
//       const rfqResponse = await records[0].data.json()
//       console.log(rfqResponse)
//       if (rfqResponse.type === 'close') {
//         setRecordThread({ ...recordThread, close: records[0] })
//         setCloseMsg(rfqResponse as TbDEXMessage<'close'>)
//       } else {
//         setRecordThread({ ...recordThread, quote: records[0] })
//         // TODO: this may return type 'close' instead
//         setQuoteMsg(rfqResponse as TbDEXMessage<'quote'>)
//       }
      
//     }
//   } else if (recordThread.orderStatuses.length < 2) {
//     const records = await getChildRecords(web5, rfqMsg.to, recordThread.quote)
//     if (records) {
//       setRecordThread({ ...recordThread, orderStatuses: records })
//     }
//   } else {
//     clearInterval(interval)
//   }
// }

// paymentDetails: { btcAddress: '32PAofRVZLF3jY9x5P9qc8cc9QBY8pMivK' },


export const createRfq = async (
  web5: Web5,
  offering: Offering,
  profileDid: string,
  pfiDid: string,
  quoteAmount: string,
  payinMethodKind: string,
  payoutMethodKind: string
) => {
  const quoteAmountSubunits = getSubunits(quoteAmount)
  const payinMethodResponse: PaymentMethodResponse = {
    kind: payinMethodKind
  }
  const payoutMethodResponse: PaymentMethodResponse = {
    kind: payoutMethodKind,
    paymentDetails: {
      btcAddress: '32PAofRVZLF3jY9x5P9qc8cc9QBY8pMivK'
    }
  }
  const rfq: Rfq = {
    offeringId: offering.id,
    quoteAmountSubunits: quoteAmountSubunits,
    kycProof: 'eyJhbGciOiJzZWNwMjU2azEiLCJraWQiOiJkaWQ6aW9uOkVpRExGaGFsc3JCUVdzQjg5c0h0NlRBa1p0eGh0OWlXVUl3ai1vX185WnFSNGc6ZXlKa1pXeDBZU0k2ZXlKd1lYUmphR1Z6SWpwYmV5SmhZM1JwYjI0aU9pSnlaWEJzWVdObElpd2laRzlqZFcxbGJuUWlPbnNpY0hWaWJHbGpTMlY1Y3lJNlczc2lhV1FpT2lKa2QyNGlMQ0p3ZFdKc2FXTkxaWGxLZDJzaU9uc2lZM0oySWpvaWMyVmpjREkxTm1zeElpd2lhM1I1SWpvaVJVTWlMQ0o0SWpvaVRITmpWRWMyYjJKbU1HSkxiME4yZFc4dGVWbzNha3hMZEVOa1JEZHZhRVl3U0dsTFgzSXhPRjluTUNJc0lua2lPaUpHTXpFMWJtVnhkMFZ4WjNsMlRIaHVPVmx5UmtORk1FMHliM3BoYm1GTFFXbE1RVFZXWjBWRFpGb3dJbjBzSW5CMWNuQnZjMlZ6SWpwYkltRjFkR2hsYm5ScFkyRjBhVzl1SWwwc0luUjVjR1VpT2lKS2MyOXVWMlZpUzJWNU1qQXlNQ0o5WFgxOVhTd2lkWEJrWVhSbFEyOXRiV2wwYldWdWRDSTZJa1ZwUWtSTFExVkxkRUpNYUVkb1dYSnFVbUZyWTNacmIyWk5NbEIwUjFjM2JXaEtPV3RsT0dzNGVVdHRTMUVpZlN3aWMzVm1abWw0UkdGMFlTSTZleUprWld4MFlVaGhjMmdpT2lKRmFVSjJXRmQxZGtGMFltRlpkM2xMUnpCWWVsOWZMVEo1TXpCNGVWQnNTbmhyYlVFdGJ6WXdUa1p5YW1kUklpd2ljbVZqYjNabGNubERiMjF0YVhSdFpXNTBJam9pUldsRVUzZDVlSEZTVEZkWFRIcFBTUzFEVVVSRE0weHpYeTA0YlhCYWRuUTRXRTgwUTJsRWEwaFZibUpwZHlKOWZRI2RpZDppb246RWlETEZoYWxzckJRV3NCODlzSHQ2VEFrWnR4aHQ5aVdVSXdqLW9fXzlacVI0ZzpleUprWld4MFlTSTZleUp3WVhSamFHVnpJanBiZXlKaFkzUnBiMjRpT2lKeVpYQnNZV05sSWl3aVpHOWpkVzFsYm5RaU9uc2ljSFZpYkdsalMyVjVjeUk2VzNzaWFXUWlPaUprZDI0aUxDSndkV0pzYVdOTFpYbEtkMnNpT25zaVkzSjJJam9pYzJWamNESTFObXN4SWl3aWEzUjVJam9pUlVNaUxDSjRJam9pVEhOalZFYzJiMkptTUdKTGIwTjJkVzh0ZVZvM2FreExkRU5rUkRkdmFFWXdTR2xMWDNJeE9GOW5NQ0lzSW5raU9pSkdNekUxYm1WeGQwVnhaM2wyVEhodU9WbHlSa05GTUUweWIzcGhibUZMUVdsTVFUVldaMFZEWkZvd0luMHNJbkIxY25CdmMyVnpJanBiSW1GMWRHaGxiblJwWTJGMGFXOXVJbDBzSW5SNWNHVWlPaUpLYzI5dVYyVmlTMlY1TWpBeU1DSjlYWDE5WFN3aWRYQmtZWFJsUTI5dGJXbDBiV1Z1ZENJNklrVnBRa1JMUTFWTGRFSk1hRWRvV1hKcVVtRnJZM1pyYjJaTk1sQjBSMWMzYldoS09XdGxPR3M0ZVV0dFMxRWlmU3dpYzNWbVptbDRSR0YwWVNJNmV5SmtaV3gwWVVoaGMyZ2lPaUpGYVVKMldGZDFka0YwWW1GWmQzbExSekJZZWw5ZkxUSjVNekI0ZVZCc1NuaHJiVUV0YnpZd1RrWnlhbWRSSWl3aWNtVmpiM1psY25sRGIyMXRhWFJ0Wlc1MElqb2lSV2xFVTNkNWVIRlNURmRYVEhwUFNTMURVVVJETTB4elh5MDRiWEJhZG5RNFdFODBRMmxFYTBoVmJtSnBkeUo5ZlEjZHduIn0.eyJpc3MiOiJkaWQ6aW9uOkVpRExGaGFsc3JCUVdzQjg5c0h0NlRBa1p0eGh0OWlXVUl3ai1vX185WnFSNGc6ZXlKa1pXeDBZU0k2ZXlKd1lYUmphR1Z6SWpwYmV5SmhZM1JwYjI0aU9pSnlaWEJzWVdObElpd2laRzlqZFcxbGJuUWlPbnNpY0hWaWJHbGpTMlY1Y3lJNlczc2lhV1FpT2lKa2QyNGlMQ0p3ZFdKc2FXTkxaWGxLZDJzaU9uc2lZM0oySWpvaWMyVmpjREkxTm1zeElpd2lhM1I1SWpvaVJVTWlMQ0o0SWpvaVRITmpWRWMyYjJKbU1HSkxiME4yZFc4dGVWbzNha3hMZEVOa1JEZHZhRVl3U0dsTFgzSXhPRjluTUNJc0lua2lPaUpHTXpFMWJtVnhkMFZ4WjNsMlRIaHVPVmx5UmtORk1FMHliM3BoYm1GTFFXbE1RVFZXWjBWRFpGb3dJbjBzSW5CMWNuQnZjMlZ6SWpwYkltRjFkR2hsYm5ScFkyRjBhVzl1SWwwc0luUjVjR1VpT2lKS2MyOXVWMlZpUzJWNU1qQXlNQ0o5WFgxOVhTd2lkWEJrWVhSbFEyOXRiV2wwYldWdWRDSTZJa1ZwUWtSTFExVkxkRUpNYUVkb1dYSnFVbUZyWTNacmIyWk5NbEIwUjFjM2JXaEtPV3RsT0dzNGVVdHRTMUVpZlN3aWMzVm1abWw0UkdGMFlTSTZleUprWld4MFlVaGhjMmdpT2lKRmFVSjJXRmQxZGtGMFltRlpkM2xMUnpCWWVsOWZMVEo1TXpCNGVWQnNTbmhyYlVFdGJ6WXdUa1p5YW1kUklpd2ljbVZqYjNabGNubERiMjF0YVhSdFpXNTBJam9pUldsRVUzZDVlSEZTVEZkWFRIcFBTUzFEVVVSRE0weHpYeTA0YlhCYWRuUTRXRTgwUTJsRWEwaFZibUpwZHlKOWZRIiwic3ViIjoiZGlkOmlvbjpFaURMRmhhbHNyQlFXc0I4OXNIdDZUQWtadHhodDlpV1VJd2otb19fOVpxUjRnOmV5SmtaV3gwWVNJNmV5SndZWFJqYUdWeklqcGJleUpoWTNScGIyNGlPaUp5WlhCc1lXTmxJaXdpWkc5amRXMWxiblFpT25zaWNIVmliR2xqUzJWNWN5STZXM3NpYVdRaU9pSmtkMjRpTENKd2RXSnNhV05MWlhsS2Qyc2lPbnNpWTNKMklqb2ljMlZqY0RJMU5tc3hJaXdpYTNSNUlqb2lSVU1pTENKNElqb2lUSE5qVkVjMmIySm1NR0pMYjBOMmRXOHRlVm8zYWt4TGRFTmtSRGR2YUVZd1NHbExYM0l4T0Y5bk1DSXNJbmtpT2lKR016RTFibVZ4ZDBWeFozbDJUSGh1T1ZseVJrTkZNRTB5YjNwaGJtRkxRV2xNUVRWV1owVkRaRm93SW4wc0luQjFjbkJ2YzJWeklqcGJJbUYxZEdobGJuUnBZMkYwYVc5dUlsMHNJblI1Y0dVaU9pSktjMjl1VjJWaVMyVjVNakF5TUNKOVhYMTlYU3dpZFhCa1lYUmxRMjl0YldsMGJXVnVkQ0k2SWtWcFFrUkxRMVZMZEVKTWFFZG9XWEpxVW1GclkzWnJiMlpOTWxCMFIxYzNiV2hLT1d0bE9HczRlVXR0UzFFaWZTd2ljM1ZtWm1sNFJHRjBZU0k2ZXlKa1pXeDBZVWhoYzJnaU9pSkZhVUoyV0ZkMWRrRjBZbUZaZDNsTFJ6QlllbDlmTFRKNU16QjRlVkJzU25ocmJVRXRiell3VGtaeWFtZFJJaXdpY21WamIzWmxjbmxEYjIxdGFYUnRaVzUwSWpvaVJXbEVVM2Q1ZUhGU1RGZFhUSHBQU1MxRFVVUkRNMHh6WHkwNGJYQmFkblE0V0U4MFEybEVhMGhWYm1KcGR5SjlmUSIsInZwIjp7IkBjb250ZXh0IjpbImh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL3YxIl0sInR5cGUiOlsiVmVyaWZpYWJsZVByZXNlbnRhdGlvbiJdLCJob2xkZXIiOiJkaWQ6aW9uOkVpRExGaGFsc3JCUVdzQjg5c0h0NlRBa1p0eGh0OWlXVUl3ai1vX185WnFSNGc6ZXlKa1pXeDBZU0k2ZXlKd1lYUmphR1Z6SWpwYmV5SmhZM1JwYjI0aU9pSnlaWEJzWVdObElpd2laRzlqZFcxbGJuUWlPbnNpY0hWaWJHbGpTMlY1Y3lJNlczc2lhV1FpT2lKa2QyNGlMQ0p3ZFdKc2FXTkxaWGxLZDJzaU9uc2lZM0oySWpvaWMyVmpjREkxTm1zeElpd2lhM1I1SWpvaVJVTWlMQ0o0SWpvaVRITmpWRWMyYjJKbU1HSkxiME4yZFc4dGVWbzNha3hMZEVOa1JEZHZhRVl3U0dsTFgzSXhPRjluTUNJc0lua2lPaUpHTXpFMWJtVnhkMFZ4WjNsMlRIaHVPVmx5UmtORk1FMHliM3BoYm1GTFFXbE1RVFZXWjBWRFpGb3dJbjBzSW5CMWNuQnZjMlZ6SWpwYkltRjFkR2hsYm5ScFkyRjBhVzl1SWwwc0luUjVjR1VpT2lKS2MyOXVWMlZpUzJWNU1qQXlNQ0o5WFgxOVhTd2lkWEJrWVhSbFEyOXRiV2wwYldWdWRDSTZJa1ZwUWtSTFExVkxkRUpNYUVkb1dYSnFVbUZyWTNacmIyWk5NbEIwUjFjM2JXaEtPV3RsT0dzNGVVdHRTMUVpZlN3aWMzVm1abWw0UkdGMFlTSTZleUprWld4MFlVaGhjMmdpT2lKRmFVSjJXRmQxZGtGMFltRlpkM2xMUnpCWWVsOWZMVEo1TXpCNGVWQnNTbmhyYlVFdGJ6WXdUa1p5YW1kUklpd2ljbVZqYjNabGNubERiMjF0YVhSdFpXNTBJam9pUldsRVUzZDVlSEZTVEZkWFRIcFBTUzFEVVVSRE0weHpYeTA0YlhCYWRuUTRXRTgwUTJsRWEwaFZibUpwZHlKOWZRIiwicHJlc2VudGF0aW9uX3N1Ym1pc3Npb24iOnsiZGVmaW5pdGlvbl9pZCI6IjJlZGRmMjVmLWY3OWYtNDEwNS1hYzgxLTU0NGM5ODhmNmQ3OCIsImRlc2NyaXB0b3JfbWFwIjpbeyJmb3JtYXQiOiJqd3RfdnAiLCJpZCI6IjAiLCJwYXRoIjoiJC52ZXJpZmlhYmxlQ3JlZGVudGlhbFswXSJ9XSwiaWQiOiJhNDZiMGQ0YS01ZmMyLTQ4OWItYjMxMi1jMzc4YTRhN2YzYmQifSwidmVyaWZpYWJsZUNyZWRlbnRpYWwiOlsiZXlKaGJHY2lPaUp6WldOd01qVTJhekVpTENKcmFXUWlPaUprYVdRNmFXOXVPa1ZwUkV4R2FHRnNjM0pDVVZkelFqZzVjMGgwTmxSQmExcDBlR2gwT1dsWFZVbDNhaTF2WDE4NVduRlNOR2M2WlhsS2ExcFhlREJaVTBrMlpYbEtkMWxZVW1waFIxWjZTV3B3WW1WNVNtaFpNMUp3WWpJMGFVOXBTbmxhV0VKeldWZE9iRWxwZDJsYVJ6bHFaRmN4YkdKdVVXbFBibk5wWTBoV2FXSkhiR3BUTWxZMVkzbEpObGN6YzJsaFYxRnBUMmxLYTJReU5HbE1RMHAzWkZkS2MyRlhUa3hhV0d4TFpESnphVTl1YzJsWk0wb3lTV3B2YVdNeVZtcGpSRWt4VG0xemVFbHBkMmxoTTFJMVNXcHZhVkpWVFdsTVEwbzBTV3B2YVZSSVRtcFdSV015WWpKS2JVMUhTa3hpTUU0eVpGYzRkR1ZXYnpOaGEzaE1aRVZPYTFKRVpIWmhSVmwzVTBkc1RGZ3pTWGhQUmpsdVRVTkpjMGx1YTJsUGFVcEhUWHBGTVdKdFZuaGtNRlo0V2pOc01sUklhSFZQVm14NVVtdE9SazFGTUhsaU0zQm9ZbTFHVEZGWGJFMVJWRlpYV2pCV1JGcEdiM2RKYmpCelNXNUNNV051UW5aak1sWjZTV3B3WWtsdFJqRmtSMmhzWW01U2NGa3lSakJoVnpsMVNXd3djMGx1VWpWalIxVnBUMmxLUzJNeU9YVldNbFpwVXpKV05VMXFRWGxOUTBvNVdGZ3hPVmhUZDJsa1dFSnJXVmhTYkZFeU9YUmlWMnd3WWxkV2RXUkRTVFpKYTFad1VXdFNURkV4Vmt4a1JVcE5ZVVZrYjFkWVNuRlZiVVp5V1ROYWNtSXlXazVOYkVJd1VqRmpNMkpYYUV0UFYzUnNUMGR6TkdWVmRIUlRNVVZwWmxOM2FXTXpWbTFhYld3MFVrZEdNRmxUU1RabGVVcHJXbGQ0TUZsVmFHaGpNbWRwVDJsS1JtRlZTakpYUm1ReFpHdEdNRmx0Umxwa00yeE1VbnBDV1dWc09XWk1WRW8xVFhwQ05HVldRbk5UYm1oeVlsVkZkR0o2V1hkVWExcDVZVzFrVWtscGQybGpiVlpxWWpOYWJHTnViRVJpTWpGMFlWaFNkRnBYTlRCSmFtOXBVbGRzUlZVelpEVmxTRVpUVkVaa1dGUkljRkJUVXpGRVZWVlNSRTB3ZUhwWWVUQTBZbGhDWVdSdVVUUlhSVGd3VVRKc1JXRXdhRlppYlVwd1pIbEtPV1pSSTJScFpEcHBiMjQ2UldsRVRFWm9ZV3h6Y2tKUlYzTkNPRGx6U0hRMlZFRnJXblI0YUhRNWFWZFZTWGRxTFc5Zlh6bGFjVkkwWnpwbGVVcHJXbGQ0TUZsVFNUWmxlVXAzV1ZoU2FtRkhWbnBKYW5CaVpYbEthRmt6VW5CaU1qUnBUMmxLZVZwWVFuTlpWMDVzU1dsM2FWcEhPV3BrVnpGc1ltNVJhVTl1YzJsalNGWnBZa2RzYWxNeVZqVmplVWsyVnpOemFXRlhVV2xQYVVwclpESTBhVXhEU25ka1YwcHpZVmRPVEZwWWJFdGtNbk5wVDI1emFWa3pTakpKYW05cFl6SldhbU5FU1RGT2JYTjRTV2wzYVdFelVqVkphbTlwVWxWTmFVeERTalJKYW05cFZFaE9hbFpGWXpKaU1rcHRUVWRLVEdJd1RqSmtWemgwWlZadk0yRnJlRXhrUlU1clVrUmtkbUZGV1hkVFIyeE1XRE5KZUU5R09XNU5RMGx6U1c1cmFVOXBTa2ROZWtVeFltMVdlR1F3Vm5oYU0yd3lWRWhvZFU5V2JIbFNhMDVHVFVVd2VXSXpjR2hpYlVaTVVWZHNUVkZVVmxkYU1GWkVXa1p2ZDBsdU1ITkpia0l4WTI1Q2RtTXlWbnBKYW5CaVNXMUdNV1JIYUd4aWJsSndXVEpHTUdGWE9YVkpiREJ6U1c1U05XTkhWV2xQYVVwTFl6STVkVll5Vm1sVE1sWTFUV3BCZVUxRFNqbFlXREU1V0ZOM2FXUllRbXRaV0ZKc1VUSTVkR0pYYkRCaVYxWjFaRU5KTmtsclZuQlJhMUpNVVRGV1RHUkZTazFoUldSdlYxaEtjVlZ0Um5KWk0xcHlZakphVGsxc1FqQlNNV016WWxkb1MwOVhkR3hQUjNNMFpWVjBkRk14UldsbVUzZHBZek5XYlZwdGJEUlNSMFl3V1ZOSk5tVjVTbXRhVjNnd1dWVm9hR015WjJsUGFVcEdZVlZLTWxkR1pERmthMFl3V1cxR1dtUXpiRXhTZWtKWlpXdzVaa3hVU2pWTmVrSTBaVlpDYzFOdWFISmlWVVYwWW5wWmQxUnJXbmxoYldSU1NXbDNhV050Vm1waU0xcHNZMjVzUkdJeU1YUmhXRkowV2xjMU1FbHFiMmxTVjJ4RlZUTmtOV1ZJUmxOVVJtUllWRWh3VUZOVE1VUlZWVkpFVFRCNGVsaDVNRFJpV0VKaFpHNVJORmRGT0RCUk1teEZZVEJvVm1KdFNuQmtlVW81WmxFalpIZHVJbjAuZXlKcGMzTWlPaUprYVdRNmFXOXVPa1ZwUkV4R2FHRnNjM0pDVVZkelFqZzVjMGgwTmxSQmExcDBlR2gwT1dsWFZVbDNhaTF2WDE4NVduRlNOR2M2WlhsS2ExcFhlREJaVTBrMlpYbEtkMWxZVW1waFIxWjZTV3B3WW1WNVNtaFpNMUp3WWpJMGFVOXBTbmxhV0VKeldWZE9iRWxwZDJsYVJ6bHFaRmN4YkdKdVVXbFBibk5wWTBoV2FXSkhiR3BUTWxZMVkzbEpObGN6YzJsaFYxRnBUMmxLYTJReU5HbE1RMHAzWkZkS2MyRlhUa3hhV0d4TFpESnphVTl1YzJsWk0wb3lTV3B2YVdNeVZtcGpSRWt4VG0xemVFbHBkMmxoTTFJMVNXcHZhVkpWVFdsTVEwbzBTV3B2YVZSSVRtcFdSV015WWpKS2JVMUhTa3hpTUU0eVpGYzRkR1ZXYnpOaGEzaE1aRVZPYTFKRVpIWmhSVmwzVTBkc1RGZ3pTWGhQUmpsdVRVTkpjMGx1YTJsUGFVcEhUWHBGTVdKdFZuaGtNRlo0V2pOc01sUklhSFZQVm14NVVtdE9SazFGTUhsaU0zQm9ZbTFHVEZGWGJFMVJWRlpYV2pCV1JGcEdiM2RKYmpCelNXNUNNV051UW5aak1sWjZTV3B3WWtsdFJqRmtSMmhzWW01U2NGa3lSakJoVnpsMVNXd3djMGx1VWpWalIxVnBUMmxLUzJNeU9YVldNbFpwVXpKV05VMXFRWGxOUTBvNVdGZ3hPVmhUZDJsa1dFSnJXVmhTYkZFeU9YUmlWMnd3WWxkV2RXUkRTVFpKYTFad1VXdFNURkV4Vmt4a1JVcE5ZVVZrYjFkWVNuRlZiVVp5V1ROYWNtSXlXazVOYkVJd1VqRmpNMkpYYUV0UFYzUnNUMGR6TkdWVmRIUlRNVVZwWmxOM2FXTXpWbTFhYld3MFVrZEdNRmxUU1RabGVVcHJXbGQ0TUZsVmFHaGpNbWRwVDJsS1JtRlZTakpYUm1ReFpHdEdNRmx0Umxwa00yeE1VbnBDV1dWc09XWk1WRW8xVFhwQ05HVldRbk5UYm1oeVlsVkZkR0o2V1hkVWExcDVZVzFrVWtscGQybGpiVlpxWWpOYWJHTnViRVJpTWpGMFlWaFNkRnBYTlRCSmFtOXBVbGRzUlZVelpEVmxTRVpUVkVaa1dGUkljRkJUVXpGRVZWVlNSRTB3ZUhwWWVUQTBZbGhDWVdSdVVUUlhSVGd3VVRKc1JXRXdhRlppYlVwd1pIbEtPV1pSSWl3aWMzVmlJam9pWkdsa09tbHZianBGYVVSTVJtaGhiSE55UWxGWGMwSTRPWE5JZERaVVFXdGFkSGhvZERscFYxVkpkMm90YjE5Zk9WcHhValJuT21WNVNtdGFWM2d3V1ZOSk5tVjVTbmRaV0ZKcVlVZFdla2xxY0dKbGVVcG9XVE5TY0dJeU5HbFBhVXA1V2xoQ2MxbFhUbXhKYVhkcFdrYzVhbVJYTVd4aWJsRnBUMjV6YVdOSVZtbGlSMnhxVXpKV05XTjVTVFpYTTNOcFlWZFJhVTlwU210a01qUnBURU5LZDJSWFNuTmhWMDVNV2xoc1MyUXljMmxQYm5OcFdUTktNa2xxYjJsak1sWnFZMFJKTVU1dGMzaEphWGRwWVROU05VbHFiMmxTVlUxcFRFTktORWxxYjJsVVNFNXFWa1ZqTW1JeVNtMU5SMHBNWWpCT01tUlhPSFJsVm04ellXdDRUR1JGVG10U1JHUjJZVVZaZDFOSGJFeFlNMGw0VDBZNWJrMURTWE5KYm10cFQybEtSMDE2UlRGaWJWWjRaREJXZUZvemJESlVTR2gxVDFac2VWSnJUa1pOUlRCNVlqTndhR0p0Umt4UlYyeE5VVlJXVjFvd1ZrUmFSbTkzU1c0d2MwbHVRakZqYmtKMll6Sldla2xxY0dKSmJVWXhaRWRvYkdKdVVuQlpNa1l3WVZjNWRVbHNNSE5KYmxJMVkwZFZhVTlwU2t0ak1qbDFWakpXYVZNeVZqVk5ha0Y1VFVOS09WaFlNVGxZVTNkcFpGaENhMWxZVW14Uk1qbDBZbGRzTUdKWFZuVmtRMGsyU1d0V2NGRnJVa3hSTVZaTVpFVktUV0ZGWkc5WFdFcHhWVzFHY2xrelduSmlNbHBPVFd4Q01GSXhZek5pVjJoTFQxZDBiRTlIY3pSbFZYUjBVekZGYVdaVGQybGpNMVp0V20xc05GSkhSakJaVTBrMlpYbEthMXBYZURCWlZXaG9ZekpuYVU5cFNrWmhWVW95VjBaa01XUnJSakJaYlVaYVpETnNURko2UWxsbGJEbG1URlJLTlUxNlFqUmxWa0p6VTI1b2NtSlZSWFJpZWxsM1ZHdGFlV0Z0WkZKSmFYZHBZMjFXYW1JeldteGpibXhFWWpJeGRHRllVblJhVnpVd1NXcHZhVkpYYkVWVk0yUTFaVWhHVTFSR1pGaFVTSEJRVTFNeFJGVlZVa1JOTUhoNldIa3dOR0pZUW1Ga2JsRTBWMFU0TUZFeWJFVmhNR2hXWW0xS2NHUjVTamxtVVNJc0luWmpJanA3SWtCamIyNTBaWGgwSWpwYkltaDBkSEJ6T2k4dmQzZDNMbmN6TG05eVp5OHlNREU0TDJOeVpXUmxiblJwWVd4ekwzWXhJbDBzSW1sa0lqb2lhR0Z3Y0hrdFkzSmxaR1Z1ZEdsaGJDSXNJblI1Y0dVaU9sc2lWbVZ5YVdacFlXSnNaVU55WldSbGJuUnBZV3dpWFN3aWFYTnpkV1Z5SWpvaVpHbGtPbWx2YmpwRmFVUk1SbWhoYkhOeVFsRlhjMEk0T1hOSWREWlVRV3RhZEhob2REbHBWMVZKZDJvdGIxOWZPVnB4VWpSbk9tVjVTbXRhVjNnd1dWTkpObVY1U25kWldGSnFZVWRXZWtscWNHSmxlVXBvV1ROU2NHSXlOR2xQYVVwNVdsaENjMWxYVG14SmFYZHBXa2M1YW1SWE1XeGlibEZwVDI1emFXTklWbWxpUjJ4cVV6SldOV041U1RaWE0zTnBZVmRSYVU5cFNtdGtNalJwVEVOS2QyUlhTbk5oVjA1TVdsaHNTMlF5YzJsUGJuTnBXVE5LTWtscWIybGpNbFpxWTBSSk1VNXRjM2hKYVhkcFlUTlNOVWxxYjJsU1ZVMXBURU5LTkVscWIybFVTRTVxVmtWak1tSXlTbTFOUjBwTVlqQk9NbVJYT0hSbFZtOHpZV3Q0VEdSRlRtdFNSR1IyWVVWWmQxTkhiRXhZTTBsNFQwWTViazFEU1hOSmJtdHBUMmxLUjAxNlJURmliVlo0WkRCV2VGb3piREpVU0doMVQxWnNlVkpyVGtaTlJUQjVZak53YUdKdFJreFJWMnhOVVZSV1Yxb3dWa1JhUm05M1NXNHdjMGx1UWpGamJrSjJZekpXZWtscWNHSkpiVVl4WkVkb2JHSnVVbkJaTWtZd1lWYzVkVWxzTUhOSmJsSTFZMGRWYVU5cFNrdGpNamwxVmpKV2FWTXlWalZOYWtGNVRVTktPVmhZTVRsWVUzZHBaRmhDYTFsWVVteFJNamwwWWxkc01HSlhWblZrUTBrMlNXdFdjRkZyVWt4Uk1WWk1aRVZLVFdGRlpHOVhXRXB4VlcxR2Nsa3pXbkppTWxwT1RXeENNRkl4WXpOaVYyaExUMWQwYkU5SGN6UmxWWFIwVXpGRmFXWlRkMmxqTTFadFdtMXNORkpIUmpCWlUwazJaWGxLYTFwWGVEQlpWV2hvWXpKbmFVOXBTa1poVlVveVYwWmtNV1JyUmpCWmJVWmFaRE5zVEZKNlFsbGxiRGxtVEZSS05VMTZRalJsVmtKelUyNW9jbUpWUlhSaWVsbDNWR3RhZVdGdFpGSkphWGRwWTIxV2FtSXpXbXhqYm14RVlqSXhkR0ZZVW5SYVZ6VXdTV3B2YVZKWGJFVlZNMlExWlVoR1UxUkdaRmhVU0hCUVUxTXhSRlZWVWtSTk1IaDZXSGt3TkdKWVFtRmtibEUwVjBVNE1GRXliRVZoTUdoV1ltMUtjR1I1U2psbVVTSXNJbWx6YzNWaGJtTmxSR0YwWlNJNklqSXdNak10TURjdE1UTlVNREE2TWpFNk1qQXVOemM1V2lJc0ltTnlaV1JsYm5ScFlXeFRkV0pxWldOMElqcDdJbWxrSWpvaVpHbGtPbWx2YmpwRmFVUk1SbWhoYkhOeVFsRlhjMEk0T1hOSWREWlVRV3RhZEhob2REbHBWMVZKZDJvdGIxOWZPVnB4VWpSbk9tVjVTbXRhVjNnd1dWTkpObVY1U25kWldGSnFZVWRXZWtscWNHSmxlVXBvV1ROU2NHSXlOR2xQYVVwNVdsaENjMWxYVG14SmFYZHBXa2M1YW1SWE1XeGlibEZwVDI1emFXTklWbWxpUjJ4cVV6SldOV041U1RaWE0zTnBZVmRSYVU5cFNtdGtNalJwVEVOS2QyUlhTbk5oVjA1TVdsaHNTMlF5YzJsUGJuTnBXVE5LTWtscWIybGpNbFpxWTBSSk1VNXRjM2hKYVhkcFlUTlNOVWxxYjJsU1ZVMXBURU5LTkVscWIybFVTRTVxVmtWak1tSXlTbTFOUjBwTVlqQk9NbVJYT0hSbFZtOHpZV3Q0VEdSRlRtdFNSR1IyWVVWWmQxTkhiRXhZTTBsNFQwWTViazFEU1hOSmJtdHBUMmxLUjAxNlJURmliVlo0WkRCV2VGb3piREpVU0doMVQxWnNlVkpyVGtaTlJUQjVZak53YUdKdFJreFJWMnhOVVZSV1Yxb3dWa1JhUm05M1NXNHdjMGx1UWpGamJrSjJZekpXZWtscWNHSkpiVVl4WkVkb2JHSnVVbkJaTWtZd1lWYzVkVWxzTUhOSmJsSTFZMGRWYVU5cFNrdGpNamwxVmpKV2FWTXlWalZOYWtGNVRVTktPVmhZTVRsWVUzZHBaRmhDYTFsWVVteFJNamwwWWxkc01HSlhWblZrUTBrMlNXdFdjRkZyVWt4Uk1WWk1aRVZLVFdGRlpHOVhXRXB4VlcxR2Nsa3pXbkppTWxwT1RXeENNRkl4WXpOaVYyaExUMWQwYkU5SGN6UmxWWFIwVXpGRmFXWlRkMmxqTTFadFdtMXNORkpIUmpCWlUwazJaWGxLYTFwWGVEQlpWV2hvWXpKbmFVOXBTa1poVlVveVYwWmtNV1JyUmpCWmJVWmFaRE5zVEZKNlFsbGxiRGxtVEZSS05VMTZRalJsVmtKelUyNW9jbUpWUlhSaWVsbDNWR3RhZVdGdFpGSkphWGRwWTIxV2FtSXpXbXhqYm14RVlqSXhkR0ZZVW5SYVZ6VXdTV3B2YVZKWGJFVlZNMlExWlVoR1UxUkdaRmhVU0hCUVUxTXhSRlZWVWtSTk1IaDZXSGt3TkdKWVFtRmtibEUwVjBVNE1GRXliRVZoTUdoV1ltMUtjR1I1U2psbVVTSXNJbWRwZG1WdVRtRnRaU0k2SWtWd2FISmhhVzBpTENKdGFXUmtiR1ZPWVcxbElqb2lRbUZ5ZEdodmJHOXRaWGNpTENKbVlXMXBiSGxPWVcxbElqb2lWMmx1ZEdoeWIzQWlMQ0ppYVhKMGFFUmhkR1VpT2lJd015OHlPQzh4T1RnNElpd2lZV1JrY21WemN5STZleUp6ZEhKbFpYUkJaR1J5WlhOeklqb2lNak15TmlCSWFXVnliMjU1Ylc5MWN5QkNiM05qYUdGeWRDQkNiM1ZzWlhaaGNtUWlMQ0pzYjJOaGJHbDBlU0k2SWtOdmJuTmxjWFZsYm1ObGN5SXNJbkpsWjJsdmJpSTZJazVsZHlCTlpYaHBZMjhpTENKamIzVnVkSEo1SWpvaVZWTkJJaXdpY0c5emRHRnNRMjlrWlNJNklqYzROekkwSW4xOWZYMC5DMTlaeHFWaVhCaWE4Y1VjUUl5VXYtY0VFaXdWeE9URTZOUUx2a0JaZ3RvTzNGNFVZOEFfVHBWTjZpUy0ySDg1VTFKcVVqRVZTSVdKQXFlN3V2VnBYQSJdfX0.t0tZSj5sOJL1Hq73jh0-_1bnk_81VN2wLO3PpgFxA9A5-fgL5--OfxFAsbHwrNvZOusKlYm2T-4dR-_N075OTA',
    payinMethod: payinMethodResponse,
    payoutMethod: payoutMethodResponse
  }

  const tbdexMsg = createMessage({
    to: pfiDid,
    from: profileDid,
    type: 'rfq',
    body: rfq,
  })

  console.log(tbdexMsg)

  const { record, status } = await web5.dwn.records.write({
    data: tbdexMsg,
    message: {
      protocol: aliceProtocolDefinition.protocol,
      protocolPath: 'RFQ',
      schema: aliceProtocolDefinition.types.RFQ.schema,
      recipient: pfiDid,
    },
  })
  
  console.log(status.code + ' ' + status.detail)

  if (record) {
    const { status: sendStatus } = await record.send(pfiDid)
    console.log(sendStatus.code + ' ' + sendStatus.detail)
  }
}
