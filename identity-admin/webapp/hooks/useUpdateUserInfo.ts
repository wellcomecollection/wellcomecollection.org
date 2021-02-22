import axios from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { EditedUserInfo } from '../types/UserInfo';

type UpdateUserInfoMutation = {
  isLoading: boolean;
  updateUserInfo: (editedUserInfo: EditedUserInfo) => Promise<void>;
};

export function useUpdateUserInfo(): UpdateUserInfoMutation {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { userId } = router.query;

  const updateUserInfo = async (editedUserInfo: EditedUserInfo) => {
    setIsLoading(true);
    await axios
      .put(`/api/user/${userId}`, editedUserInfo)
      .then(() => setIsLoading(false));
  };

  return { updateUserInfo, isLoading };
}
