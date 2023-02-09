import dynamic from 'next/dynamic';
import { ColorFilter as ColorFilterType } from '@weco/common/services/catalogue/filters';

const PaletteColorPicker = dynamic(
  import('@weco/common/views/components/PaletteColorPicker/PaletteColorPicker')
);

export type ColorFilterProps = {
  f: ColorFilterType;
  changeHandler: () => void;
  form?: string;
};

const ColorFilter = ({ f, changeHandler, form }: ColorFilterProps) => {
  return (
    <PaletteColorPicker
      name={f.id}
      color={f.color}
      onChangeColor={changeHandler}
      form={form}
    />
  );
};

export default ColorFilter;
