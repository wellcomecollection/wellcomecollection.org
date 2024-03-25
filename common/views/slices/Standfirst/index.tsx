import { StandfirstSlice as SliceType } from '@weco/common/prismicio-types';
import { FunctionComponent } from 'react';
import { SliceComponentProps } from '@prismicio/react';
import { transformStandfirstSlice } from '@weco/content/services/prismic/transformers/body';
import PageHeaderStandfirst from '@weco/common/views/components/PageHeaderStandfirst/PageHeaderStandfirst';

type StandfirstProps = SliceComponentProps<SliceType>;

const Standfirst: FunctionComponent<StandfirstProps> = ({ slice }) => {
  const transformedSlice = transformStandfirstSlice(slice);
  return <PageHeaderStandfirst html={transformedSlice.value} />;
};

export default Standfirst;
