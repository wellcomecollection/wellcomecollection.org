import { spacing } from '../../../utils/classnames';
import VerticalSpace from '../styled/VerticalSpace';

type Props = {|
  text: string,
|};

const HighlightedHeading = ({ text }: Props) => {
  return (
    <h1 className="h1">
      <VerticalSpace
        size="s"
        properties={['padding-top', 'padding-bottom']}
        className={`highlighted-heading bg-white ${spacing(
          { s: 2 },
          { padding: ['left', 'right'] }
        )}`}
      >
        {text}
      </VerticalSpace>
    </h1>
  );
};

export default HighlightedHeading;
