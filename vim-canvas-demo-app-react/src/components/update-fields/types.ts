export interface UpdateField<T = unknown> {
  value?: T;
  disabled: boolean;
  onChange: (value: T) => void;
}
