import {
  Offering,
  aliceProtocolDefinition,
  createMessage,
} from '@tbd54566975/tbdex';
import { Web5 } from '@tbd54566975/web5';
import currency from 'currency.js';

/**
 * queries DWN for VCs
 * @returns an array of VCs
 */
export async function getVcs(web5: Web5) {
  const { records = [], status } = await web5.dwn.records.query({
    message: {
      filter: {
        schema: 'https://www.w3.org/2018/credentials/v1',
      },
    },
  });

  if (status.code !== 200) {
    throw new Error('Failed to fetch VCs');
  }

  const vcs = [];
  for (let record of records) {
    const vc = await record.data.text();
    console.log(vc);
    vcs.push(vc);
  }

  return vcs;
}

export async function queryChildRecords(
  web5: Web5,
  record: any
): Promise<Array<any> | void> {
  if (record.id) {
    const { records } = await web5.dwn.records.query({
      from: 'did:ion:EiDk8Kmu7lYgIolDeENZqTWbBpUpKY76TgO4JCgAcruAGg:eyJkZWx0YSI6eyJwYXRjaGVzIjpbeyJhY3Rpb24iOiJyZXBsYWNlIiwiZG9jdW1lbnQiOnsicHVibGljS2V5cyI6W3siaWQiOiJhdXRoeiIsInB1YmxpY0tleUp3ayI6eyJjcnYiOiJzZWNwMjU2azEiLCJrdHkiOiJFQyIsIngiOiJSTWVlT1NTMC13dFpGeUVEaVQtRVhKVUFKODh4UHFQRGZvQlNNY2ttNm9FIiwieSI6InlUcmRpY05fWTZWNV9fWFl3OEttcHVYSWhnZEU0VnhKZjI5clV6UzRxUDAifSwicHVycG9zZXMiOlsiYXV0aGVudGljYXRpb24iXSwidHlwZSI6Ikpzb25XZWJLZXkyMDIwIn0seyJpZCI6ImVuYyIsInB1YmxpY0tleUp3ayI6eyJjcnYiOiJzZWNwMjU2azEiLCJrdHkiOiJFQyIsIngiOiI0LXROdG42d1l4VVZaa1JNQXFXS0ZoODNWTFBTd0pZRTY5T3EteEhJWVU0IiwieSI6ImRteG54Q3BkX0VfdlNMZ3pDdGV3UEtuQkpKNi1IRW9yZmtDb2p0NDZ4eFEifSwicHVycG9zZXMiOlsia2V5QWdyZWVtZW50Il0sInR5cGUiOiJKc29uV2ViS2V5MjAyMCJ9XSwic2VydmljZXMiOlt7ImlkIjoiZHduIiwic2VydmljZUVuZHBvaW50Ijp7Im1lc3NhZ2VBdXRob3JpemF0aW9uS2V5cyI6WyIjYXV0aHoiXSwibm9kZXMiOlsiaHR0cDovL2xvY2FsaG9zdDo5MDAwIl0sInJlY29yZEVuY3J5cHRpb25LZXlzIjpbIiNlbmMiXX0sInR5cGUiOiJEZWNlbnRyYWxpemVkV2ViTm9kZSJ9XX19XSwidXBkYXRlQ29tbWl0bWVudCI6IkVpQi1CZ0czM2sxZVhreVBGVTNDaWl5VEhyUEw4SHU1cDZzM0lqMHB2bUhUUlEifSwic3VmZml4RGF0YSI6eyJkZWx0YUhhc2giOiJFaUJ6Nm5BclNfeDZaYmdIbTNJdFlPcW1UU2ctU2s1OFk0Z1ZoSUQ2UVFXa2VnIiwicmVjb3ZlcnlDb21taXRtZW50IjoiRWlEUUlYUmotaEV0SmVBT1lteUdsMDYxZ0hzTU8xdFZkSVZJb19MZzVsdFRlZyJ9fQ',
      message: {
        filter: {
          parentId: record.id,
        },
      },
    });

    return records;
  }
}

export const createRfq = async (
  web5: Web5,
  profileDid: string,
  pfiDid: string,
  offering: Offering,
  amount: string,
  kycProof: string,
  payinInstrument: any,
  payoutInstrument: any
) => {
  console.log('tbdex offering id: ' + offering.id);
  const amountInCents = currency(amount).multiply(100).value.toString();
  const rfq = {
    offeringId: offering.id,
    baseCurrency: offering.baseCurrency,
    quoteCurrency: offering.quoteCurrency,
    amount: amountInCents,
    kycProof: kycProof,
    payinMethod: {
      kind: payinInstrument,
    },
    payoutMethod: {
      kind: payoutInstrument,
      paymentVerifiablePresentationJwt: '',
    },
  };

  const tbdexMsg = createMessage({
    to: pfiDid,
    from: profileDid,
    type: 'rfq',
    body: rfq,
  });

  console.log(tbdexMsg);

  const { record, status } = await web5.dwn.records.write({
    data: tbdexMsg,
    message: {
      protocol: aliceProtocolDefinition.protocol,
      protocolPath: 'RFQ',
      schema: aliceProtocolDefinition.types.RFQ.schema,
      recipient: pfiDid,
    },
  });
  console.log(status.code + ' ' + status.detail);

  const { status: sendStatus } = await record?.send(pfiDid);
  console.log(sendStatus.code + ' ' + sendStatus.detail);
};
