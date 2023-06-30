import {
  TbDEXMessage,
  MessageTypes,
  Rfq,
  Quote,
  PaymentMethodKind,
  OrderStatus,
  Status,
} from '@tbd54566975/tbdex';
import { Web5 } from '@tbd54566975/web5';
import moment from 'moment';

export type ThreadData = {
  rfq?: TbDEXMessage<'rfq'>;
  quote?: TbDEXMessage<'quote'>;
  orderStatuses: TbDEXMessage<'orderStatus'>[];
};

export class ThreadManager {
  private threadMap: Map<string, ThreadData>;
  private aliceProtocolDefinition;

  constructor(web5: Web5) {
    this.threadMap = new Map<string, ThreadData>();
    this.aliceProtocolDefinition = {
      protocol: 'https://tbd.website/protocols/tbdex',
      types: {
        RFQ: {
          schema: 'https://tbd.website/protocols/tbdex/RequestForQuote',
          dataFormats: ['application/json'],
        },
        Quote: {
          schema: 'https://tbd.website/protocols/tbdex/Quote',
          dataFormats: ['application/json'],
        },
        Order: {
          schema: 'https://tbd.website/protocols/tbdex/Order',
          dataFormats: ['application/json'],
        },
        OrderStatus: {
          schema: 'https://tbd.website/protocols/tbdex/OrderStatus',
          dataFormats: ['application/json'],
        },
      },
      structure: {
        // alice sends RFQs, not receives them
        RFQ: {
          $actions: [],
          // whoever received the RFQ that Alice sent, can write back a Quote to Alice
          Quote: {
            $actions: [
              {
                who: 'recipient',
                of: 'RFQ',
                can: 'write',
              },
            ],
            // alice sends Orders, not receives them
            Order: {
              $actions: [],
              // whoever received the order that Alice sent in response to a Quote in response to an RFQ, can write back an OrderStatus to Alice.
              OrderStatus: {
                $actions: [
                  {
                    who: 'recipient',
                    of: 'RFQ/Quote/Order',
                    can: 'write',
                  },
                ],
              },
            },
          },
        },
      },
    };
    // this.initializeAsync(web5);
    this.populateThreadMap();
  }

  private generateUniqueId(): string {
    const timestamp: number = new Date().getTime();
    const randomId: string = Math.random().toString(36).substr(2, 9);
    return `${timestamp}-${randomId}`;
  }

  private generateRandomTimestamp(): string {
    const randomTimestamp = moment()
      .subtract(Math.floor(Math.random() * 12), 'months')
      .subtract(Math.floor(Math.random() * 30), 'days')
      .set('hour', Math.floor(Math.random() * 24))
      .set('minute', Math.floor(Math.random() * 60))
      .set('second', Math.floor(Math.random() * 60))
      .set('millisecond', Math.floor(Math.random() * 1000))
      .format('YYYY-MM-DDTHH:mm:ss.SSSSSSZ');

    return randomTimestamp;
  }

