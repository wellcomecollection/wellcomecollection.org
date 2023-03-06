import DropdownButton from '@weco/common/views/components/DropdownButton/DropdownButton';
import PaletteColorPicker, {
  PaletteColorPickerProps,
} from '@weco/common/views/components/PaletteColorPicker/PaletteColorPicker';

type DesktopColorFilterProps = PaletteColorPickerProps & {
  hasNoOptions?: boolean;
};
const DesktopColorFilter = ({
  name,
  color,
  onChangeColor,
  form,
  hasNoOptions,
}: DesktopColorFilterProps) => {
  return (
    <DropdownButton
      isPill
      isFilter
      label="Colours"
      buttonType="inline"
      id="images.color"
      hasNoOptions={hasNoOptions}
    >
      <PaletteColorPicker
        name={name}
        color={color}
        onChangeColor={onChangeColor}
        form={form}
      />
    </DropdownButton>
  );
};

export default DesktopColorFilter;
