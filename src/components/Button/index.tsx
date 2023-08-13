import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type PropsTypes = {
  btnText: string;
  styleObj?: object;
  textStyle?: object;
  onButtonPress: () => void;
  loading?: boolean;
};

const Button = ({
  btnText = '',
  styleObj = {},
  textStyle = {},
  onButtonPress = () => {},
  loading = false,
}: PropsTypes) => {
  const renderChild = () => {
    if (loading) {
      return <ActivityIndicator color={'white'} />;
    }
    return <Text style={[styles.textStyle, textStyle]}>{btnText}</Text>;
  };
  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={loading ? () => {} : onButtonPress}
        style={[styles.container, styleObj]}>
        {renderChild()}
      </TouchableOpacity>
    </View>
  );
};

export default Button;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    backgroundColor: '#000',
    marginVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00000040',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
  },
});
