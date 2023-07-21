export const transactionValidate = {
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
  notes: [
    (value: string) => {
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
  files: [
    (value: any) => {
      if (!value) {
        return ' Please Select Files';
      }
      console.log('file sizev :', value[0].size);

      const allowedExtension = ['jpeg', 'jpg', 'png'];
    },
  ],
};
