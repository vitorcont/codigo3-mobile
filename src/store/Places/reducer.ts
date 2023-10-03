import { SET_ACTIVE_ROUTE, SET_PLACES_LIST } from '../actionsType';

const initialState: reducers.SearchState = {
  placesList: {
    type: '',
    features: [],
  },
  activeRoute: null,
};

export const placesReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_PLACES_LIST:
      return {
        ...state,
        placesList: action.payload,
      };
    case SET_ACTIVE_ROUTE:
      return {
        ...state,
        activeRoute: action.payload,
      };
    default:
      return state;
  }
};

export default placesReducer;
