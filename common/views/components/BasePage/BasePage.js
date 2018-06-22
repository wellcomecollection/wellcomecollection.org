// @flow
import {Fragment} from 'react';
import {spacing, grid} from '../../../utils/classnames';
import type {Node} from 'react';
import type BaseHeader from '../BaseHeader/BaseHeader';
import type Body from '../Body/Body';
import type Contributors from '../Contributors/Contributors';
import type BookMetadata from './BookPage';
import type EventPlace from '../EventPlace/EventPlace';

// We allow passing of null here for situations like Contributors only
// being passed through if there is more than 1.
type MetadataContainerChildren = ?Contributors | ?EventPlace | ?BookMetadata

type Props = {|
  id: string,
  Header: BaseHeader,
  Body: Body,
  children?: MetadataContainerChildren | MetadataContainerChildren[]
|}

export const BasePageColumn = ({children}: {| children: Node |}) => (
  <div className={`row ${spacing({s: 8}, {padding: ['bottom']})}`}>
    <div className='container'>
      <div className='grid'>
        <div className={`${grid({s: 12, m: 10, shiftM: 1, l: 8, shiftL: 2, xl: 8, shiftXL: 2})}`}>
          {children}
        </div>
      </div>
    </div>
  </div>
);

type BasePageMetadataContrainerProps = {|
  children: MetadataContainerChildren
|}
export const BasePageMetadataContrainer = (
  { children }: BasePageMetadataContrainerProps
) => (
  <div className={`
    ${spacing({s: 2}, {padding: ['top']})}
    ${spacing({s: 2}, {margin: ['top']})}
    border-top-width-1 border-color-smoke`}>
    <Fragment>{children}</Fragment>
  </div>
);

const BasePage = ({
  id,
  Header,
  Body,
  children
}: Props) => {
  return (
    <article data-wio-id={id}>
      <Fragment>{Header}</Fragment>
      <BasePageColumn>
        <div className='basic-page'>
          <Fragment>{Body}</Fragment>
        </div>
      </BasePageColumn>

      {children &&
        <BasePageColumn>
          {Array.isArray(children) && children.map(child => (
            <BasePageMetadataContrainer key={child}>
              {child}
            </BasePageMetadataContrainer>
          ))}
          {!Array.isArray(children) &&
            <BasePageMetadataContrainer>
              {children}
            </BasePageMetadataContrainer>
          }
        </BasePageColumn>
      }
    </article>
  );
};

export default BasePage;
