import { handleRedirection } from './tools.js'; 

document.querySelector('.button').addEventListener('click', async () => {
     handleRedirection()
     window.history.replaceState(null, null, "/index.html");
     location.reload();
})