import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';

import { StandfirstSlice as RawStandfirstSlice } from '@weco/common/prismicio-types';
import PageHeaderStandfirst from '@weco/common/views/components/PageHeaderStandfirst';
import { transformStandfirstSlice } from '@weco/content/services/prismic/transformers/body';

type StandfirstProps = SliceComponentProps<RawStandfirstSlice>;

const Standfirst: FunctionComponent<StandfirstProps> = ({ slice }) => {
  const transformedSlice = transformStandfirstSlice(slice);
  return <PageHeaderStandfirst html={transformedSlice.value} />;
};

export default Standfirst;
