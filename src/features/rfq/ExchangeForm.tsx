import { Fragment, useState } from 'react';
import { ExchangeFormData, getCurrencySymbol } from './FormTypes';
import { Offering } from '@tbd54566975/tbdex';

type PriceInputProps = {
  baseCurrency: string;
  quoteCurrency: string;
  unitPrice: string;
  counterUnits: string;
  onChange: (newValue: string) => void;
};

type ExchangeFormProps = {
  offering: Offering;
  exchangeData: ExchangeFormData;
  onSubmit: (formData: ExchangeFormData) => void;
};

function PriceInput({
  baseCurrency,
  quoteCurrency,
  unitPrice,
  counterUnits,
  onChange,
}: PriceInputProps) {
  // Extracting base currency and counter currency from the pair
  const parsedUnitPrice = parseFloat(unitPrice.replace(/,/g, ''));

  const [convertedUnits, setConvertedUnits] = useState(
    convertToBaseUnits(counterUnits)
  );

  function convertToBaseUnits(counterUnits: string) {
    if (counterUnits !== '') {
      const parsedCounterUnits = parseFloat(counterUnits);
      const calculatedValue = parsedCounterUnits / parsedUnitPrice;
      return calculatedValue.toFixed(8); // Limit to 8 decimals
    } else {
      return '';
    }
  }

  // TODO: this doesnt support decimals properly
  function formatCounterUnits(counterUnits: string) {
    // Remove non-numeric and non-decimal characters from the input value
    const numericValue = counterUnits.replace(/[^\d]/g, '');

    // Split the value into integer and decimal parts
    const [integerPart, decimalPart] = numericValue.split('.');

    // Format the integer part by adding commas every three digits
    const formattedIntegerPart = integerPart.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      ','
    );

    // Limit the decimal part to 8 decimal places
    const truncatedDecimalPart = decimalPart ? decimalPart.slice(0, 8) : '';

    // Combine the integer and decimal parts with a dot separator
    return `${formattedIntegerPart}${
      truncatedDecimalPart !== '' ? `.${truncatedDecimalPart}` : ''
    }`;
  }

  const handleCounterUnitsChange = (counterUnits: string) => {
    const formattedCounterUnits = formatCounterUnits(counterUnits);
    onChange(formattedCounterUnits);

    const convertedUnits = convertToBaseUnits(formattedCounterUnits);
    setConvertedUnits(convertedUnits);
  };

  return (
    <div>
      <label
        htmlFor="price"
        className="block text-sm font-medium leading-6 text-white"
      >
        {'Send'}
      </label>
      {/* First Price Input */}
      <div className="relative mt-2 rounded-md shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <span className="text-gray-500 sm:text-sm">
            {getCurrencySymbol(quoteCurrency)}
          </span>
        </div>
        <input
          type="text"
          name="price"
          id="price"
          className="block w-full rounded-md border-0 py-1.5 pl-7 pr-12 text-white bg-neutral-900 ring-1 ring-inset ring-transparent placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="0.00"
          aria-describedby="price-currency"
          value={counterUnits}
          onChange={(e) => handleCounterUnitsChange(e.target.value)}
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <span className="text-gray-500 sm:text-sm" id="price-currency">
            {quoteCurrency}
          </span>
        </div>
      </div>
      <label
        htmlFor="price"
        className="block text-sm font-medium leading-6 text-white mt-5"
      >
        {'Receive'}
      </label>{' '}
      {/* Second Price Input */}
      <div className="relative mt-2 rounded-md shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <span className="text-gray-500 sm:text-sm">
            {getCurrencySymbol(baseCurrency)}
          </span>
        </div>
        <input
          type="text"
          name="price"
          id="price"
          className="block w-full rounded-md border-0 py-1.5 pl-7 pr-12 text-white bg-neutral-900 ring-1 ring-inset ring-transparent placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="0.00"
          aria-describedby="price-currency"
          value={convertedUnits}
          readOnly
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <span className="text-gray-500 sm:text-sm" id="price-currency">
            {baseCurrency}
          </span>
        </div>
      </div>
    </div>
  );
}

export function ExchangeForm({
  offering,
  exchangeData,
  onSubmit,
}: ExchangeFormProps) {
  const [amount, setAmount] = useState(exchangeData.amount);

  const handleInputChange = (amount: string) => {
    setAmount(amount);
  };

  const handleNext = () => {
    const formData: ExchangeFormData = {
      amount,
    };
    onSubmit(formData);
  };

  return (
    <>
      <div className="mt-8 mb-8 pl-8 pr-8">
        <div className="mt-8">
          <PriceInput
            baseCurrency={offering.baseCurrency}
            quoteCurrency={offering.quoteCurrency}
            unitPrice={offering.unitPrice}
            counterUnits={amount}
            onChange={handleInputChange}
          />{' '}
        </div>
      </div>
      <div className="mt-12 pl-8 pr-8 flex items-center justify-end gap-x-6">
        <button
          type="submit"
          className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </>
  );
}
