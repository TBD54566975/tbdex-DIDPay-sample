type ProgressPanelProps = {
  steps: Step[];
  currentStep: number;
};

export type Step = {
  name: string;
  status: 'complete' | 'current' | 'upcoming';
};

export const steps: Step[] = [
  { name: 'Exchange', status: 'complete' },
  { name: 'Payments', status: 'current' },
  { name: 'Select VCs', status: 'upcoming' },
  { name: 'Review', status: 'upcoming' },
];

export function ProgressPanel({ steps, currentStep }: ProgressPanelProps) {
  return (
    <nav className="flex items-center justify-center" aria-label="Progress">
      <p className="text-sm text-yellow-300 font-medium">
        {steps[currentStep].name}
      </p>
      <ol className="ml-8 flex items-center space-x-5">
        {steps.map((step, index) => {
          let status = 'upcoming';
          if (index < currentStep) {
            status = 'complete';
          } else if (index === currentStep) {
            status = 'current';
          }

          return (
            <li key={step.name}>
              {status === 'complete' ? (
                <div className="block h-2.5 w-2.5 rounded-full bg-indigo-600 hover:bg-indigo-900">
                  <span className="sr-only">{step.name}</span>
                </div>
              ) : status === 'current' ? (
                <div
                  className="relative flex items-center justify-center"
                  aria-current="step"
                >
                  <span
                    className="absolute flex h-5 w-5 p-px"
                    aria-hidden="true"
                  >
                    <span className="h-full w-full rounded-full bg-indigo-600 opacity-30" />
                  </span>
                  <span
                    className="relative block h-2.5 w-2.5 rounded-full bg-indigo-600"
                    aria-hidden="true"
                  />
                  <span className="sr-only">{step.name}</span>
                </div>
              ) : (
                <div className="block h-2.5 w-2.5 rounded-full bg-gray-200 hover:bg-gray-400">
                  <span className="sr-only">{step.name}</span>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
