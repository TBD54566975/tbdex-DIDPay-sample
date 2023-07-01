import { useState } from 'react';
import { RfqModal } from '../rfq/RfqModal';
import { useNavigate, useLocation } from 'react-router-dom';
import { OfferingCard } from './OfferingCard';
import { Offering } from '@tbd54566975/tbdex';

export function OfferingsPage() {
  const [rfqModalOpen, setRfqModalOpen] = useState(false);
  const [selectedOffering, setSelectedOffering] = useState<
    Offering | undefined
  >(); // TODO: fix

  const navigate = useNavigate();
  const location = useLocation();
  const { offerings } = location.state || {}; // Use destructuring with default value

  const handleRequestQuote = (offering: Offering) => {
    setSelectedOffering(offering);
    setRfqModalOpen(true);
  };

  const handleModalClose = (hasSubmitted: boolean) => {
    setRfqModalOpen(false);
    if (hasSubmitted) {
      navigate('/');
    } else {
      navigate('/offerings', { state: { offerings } });
    }
  };

  return (
    <div>
      {offerings &&
        offerings.map((offering: Offering, index: string) => (
          <div className="pb-8 pl-4 pr-4" key={index}>
            <OfferingCard
              offering={offering}
              handleAction={() => handleRequestQuote(offering)}
            ></OfferingCard>
          </div>
        ))}
      {rfqModalOpen && selectedOffering && (
        <RfqModal
          offering={selectedOffering}
          isOpen={rfqModalOpen}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}
