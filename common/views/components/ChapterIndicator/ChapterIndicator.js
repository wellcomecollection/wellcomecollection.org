// @flow

const colorDataUris = {
  white: 'P///wAAACH5BAAAAAAALAAAAAABAAQAAAIChFEAOw==',
  red: 'P9DVQAAACH5BAAAAAAALAAAAAABAAQAAAIChFEAOw==',
  purple: 'IxHmQAAACH5BAAAAAAALAAAAAABAAQAAAIChFEAOw==',
  turquoise: 'Fy4vwAAACH5BAAAAAAALAAAAAABAAQAAAIChFEAOw==',
  orange: 'Oh1AAAAACH5BAAAAAAALAAAAAABAAQAAAIChFEAOw=='
};

export type Props = {|
  position: number,
  showSingle?: boolean,
  showTotal?: boolean,
  color: 'white' | 'red' | 'purple' | 'turquoise' | 'orange',
  commissionedLength: number,
  isFull?: boolean
|}

function buildMarkup(showSingle, commissionedLength, position, showTotal, color) {
  const repeat = new Array(showSingle ? 1 : commissionedLength);

  return Array.from(repeat).map((item, index) => {
    const srcUrl = index < position || showTotal
      ? `data:image/gif;base64,R0lGODlhAQAEAIAAA${colorDataUris[color]}`
      : `data:image/gif;base64,R0lGODlhAQAEAIAAA${colorDataUris['white']}`;

    return (
      <img key={index} alt='' className={`chapter-indicator__bar ${(index < position) || showTotal ? 'chapter-indicator__bar--filled' : ''}`}
        src={srcUrl} />
    );
  });
}

const ChapterIndicator = ({position, showSingle, color, showTotal, commissionedLength, isFull}: Props) => (
  <div
    aria-label={`part ${position} of ${commissionedLength}`}
    className={`chapter-indicator chapter-indicator--${color} ${isFull ? 'chapter-indicator--full' : ''}`}>
    {buildMarkup(showSingle, commissionedLength, position, showTotal, color)}
  </div>
);

export default ChapterIndicator;
