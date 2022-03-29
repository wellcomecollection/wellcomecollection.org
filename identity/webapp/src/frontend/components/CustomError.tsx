import { ReactElement, FC, PropsWithChildren } from 'react';
import { SectionHeading } from './Layout.style';
type Props = PropsWithChildren<{
  errorDescription: string;
}>;

const CustomError: FC<Props> = ({ errorDescription, children }) => {
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
      return children as ReactElement;
  }
};

export default CustomError;
