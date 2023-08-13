const initialState = {
  feedDataResp: [],
  singleFeedDataRes: {},
  refreshHome: false,
  totalFeeds: 0,
  totalFeedCommentsRes: [],
};

const FeedReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FEED_LIST': {
      return {
        ...state,
        feedDataResp: action.value,
        refreshHome: false,
      };
    }

    case 'SINGLE_FEED': {
      return {
        ...state,
        singleFeedDataRes: action.value,
      };
    }

    case 'TOTAL_FEED_COUNT': {
      return {
        ...state,
        totalFeeds: action.value,
      };
    }

    case 'SINGLE_FEED_COMMENTS': {
      return {
        ...state,
        totalFeedCommentsRes: action.value,
      };
    }

    default:
      return state;
  }
};

export default FeedReducer;
