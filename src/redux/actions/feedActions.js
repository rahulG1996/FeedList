import {AppService} from '../../service';

export const fetchFeeds = (offset = 1) => {
  return async dispatch => {
    const apiUrl = `articles?limit=10&offset=${offset}`;
    try {
      const responseData = await AppService(apiUrl, 'GET');
      dispatch({type: 'FEED_LIST', value: responseData.articles || []});
      dispatch({type: 'REFRESH_HOME', value: false});
      dispatch({
        type: 'TOTAL_FEED_COUNT',
        value: responseData.articlesCount || 0,
      });
    } catch (error) {}
  };
};

export const getSingleFeed = (id, cb = () => {}) => {
  return async dispatch => {
    const apiUrl = `articles/${id}`;
    try {
      const responseData = await AppService(apiUrl, 'GET');
      cb();
      dispatch({type: 'SINGLE_FEED', value: responseData.article || []});
    } catch (error) {}
  };
};

export const getSingleFeedComments = (id, headers) => {
  return async dispatch => {
    const apiUrl = `articles/${id}/comments`;
    try {
      const responseData = await AppService(apiUrl, 'GET', null, headers);

      dispatch({
        type: 'SINGLE_FEED_COMMENTS',
        value: responseData.comments || [],
      });
    } catch (error) {}
  };
};

export const postComment = (id, data, headers, successCallback = () => {}) => {
  return async dispatch => {
    const apiUrl = `articles/${id}/comments`;
    try {
      const responseData = await AppService(apiUrl, 'POST', data, headers);
      successCallback();
    } catch (error) {}
  };
};

export const deleteCommentAction = (
  postId,
  commentId,
  headers,
  successCallback = () => {},
) => {
  return async dispatch => {
    const apiUrl = `articles/${postId}/comments/${commentId}`;
    try {
      const responseData = await AppService(apiUrl, 'DELETE', null, headers);
      successCallback();
    } catch (error) {}
  };
};
