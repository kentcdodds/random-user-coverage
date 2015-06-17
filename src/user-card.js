export default getUserCard;

function getUserCard(user) {
  return `
    <div class="row">
      <div>
        <div class="card white">
          <div class="card-content">
            <img src="${user.avatar}" alt="${user.name} avatar"/>
            <div class="card-title black-text">${user.name}</div>
          </div>
        </div>
      </div>
    </div>
  `;
}
