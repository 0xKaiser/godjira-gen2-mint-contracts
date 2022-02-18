export const percentage = (big, small) => {
  const per = ((big - small) / big) * 100;
  return per;
};
