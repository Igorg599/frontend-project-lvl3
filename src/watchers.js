/* eslint-env browser */
import onChange from 'on-change';

const input = document.querySelector('.form-control');
const textDanger = document.querySelector('.text-danger');

const initialState = {
  streams: [],
  error: null,
};

const watchedObject = onChange(initialState, () => {
  if (watchedObject.error) {
    input.classList.add('is-invalid');
    textDanger.textContent = watchedObject.error;
  } else {
    input.classList.remove('is-invalid');
    textDanger.textContent = '';
  }
});

export default watchedObject;
