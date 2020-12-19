const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user');

const api = supertest(app);

beforeAll(async () => {
  await User.deleteMany({});

  const credentials = { username: 'username', password: 'password' };
  const { body: user } = await api.post('/api/users').send(credentials);
  process.env.USER = JSON.stringify(user);

  const res = await api.post('/api/login').send(credentials);
  process.env.TOKEN = res.body.token;
});

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = helper.initialBlogs.map(
    b => new Blog({ ...b, user: JSON.parse(process.env.USER).id })
  );
  await Promise.all(blogObjects.map(b => b.save()));
});

afterAll(() => {
  mongoose.connection.close();
});

describe('when there are initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs');

    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test('all blogs have id property instead of _id', async () => {
    const response = await api.get('/api/blogs');

    response.body.forEach(blog => {
      expect(blog._id).not.toBeDefined();
      expect(blog.id).toBeDefined();
    });
  });
});

describe('addition of a new blog', () => {
  test('fails if authorization token is invalid or missing', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const newBlog = helper.exampleBlog;

    const res = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401);

    expect(res.body.error).toMatch(/token/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length);
  });

  test('succeeds with valid data', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const newBlog = helper.exampleBlog;

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${process.env.TOKEN}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    const contents = blogsAtEnd.map(b => b.content);

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1);
    expect(contents).toContain(newBlog.content);
  });

  test('number of likes defaults to zero', async () => {
    const newBlog = helper.exampleBlog;
    delete newBlog.likes;

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${process.env.TOKEN}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const savedBlog = response.body;

    expect(savedBlog.likes).toBeDefined();
    expect(savedBlog.likes).toBe(0);
  });

  test('fails with 400 status code if title property is missing', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const newBlog = helper.exampleBlog;
    delete newBlog.title;

    const res = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${process.env.TOKEN}`)
      .send(newBlog)
      .expect(400);

    expect(res.body.error).toMatch(/title.*required/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length);
  });

  test('fails with 400 status code if url property is missing', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const newBlog = helper.exampleBlog;
    delete newBlog.url;

    const res = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${process.env.TOKEN}`)
      .send(newBlog)
      .expect(400);

    expect(res.body.error).toMatch(/url.*required/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length);
  });
});

describe('deletion of a blog', () => {
  test('succeeds with 204 status code when id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${process.env.TOKEN}`)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1);
    expect(blogsAtEnd).not.toContainEqual(blogToDelete);
  });

  test('fails with 400 status code when id is invalid', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const invalidId = '1234';

    await api
      .delete(`/api/blogs/${invalidId}`)
      .set('Authorization', `Bearer ${process.env.TOKEN}`)
      .expect(400);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length);
  });
});

describe('upsert of a blog', () => {
  test('succeeds with 200 status code when id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpsert = blogsAtStart[0];
    const updatedBlog = { ...blogToUpsert, title: 'New title xyz 321' };

    await api
      .put(`/api/blogs/${blogToUpsert.id}`)
      .set('Authorization', `Bearer ${process.env.TOKEN}`)
      .send(updatedBlog)
      .expect(200);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length);
    expect(blogsAtEnd).not.toContainEqual(blogToUpsert);
    expect(blogsAtEnd).toContainEqual(updatedBlog);
  });

  test('fails with 400 status code when id is invalid', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const invalidId = '1234';
    const updatedBlog = {
      ...blogsAtStart[0],
      id: '1234',
      title: 'New title xyz 321',
    };

    await api
      .put(`/api/blogs/${invalidId}`)
      .set('Authorization', `Bearer ${process.env.TOKEN}`)
      .expect(400);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length);
    expect(blogsAtEnd).not.toContainEqual(updatedBlog);
  });
});
