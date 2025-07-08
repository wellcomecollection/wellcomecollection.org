import Button from '@weco/common/views/components/Buttons';
import PaletteColorPicker, {
  PaletteColorPickerProps,
} from '@weco/content/views/components/PaletteColorPicker';

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
    <Button
      variant="DropdownButton"
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
    </Button>
  );
};

export default DesktopColorFilter;
