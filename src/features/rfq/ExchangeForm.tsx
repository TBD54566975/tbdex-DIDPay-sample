import { Fragment, useState } from 'react';
import { getCurrencySymbol, BTC } from './FormTypes';
import { Offering } from '@tbd54566975/tbdex';
import currency from 'currency.js';

type PriceInputProps = {
  offering: Offering;
  counterUnits: string;
  onChange: (newValue: string) => void;
};

export type ExchangeFormData = {
  amount: string;
};

type ExchangeFormProps = {
  offering: Offering;
  exchangeData: ExchangeFormData;
  onSubmit: (formData: ExchangeFormData) => void;
};

function PriceInput({ offering, counterUnits, onChange }: PriceInputProps) {
  // Extracting base currency and counter currency from the pair
  const parsedUnitPrice = parseFloat(offering.unitPrice.replace(/,/g, ''));
  const parsedMin = parseFloat(offering.min);
  const parsedMax = parseFloat(offering.max);

  const [isAmountOutsideRange, setIsAmountOutsideRange] = useState(false);
  const [convertedUnits, setConvertedUnits] = useState(
    convertToBaseUnits(counterUnits)
  );

  function convertToBaseUnits(counterUnits: string) {
    if (counterUnits !== '') {
      const parsedCounterUnits = parseFloat(counterUnits);
      return (parsedCounterUnits / parsedUnitPrice).toString();
    } else {
      return '';
    }
  }

  // TODO: this doesnt support decimals properly
  function formatUnits(input: string, decimalLength: number): string {
    // Remove any non-numeric and non-decimal characters except the first decimal point
    const numericValue = input.replace(/[^\d.]/g, (match, offset) => {
      if (match === '.') {
        // Allow the first decimal point
        return offset === 0 ? match : '';
      }
      return '';
    });

    // Remove additional decimal points if present
    const decimalIndex = numericValue.indexOf('.');
    if (decimalIndex !== -1) {
      const afterDecimal = numericValue.slice(decimalIndex + 1);
      const remainingDecimals = afterDecimal.slice(0, decimalLength);
      return `${numericValue.slice(0, decimalIndex)}.${remainingDecimals}`;
    }

    return numericValue;
  }

  const handleCounterUnitsChange = (counterUnits: string) => {
    const formattedCounterUnits = formatUnits(counterUnits, 2);
    onChange(formattedCounterUnits);

    // change decimal point based on what currency it is
    const formattedBaseUnits = formatUnits(
      convertToBaseUnits(formattedCounterUnits),
      8
    );
    setConvertedUnits(BTC(formattedBaseUnits).format());

    const parsedAmount = parseFloat(formattedCounterUnits);
    setIsAmountOutsideRange(
      parsedAmount < parsedMin || parsedAmount > parsedMax
    );
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
            {getCurrencySymbol(offering.quoteCurrency)}
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
            {offering.quoteCurrency}
          </span>
        </div>
      </div>
      {counterUnits !== '' && isAmountOutsideRange ? (
        <p className="mt-2 text-sm text-red-600" id="email-error">
          {parseFloat(counterUnits) < parsedMin
            ? `Minimum order is ${currency(offering.min).format()}`
            : parseFloat(counterUnits) > parsedMax
            ? `Maximum order is 
              ${currency(offering.max).format()}`
            : null}
        </p>
      ) : null}
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
            {getCurrencySymbol(offering.baseCurrency)}
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
            {offering.baseCurrency}
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
  const parsedMin = parseFloat(offering.min);
  const parsedMax = parseFloat(offering.max);

  const handleInputChange = (amount: string) => {
    setAmount(amount);
  };

  const handleNext = () => {
    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedAmount)) {
      // Return or handle the case when the amount is not a valid number
      return;
    }

    const isAmountOutsideRange =
      parsedAmount < parsedMin || parsedAmount > parsedMax;
    if (!isAmountOutsideRange) {
      const formData: ExchangeFormData = {
        amount: parsedAmount.toString(),
      };
      onSubmit(formData);
    }
  };

  return (
    <>
      <div className="mt-8 mb-8 pl-8 pr-8">
        <div className="mt-8">
          <PriceInput
            offering={offering}
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
