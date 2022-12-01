import { FunctionComponent, ReactNode, useEffect, useState } from 'react';
import { AuthClickThroughServiceWithPossibleServiceArray } from '../../../webapp/types/manifest';
import { AuthAccessTokenService } from '@iiif/presentation-3';
import { font } from '@weco/common/utils/classnames';
import { trackGaEvent } from '@weco/common/utils/ga';
import ButtonSolid from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import Space from '@weco/common/views/components/styled/Space';
import styled from 'styled-components';
import useShowClickthrough from '../../hooks/useShowClickthrough';

const IframeAuthMessage = styled.iframe`
  display: none;
`;
const iframeId = 'authMessage';
function reloadAuthIframe(document, id: string) {
  const authMessageIframe: HTMLIFrameElement = document.getElementById(id);
  // assigning the iframe src to itself reloads the iframe and refires the window.message event
  // eslint-disable-next-line no-self-assign
  authMessageIframe.src = authMessageIframe.src;
}

type Props = {
  clickThroughService:
    | AuthClickThroughServiceWithPossibleServiceArray
    | undefined;
  tokenService: AuthAccessTokenService | undefined;
  trackingId: string;
  children: ReactNode;
};

const IIIFClickthrough: FunctionComponent<Props> = ({
  clickThroughService,
  tokenService,
  trackingId,
  children,
}: Props) => {
  const [origin, setOrigin] = useState<string>();
  const showClickthroughMessage = useShowClickthrough(
    clickThroughService,
    tokenService
  );
  useEffect(() => {
    setOrigin(`${window.location.protocol}//${window.location.hostname}`);
  }, []);

  return clickThroughService && tokenService ? (
    <>
      {tokenService && origin && (
        <IframeAuthMessage
          id={iframeId}
          src={`${tokenService['@id']}?messageId=1&origin=${origin}`}
        />
      )}
      {showClickthroughMessage ? (
        <div className={font('intr', 5)}>
          {clickThroughService?.label && (
            <h2 className={font('intb', 4)}>{clickThroughService?.label}</h2>
          )}
          {clickThroughService?.description && (
            <p
              dangerouslySetInnerHTML={{
                __html: clickThroughService?.description,
              }}
            />
          )}
          {clickThroughService?.['@id'] && origin && (
            <Space as="span" h={{ size: 'm', properties: ['margin-right'] }}>
              <ButtonSolid
                text="Show the content"
                clickHandler={() => {
                  trackGaEvent({
                    category: 'ButtonSolidLink',
                    action: 'follow link "Show the content"',
                    label: `workId: ${trackingId}`,
                  });
                  const authServiceWindow = window.open(
                    `${clickThroughService?.['@id'] || ''}?origin=${origin}`
                  );
                  authServiceWindow &&
                    authServiceWindow.addEventListener('unload', function () {
                      reloadAuthIframe(document, iframeId);
                    });
                }}
              />
            </Space>
          )}
        </div>
      ) : (
        <>{children}</>
      )}
    </>
  ) : null;
};

export default IIIFClickthrough;
