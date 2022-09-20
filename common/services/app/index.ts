import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextPageContext,
} from 'next';

export type AppErrorProps = Required<Pick<NextPageContext, 'err'>>;

export const appError = (
  context: GetServerSidePropsContext,
  statusCode: number,
  message: string
): GetServerSidePropsResult<AppErrorProps> => {
  context.res.statusCode = statusCode;
  return {
    props: {
      err: { name: 'Error', statusCode, message },
    },
  };
};
