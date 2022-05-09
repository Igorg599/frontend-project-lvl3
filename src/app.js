import * as yup from 'yup';
import axios from 'axios';
import i18n from 'i18next';
import _ from 'lodash';
import watch from './watcher.js';
import resources from './locales/index.js';
import parser from './parser.js';

const app = async () => {
  const defaultLanguage = 'ru';

  const i18nInstance = i18n.createInstance();
  await i18nInstance.init({
    lng: defaultLanguage,
    debug: false,
    resources,
  });

  yup.setLocale({
    mixed: {
      notOneOf: i18nInstance.t('errors.double'),
    },
    string: {
      url: i18nInstance.t('errors.valid'),
      required: i18nInstance.t('errors.empty'),
    },
  });

  const elements = {
    form: document.querySelector('.rss-form'),
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
    modalPost: null,
    viewPosts: [],
    load: 'ok',
  };

  const fetchInterval = 5000;

  const proxyLink = 'https://allorigins.hexlet.app/get?disableCache=true&url=';

  const typeError = (err) => {
    if (err.message === 'Network Error') {
      return i18nInstance.t('errors.network');
    }
    if (err.isResource) {
      return i18nInstance.t('errors.resource');
    }
    return i18nInstance.t('errors.unknown');
  };

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

  const processSSr = (url, state) => {
    state.load = 'loading';
    axios
      .get(proxyLink + url)
      .then((response) => {
        const dataParse = parser(response.data.contents);
        const feed = {
          url,
          id: _.uniqueId(),
          title: dataParse.title,
          descr: dataParse.descr,
        };
        const posts = dataParse.items.map((item) => ({
          ...item,
          feedId: feed.id,
          id: _.uniqueId(),
        }));
        state.feeds.unshift(feed);
        state.posts.unshift(...posts);
        state.load = 'ok';
        state.form = {
          error: null,
          valid: true,
        };
      })
      .catch((e) => {
        state.form = {
          error: typeError(e),
          valid: false,
        };
        state.load = 'failure';
      });
  };

  const validateURL = (url, state) => {
    const links = state.feeds.map((feed) => feed.url);
    const currentUserSchema = yup.string().url().required().notOneOf(links);
    return currentUserSchema
      .validate(url)
      .then(() => null)
      .catch((e) => e.message);
  };

  const watchState = watch(elements, initialState, i18nInstance);

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
          processSSr(url, watchState);
        }
      })
      .catch((err) => {
        watchState.form = {
          error: err,
          valid: false,
        };
      });
  });

  elements.postsWrapper.addEventListener('click', (e) => {
    if (!e.target.dataset.id) {
      return;
    }

    watchState.modalPost = e.target.dataset.id;
    if (!watchState.viewPosts.includes(e.target.dataset.id)) {
      watchState.viewPosts.push(e.target.dataset.id);
    }
  });

  setTimeout(() => getNewPosts(watchState), fetchInterval);
};

export default app;
