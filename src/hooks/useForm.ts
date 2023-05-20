import { useState } from 'react';

const useForm = (initialState: any) => {
  const [form, setForm] = useState(initialState);

  const onChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const clear = () => {
    setForm(initialState);
  };

  return [form, onChange, clear, setForm];
};

export default useForm;

enum Permissions {
  ADM = 1,
  COORD = 2,
  FINANCEIRO = 3,
}

enum FileType {
  JPEG = 1,
  PNG = 2,
  WEBP = 3,
}
