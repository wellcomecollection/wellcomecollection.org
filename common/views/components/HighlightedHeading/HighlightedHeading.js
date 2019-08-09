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
        h={{ size: 'm', properties: ['padding-left', 'padding-right'] }}
        className={`highlighted-heading bg-white`}
      >
        {text}
      </Space>
    </h1>
  );
};

export default HighlightedHeading;
