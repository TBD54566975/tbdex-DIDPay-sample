// TODO: Types here should be pulled out into the
// tbDEX protocol library once it's solidified a bit more.
// That way, any app that uses the tbDEX protocol can
// get the types to interact with it.

export type RFQ = {
  offering_id: string;
  product: string;
  size: number;
  presentation_submission: object;
};

export type Offering = {
  id: string;
  pair: string;
  unitPrice: string;
  fee: string;
  min?: string;
  max?: string;
  payinInstruments: PaymentInstrument[];
  payoutInstruments: PaymentInstrument[];
  presentationRequest: object;
};

export type PaymentInstrument = {
  kind: string;
  fee?: string;
  presentationRequest?: object;
};
