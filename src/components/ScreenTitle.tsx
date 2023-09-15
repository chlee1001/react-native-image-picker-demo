import { Text, View } from 'react-native';
import React from 'react';

const ScreenTitle = ({ title }: { title: string }) => {
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 24,
      }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
        }}>
        {title}
      </Text>
    </View>
  );
};

export default ScreenTitle;
