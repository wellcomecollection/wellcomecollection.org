import React, { useState } from 'react';
import ReactModal from 'react-modal';
import { DangerButton, Button } from '../Button';
import { useDeleteAccount } from '../../hooks/useDeleteAccount';
import styles from './DeleteAccount.module.css';
import { useRouter } from 'next/router';
import { User } from '../../interfaces';

ReactModal.setAppElement('#__next');

type DeleteAccountProps = Pick<User, 'userId'>;

export function DeleteAccount({ userId }: DeleteAccountProps): JSX.Element {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { deleteAccount } = useDeleteAccount(userId);

  const handleConfirm = () => {
    deleteAccount().then(() =>
      router.push({
        pathname: '/',
        query: {
          deletedUser: userId,
        },
      })
    );
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <li style={{ color: 'firebrick' }} onClick={openModal}>
        Delete account
      </li>
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
