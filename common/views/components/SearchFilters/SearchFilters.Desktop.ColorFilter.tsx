import DropdownButton from '@weco/common/views/components/DropdownButton/DropdownButton';
import PaletteColorPicker, {
  PaletteColorPickerProps,
} from '@weco/common/views/components/PaletteColorPicker/PaletteColorPicker';

type DesktopColorFilterProps = PaletteColorPickerProps & {
  hasNoOptions?: boolean;
  isNewStyle?: boolean;
};
const DesktopColorFilter = ({
  name,
  color,
  onChangeColor,
  form,
  hasNoOptions,
  isNewStyle,
}: DesktopColorFilterProps) => {
  return (
    <DropdownButton
      isPill={isNewStyle}
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
