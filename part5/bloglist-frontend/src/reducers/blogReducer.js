import blogService from '../services/blogs';
import { changeNotification } from './notificationReducer';

const blogReducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT_BLOGS':
      return action.data;
    case 'NEW_BLOG':
      return [...state, action.data];
    case 'UPDATE_BLOG':
      return state.map(b => b.id === action.data.id ? action.data : b);
    case 'REMOVE_BLOG':
      return state.filter(b => b.id !== action.data);
    default:
      return state;
  }
};

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll();
    dispatch({
      type: 'INIT_BLOGS',
      data: blogs,
    });
  };
};

export const createBlog = (blog, user) => {
  return async dispatch => {
    const savedBlog = await blogService.create(blog);
    savedBlog.user = user;

    dispatch({
      type: 'NEW_BLOG',
      data: savedBlog,
    });
    dispatch(
      changeNotification(
        'ack',
        `added ${savedBlog.title} by ${savedBlog.author}`,
        5
      )
    );
  };
};

export const likeBlog = blog => {
  return async dispatch => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 };
    await blogService.upsert(updatedBlog);

    dispatch({
      type: 'UPDATE_BLOG',
      data: updatedBlog,
    });
    dispatch(changeNotification('ack', `liked ${blog.title} by ${blog.author}`, 5));
  };
};

export const removeBlog = blog => {
  return async dispatch => {
    await blogService.remove(blog.id);
    dispatch({
      type: 'REMOVE_BLOG',
      data: blog.id,
    });
    dispatch(changeNotification('ack', `removed ${blog.title} by ${blog.author}`, 5));
  };
};

export default blogReducer;
