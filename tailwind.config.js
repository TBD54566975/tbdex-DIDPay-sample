/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/features/app/root/RootPageTailwind.tsx',
    './src/features/credentials/VerifiableCredentialsPageTailwind.tsx',
    './src/features/offerings/OfferingsPageTailwind.tsx',
    './src/features/offerings/OfferingsListTailwind.tsx',
    './src/features/orders/OrdersPageTailwind.tsx',
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
};
