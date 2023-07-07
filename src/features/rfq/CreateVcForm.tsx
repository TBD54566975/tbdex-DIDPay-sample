import { useState } from 'react';
import { RJSFSchema, FieldProps, RegistryFieldsType } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';
import Form, { ThemeProps, withTheme } from '@rjsf/core';
import React from 'react';

type CreateVcFormProps = {
  schema: RJSFSchema;
  onSubmit: (formData: any) => void;
  onBack: (formData: any) => void;
};

class VcStringFieldTemplate extends React.Component<FieldProps> {
  render() {
    return (
      <>
        <div key={this.props.name}>
          <label className="block text-sm font-medium leading-6 text-white">
            {this.props.name}
          </label>

          <input
            type="text"
            id={'element.content.key'}
            className="block w-full rounded-md border-0 py-1.5 pl-7 pr-12 text-white bg-neutral-900 ring-1 ring-inset ring-transparent placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder={`Enter ${this.props.name}`}
            onChange={(event) => this.props.onChange(event.target.value)}
          />
        </div>
      </>
    );
  }
}

const vcFieldTemplate: RegistryFieldsType = {
  StringField: VcStringFieldTemplate,
};

const ThemeObject: ThemeProps = { fields: vcFieldTemplate };
const VcCreationForm = withTheme(ThemeObject);

const uiSchema = {
  'ui:submitButtonOptions': {
    norender: true,
  },
};

export function CreateVcForm({ schema, onSubmit, onBack }: CreateVcFormProps) {
  const [formData, setFormData] = useState<any>(undefined);

  const handleNext = () => {
    // const formData: PaymentFormData = {
    //   PaymentMethodKind,
    //   1
    // };
    onSubmit(formData);
  };

  const handleBack = (formData: any) => {
    // const formData: PaymentFormData = {
    //   credential,
    // };
    onBack(undefined);
  };

  const handleOnChange = (e: any) => {
    console.log(e.formData);
    setFormData(e.formData);
  };

  return (
    <div className="mt-4 mb-8 pl-8 pr-8">
      <div className=" text-black">
        <VcCreationForm
          schema={schema}
          uiSchema={uiSchema}
          formData={formData}
          validator={validator}
          onChange={handleOnChange}
        />
      </div>
      <div className="mt-12 pl-8 pr-8 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-white"
          onClick={handleBack}
        >
          Back
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}
