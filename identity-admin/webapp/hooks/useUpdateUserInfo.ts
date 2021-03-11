import { useRouter } from 'next/router';
import { EditedUserInfo } from '../types/UserInfo';
import { useMutation } from './useMutation';

type UpdateUserInfoMutation = {
  isLoading: boolean;
  updateUserInfo: (editedUserInfo: EditedUserInfo) => Promise<void>;
};

export function useUpdateUserInfo(): UpdateUserInfoMutation {
  const router = useRouter();
  const { userId } = router.query;
  const { mutate, isLoading } = useMutation<EditedUserInfo>(
    `/api/user/${userId}`
  );

  return { updateUserInfo: mutate, isLoading };
}
