// @flow
type Props = {|
  promoType: string,
  url: string,
  title: string,
  description: ?string
|}

const BasicPromo = ({ promoType, url, title, description }: Props) => (
  <a
    data-component={promoType}
    data-track-event={JSON.stringify({
      category: 'component',
      action: `${promoType}:click`
    })}
    href={url}
    className='promo'
  >
    <div className='promo__heading'>
      <h2 className='promo__title font-WB7-s font-WB6-l'>
        {title}
      </h2>
    </div>

    {description &&
      <span className='promo__copy'>
        {description}
      </span>
    }
  </a>
);

export default BasicPromo;
