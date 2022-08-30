export const capitalize = (text: string | undefined) => {
  return !text
    ? ''
    : text
        .toLowerCase()
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ');
};

export const uniqueId = (length: number) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const toLocaleTime = (stringDate: string) => {
  const location = 'en-US';
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' } as const;
  const date = new Date(stringDate);
  const time = date.toLocaleTimeString(location);
  const dateFormated = date.toLocaleDateString(location, options);
  return `${time}, ${dateFormated}`;
};
