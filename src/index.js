/* eslint-env browser */
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  console.log(e);
});
