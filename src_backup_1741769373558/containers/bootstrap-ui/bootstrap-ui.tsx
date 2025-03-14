import { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { AuthModal } from '#containers/auth-modal';
import { CheckoutModal } from '#containers/checkout-modal';
import { ItemUsingModal } from '#containers/item-using-modal/item-using-modal';
import { SubscribeDoneModal } from '#containers/subscribe-done-modal';
import { UiSlice } from '#features/ui';

export function BootstrapUI({ children }: { children?: ReactNode }) {
  const currentModal = useSelector(UiSlice.selectors.currentModalType);

  return (
    <>
      {children}
      {currentModal && (
        <>
          {currentModal.modalType === 'auth' && <AuthModal />}

          {currentModal.modalType === 'purchase' && <CheckoutModal offer={currentModal.offer} />}

          {currentModal.modalType === 'subscribeDone' && <SubscribeDoneModal />}

          {currentModal.modalType === 'item-using' && <ItemUsingModal />}
        </>
      )}
    </>
  );
}
