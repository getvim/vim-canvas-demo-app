export interface UpdateField<T = unknown> {
  id?: string;
  value?: T;
  disabled: boolean;
  onChange: (value: T) => void;
  inputType?: 'text' | 'number' | 'password';
  min?: number;
}
