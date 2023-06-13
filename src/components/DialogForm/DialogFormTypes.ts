export type Form = {
  title?: string;
  subtitle?: string;
  type: string;
  fields: FormField[];
};

type FormField = {
  name: string;
  label: string;
};
