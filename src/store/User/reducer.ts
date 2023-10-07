import { SET_USER } from './../actionsType';

const initialState: reducers.UserState = {
  userData: null,
};

export const userReducer = (state = initialState, action: any) => {
  switch (action.type) {
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
