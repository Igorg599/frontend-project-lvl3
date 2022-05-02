/* eslint-env browser */
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import { object, string } from 'yup';
import watchedObject from './watchers.js';

const form = document.querySelector('form');

const userSchema = object({
  website: string().url().nullable(),
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
