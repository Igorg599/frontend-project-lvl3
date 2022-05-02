/* eslint-env browser */
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import { object, string } from 'yup';
import i18n from 'i18next';
import watchedObject from './watchers.js';
import resources from './locales/index.js';

const app = async () => {
  const defaultLanguage = 'ru';

  const i18nInstance = i18n.createInstance();
  await i18nInstance.init({
    lng: defaultLanguage,
    debug: false,
    resources,
  });

  const userSchema = object({
    website: string().url().nullable(),
  });

  const form = document.querySelector('form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    userSchema
      .validate({
        website: formData.get('url'),
      })
      .then((res) => {
        if (watchedObject.streams.includes(res.website)) {
          watchedObject.error = i18nInstance.t('errors.double');
          return;
        }
        watchedObject.error = null;
        watchedObject.streams = [...watchedObject.streams, res.website];
        form.reset();
      })
      .catch(() => {
        watchedObject.error = i18nInstance.t('errors.valid');
      });
  });
};

app();
