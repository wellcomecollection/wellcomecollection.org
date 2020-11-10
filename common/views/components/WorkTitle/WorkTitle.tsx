const WorkTitle = ({ title }: { title: string }): JSX.Element => (
  <span dangerouslySetInnerHTML={{ __html: title }} />
);

export default WorkTitle;
