import { FunctionComponent, ReactElement } from 'react';
import styled from 'styled-components';

import HTMLDateAndTime from '@weco/common/views/components/HTMLDateAndTime';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import { Book } from '@weco/content/types/books';

const MetadataKey = styled(GridCell).attrs({
  as: 'dt',
})`
  margin: 0;
`;

const MetadataValue = styled(GridCell).attrs({
  as: 'dd',
})`
  margin: 0;
`;

type MetadataProps = {
  label: string;
  value: ReactElement | string | undefined;
};

const Metadata: FunctionComponent<MetadataProps> = ({ label, value }) => (
  <>
    <MetadataKey
      $sizeMap={{
        s: [4],
        m: [4],
        l: [4],
        xl: [4],
      }}
    >
      {label}
    </MetadataKey>
    <MetadataValue
      $sizeMap={{
        s: [8],
        m: [8],
        l: [8],
        xl: [8],
      }}
    >
      {value}
    </MetadataValue>
  </>
);

const BookMetadata: FunctionComponent<{ book: Book }> = ({ book }) => (
  <Space
    as="dl"
    $v={{ size: 'm', properties: ['margin-top', 'margin-bottom'] }}
  >
    <Grid>
      {book.datePublished && (
        <Metadata
          label="Date published"
          value={<HTMLDateAndTime variant="date" date={book.datePublished} />}
        />
      )}
      <Metadata label="Format" value={book.format} />
      <Metadata label="Extent" value={book.extent} />
      <Metadata label="ISBN" value={book.isbn} />
    </Grid>
  </Space>
);

export default BookMetadata;
