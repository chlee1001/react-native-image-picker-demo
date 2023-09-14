import { Text, TouchableOpacity } from 'react-native';
import React from 'react';

interface CommonButtonProps {
  buttonTitle: string;
  buttonStyle?: {
    [key: string]: any;
  };
  buttonClick?: () => void;
}

function CommonButton({
  buttonTitle,
  buttonStyle,
  buttonClick = () => {},
}: CommonButtonProps) {
  return (
    <TouchableOpacity
      style={[
        {
          backgroundColor: 'red',
          paddingHorizontal: 12,
          paddingVertical: 24,
          margin: 12,
          borderRadius: 12,
          alignItems: 'center',
        },
        { ...buttonStyle },
      ]}
      onPress={buttonClick}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: '600',
        }}>
        {buttonTitle}
      </Text>
    </TouchableOpacity>
  );
}

export default CommonButton;
