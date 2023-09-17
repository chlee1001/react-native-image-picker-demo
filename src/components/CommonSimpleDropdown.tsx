import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal } from 'react-native';

interface CommonSimpleDropdown {
  title?: string;
  items: { label: string; value: string }[];
  onSelect: (item: { label: string; value: string }) => void;
}

const CommonSimpleDropdown = ({
  title = 'Select an option',
  items,
  onSelect,
}: CommonSimpleDropdown) => {
  const [modalVisible, setModalVisible] = useState(false);

  const renderItem = ({ item }: { item: { label: string; value: string } }) => (
    <TouchableOpacity
      style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' }}
      onPress={() => {
        onSelect(item);
        setModalVisible(false);
      }}>
      <Text>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View
      style={{
        paddingVertical: 12,
      }}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text style={{ fontSize: 16 }}>{title}</Text>
      </TouchableOpacity>
      <Modal transparent={true} visible={modalVisible}>
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
          onPress={() => setModalVisible(false)}>
          <View
            style={{
              width: 300,
              backgroundColor: 'white',
              borderRadius: 10,
              maxHeight: '40%',
            }}>
            <FlatList
              contentInset={{ top: 16, bottom: 16 }}
              data={items}
              renderItem={renderItem}
              keyExtractor={(item) => item.value}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default CommonSimpleDropdown;
