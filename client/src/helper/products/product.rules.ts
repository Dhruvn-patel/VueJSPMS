export const productValidate = {
  name: [
    (value: string) => {
      if (value?.length < 2) return 'Name needs to be at least 2 characters.';
      else if (!/[^0-9]/.test(value)) return ' name can not contain digits.';
      return true;
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
  date: [
    (value: string) => {
      if (!value) {
        return 'Please Select date';
      }
      return true;
    },
  ],
  description: [
    (value: string) => {
      if (value?.length < 10) return 'Name needs to be at least 10 characters.';
      return true;
    },
  ],
  amount: [
    (value: string) => {
      if (!value) {
        return ' Please Select amount';
      } else if (!/^\d+$/.test(value)) {
        return 'Amount Contain only number';
      }
      return true;
    },
  ],
  qty: [
    (value: string) => {
      if (!value) {
        return ' Please Select qty';
      } else if (!/^\d+$/.test(value)) {
        return 'qty Contain only number';
      }
      return true;
    },
  ],
  files: [
    (value: any) => {
      if (!value) {
        return ' Please Select Files';
      }
      const allowedExtension = ['jpeg', 'jpg', 'png'];
      return true;
    },
  ],
};
