export const humanFileSize = (size: number) => {
  const i = Math.floor(Math.log(size) / Math.log(1024));
  return (size / Math.pow(1024, i)).toFixed() + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
};
