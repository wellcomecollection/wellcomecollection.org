import DropdownButton from '@weco/common/views/components/DropdownButton/DropdownButton';
import PaletteColorPicker, {
  PaletteColorPickerProps,
} from '@weco/content/components/PaletteColorPicker';

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
