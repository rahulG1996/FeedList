import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Login} from '../screens/Login';
import Feed from '../screens/Feed';
import SingleFeed from '../screens/SingleFeed';
import {useSelector} from 'react-redux';

const Stack = createNativeStackNavigator();

function AppNavigation() {
  const userId = useSelector(state => state.AuthReducer.userId);
  const isGuestUser = useSelector(state => state.AuthReducer.isGuestUser);

  if (!userId && !isGuestUser) {
    return (
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={Login} />
      </Stack.Navigator>
    );
  }
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Feed" component={Feed} />
      <Stack.Screen name="SingleFeed" component={SingleFeed} />
    </Stack.Navigator>
  );
}

export default AppNavigation;
