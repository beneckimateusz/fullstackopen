const baseUrl = '/api/login';

const login = async credentials => {
  const res = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  const body = await res.json();

  if (body.error) {
    throw Error(body.error);
  }
  return body;
};

export default { login };
