import axios from 'axios';
import { useRouter } from 'next/router';
import { EditedUserInfo } from '../types/UserInfo';

type UpdateUserInfoMutation = {
  updateUserInfo: (editedUserInfo: EditedUserInfo) => Promise<void>;
};

export function useUpdateUserInfo(): UpdateUserInfoMutation {
  const router = useRouter();
  const { userId } = router.query;

  const updateUserInfo = async (editedUserInfo: EditedUserInfo) => {
    await axios.put(`/api/user/${userId}`, editedUserInfo);
  };

  return { updateUserInfo };
}
