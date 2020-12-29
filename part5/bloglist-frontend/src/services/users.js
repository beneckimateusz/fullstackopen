const baseUrl = '/api/users';

const getAll = async () => {
  const res = await fetch(baseUrl);
  return await res.json();
};

export default { getAll };
