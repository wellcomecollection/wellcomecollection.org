import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';

import { AppErrorProps } from '@weco/common/services/app';
import { cacheTTL, setCacheControl } from '@weco/content/utils/setCacheControl';

import * as page from './index';

export const getServerSideProps: GetServerSideProps<
  (page.NewProps | page.Props) | AppErrorProps
> = async context => {
  setCacheControl(context.res, cacheTTL.events);

  return page.getServerSideProps(context);
};

const EventsCurrentAndComingUp: FunctionComponent<page.Props> = (
  props: page.Props
) => <page.default {...props}></page.default>;

export default EventsCurrentAndComingUp;
