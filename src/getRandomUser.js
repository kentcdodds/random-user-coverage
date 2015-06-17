import axios from 'axios';
import _ from 'lodash';

export default getRandomUser;

function getRandomUser() {
  var url = 'http://api.randomuser.me';
  // var url = 'http://localhost:3000'; // just in case there's no internet...
  return axios.get(url).then(response => {
    const user = response.data.results[0].user;
    return {
      name: [
        _.capitalize(user.name.title),
        _.capitalize(user.name.first),
        _.capitalize(user.name.last)
      ].join(' '),
      avatar: user.picture.medium
    };
  });
}
