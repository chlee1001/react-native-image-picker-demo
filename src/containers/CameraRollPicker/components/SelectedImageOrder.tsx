import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const styles = StyleSheet.create({
  selectImageOrderView: {
    width: 22,
    height: 22,
    backgroundColor: 'lightsalmon',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.6,
    borderColor: '#ffffff',
  },
  selectImageOrderText: {
    fontSize: 14,
    color: '#ffffff',
  },
});

function SelectImageOrder({ orderNumber }: { orderNumber: number }) {
  return (
    <View style={styles.selectImageOrderView}>
      <Text style={styles.selectImageOrderText}>{orderNumber}</Text>
    </View>
  );
}

export default SelectImageOrder;
