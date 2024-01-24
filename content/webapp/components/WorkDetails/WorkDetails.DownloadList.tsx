import { FunctionComponent } from 'react';
import {
  TransformedRange,
  TransformedCanvas,
  CustomContentResource,
} from '@weco/content/types/manifest';
import {
  getLabelString,
  isTransformedCanvas,
  isTransformedRange,
} from '@weco/content/utils/iiif/v3';
import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper/ConditionalWrapper';
import {
  InternationalString,
  ContentResource,
  ChoiceBody,
} from '@iiif/presentation-3';

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

// We need to determine exactly what we want to display
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

const DownloadData: FunctionComponent<{
  canvas: TransformedCanvas;
  data: ContentResource | CustomContentResource | ChoiceBody;
}> = ({ canvas, data }) => {
  if (data.type === 'Choice') {
    return data.items.map(choiceItem => {
      if (typeof choiceItem !== 'string') {
        return (
          <li key={choiceItem.id}>
            <FileLink
              canvasLabel={canvas.label}
              itemLabel={choiceItem.label}
              fileUri={choiceItem.id}
              format={choiceItem.format}
            />
          </li>
        );
      } else return null;
    });
  } else {
    return (
      <li key={data.id}>
        <FileLink
          canvasLabel={canvas.label}
          itemLabel={data.label}
          fileUri={data.id}
          format={data.format}
        />
      </li>
    );
  }
};

const DownloadList: FunctionComponent<{
  structures: (TransformedRange | TransformedCanvas)[];
  includeOuterUl?: boolean;
}> = ({ structures, includeOuterUl = true }) => {
  return (
    <>
      <ConditionalWrapper
        condition={includeOuterUl}
        wrapper={children => <ul>{children}</ul>}
      >
        {structures?.map((range, i) => {
          const rangeItems = range?.items || [];
          return (
            <li key={i}>
              {isTransformedRange(range) && getLabelString(range.label)}
              {isTransformedCanvas(range) && (
                <>
                  {range.downloadData.map(data => {
                    return (
                      <DownloadData key={data.id} canvas={range} data={data} />
                    );
                  })}
                </>
              )}
              {rangeItems.length > 0 && (
                <ul>
                  {rangeItems.map((item, i) => {
                    if (isTransformedCanvas(item)) {
                      return item.downloadData.map(data => {
                        return (
                          <DownloadData
                            key={data.id}
                            canvas={item}
                            data={data}
                          />
                        );
                      });
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
