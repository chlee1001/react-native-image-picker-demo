import React from 'react';
import { ScrollView } from 'react-native';
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
        />
        <CommonButton
          buttonTitle="react-native-multiple-image-picker"
          buttonStyle={{
            backgroundColor: 'lightpink',
          }}
        />
        <CommonButton
          buttonTitle="@ko-developerhong/react-native-multiple-image-picker"
          buttonStyle={{
            backgroundColor: 'lightsalmon',
          }}
        />
        <CommonButton
          buttonTitle="@react-native-camera-roll/camera-roll"
          buttonStyle={{
            backgroundColor: 'lightyellow',
          }}
        />
      </ScrollView>
    </CommonSafeAreaView>
  );
}

export default PickerGroup;
