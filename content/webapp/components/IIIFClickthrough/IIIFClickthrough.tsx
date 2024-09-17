import {
  FunctionComponent,
  PropsWithChildren,
  useEffect,
  useState,
} from 'react';
import { font } from '@weco/common/utils/classnames';
import Button from '@weco/common/views/components/Buttons';
import Space from '@weco/common/views/components/styled/Space';
import styled from 'styled-components';
import useShowClickthrough from '@weco/content/hooks/useShowClickthrough';
import { TransformedAuthService } from '@weco/content/utils/iiif/v3';

const IframeAuthMessage = styled.iframe`
  display: none;
`;
const iframeId = 'authMessage';
function reloadAuthIframe(document: Document, id: string) {
  const authMessageIframe = document.getElementById(id) as HTMLIFrameElement;

  // assigning the iframe src to itself reloads the iframe and refires the window.message event
  // eslint-disable-next-line no-self-assign
  authMessageIframe.src = authMessageIframe.src;
}

type Props = PropsWithChildren<{
  clickThroughService: TransformedAuthService | undefined;
  tokenService: TransformedAuthService | undefined;
}>;

const IIIFClickthrough: FunctionComponent<Props> = ({
  clickThroughService,
  tokenService,
  children,
}) => {
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
          title="IIIF Authentication iframe for cross-domain messaging"
          src={`${tokenService.id}?messageId=1&origin=${origin}`}
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
          {clickThroughService?.id && origin && (
            <Space as="span" $h={{ size: 'm', properties: ['margin-right'] }}>
              <Button
                variant="ButtonSolid"
                dataGtmTrigger="show_the_content"
                text="Show the content"
                clickHandler={() => {
                  const authServiceWindow = window.open(
                    `${clickThroughService?.id || ''}?origin=${origin}`
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
