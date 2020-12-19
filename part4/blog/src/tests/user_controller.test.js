const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const User = require('../models/user');

const getUsersInDb = async () => (await User.find({})).map(u => u.toJSON());

beforeEach(async () => {
  await User.deleteMany({});

  const existingUser = new User({
    name: 'John Doe',
    username: 'johndoe',
    password: 'password',
    passwordHash:
      '$2b$10$1x2I4Xjaos53HPq7MlRcQeB0AGoYf71Vz2Wp5ktYsZ8XUZup0sduS',
  });
  await existingUser.save();
});

afterAll(() => mongoose.connection.close());

describe('creation of a new user', () => {
  test('fails if username is not unique', async () => {
    const usersAtStart = await getUsersInDb();

    const newUser = {
      name: 'Some user',
      username: 'johndoe',
      password: 'password',
    };

    const res = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(res.body.error).toMatch(/.*username.*unique.*/);

    const usersAtEnd = await getUsersInDb();

    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test('succeeds if username and password are valid', async () => {
    const usersAtStart = await getUsersInDb();

    const newUser = {
      name: 'Some user',
      username: 'someuser',
      password: 'password',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await getUsersInDb();

    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);
    expect(usersAtEnd.map(u => u.username)).toContain(newUser.username);
  });

  test('fails if username is not valid', async () => {
    const usersAtStart = await getUsersInDb();

    const newUser = {
      name: 'Some user',
      username: 'az',
      password: 'password',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await getUsersInDb();

    expect(usersAtEnd).toHaveLength(usersAtStart.length);
    expect(usersAtEnd.map(u => u.username)).not.toContain(newUser.username);
  });

  test('fails if password is not valid', async () => {
    const usersAtStart = await getUsersInDb();

    const newUser = {
      name: 'Some user',
      username: 'validusername',
      password: 'ps',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await getUsersInDb();

    expect(usersAtEnd).toHaveLength(usersAtStart.length);
    expect(usersAtEnd.map(u => u.username)).not.toContain(newUser.username);
  });
});
