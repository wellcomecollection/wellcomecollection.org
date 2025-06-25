import { FunctionComponent } from 'react';

import CopyContent, { Props as CopyContentProps } from './CopyButtons.Content';
import CopyUrl, { Props as CopyUrlProps } from './CopyButtons.Url';

type Props =
  | (CopyContentProps & { variant: 'content' })
  | (CopyUrlProps & { variant: 'url' });

const CopyButtons: FunctionComponent<Props> = props => {
  const { variant } = props;

  return (
    <>
      {variant === 'content' ? (
        <CopyContent {...props} />
      ) : (
        <CopyUrl {...props} />
      )}
    </>
  );
};

export default CopyButtons;
