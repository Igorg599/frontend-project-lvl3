import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import { object, string } from 'yup';
import axios from 'axios';
import i18n from 'i18next';
import _ from 'lodash';
import watch from './watcher.js';
import resources from './locales/index.js';
import parser from './parser.js';

const processSSr = (url, state, i18nInstance) => {
  axios
    .get(`https://allorigins.hexlet.app/get?disableCache=true&url=${url}`)
    .then((response) => {
      if (response.status === 200) return response.data;
      state.form = {
        error: i18nInstance.t('errors.network'),
        valid: false,
      };
      throw new Error('Network response was not ok.');
    })
    .then((data) => parser(data.contents))
    .then((res) => {
      const feed = {
        url,
        id: _.uniqueId(),
        title: res.title,
        descr: res.descr,
      };
      const posts = res.items.map((item) => ({
        ...item,
        feedId: feed.id,
        id: _.uniqueId(),
      }));
      state.feeds.unshift(feed);
      state.posts.unshift(...posts);
    })
    .catch(() => {
      state.form = {
        error: i18nInstance.t('errors.resource'),
        valid: false,
      };
    });
};

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

  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('.form-control'),
    feedback: document.querySelector('.feedback'),
    feedsWrapper: document.querySelector('.feeds'),
    postsWrapper: document.querySelector('.posts'),
    modal: document.querySelector('#modal'),
    submit: document.querySelector('.rss-form button[type="submit"]'),
  };

  const initialState = {
    feeds: [],
    posts: [],
    form: {
      error: null,
      valid: false,
    },
  };

  const watchState = watch(elements, initialState);

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    userSchema
      .validate({
        website: formData.get('url'),
      })
      .then((res) => {
        // if (watchedObject.streams.includes(res.website)) {
        //   elements.feedback.textContent = i18nInstance.t("errors.double")
        //   watchedObject.error = true
        //   return
        // }
        // watchedObject.error = false
        // elements.feedback.textContent = ""
        watchState.form = {
          error: null,
          valid: true,
        };
        processSSr(res.website, watchState, i18nInstance);
      })
      .catch(() => {
        watchState.form = {
          error: i18nInstance.t('errors.valid'),
          valid: false,
        };
      });
  });
};

app();
