import { useRouter } from 'next/router';
import { EditedUser } from '../interfaces';
import { useMutation } from './useMutation';

type UpdateUserInfoMutation = {
  isLoading: boolean;
  updateUserInfo: (editedUserInfo: EditedUser) => Promise<void>;
};

export function useUpdateUserInfo(): UpdateUserInfoMutation {
  const router = useRouter();
  const { userId } = router.query;
  const { mutate, isLoading } = useMutation<EditedUser>(`/api/user/${userId}`);

  return { updateUserInfo: mutate, isLoading };
}
