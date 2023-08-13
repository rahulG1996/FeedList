import {AppService} from '../../service';

export const doLogin = (data, headers, errorCallback = () => {}) => {
  return async dispatch => {
    const apiUrl = 'users/login';
    try {
      const responseData = await AppService(apiUrl, 'POST', data, headers);
      dispatch({type: 'LOGIN', value: responseData.user || {}});
      dispatch({type: 'USERID', value: responseData.user.token || ''});
    } catch (error) {
      errorCallback();
    }
  };
};
