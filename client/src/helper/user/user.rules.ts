export const userValidate = {
  name: [
    (value: string) => {
      if (value?.length < 2) return 'Name needs to be at least 2 characters.';
      else if (!/[^0-9]/.test(value)) return ' name can not contain digits.';
      return true;
    },
  ],
  email: [
    (value: string) => {
      if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) return true;
      return 'Must be a valid e-mail.';
    },
  ],
  password: [
    (value: string) => {
      if (value == '') return 'Enter password ';
      if (value?.length >= 8) return true;
      return 'Password length needs to be at least 8.';
    },
  ],
  select: [
    (value: string) => {
      if (!value) {
        return 'Please Select Field';
      }

      return true;
    },
  ],
};
