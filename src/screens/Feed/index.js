import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {fetchFeeds} from '../../redux/actions/feedActions';
import Container from '../../components/Container';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/EvilIcons';
import moment from 'moment';

export const ItemSeparator = () => {
  return <View style={styles.separatorView} />;
};

export const RenderFeedCard = ({
  item = {},
  onFeedClick = () => {},
  index = '',
  numberOfLines = 3,
}) => {
  const {
    body = '',
    author,
    createdAt = '',
    favoritesCount = 1,
    tagList = [],
  } = item;
  const {username, image} = author || {};
  const [textShown, setTextShown] = useState('');

  let momentOne = moment(createdAt);
  let momentTwo = moment();
  let durationA = moment.duration(momentOne.diff(momentTwo));
  if (Object.keys(item).length === 0) {
    return null;
  }
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={{paddingTop: 16}}
      onPress={() => onFeedClick(item.slug)}>
      <View style={{flexDirection: 'row'}}>
        <Image source={{uri: image}} style={styles.userImagStyle} />
        <View style={{marginLeft: 8}}>
          <Text style={{fontWeight: 'bold'}} numberOfLines={1}>
            {username}
          </Text>
          <Text style={styles.postTimeStyle}>{durationA.humanize()}</Text>
        </View>
      </View>
      <View>
        <Text
          style={styles.bodyStyle}
          numberOfLines={textShown === index ? undefined : numberOfLines}>
          {body}
        </Text>
        {textShown !== index && (
          <Text
            style={styles.viewmoreStyle}
            onPress={() => setTextShown(index)}>
            View More
          </Text>
        )}
      </View>
      <View style={styles.tagListContainer}>
        {tagList.map((data, i) => {
          return (
            <TouchableOpacity key={i}>
              <Text style={styles.tagStyle}>#{data}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.likeCommentContainer}>
        <TouchableOpacity style={styles.likeStyle}>
          <Icon name="like2" size={24} />
          <Text style={styles.like}>Like ({favoritesCount})</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.commentClick}>
          <Icon1 name="comment" size={24} />
          <Text style={{paddingLeft: 4}}>Comment</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const Feed = () => {
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(1);
  const navigation = useNavigation();
  const feedDataResp = useSelector(state => state.FeedReducer.feedDataResp);
  const refreshHome = useSelector(state => state.FeedReducer.refreshHome);
  const totalFeeds = useSelector(state => state.FeedReducer.totalFeeds);

  const [loading, setLoading] = useState(true);
  const [loadMore, setLoadMore] = useState(false);
  const [shouldPaginate, setPaginate] = useState(false);
  const [feedList, setFeedList] = useState([]);

  useEffect(() => {
    dispatch(fetchFeeds(offset));
  }, [dispatch]);

  useEffect(() => {
    if (feedDataResp.length) {
      setLoading(false);
      if (shouldPaginate) {
        setFeedList(prev => [...prev, ...feedDataResp]);
        setPaginate(false);
      } else {
        setFeedList(feedDataResp);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedDataResp]);

  const onFeedClick = id => {
    navigation.navigate('SingleFeed', {
      id,
    });
  };

  const _onRefresh = () => {
    dispatch({type: 'REFRESH_HOME', value: true});
    dispatch(fetchFeeds(offset));
  };

  const loadMoreFeeds = () => {
    if (totalFeeds > feedList.length) {
      setLoadMore(true);
      setPaginate(true);
      setOffset(prev => prev + 1);
      dispatch(fetchFeeds(offset + 1));
    }
  };

  const footerComponent = () => {
    if (loadMore) {
      return <ActivityIndicator />;
    }
    return null;
  };

  const logout = () => {
    dispatch({type: 'LOGIN', value: {}});
    dispatch({type: 'USERID', value: ''});
    dispatch({type: 'IS_GUEST', value: false});
    dispatch({type: 'FEED_LIST', value: []});
  };

  const renderFeeds = useCallback(({item, index}) => {
    return (
      <RenderFeedCard item={item} index={index} onFeedClick={onFeedClick} />
    );
  }, []);

  const keyExtractor = useCallback(item => item.slug, []);

  if (loading) {
    return (
      <Container styleObj={{justifyContent: 'center'}}>
        <ActivityIndicator size={48} />
      </Container>
    );
  }

  return (
    <Container>
      <View style={{alignItems: 'flex-end'}}>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Text style={{color: 'white'}}>Logout</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={feedList}
        keyExtractor={keyExtractor}
        refreshControl={
          <RefreshControl refreshing={refreshHome} onRefresh={_onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        renderItem={renderFeeds}
        ItemSeparatorComponent={<ItemSeparator />}
        onMomentumScrollEnd={loadMoreFeeds}
        onEndReachedThreshold={0.1}
        ListFooterComponent={footerComponent}
      />
    </Container>
  );
};

export default Feed;

const styles = StyleSheet.create({
  logoutButton: {
    backgroundColor: 'black',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  commentClick: {
    width: '50%',
    alignItems: 'center',
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  likeStyle: {
    width: '50%',
    alignItems: 'center',
    paddingVertical: 12,
    borderRightWidth: 1,
    borderRightColor: '#00000010',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  likeCommentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#00000010',
  },
  separatorView: {
    height: 8,
    backgroundColor: '#00000005',
    marginBottom: 24,
  },
  userImagStyle: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  postTimeStyle: {
    fontSize: 10,
    color: '#00000080',
  },
  bodyStyle: {
    color: '#00000080',
    marginTop: 24,
  },
  viewmoreStyle: {
    fontWeight: 'bold',
    color: '#0096FF',
  },
  tagListContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 8,
  },
  tagStyle: {
    fontWeight: 'bold',
    marginRight: 8,
  },
  like: {
    color: 'black',
    paddingLeft: 4,
  },
});
