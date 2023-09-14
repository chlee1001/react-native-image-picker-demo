import React from 'react';
import { Text, View } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import CommonSafeAreaView from '../../components/CommonSafeAreaView';
import CommonButton from '../../components/CommonButton';
import {
  CameraOptions,
  ImageLibraryOptions,
} from 'react-native-image-picker/src/types';
import { checkAndRequestCameraLibraryPermission } from '../../utils/permissionHelper';

const CAMERA_OPTIONS: CameraOptions = {
  mediaType: 'photo',
  includeBase64: false,
  // maxHeight: 200,
  // maxWidth: 200,
  quality: 1,
  saveToPhotos: true,
  cameraType: 'back',
  includeExtra: true,
};
const IMAGE_LIBRARY_OPTIONS: ImageLibraryOptions = {
  mediaType: 'photo',
  maxHeight: 3000,
  maxWidth: 3000,
  quality: 1,
  selectionLimit: 0,
  includeBase64: false,
  includeExtra: true,
};

const ImagePicker = () => {
  return (
    <CommonSafeAreaView>
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
          React Native Image Picker
        </Text>
      </View>
      <CommonButton
        buttonTitle={'launchCamera'}
        buttonStyle={{
          backgroundColor: 'lightblue',
        }}
        buttonClick={async () => {
          const cameraPermission = await checkAndRequestCameraLibraryPermission(
            'CAMERA',
          );
          if (!cameraPermission) {
            return;
          }

          await launchCamera(CAMERA_OPTIONS, (response) => {
            console.log('Response = ', response);
          });
        }}
      />
      <CommonButton
        buttonTitle={'launchImageLibrary'}
        buttonStyle={{
          backgroundColor: 'lightgreen',
        }}
        buttonClick={async () => {
          const libraryPermission =
            await checkAndRequestCameraLibraryPermission('LIBRARY');
          if (!libraryPermission) {
            return;
          }

          await launchImageLibrary(IMAGE_LIBRARY_OPTIONS, (response) => {
            console.log('Response = ', response);
          });
        }}
      />
    </CommonSafeAreaView>
  );
};
export default ImagePicker;
