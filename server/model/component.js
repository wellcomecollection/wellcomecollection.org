type ComponentType =
  | 'imageGallery'
  | 'picture'
  | 'video'
  | 'list'
  | 'tweet'
  | 'heading';

type ComponentWeight =
  | 'default'
  | 'leading'
  | 'standalone'
  | 'supporting';

export type Component<T> = {|
  weight: ComponentWeight;
  type: ComponentType;
  value: T;
|}
