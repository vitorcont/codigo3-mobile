import { SET_USER, SET_USER_LOCATION } from './../actionsType';

const initialState: reducers.UserState = {
  userLocation: null,
  userData: null,
};

export const userReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_USER_LOCATION:
      return {
        ...state,
        userLocation: action.payload,
      };
    case SET_USER:
      return {
        ...state,
        userData: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
