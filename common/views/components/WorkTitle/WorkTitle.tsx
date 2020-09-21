const WorkTitle = ({ title }: { title: string }) => (
  <span dangerouslySetInnerHTML={{ __html: title }} />
);

export default WorkTitle;
