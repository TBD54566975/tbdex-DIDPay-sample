import { CreateCredentialForm } from './CreateCredentialTypes';

const warningSubtitle =
  'PLEASE DO NOT INPUT REAL INFO! THIS IS JUST FOR TESTING!';

export const KycVcForm: CreateCredentialForm = {
  title: 'KYC Verifiable Credential',
  subtitle: warningSubtitle,
  type: 'KYCAMLAttestation',
  fields: [
    { name: 'fullName', label: 'Full Name' },
    { name: 'dob', label: 'Date of Birth' },
  ],
};

export const AchVcForm: CreateCredentialForm = {
  title: 'ACH Verifiable Credential',
  subtitle: warningSubtitle,
  type: 'ACHAttestation',
  fields: [
    { name: 'accountNumber', label: 'Account Number' },
    { name: 'routingNumber', label: 'Routing Number' },
  ],
};

export const BtcVcForm: CreateCredentialForm = {
  title: 'Bitcoin Verifiable Credential',
  subtitle: warningSubtitle,
  type: 'BTCAttestation',
  fields: [{ name: 'btcAddress', label: 'Bitcoin Wallet Address' }],
};
