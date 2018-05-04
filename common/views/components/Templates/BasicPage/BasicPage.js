// @flow
import {Fragment} from 'react';
import type {Node} from 'react';
import {font, spacing, grid} from '../../../../utils/classnames';
import FramedHeader from '../../PageHeaders/FramedHeader/FramedHeader';
import BasicBody from '../../BasicBody/BasicBody';
import {UiImage} from '../../Images/Images';
import type {UiImageProps} from '../../Images/Images';

type Props = {|
  title: string,
  body: {type: string, value: any}[],
  mainImageProps: UiImageProps,
  DateInfo: Node,
  InfoBar: Node,
|}

const BasicPage = ({
  title,
  body,
  mainImageProps,
  DateInfo,
  InfoBar
}: Props) => {
  return (
    <Fragment>
      <FramedHeader backgroundTexture={null}>
        <h1 className='h1'>{title}</h1>
        <div className={`${font({s: 'HNL3'})}`}>
          {DateInfo}
        </div>

        <div className={`${font({s: 'HNL4'})}`}>
          {InfoBar}
        </div>
        <div className='relative'>
          <UiImage {...mainImageProps} />
        </div>
      </FramedHeader>
      <div className={`row ${spacing({s: 3}, {padding: ['top']})} ${spacing({s: 8}, {padding: ['bottom']})}`}>
        <div className='container'>
          <div className='grid'>
            <div className={`basic-page ${grid({s: 12, m: 10, shiftM: 1, l: 8, shiftL: 2, xl: 8, shiftXL: 2})}`}>
              <BasicBody body={body}></BasicBody>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default BasicPage;
