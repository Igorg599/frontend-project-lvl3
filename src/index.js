/* eslint-env browser */
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import { object, string } from 'yup';
import onChange from 'on-change';

const form = document.querySelector('form');
const input = document.querySelector('.form-control');
const textDanger = document.querySelector('.text-danger');

const userSchema = object({
  website: string().url().nullable(),
});

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

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  userSchema
    .validate({
      website: formData.get('url'),
    })
    .then((res) => {
      if (watchedObject.streams.includes(res.website)) {
        watchedObject.error = 'RSS уже существует';
        return;
      }
      watchedObject.error = null;
      watchedObject.streams = [...watchedObject.streams, res.website];
      form.reset();
    })
    .catch(() => {
      watchedObject.error = 'Ссылка должна быть валидным URL';
    });
});
