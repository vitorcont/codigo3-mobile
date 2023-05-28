import { SET_BOTTOM_MODAL, SET_PLACES_LIST } from '../actionsType';

const initialState: reducers.SearchState = {
  placesList: {
    type: '',
    features: [],
  },
};

export const placesReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_PLACES_LIST:
      return {
        ...state,
        placesList: action.payload,
      };
    default:
      return state;
  }
};

export default placesReducer;
