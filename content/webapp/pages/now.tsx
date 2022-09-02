import { FC } from 'react';
import { GetServerSideProps } from 'next';
import { AppErrorProps } from '@weco/common/views/pages/_app';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { getServerData } from '@weco/common/server-data';

type Props = {
  now: Date;
};

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async context => {
    const serverData = await getServerData(context);
    return {
      props: removeUndefinedProps({
        serverData,
        now: new Date(),
      }),
    };
  };

const NowPage: FC<Props> = ({ now }) => {
  return (
    <>
      <p>now = {now.toString()}</p>
      <p>typeof now = {typeof now}</p>
    </>
  );
};

export default NowPage;
