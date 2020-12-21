import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import BlogForm from './BlogForm';

describe('<NoteForm />', () => {
  test('calls onSubmit with proper data', () => {
    const createBlogMock = jest.fn();
    const component = render(<BlogForm createBlog={createBlogMock} />);

    const form = component.container.querySelector('form');
    const titleInput = component.container.querySelector('input[name="title"]');
    const authorInput = component.container.querySelector(
      'input[name="author"]'
    );
    const urlInput = component.container.querySelector('input[name="url"]');

    const blog = { title: 'sometitle', author: 'someauthor', url: 'someurl' };

    fireEvent.change(titleInput, { target: { value: blog.title } });
    fireEvent.change(authorInput, { target: { value: blog.author } });
    fireEvent.change(urlInput, { target: { value: blog.url } });
    fireEvent.submit(form);

    expect(createBlogMock.mock.calls).toHaveLength(1);
    expect(createBlogMock.mock.calls[0][0]).toEqual(blog);
  });
});
