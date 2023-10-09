import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import HomeScreen from './src/Screens/HomeScreen';

const App = () => {
  return (
    <View style={styles.main}>
      <HomeScreen />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
});
