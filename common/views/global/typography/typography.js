// @flow
import PrimaryLink from '../../components/PrimaryLink/PrimaryLink';

type Props = {|
  fonts: Array<{|
    name: string,
    example: string,
    size: string,
    spacing: string,
    lineHeight: string,
    usage: string
  |}>
|}

const Typography = ({fonts}: Props) => (
  <div>
    <div className='styleguide__font'>
      <h2 className='styleguide__font__name'>Primary link</h2>
      <div>
        <PrimaryLink name='Full event details' url='#' />
      </div>
      <h2 className='styleguide__font__usage-title'>Usage:</h2>
      <p className='styleguide__font__usage-text'>Used to highlight more information, as an onward journey, link to a page or a category. Uses text-decoration property for underline.</p>
    </div>
    <div className='styleguide__font'>
      <h2 className='styleguide__font__name'>Secondary link</h2>
      <div className='has-secondary-links'><p className='font-hnl4-s no-margin'><a href='#'>Opening hours</a></p></div>
      <h2 className='styleguide__font__usage-title'>Usage:</h2>
      <p className='styleguide__font__usage-text'>Utility text link which may be used contextually or standalone. Uses text-decoration property for underline.</p>
    </div>
    <div className='styleguide__font'>
      <h2 className='styleguide__font__name'>Body text link</h2>
      <div className='body-text'><p className='no-margin'>There has even been a (failed) <a href='https://www.nytimes.com/2015/10/15/us/court-rules-hot-yoga-isnt-entitled-to-copyright.html'>attempt to copyright a yoga system</a>.</p></div>
      <h2 className='styleguide__font__usage-title'>Usage:</h2>
      <p className='styleguide__font__usage-text'>Used in the main body copy. These are animated links which form part of the experience language. Uses border-bottom property for underline.</p>
    </div>

    {fonts.map(font => (
      <div key={font.name} className='styleguide__font'>
        <h2 className='styleguide__font__name'>{font.name}</h2>
        <p className={`styleguide__font__example--${font.name}`}>{font.example}</p>
        <dl className='styleguide__font__properties'>
          <dt className='styleguide__font__property'>Font-size:</dt>
          <dd className='styleguide__font__value'>{font.size}</dd>
          <dt className='styleguide__font__property'>Letter-spacing:</dt>
          <dd className='styleguide__font__value'>{font.spacing}</dd>
          <dt className='styleguide__font__property'>Line-height:</dt>
          <dd className='styleguide__font__value'>{font.lineHeight}</dd>
        </dl>
        <h2 className='styleguide__font__usage-title'>Usage:</h2>
        <p className='styleguide__font__usage-text'>{font.usage}</p>
      </div>
    ))}
  </div>
);

export default Typography;
