import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import Blog from './Blog';

describe('<Blog />', () => {
  let handleLikeMock;
  let handleRemoveMock;
  let component;

  let blog;
  let user;

  beforeEach(() => {
    user = { username: 'username' };
    blog = {
      title: 'sometitle',
      author: 'someauthor',
      url: 'someurl',
      likes: 7,
      user,
    };

    handleLikeMock = jest.fn();
    handleRemoveMock = jest.fn();

    component = render(
      <Blog blog={blog} handleLike={handleLikeMock} handleRemove={handleRemoveMock} />
    );
  });
  test('shows title and author by default', () => {
    const title = component.container.querySelector('.blog__title');
    const author = component.container.querySelector('.blog__author');

    expect(title).toHaveTextContent(blog.title);
    expect(author).toHaveTextContent(blog.author);
  });

  test('does not show blog details by default', () => {
    const blogDetails = component.container.querySelector('.blog__details');

    expect(blogDetails).toBe(null);
  });

  test('shows blog details when toggled', () => {
    const button = component.getByText('view');

    fireEvent.click(button);
    expect(button).toHaveTextContent('hide');

    const url = component.container.querySelector('.blog__details__url');
    const likes = component.container.querySelector('.blog__details__likes');
    const username = component.container.querySelector(
      '.blog__details__username'
    );

    expect(url).toHaveTextContent(blog.url);
    expect(likes).toHaveTextContent(blog.likes);
    expect(username).toHaveTextContent(blog.user.username);
  });

  test('multiple likes call event handler the same number of times', () => {
    const button = component.getByText('view');
    fireEvent.click(button);

    const likeButton = component.getByText('like');
    fireEvent.click(likeButton);
    fireEvent.click(likeButton);

    expect(handleLikeMock.mock.calls).toHaveLength(2);
  });
});
