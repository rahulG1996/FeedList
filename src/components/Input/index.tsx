import React from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';

type PropsTypes = {
  value: string;
  onChangeText: () => void;
  placeHolder: string;
  title: string;
  errorText: string;
  onEndEditing: () => void;
  secureTextEntry?: boolean;
};

const Input = ({
  value = '',
  onChangeText = () => {},
  placeHolder = '',
  title = '',
  errorText = '',
  onEndEditing = () => {},
  secureTextEntry = false,
}: PropsTypes) => {
  return (
    <View style={styles.container}>
      <Text>{title} : </Text>
      <TextInput
        value={value}
        style={styles.input}
        onChangeText={onChangeText}
        placeholder={placeHolder}
        onEndEditing={onEndEditing}
        secureTextEntry={secureTextEntry}
      />
      <Text style={styles.erorTextStyle}>{errorText}</Text>
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 16,
    paddingLeft: 8,
    borderColor: '#00000040',
    marginTop: 8,
  },
  erorTextStyle: {
    color: 'red',
    marginTop: 4,
  },
});
