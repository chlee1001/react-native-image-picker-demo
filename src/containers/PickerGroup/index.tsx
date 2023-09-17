import React from 'react';
import { Alert, ScrollView } from 'react-native';
import CommonButton from '../../components/CommonButton';
import { navigateScreenTo } from '../../utils/navigationHelper';
import CommonSafeAreaView from '../../components/CommonSafeAreaView';

function PickerGroup() {
  return (
    <CommonSafeAreaView style={{ flex: 1 }}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={{}}>
        <CommonButton
          buttonTitle="React Native Image Picker"
          buttonStyle={{
            backgroundColor: 'lightblue',
          }}
          buttonClick={() => {
            navigateScreenTo('ImagePicker');
          }}
        />
        <CommonButton
          buttonTitle="react-native-image-crop-picker"
          buttonStyle={{
            backgroundColor: 'lightgreen',
          }}
          buttonClick={() => {
            navigateScreenTo('ImageCropPicker');
          }}
        />
        <CommonButton
          buttonTitle="react-native-multiple-image-picker"
          buttonStyle={{
            backgroundColor: 'lightpink',
          }}
          buttonClick={() => {
            Alert.alert('라이브러리가 존재하지 않습니다..');
            // navigateScreenTo('ImageMultiPicker');
          }}
        />
        <CommonButton
          buttonTitle="@react-native-camera-roll/camera-roll"
          buttonStyle={{
            backgroundColor: 'lightyellow',
          }}
          buttonClick={() => {
            navigateScreenTo('CameraRollPicker');
          }}
        />
      </ScrollView>
    </CommonSafeAreaView>
  );
}

export default PickerGroup;
