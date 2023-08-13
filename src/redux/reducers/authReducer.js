const initialState = {
  loginResponse: {},
  userId: '',
  isGuestUser: false,
};

const AuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN': {
      return {
        ...state,
        loginResponse: action.value,
      };
    }
    case 'USERID': {
      return {
        ...state,
        userId: action.value,
      };
    }

    case 'IS_GUEST': {
      return {
        ...state,
        isGuestUser: action.value,
      };
    }

    default:
      return state;
  }
};

export default AuthReducer;
