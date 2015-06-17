import getRandomUser from './get-random-user';
import getUserCard from './get-user-card';

window.jQuery = window.$ = require('jquery'); // <-- don't do this normally, use a webpack loader... I'm in a hurry.
require('materialize-css/bin/materialize.css');
require('materialize-css/bin/materialize.js'); // <-- it's this guy's fault for depending on global jQuery only :-(


const card = document.querySelector('#user-card-area');

function setUser() {
  getRandomUser().then(user => {
    card.innerHTML = getUserCard(user);
  });
}

setUser();
