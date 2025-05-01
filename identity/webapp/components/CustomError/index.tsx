import { FunctionComponent, PropsWithChildren } from 'react';

import { SectionHeading } from '@weco/identity/components/styled/layouts';

type Props = PropsWithChildren<{
  errorDescription: string;
}>;

const CustomError: FunctionComponent<Props> = ({
  errorDescription,
  children,
}) => {
  switch (errorDescription) {
    case 'user is blocked':
      return (
        <>
          <SectionHeading as="h1">Library account blocked</SectionHeading>
          <p>
            Your account can no longer be accessed. Please email{' '}
            <a href="mailto:library@wellcomecollection.org">
              library@wellcomecollection.org
            </a>{' '}
            for assistance.
          </p>
        </>
      );
    default:
      return (
        <>
          <SectionHeading as="h1">An error occurred</SectionHeading>
          <p>{errorDescription}</p>
          {children}
        </>
      );
  }
};

export default CustomError;
