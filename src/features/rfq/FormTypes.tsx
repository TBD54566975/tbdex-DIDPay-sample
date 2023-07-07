import { PaymentMethodKind } from '@tbd54566975/tbdex';
import currency from 'currency.js';

// TODO: get rid of this file!!

export type PaymentInstrument = {
  name: 'Debit Card' | 'Bitcoin Address';
};

export type Credential = {
  id: string;
  type: 'VerifiableCredential' | 'EmailCredential';
  issuer: Issuer;
  issuanceDate: string;
  credentialSubject: string;
  credentialSchema: string;
};

export type Issuer = {
  id: string;
  name: string;
};

export const BTC = (value: currency.Any) =>
  currency(value, { precision: 8, symbol: '' });

enum Currency {
  USD = '$',
  MXN = '$',
  GHA = '₵',
  BTC = '₿',
}

export function getCurrencySymbol(ticker: string): string {
  const currency = Currency[ticker as keyof typeof Currency];
  return currency || '';
}

export function paymentMethodKindToString(
  paymentMethodKind: PaymentMethodKind
) {
  if (paymentMethodKind === PaymentMethodKind.BITCOIN_ADDRESS) {
    return 'Bitcoin Address';
  } else if (paymentMethodKind === PaymentMethodKind.DEBIT_CARD) {
    return 'Debit Card';
  } else if (paymentMethodKind === PaymentMethodKind.SQUARE_PAY) {
    return 'Square Pay';
  }
}

export const credentials: Credential[] = [
  {
    id: 'https://tbd.xyz/credentials/3733',
    type: 'VerifiableCredential',
    issuer: {
      id: 'id:ion:EiDoh5LcA_jXtAdCKFxVcl8AHS10Vfhctsm8ARU4ekK93g',
      name: 'super trustworthy vc',
    },
    issuanceDate: '2017-03-12T19:46:24Z',
    credentialSubject: 'bleh',
    credentialSchema: 'bleh',
  },
  {
    id: 'https://tbd.xyz/credentials/1234',
    type: 'VerifiableCredential',
    issuer: {
      id: 'id:ion:EiDoh5LcA_jXtAdCKFxVcl8AHS10Vfhctsm8ARU4ekK93g',
      name: 'another not sketch VC',
    },
    issuanceDate: '2019-02-27T19:03:24Z',
    credentialSubject: 'bleh',
    credentialSchema: 'bleh',
  },
  {
    id: 'https://tbd.xyz/credentials/5678',
    type: 'EmailCredential',
    issuer: {
      id: 'id:ion:EiDoh5LcA_jXtAdCKFxVcl8AHS10Vfhctsm8ARU4ekK93g',
      name: 'wow an email vc',
    },
    issuanceDate: '2022-01-06T19:25:24Z',
    credentialSubject: 'bleh',
    credentialSchema: 'bleh',
  },
  {
    id: 'https://tbd.xyz/credentials/5678',
    type: 'VerifiableCredential',
    issuer: {
      id: 'id:ion:EiDoh5LcA_jXtAdCKFxVcl8AHS10Vfhctsm8ARU4ekK93g',
      name: 'guess what?',
    },
    issuanceDate: '2023-08-03T19:35:24Z',
    credentialSubject: 'bleh',
    credentialSchema: 'bleh',
  },
];
