import Icon from '../../components/Icon/Icon';

type Props = {
  allIcons: Array<{|
    name: string,
    title?: string,
    extraClasses: Array<?string>,
    attrs: Array<?string>
  |}>
}

const AllIcons = ({allIcons}: Props) => (
  <div>
    {allIcons.map(icon => (
      <div key={icon.name} className='styleguide__icon'>
        <p className='styleguide__icon__id'>{icon.name}</p>
        <Icon name={icon.name} />
      </div>
    ))}
  </div>
);

export default AllIcons;
