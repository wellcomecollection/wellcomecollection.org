import { NextPageContext } from 'next';

export type AppErrorProps = Required<Pick<NextPageContext, 'err'>>;
