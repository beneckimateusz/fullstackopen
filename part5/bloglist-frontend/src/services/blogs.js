const baseUrl = '/api/blogs';

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = async () => {
  const res = await fetch(baseUrl);
  return await res.json();
};

const create = async blog => {
  const res = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
    body: JSON.stringify(blog),
  });

  const body = await res.json();
  if (body.error) {
    throw Error(body.error);
  }

  return body;
};

export default { setToken, getAll, create };
