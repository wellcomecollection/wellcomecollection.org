import { FunctionComponent, RefObject } from 'react';
import Modal from '../../components/Modal/Modal';
import { font, classNames } from '@weco/common/utils/classnames';
import styled from 'styled-components';
type MoreFiltersProps = {
  id: string;
  showMoreFiltersModal: boolean;
  setMoreFiltersModal: (arg: boolean) => void;
  openMoreFiltersButtonRef: RefObject<HTMLInputElement>;
  filtersToShow: string[];
};

const ModalInner = styled.div`
  ${props => props.theme.media.medium`
    overflow: auto;
    display: flex;
  `}
`;

const ModalMoreFilters: FunctionComponent<MoreFiltersProps> = ({
  id,
  showMoreFiltersModal,
  setMoreFiltersModal,
  openMoreFiltersButtonRef,
}: MoreFiltersProps) => {
  return (
    <Modal
      id={id}
      isActive={showMoreFiltersModal}
      setIsActive={setMoreFiltersModal}
      openButtonRef={openMoreFiltersButtonRef}
    >
      <ModalInner>
        <h2
          className={classNames({
            [font('hnm', 5)]: true,
          })}
        >
          More Filters
        </h2>
      </ModalInner>
    </Modal>
  );
};

export default ModalMoreFilters;
