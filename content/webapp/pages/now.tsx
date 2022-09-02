import { FC } from 'react';
import { GetServerSideProps } from 'next';
import { AppErrorProps } from '@weco/common/views/pages/_app';
import { removeUndefinedProps } from '@weco/common/utils/json';

type Props = {
  now: Date;
};

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async context => {
    return {
      props: removeUndefinedProps({
        now: new Date(),
      }),
    };
  };

const NowPage: FC<Props> = ({ now }) => {
  return (
    <>
      <p>now = {now}</p>
      <p>typeof now = {typeof now}</p>
    </>
  );
};

export default NowPage;
