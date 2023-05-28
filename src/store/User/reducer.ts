import { SET_USER_LOCATION } from './../actionsType';

const initialState: reducers.UserState = {
  userLocation: null,
};

export const userReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_USER_LOCATION:
      return {
        ...state,
        userLocation: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
