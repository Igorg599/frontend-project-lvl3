import onChange from 'on-change';

const watch = (elements, initialState) => {
  const {
    input, feedback, form, feedsWrapper, postsWrapper,
  } = elements;

  const changeForm = (state) => {
    const {
      form: { error, valid },
    } = state;

    if (valid) {
      input.classList.remove('is-invalid');
      feedback.textContent = '';
      form.reset();
    } else {
      input.classList.add('is-invalid');
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
    const { posts } = state;
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
        link.classList.add('fw-bold');
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
        button.textContent = 'Просмотр';
        li.appendChild(button);
        ulPost.appendChild(li);
      });
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
      default:
        break;
    }
  });

  return watchedObject;
};

export default watch;