  private populateThreadMap() {
    const n = 10;

    for (let i = 0; i < n; i++) {
      const threadId = this.generateUniqueId();
      const rfqId = this.generateUniqueId();
      const quoteId = this.generateUniqueId();

      const rfq: Rfq = {
        baseCurrency: 'BTC',
        quoteCurrency: 'USD',
        amount: '15000',
        kycProof: '',
        payinMethod: {
          kind: PaymentMethodKind.DEBIT_CARD,
          paymentVerifiablePresentationJwt: 'string',
        },
        payoutMethod: {
          kind: PaymentMethodKind.BITCOIN_ADDRESS,
          paymentVerifiablePresentationJwt: 'string',
        },
      };
      const rfqMsg: TbDEXMessage<'rfq'> = {
        id: rfqId,
        threadId: threadId,
        parentId: threadId,
        from: 'did:ion:myDid',
        to: 'did:ion:pfiDid',
        type: 'rfq',
        body: rfq,
        createdTime: this.generateRandomTimestamp(),
      };

      const quote: Quote = {
        expiryTime: '2023-06-13T23:03:37.750615Z',
        totalFee: '15500',
        amount: '0.5',
        paymentInstructions: {
          payin: {
            link: 'stripe.com/xyz',
          },
        },
      };
      const quoteMsg: TbDEXMessage<'quote'> = {
        id: quoteId,
        threadId: threadId,
        parentId: rfqId,
        from: 'did:ion:myDid',
        to: 'did:ion:pfiDid',
        type: 'quote',
        body: quote,
        createdTime: this.generateRandomTimestamp(),
      };

      let orderStatus: OrderStatus;
      if (i % 3 === 0) {
        orderStatus = {
          orderStatus: Status.COMPLETED,
        };
      } else if (i % 3 === 1) {
        orderStatus = {
          orderStatus: Status.FAILED,
        };
      } else {
        orderStatus = {
          orderStatus: Status.PENDING,
        };
      }

      const orderStatusMsg: TbDEXMessage<'orderStatus'> = {
        id: this.generateUniqueId(),
        threadId: threadId,
        parentId: quoteId,
        from: 'did:ion:myDid',
        to: 'did:ion:pfiDid',
        type: 'orderStatus',
        body: orderStatus,
        createdTime: this.generateRandomTimestamp(),
      };

      const message = {
        rfq: rfqMsg,
        quote: quoteMsg,
        orderStatuses: [orderStatusMsg],
      };

      this.threadMap.set(this.generateUniqueId(), message);
    }
  }

  private async initializeAsync(web5: Web5): Promise<void> {
    const records = await web5.dwn.records.query({
      message: {
        filter: {
          protocol: this.aliceProtocolDefinition.protocol,
        },
        dateCreated: 'createdDescending',
      },
    });

    if (records.status.code !== 200) {
      console.error('Failed to query protocol', records.status);
      return;
    }

    if (Array.isArray(records)) {
      await Promise.all(
        records.map(async (record) => {
          const contextId = record.contextId;
          const tbdexMsg = await record.data.json();

          this.threadMap.set(contextId, tbdexMsg);
        })
      );
    } else {
      // Handle the case where records is not an array
      // throw an error, log a warning
    }
  }

  public getCompletedOrFailedStatusKeys(): string[] {
    const keysWithCompletedOrFailed: string[] = [];
    const contextIds = Array.from(this.threadMap.keys());

    for (const contextId of contextIds) {
      const threadData = this.getThread(contextId);

      for (const statuses of threadData?.orderStatuses ?? []) {
        const orderStatus = statuses.body as OrderStatus;
        if (orderStatus.orderStatus !== Status.PENDING) {
          keysWithCompletedOrFailed.push(contextId);
        }
      }
    }

    return keysWithCompletedOrFailed;
  }

  // TODO: fix this, there can be multiple pending
  public getPendingStatusKeys(): string[] {
    const completed = this.getCompletedOrFailedStatusKeys();

    return Array.from(this.threadMap.keys()).filter(
      (key) => !completed.includes(key)
    );
  }

  public getThreadStatus(contextId: string) {
    const threadData = this.getThread(contextId);

    for (const message of threadData?.orderStatuses ?? []) {
      const orderStatus = message.body as OrderStatus;
      if (orderStatus.orderStatus !== Status.PENDING) {
        return orderStatus.orderStatus;
      }
    }
    return Status.PENDING;
  }

  // Useful for displaying threads in home page of DIDPay
  public getThread(contextId: string): ThreadData | undefined {
    return this.threadMap.get(contextId);
  }

  // TODO: or would it be better to query by schema (Quote, Rfq) even tho it's async?
  public getLatestThreadMessage(
    contextId: string
  ): TbDEXMessage<'rfq' | 'quote'> | undefined {
    const threadData = this.getThread(contextId);

    if (!threadData) {
      return undefined;
    }
    if (threadData.quote) {
      return threadData.quote;
    }
    if (threadData.rfq) {
      return threadData.rfq;
    }
    return undefined;
  }
}
