import { useState } from 'react';
import { RfqModal } from '../rfq/RfqModal';
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
