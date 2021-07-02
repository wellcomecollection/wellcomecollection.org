import { FunctionComponent, ReactElement } from 'react';
import styled from 'styled-components';
import { classNames, font } from '@weco/common/utils/classnames';

const List = styled.dl`
  display: grid;
  grid-column-gap: 20px;
  grid-row-gap: 6px;
  grid-template-columns: min-content 1fr;
  margin: 0;
`;

const Term = styled.dt.attrs({
  className: classNames({
    [font('hnb', 5)]: true,
  }),
})``;

const Description = styled.dd.attrs({
  className: classNames({
    [font('hnr', 5)]: true,
  }),
})`
  margin-left: 0;
`;

type Props = {
  title: string;
  items: { term: string; description: string | ReactElement }[];
};

const DescriptionList: FunctionComponent<Props> = ({ title, items }) => {
  return (
    <>
      <h3
        className={classNames({
          [font('hnb', 4)]: true,
        })}
      >
        {title}
      </h3>
      <List>
        {items.map(({ term, description }) => (
          <>
            <Term>{term}</Term>
            <Description>{description}</Description>
          </>
        ))}
      </List>
    </>
  );
};

export default DescriptionList;
