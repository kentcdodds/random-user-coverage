import getUserCard from './get-user-card';
describe(`getUserCard`, () => {
  it(`should work`, () => {
    expect(getUserCard()).to.be.a('string');
  });
});
