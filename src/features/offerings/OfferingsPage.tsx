import { useState } from 'react';
import {
  ChevronRightIcon,
  CodeBracketIcon,
  CreditCardIcon,
} from '@heroicons/react/20/solid';
import { RfqModal } from '../rfq/RfqModal';
import { Offering, PaymentMethodKind } from '@tbd54566975/tbdex';
import { useNavigate, useLocation } from 'react-router-dom';
import { OfferingCard } from './OfferingCard';

export function OfferingsPage() {
  const [rfqModalOpen, setRfqModalOpen] = useState(false);
  // const [selectedOffering, setSelectedOffering] = useState(offerings[0]); // TODO: fix

  const navigate = useNavigate();
  const location = useLocation();
  const { offering } = location.state || {}; // Use destructuring with default value

  const handleRequestQuote = () => {
    // setSelectedOffering(offering);
    setRfqModalOpen(true);
  };

  const handleModalClose = (hasSubmitted: boolean) => {
    setRfqModalOpen(false);
    if (hasSubmitted) {
      navigate('/');
    } else {
      navigate('/offering', { state: { offering: offering } });
    }
  };

  return (
    <div>
      <OfferingCard
        offering={offering}
        handleAction={handleRequestQuote}
      ></OfferingCard>
      {rfqModalOpen && (
        <RfqModal
          offering={offering}
          isOpen={rfqModalOpen}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}
