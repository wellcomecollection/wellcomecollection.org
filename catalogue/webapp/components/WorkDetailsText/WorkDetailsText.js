// @flow

type Props = {| title: ?string, text: string[] |};

const WorkDetailsText = ({ title, text }: Props) => {
  return (
    <div className="spaced-text">
      {text.map((para, i) => {
        return <p key={i} dangerouslySetInnerHTML={{ __html: para }} />;
      })}
    </div>
  );
};

export default WorkDetailsText;
