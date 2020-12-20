const baseUrl = '/api/blogs';

let token = null;

const setToken = newToken => {
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
      Authorization: token,
    },
    body: JSON.stringify(blog),
  });

  const body = await res.json();
  if (body.error) {
    throw Error(body.error);
  }

  return body;
};

const upsert = async blog => {
  const updatedBlog = { ...blog, user: blog.user.id };
  delete updatedBlog.id;

  const res = await fetch(`${baseUrl}/${blog.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify(updatedBlog),
  });

  const body = await res.json();
  if (body.error) {
    throw Error(body.error);
  }

  return body;
};

const remove = async blogId => {
  const res = await fetch(`${baseUrl}/${blogId}`, {
    method: 'DELETE',
    headers: {
      Authorization: token,
    },
  });

  if (res.status !== 204) {
    const body = await res.json();
    if (body && body.error) {
      throw Error(body.error);
    }
  }
};

export default { setToken, getAll, create, upsert, remove };
