import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import {
  deleteCommentAction,
  getSingleFeed,
  getSingleFeedComments,
  postComment,
} from '../../redux/actions/feedActions';
import {useDispatch, useSelector} from 'react-redux';
import {RenderFeedCard} from '../Feed';
import Container from '../../components/Container';
import Icon from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';

export const RenderCommentBody = ({
  item = {},
  deleteComment = () => {},
  userId = '',
}) => {
  const {body, author, createdAt, id = ''} = item;
  const {username, image} = author || {};
  const postDate1 = new Date(createdAt).getDate();
  return (
    <View>
      <View style={{flexDirection: 'row'}}>
        <Image source={{uri: image}} style={styles.imageStyle} />
        <View style={{marginLeft: 8}}>
          <Text style={{fontWeight: 'bold'}} numberOfLines={1}>
            {username}
          </Text>
          <Text>{postDate1}</Text>
          <Text style={styles.commentBodyText}>{body}</Text>
          {userId && (
            <Text
              style={styles.deleteCommentText}
              onPress={() => deleteComment(id)}>
              Delete
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

const RenderComments = ({data = [], deleteComment = () => {}, userId = ''}) => {
  return (
    <FlatList
      data={data}
      keyExtractor={item => item.slug}
      style={{marginTop: 16}}
      showsVerticalScrollIndicator={false}
      renderItem={({item, index}) => (
        <RenderCommentBody
          item={item}
          deleteComment={deleteComment}
          userId={userId}
        />
      )}
      ItemSeparatorComponent={
        <View
          style={{
            height: 8,
            backgroundColor: '#00000005',
            marginVertical: 16,
          }}
        />
      }
    />
  );
};

export const RenderCommentInput = ({
  userId = '',
  comment = '',
  addComment = () => {},
  submitComment = () => {},
  isKeyboardVisible = '',
  keyboardHeight = 0,
}) => {
  if (userId) {
    return (
      <View
        style={[
          styles.commentInputContainer,
          {
            bottom:
              Platform.OS === 'android'
                ? 0
                : isKeyboardVisible
                ? keyboardHeight - 35
                : 0,
          },
        ]}>
        <TextInput
          placeholder="Add your comment"
          returnKeyType="done"
          onSubmitEditing={submitComment}
          value={comment}
          onChangeText={addComment}
          style={styles.input}
        />
      </View>
    );
  }

  return null;
};

const SingleFeed = props => {
  const [comment, setComment] = useState('');
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const singleFeedDataRes = useSelector(
    state => state.FeedReducer.singleFeedDataRes,
  );
  const totalFeedCommentsRes = useSelector(
    state => state.FeedReducer.totalFeedCommentsRes,
  );
  const [loading, setLoading] = useState(true);
  const userId = useSelector(state => state.AuthReducer.userId);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      e => {
        console.log('@@', e.endCoordinates.height);
        setKeyboardHeight(e.endCoordinates.height);
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
        setKeyboardHeight(0);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    if (props?.route?.params?.id) {
      setLoading(true);
      const headers = {
        Authorization: `Bearer ${userId}`,
      };
      dispatch(getSingleFeed(props?.route?.params?.id, cb));
      dispatch(getSingleFeedComments(props?.route?.params?.id, headers));
    }
  }, [dispatch, props?.route?.params?.id, userId]);

  const cb = () => {
    setLoading(false);
  };

  const onBack = () => {
    navigation.goBack();
  };

  const addComment = e => {
    setComment(e);
  };

  const submitComment = () => {
    if (!comment) {
      return;
    }
    const data = {comment: {body: comment}};
    const headers = {
      Authorization: `Bearer ${userId}`,
    };
    dispatch(
      postComment(props?.route?.params?.id, data, headers, successCallback),
    );
  };

  const successCallback = () => {
    const headers = {
      Authorization: `Bearer ${userId}`,
    };
    dispatch(getSingleFeedComments(props?.route?.params?.id, headers));
  };

  const deleteComment = id => {
    const headers = {
      Authorization: `Bearer ${userId}`,
    };
    dispatch(
      deleteCommentAction(singleFeedDataRes.slug, id, headers, successCallback),
    );
  };
  if (loading) {
    return (
      <Container styleObj={{justifyContent: 'center'}}>
        <ActivityIndicator />
      </Container>
    );
  }
  return (
    <View style={styles.container}>
      <Container styleObj={styles.innerContainer}>
        <TouchableOpacity onPress={onBack} style={{alignSelf: 'flex-start'}}>
          <Icon name="arrowleft" size={30} color="#000" />
        </TouchableOpacity>
        <ScrollView
          showsVerticalScrollIndicator={false}
          automaticallyAdjustKeyboardInsets={true}>
          <RenderFeedCard
            item={singleFeedDataRes}
            index={0}
            numberOfLines={15}
          />
          <RenderComments
            data={totalFeedCommentsRes}
            deleteComment={deleteComment}
            userId={userId}
          />
        </ScrollView>
      </Container>
      <RenderCommentInput
        userId={userId}
        comment={comment}
        addComment={addComment}
        submitComment={submitComment}
        isKeyboardVisible={isKeyboardVisible}
        keyboardHeight={keyboardHeight}
      />
    </View>
  );
};

export default SingleFeed;

const styles = StyleSheet.create({
  input: {
    borderTopWidth: 1,
    borderRadius: 8,
    paddingVertical: 16,
    paddingLeft: 16,
    borderColor: '#00000040',
  },
  commentInputContainer: {
    position: 'absolute',
    width: '100%',
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
  },
  innerContainer: {
    paddingBottom: 60,
  },
  imageStyle: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  deleteCommentText: {
    color: 'blue',
    fontSize: 10,
    padding: 4,
  },
  commentBodyText: {
    color: '#00000080',
    marginTop: 8,
  },
});
