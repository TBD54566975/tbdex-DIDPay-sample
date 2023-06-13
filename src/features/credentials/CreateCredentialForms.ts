import { Form } from '../../components/DialogForm/DialogFormTypes';

const warningSubtitle =
  'PLEASE DO NOT INPUT REAL INFO! THIS IS JUST FOR TESTING!';

export const KycVcForm: Form = {
  title: 'KYC Verifiable Credential',
  subtitle: warningSubtitle,
  type: 'KYCAMLAttestation',
  fields: [
    { name: 'fullName', label: 'Full Name' },
    { name: 'dob', label: 'Date of Birth' },
  ],
};

export const AchVcForm: Form = {
  title: 'ACH Verifiable Credential',
  subtitle: warningSubtitle,
  type: 'ACHAttestation',
  fields: [
    { name: 'accountNumber', label: 'Account Number' },
    { name: 'routingNumber', label: 'Routing Number' },
  ],
};

export const BtcVcForm: Form = {
  title: 'Bitcoin Verifiable Credential',
  subtitle: warningSubtitle,
  type: 'BTCAttestation',
  fields: [{ name: 'btcAddress', label: 'Bitcoin Wallet Address' }],
};
