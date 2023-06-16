export type Form = {
  title?: string;
  subtitle?: string;
  fields: FormField[];
};

type FormField = {
  name: string;
  label: string;
};
