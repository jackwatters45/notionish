const convertTimestampsToDate = (data) => {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => {
      return [
        key,
        value?.seconds ? new Date(value.seconds * 1000) : value,
      ];
    }),
  );
};

export default convertTimestampsToDate;