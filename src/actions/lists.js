import faker from 'faker';

export const GET_LISTS_START = 'GET_LISTS_START';
export const GET_LISTS = 'GET_LISTS';


export function getLists(quantity) {
  return dispatch => {
    dispatch({ type: GET_LISTS_START, quantity });
    setTimeout(() => {
      const lists = [];
      let count = 0;
      for (let i = 0; i < quantity; i++) {
        const cards = [];
        const randomQuantity = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
        for (let ic = 0; ic < randomQuantity; ic++) {
          cards.push({
            id: count,
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            title: faker.name.jobTitle()
          });
          count = count + 1;
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


function move(arr, old, newIndex) {
  if (newIndex >= arr.length) {
    let k = newIndex - arr.length;
    while ((k--) + 1) {
      arr.push(undefined);
    }
  }
  arr.splice(newIndex, 0, arr.splice(old, 1)[0]);
  return arr;
}


export function moveCard(x, y, xNew, yNew) {
  return (dispatch, getState) => {
    const lists = getState().lists.lists;
    console.log(lists);
    if (x === xNew) {
      lists[x].cards = move(lists[x].cards, y, yNew);
    } else if (x !== xNew) {
      const item = lists[x].cards[y];
      lists[x].cards = lists[x].cards.splice(y, 1);
      lists[xNew].cards = lists[xNew].cards.splice(yNew, 0, item);
    }
    dispatch({ type: GET_LISTS, lists, isFetching: true });
    // console.log(state.lists.lists);
  };
}
