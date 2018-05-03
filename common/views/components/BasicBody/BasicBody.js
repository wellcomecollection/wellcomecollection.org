// @flow
// TODO: Sync up types with the body slices and the components they return
import {spacing} from '../../../utils/classnames';
import AsyncSearchResults from '../SearchResults/AsyncSearchResults';
import CaptionedImage from '../CaptionedImage/CaptionedImage';
import Image from '../Image/Image';
import Tasl from '../Tasl/Tasl';
import ImageGallery from '../ImageGallery/ImageGallery';

type Props = {|
  body: {type: string, value: any}[]
|}

type HTMLBlockProps = { html: string };
const HTMLBlock = ({ html }: HTMLBlockProps) => (
  <div dangerouslySetInnerHTML={{__html: html}} />
);

const BasicBody = ({ body }: Props) => {
  return (
    <div className='basic-body'>
      {body.map((slice, i) =>
        <div className={`body-part ${spacing({s: 4}, {margin: ['top']})}`} key={`slice${i}`}>
          {slice.type === 'text' && <div className='body-text'><HTMLBlock html={slice.value} /></div>}
          {slice.type === 'picture' &&
            <CaptionedImage caption={slice.value.caption}>
              <Image {...slice.value} />
              <Tasl
                contentUrl={slice.value.contentUrl || ''}
                title={slice.value.title}
                author={slice.value.author}
                sourceName={slice.value.source && slice.value.source.name}
                sourceLink={slice.value.source && slice.value.source.link}
                license={slice.value.license}
                copyrightHolder={slice.value.copyright && slice.value.copyright.holder}
                copyrightLink={slice.value.copyright && slice.value.copyright.link}
                isFull={false} />
            </CaptionedImage>
          }
          {slice.type === 'imageGallery' && <ImageGallery {...slice.value} />}
          {slice.type === 'contentList' &&
            <AsyncSearchResults
              title={slice.value.title}
              query={slice.value.items.map(({id}) => `id:${id}`).join(' ')}
              pageSize={slice.value.items.length}
            />}
          {slice.type === 'searchResults' && <AsyncSearchResults {...slice.value} />}
        </div>
      )}
    </div>
  );
};

export default BasicBody;
