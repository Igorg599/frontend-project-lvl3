/* eslint-env browser */
import onChange from 'on-change';

const input = document.querySelector('.form-control');

const initialState = {
  streams: [],
  error: false,
};

const watchedObject = onChange(initialState, () => {
  if (watchedObject.error) {
    input.classList.add('is-invalid');
  } else {
    input.classList.remove('is-invalid');
  }
});

export default watchedObject;
