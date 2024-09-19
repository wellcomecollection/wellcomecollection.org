'use client';
import { SliceZone } from '@prismicio/react';
import { SliceSimulator } from '@slicemachine/adapter-next/simulator';

import { getServerData } from '@weco/common/server-data';
import { components } from '@weco/common/views/slices';

export const getServerSideProps = async context => {
  const serverData = await getServerData(context);

  return {
    props: {
      serverData,
    },
  };
};

export default function SliceSimulatorPage() {
  return (
    <SliceSimulator
      sliceZone={props => <SliceZone {...props} components={components} />}
    />
  );
}
