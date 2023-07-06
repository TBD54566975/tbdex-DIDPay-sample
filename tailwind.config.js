/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/features/app/root/RootPage.tsx',
    './src/features/credentials/VerifiableCredentialsPage.tsx',
    './src/features/history/HistoryPage.tsx',
    './src/features/offerings/OfferingCard.tsx',
    './src/features/offerings/OfferingPage.tsx',
    './src/features/offerings/OfferingsSearch.tsx',
    './src/features/quotes/PaymentModal.tsx',
    './src/features/quotes/QuoteCard.tsx',
    './src/features/rfq/ExchangeForm.tsx',
    './src/features/rfq/PaymentForm.tsx',
    './src/features/rfq/ProgressPanel.tsx',
    './src/features/rfq/ReviewForm.tsx',
    './src/features/rfq/RfqModal.tsx',
    './src/features/rfq/VcForm.tsx',
    './src/features/threads/ThreadsPage.tsx',
    './src/features/threads/Thread.tsx',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
  darkMode: 'class',
};
