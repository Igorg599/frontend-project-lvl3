import onChange from 'on-change';

const watch = (elements, initialState, i18nInstance) => {
  const {
    input, feedback, feedsWrapper, postsWrapper, modal, submit,
  } = elements;

  const changeForm = (state) => {
    const {
      form: { error, valid },
    } = state;

    if (valid) {
      input.classList.remove('is-invalid');
      feedback.classList.add('text-success');
      feedback.classList.remove('text-danger');
      feedback.textContent = i18nInstance.t('load.success');
    } else {
      input.classList.add('is-invalid');
      feedback.classList.remove('text-success');
      feedback.classList.add('text-danger');
      feedback.textContent = error;
    }
  };

  const changeFeeds = (state) => {
    const { feeds } = state;
    feedsWrapper.textContent = '';
    if (feeds.length) {
      const container = document.createElement('div');
      container.classList.add('card', 'border-0');
      feedsWrapper.appendChild(container);
      const titleWrapper = document.createElement('div');
      titleWrapper.classList.add('card-body');
      container.appendChild(titleWrapper);
      const title = document.createElement('h2');
      title.classList.add('card-title', 'h4');
      titleWrapper.appendChild(title);
      title.textContent = 'Фиды';
      const ulFeed = document.createElement('ul');
      ulFeed.classList.add('list-group', 'border-0', 'rounded-0');
      container.appendChild(ulFeed);
      feeds.forEach((feed) => {
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'border-0', 'border-end-0');
        const titleFeed = document.createElement('h3');
        titleFeed.classList.add('h6', 'm-0');
        titleFeed.textContent = feed.title;
        li.appendChild(titleFeed);
        const descrFeed = document.createElement('p');
        descrFeed.classList.add('m-0', 'small', 'text-black-50');
        descrFeed.textContent = feed.descr;
        li.appendChild(descrFeed);
        ulFeed.appendChild(li);
      });
    }
  };

  const changePosts = (state) => {
    const { posts, viewPosts } = state;
    postsWrapper.textContent = '';
    if (posts.length) {
      const container = document.createElement('div');
      container.classList.add('card', 'border-0');
      postsWrapper.appendChild(container);
      const titleWrapper = document.createElement('div');
      titleWrapper.classList.add('card-body');
      container.appendChild(titleWrapper);
      const title = document.createElement('h2');
      title.classList.add('card-title', 'h4');
      titleWrapper.appendChild(title);
      title.textContent = 'Посты';
      const ulPost = document.createElement('ul');
      ulPost.classList.add('list-group', 'border-0', 'rounded-0');
      container.appendChild(ulPost);
      posts.forEach((post) => {
        const li = document.createElement('li');
        li.classList.add(
          'list-group-item',
          'd-flex',
          'justify-content-between',
          'align-items-start',
          'border-0',
          'border-end-0',
        );
        const link = document.createElement('a');
        if (viewPosts.includes(post.id)) {
          link.classList.add('fw-normal', 'link-secondary');
        } else {
          link.classList.add('fw-bold');
        }
        link.setAttribute('href', post.link);
        link.setAttribute('data-id', post.id);
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
        link.textContent = post.title;
        li.appendChild(link);
        const button = document.createElement('button');
        button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
        button.setAttribute('type', 'button');
        button.setAttribute('data-id', post.id);
        button.setAttribute('data-bs-toggle', 'modal');
        button.setAttribute('data-bs-target', '#modal');
        button.textContent = i18nInstance.t('preview');
        li.appendChild(button);
        ulPost.appendChild(li);
      });
    }
  };

  const changeModal = (state) => {
    const { modalPost } = state;

    if (modalPost) {
      const post = state.posts.find(({ id }) => id === modalPost);
      const title = modal.querySelector('.modal-title');
      title.textContent = post.title;
      const descr = modal.querySelector('.modal-body');
      descr.textContent = post.descr;
      const linkBtn = modal.querySelector('.full-article');
      linkBtn.href = post.link;
    }
  };

  const loadProcess = (state) => {
    switch (state.load) {
      case 'ok':
        submit.disabled = false;
        input.removeAttribute('readonly');
        input.value = '';
        input.focus();
        break;
      case 'loading':
        submit.disabled = true;
        input.setAttribute('readonly', true);
        break;
      case 'failure':
        submit.disabled = false;
        input.removeAttribute('readonly');
        break;
      default:
        break;
    }
  };

  const watchedObject = onChange(initialState, (path) => {
    switch (path) {
      case 'form':
        changeForm(initialState);
        break;
      case 'feeds':
        changeFeeds(initialState);
        break;
      case 'posts':
        changePosts(initialState);
        break;
      case 'modalPost':
        changeModal(initialState);
        break;
      case 'viewPosts':
        changePosts(initialState);
        break;
      case 'load':
        loadProcess(initialState);
        break;
      default:
        break;
    }
  });

  return watchedObject;
};

export default watch;
