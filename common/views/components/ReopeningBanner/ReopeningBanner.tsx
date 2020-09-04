import Space from '../styled/Space';
import ButtonOutlinedLink from '../ButtonOutlinedLink/ButtonOutlinedLink';
import { classNames } from '../../../utils/classnames';

const ReopeningBanner = () => {
  return (
    <Space
      v={{size: 'xl', properties: ['padding-top', 'padding-bottom']}}
      h={{size: 'xl', properties: ['padding-left', 'padding-right']}}
      className={classNames({
        'bg-green font-white text-align-center': true
      })}
    >
      <h2 className="h1">We are open!</h2>
      <p>We can't wait to welcome you back to the Wellcome Collection. Find out everything you need to plan a safe visit.</p>
      <Space v={{size: 'l', properties: ['margin-top']}}>
        <ButtonOutlinedLink text="Plan your visit" link="/covid-we-are-open" icon="arrow" isOnDark={true} />
      </Space>
    </Space>
  )
};

export default ReopeningBanner;
