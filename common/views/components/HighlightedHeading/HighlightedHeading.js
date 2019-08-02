import Space from '../styled/Space';

type Props = {|
  text: string,
|};

const HighlightedHeading = ({ text }: Props) => {
  return (
    <h1 className="h1">
      <Space
        v={{
          size: 's',
          properties: ['padding-top', 'padding-bottom'],
        }}
        className={`highlighted-heading bg-white padding-left-12 padding-right-12`}
      >
        {text}
      </Space>
    </h1>
  );
};

export default HighlightedHeading;
