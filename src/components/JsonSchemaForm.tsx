import React from 'react'
import Form, { ThemeProps, withTheme } from '@rjsf/core'
import validator from '@rjsf/validator-ajv8'
import { RJSFSchema, FieldProps, RegistryFieldsType } from '@rjsf/utils'

class StringFieldTemplate extends React.Component<FieldProps> {
  render() {
    return (
      <>
        <div key={this.props.name}>
          <label className="block text-sm font-medium leading-6 text-white mt-4 mb-2">
            {this.props.name}
          </label>
  
          <input
            type="text"
            id={'element.content.key'}
            className="block w-full rounded-md border-0 py-1.5 pl-7 pr-12 text-white bg-neutral-900 ring-1 ring-inset ring-transparent placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder={`Enter ${this.props.name}`}
            value={this.props.formData}
            onChange={(event) => this.props.onChange(event.target.value)}
          />
        </div>
      </>
    )
  }
}

function DescriptionFieldTemplate() {
  return (
    <></>
  )
}

function TitleFieldTemplate() {
  return (
    <></>
  )
}

const fieldTemplates: RegistryFieldsType = {
  StringField: StringFieldTemplate,
}

const themeObject: ThemeProps = { fields: fieldTemplates }
export const JsonSchemaForm = withTheme(themeObject)

JsonSchemaForm.defaultProps = {
  validator: validator,
  uiSchema: {
    'ui:submitButtonOptions': {
      norender: true,
    },
    'ui:globalOptions': {
      label: false,
    }
  },
  templates: { DescriptionFieldTemplate, TitleFieldTemplate }
}