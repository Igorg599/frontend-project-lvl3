import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import { object, string } from 'yup';
import axios from 'axios';
import i18n from 'i18next';
import _ from 'lodash';
import watch from './watcher.js';
import resources from './locales/index.js';
import parser from './parser.js';

const fetchInterval = 5000;

const proxyLink = 'https://allorigins.hexlet.app/get?disableCache=true&url=';

const getNewPosts = (state) => {
  const promisesFeeds = state.feeds.map((feed) => axios
    .get(proxyLink + feed.url)
    .then((response) => {
      const data = parser(response.data.contents);

      const newPosts = data.items.map((item) => ({
        ...item,
        feedId: feed.id,
      }));
      const oldPosts = state.posts.filter((post) => post.feedId === feed.id);

      const resultPosts = _.differenceWith(
        newPosts,
        oldPosts,
        (paramOne, paramTwo) => paramOne.title === paramTwo.title,
      ).map((post) => ({ ...post, id: _.uniqueId() }));

      state.posts.unshift(...resultPosts);
    })
    .catch((err) => console.log(err)));

  Promise.all(promisesFeeds).finally(() => {
    setTimeout(() => getNewPosts(state), fetchInterval);
  });
};

const processSSr = (url, state, i18nInstance) => {
  axios
    .get(proxyLink + url)
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

  const validateURL = (url, state) => {
    const links = state.feeds.map((feed) => feed.url);
    if (links.includes(url)) {
      return Promise.reject(i18nInstance.t('errors.double'));
    }
    return userSchema
      .validate({
        website: url,
      })
      .then(() => null)
      .catch(() => i18nInstance.t('errors.valid'));
  };

  const watchState = watch(elements, initialState);

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');
    validateURL(url, watchState)
      .then((err) => {
        if (err) {
          watchState.form = {
            error: err,
            valid: false,
          };
        } else {
          watchState.form = {
            error: null,
            valid: true,
          };
          processSSr(url, watchState, i18nInstance);
        }
      })
      .catch((err) => {
        watchState.form = {
          error: err,
          valid: false,
        };
      });
  });

  setTimeout(() => getNewPosts(watchState), fetchInterval);
};

app();
