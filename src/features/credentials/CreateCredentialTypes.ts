export type CreateCredentialForm = {
  title?: string;
  subtitle?: string;
  type: string;
  fields: FormField[];
};

type FormField = {
  name: string;
  label: string;
};

const warningSubtitle =
  'PLEASE DO NOT INPUT REAL INFO! THIS IS JUST FOR TESTING!';

export const CreateKycVcForm: CreateCredentialForm = {
  title: 'KYC Verifiable Credential',
  subtitle: warningSubtitle,
  type: 'KYCAMLAttestation',
  fields: [
    { name: 'fullName', label: 'Full Name' },
    { name: 'dob', label: 'Date of Birth' },
  ],
};

export const CreateAchVcForm: CreateCredentialForm = {
  title: 'ACH Verifiable Credential',
  subtitle: warningSubtitle,
  type: 'ACHAttestation',
  fields: [
    { name: 'accountNumber', label: 'Account Number' },
    { name: 'routingNumber', label: 'Routing Number' },
  ],
};

export const CreateBtcVcForm: CreateCredentialForm = {
  title: 'Bitcoin Verifiable Credential',
  subtitle: warningSubtitle,
  type: 'BTCAttestation',
  fields: [{ name: 'btcAddress', label: 'Bitcoin Wallet Address' }],
};
