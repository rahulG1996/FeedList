import React, {useState} from 'react';
import {Text, StyleSheet} from 'react-native';
import Container from '../../components/Container';
import Input from '../../components/Input';
import Button from '../../components/Button';
import {useDispatch} from 'react-redux';
import {doLogin} from '../../redux/actions/authActions';

export function Login() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const handleInput = (e, type) => {
    if (type === 'email') {
      setEmail(e);
      setEmailError('');
    } else {
      setPassword(e);
      setPasswordError('');
    }
  };

  const onLogin = async () => {
    let pattern =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!email) {
      setEmailError('*Please enter email id');
      return;
    }
    if (email && !pattern.test(email)) {
      setEmailError('*Please enter valid email id');
      return;
    }
    if (!password) {
      setPasswordError('Please enter Password');
      return;
    }
    if (email && password) {
      let data = {user: {email: email, password: password}};
      const headers = {
        'Content-Type': 'application/json',
      };
      setLoading(true);
      dispatch(doLogin(data, headers, errorCallback));
    }
  };

  const errorCallback = () => {
    setLoading(false);
  };

  const onLoginSkip = () => {
    dispatch({type: 'IS_GUEST', value: true});
  };

  const checkEmailFormat = () => {
    let pattern =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email && !pattern.test(email)) {
      setEmailError('*Please enter valid email id');
    }
  };

  return (
    <Container styleObj={{justifyContent: 'center'}}>
      <Text style={styles.loginText}>Login</Text>
      <Input
        placeHolder="Enter Email ( Required )"
        value={email}
        title="Email"
        onChangeText={e => handleInput(e, 'email')}
        errorText={emailError}
        onEndEditing={checkEmailFormat}
      />
      <Input
        placeHolder="Enter Password ( Required )"
        value={password}
        title="Password"
        onChangeText={e => handleInput(e, 'password')}
        errorText={passwordError}
        secureTextEntry
      />
      <Button btnText="Submit" onButtonPress={onLogin} loading={loading} />
      <Text style={styles.orText}>OR</Text>
      <Button
        btnText="Login as guest"
        styleObj={{backgroundColor: 'transparent'}}
        textStyle={{color: 'black'}}
        onButtonPress={onLoginSkip}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  loginText: {
    fontSize: 56,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  orText: {
    textAlign: 'center',
  },
});
