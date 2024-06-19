import Space from '@weco/common/views/components/styled/Space';
import PhysicalItems from '@weco/content/components/PhysicalItems/PhysicalItems';
import WorkDetailsSection from './WorkDetails.Section';
import WorkDetailsText from './WorkDetails.Text';
import LibraryMembersBar from '@weco/content/components/LibraryMembersBar/LibraryMembersBar';
import {
  itemIsRequestable,
  itemIsTemporarilyUnavailable,
} from '@weco/content/utils/requesting';
import {
  Note,
  PhysicalItem,
  Work,
} from '@weco/content/services/wellcome/catalogue/types';
import { useToggles } from '@weco/common/server-data/Context';

type Props = {
  work: Work;
  physicalItems: PhysicalItem[];
  locationOfWork?: Note;
};

const WhereToFindIt = ({ work, physicalItems, locationOfWork }: Props) => {
  const { offsiteRequesting } = useToggles();
  return (
    <WorkDetailsSection headingText="Where to find it">
      {physicalItems.some(
        item =>
          itemIsRequestable(item, offsiteRequesting) ||
          itemIsTemporarilyUnavailable(item)
      ) && (
        <Space $v={{ size: 'm', properties: ['margin-bottom'] }}>
          <LibraryMembersBar />
        </Space>
      )}
      {locationOfWork && (
        <WorkDetailsText
          title={locationOfWork.noteType.label}
          html={locationOfWork.contents}
          allowDangerousRawHtml={true}
        />
      )}
      <PhysicalItems work={work} items={physicalItems} />
    </WorkDetailsSection>
  );
};

export default WhereToFindIt;
