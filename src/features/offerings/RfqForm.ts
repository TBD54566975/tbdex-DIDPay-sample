import { Form } from '../../components/DialogForm/DialogFormTypes';
import { Offering } from '../../tbDexTypes';

export type RfqForm = Form & {
  offering_id: string;
  product: string;
};

export function createRfqForm(offering: Offering): RfqForm {
  return {
    title: 'Request for Quote',
    subtitle: 'Fill out the below information to get a quote from the PFI!',
    offering_id: offering.id,
    product: offering.pair,
    fields: [{ name: 'size', label: 'Amount' }],
  };
}
