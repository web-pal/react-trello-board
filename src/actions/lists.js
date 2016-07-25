import faker from 'faker';

export const GET_LISTS_START = 'GET_LISTS_START';
export const GET_LISTS = 'GET_LISTS';


export function getLists(quantity) {
  return dispatch => {
    dispatch({ type: GET_LISTS_START, quantity });
    setTimeout(() => {
      const lists = [];
      for (let i = 0; i < quantity; i++) {
        const cards = [];
        const randomQuantity = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
        for (let ic = 0; ic < randomQuantity; ic++) {
          cards.push({
            id: ic,
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            title: faker.name.jobTitle()
          });
        }
        lists.push({
          id: i,
          name: faker.commerce.productName(),
          cards
        });
      }
      dispatch({ type: GET_LISTS, lists, isFetching: true });
    }, 1000); // Fake delay
    dispatch({ type: GET_LISTS_START, isFetching: false });
  };
}
