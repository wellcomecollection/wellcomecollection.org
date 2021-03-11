import React, { useState } from 'react';
import ReactModal from 'react-modal';
import { DangerButton, Button } from '../Button';
import { useDeleteAccount } from '../../hooks/useDeleteAccount';
import styles from './DeleteAccount.module.css';

ReactModal.setAppElement('#__next');

export function DeleteAccount(): JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { deleteAccount } = useDeleteAccount();
  const handleConfirm = () => deleteAccount();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <DangerButton onClick={openModal}>Delete account</DangerButton>
      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className={styles.Modal}
        overlayClassName={styles.Overlay}
      >
        <p>Are you sure you want to delete this account?</p>
        <DangerButton onClick={handleConfirm}>Yes, delete account</DangerButton>
        <Button onClick={closeModal}>No, cancel this action</Button>
      </ReactModal>
    </>
  );
}
