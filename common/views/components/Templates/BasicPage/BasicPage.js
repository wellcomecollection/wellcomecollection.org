// @flow
import {Fragment} from 'react';
import {spacing, grid} from '../../../../utils/classnames';
import BasicHeader from '../../PageHeaders/BasicHeader/BasicHeader';
import BasicBody from '../../BasicBody/BasicBody';
import type {Node} from 'react';
import type {UiImageProps} from '../../Images/Images';

type Props = {|
  title: string,
  body: {type: string, value: any}[],
  mainImageProps: ?UiImageProps,
  DateInfo: Node,
  Description: Node,
  InfoBar: Node,
  children: Node
|}

export const BasicPageColumn = ({children}: {| children: Node |}) => (
  <div className={`row ${spacing({s: 3}, {padding: ['top']})} ${spacing({s: 8}, {padding: ['bottom']})}`}>
    <div className='container'>
      <div className='grid'>
        <div className={`${grid({s: 12, m: 10, shiftM: 1, l: 8, shiftL: 2, xl: 8, shiftXL: 2})}`}>
          {children}
        </div>
      </div>
    </div>
  </div>
);

const BasicPage = ({
  title,
  body,
  mainImageProps,
  DateInfo,
  Description,
  InfoBar,
  children
}: Props) => {
  return (
    <Fragment>
      <div className='row relative'>
        <div className='overflow-hidden full-width bg-cream' style={{
          top: 0,
          position: 'fixed',
          height: '50vw',
          maxHeight: '66vh',
          zIndex: -1
        }}>
          <div className='absolute full-width' style={{ bottom: 0 }}>
            <div className='wobbly-edge wobbly-edge--white js-wobbly-edge'
              data-is-valley='true'
              data-max-intensity='100'>
            </div>
          </div>
        </div>
      </div>
      <BasicHeader
        title={title}
        mainImageProps={mainImageProps}
        DateInfo={DateInfo}
        Description={Description}
        InfoBar={InfoBar}
      />
      <BasicPageColumn>
        <div className='basic-page'>
          <BasicBody body={body}></BasicBody>
        </div>
      </BasicPageColumn>

      <BasicPageColumn>
        {children}
      </BasicPageColumn>
    </Fragment>
  );
};

export default BasicPage;
