import { router } from './router/router';
import './styles/style.css'

const main = document.querySelector('#app-main');

window.addEventListener('hashchange', async (e) => {
  router(main);
})

window.addEventListener('DOMContentLoaded', async () => {
  router(main);
})