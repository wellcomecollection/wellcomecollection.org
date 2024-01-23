import { FunctionComponent } from 'react';
import { TransformedRange } from '@weco/content/types/manifest';
import {
  getLabelString,
  isTransformedCanvas,
  isTransformedRange,
} from '@weco/content/utils/iiif/v3';
import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper/ConditionalWrapper';
import { InternationalString } from '@iiif/presentation-3';

type Format = {
  format: string | undefined;
};
const Format: FunctionComponent<Format> = ({ format }) => {
  if (format) {
    return <>{`, format: ${format}`}</>;
  } else {
    return null;
  }
};

type FileLinkProps = {
  canvasLabel: string | undefined;
  itemLabel: InternationalString | null | undefined;
  fileUri: string | undefined;
  format: string | undefined;
};
// TODO determine exactly what we want to display
// N.B. canvas and item labels are often the same, but item label is not always present
// Should we just show item label and fall back to canvas label if the item label isn't present?
// If so, maybe do this at the transform stage and only have one label
const FileLink: FunctionComponent<FileLinkProps> = ({
  canvasLabel,
  itemLabel,
  format,
  fileUri,
  /*, fileSize - is file size actually available in the data? */
}) => {
  const itemLabelString = itemLabel && getLabelString(itemLabel);
  return (
    <a href={fileUri}>
      {`canvas label: ${canvasLabel}`}
      <br />
      {`annotation item label: ${itemLabelString}`}
      <br />
      {`format: ${format}`}
    </a>
  );
};

const DownloadList = ({
  structures,
  includeOuterUl = true,
}: {
  structures: TransformedRange[];
  includeOuterUl?: boolean;
}) => {
  return (
    <>
      {/* <pre>{JSON.stringify(structures, null, 2)}</pre> */}
      <ConditionalWrapper
        condition={includeOuterUl}
        wrapper={children => <ul>{children}</ul>}
      >
        {structures?.map((range, i) => {
          const rangeItems = range?.items || [];
          return (
            <li key={i}>
              <span style={{ fontSize: '18px' }}>
                {getLabelString(range.label)}
              </span>
              {rangeItems.length > 0 && (
                <ul>
                  {rangeItems.map((item, i) => {
                    if (isTransformedCanvas(item)) {
                      if (item?.original) {
                        return (
                          <li key={item.original?.originalFile || i}>
                            <FileLink
                              canvasLabel={item.label}
                              itemLabel={item.original.label}
                              fileUri={item.original?.originalFile}
                              format={item.original?.format}
                            />
                          </li>
                        );
                      } else {
                        if (item.display) {
                          return item.display.flat().map((displayItem, i) => {
                            // TODO why need to flat(), can we get rid higher up the chain?
                            return (
                              <li key={i}>
                                {/* TODO temporary strong tag to easily id non born digital items in the UI */}
                                <strong>
                                  <FileLink
                                    canvasLabel={item.label}
                                    itemLabel={displayItem.label}
                                    fileUri={displayItem.id}
                                    format={displayItem.format}
                                  />
                                </strong>
                              </li>
                            );
                            // } // TODO is this needed?
                            // else {
                            //   return (
                            //     <li key={i}>
                            //       <strong>non born digital file</strong>
                            //     </li>
                            //   );
                            // }
                          });
                        } else {
                          return (
                            <li key={i}>
                              <strong>non born digital file</strong>
                            </li>
                          );
                        }
                      }
                    } else if (isTransformedRange(item)) {
                      return (
                        <DownloadList
                          key={i}
                          structures={[item]}
                          includeOuterUl={false}
                        />
                      );
                    } else {
                      return null;
                    }
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ConditionalWrapper>
    </>
  );
};

export default DownloadList;
