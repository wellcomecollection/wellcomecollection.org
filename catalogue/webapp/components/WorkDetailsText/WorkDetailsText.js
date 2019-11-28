import WorkDetailsProperty from '../WorkDetailsProperty/WorkDetailsProperty';

// @flow

type Props = {| title: ?string, text: string[] |};

const WorkDetailsText = ({ title, text }: Props) => {
  return (
    <WorkDetailsProperty title={title}>
      <div className="spaced-text">
        {text.map((para, i) => {
          return <p key={i} dangerouslySetInnerHTML={{ __html: para }} />;
        })}
      </div>
    </WorkDetailsProperty>
  );
};

export default WorkDetailsText;
