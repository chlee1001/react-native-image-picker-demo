import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import CommonSafeAreaView from '../../components/CommonSafeAreaView';
import CommonButton from '../../components/CommonButton';
import {
  Asset,
  CameraOptions,
  ImageLibraryOptions,
} from 'react-native-image-picker/src/types';
import { checkAndRequestCameraLibraryPermission } from '../../utils/permissionHelper';
import ScreenTitle from '../../components/ScreenTitle';

const CAMERA_OPTIONS: CameraOptions = {
  mediaType: 'photo',
  includeBase64: false,
  // maxHeight: 200,
  // maxWidth: 200,
  quality: 1,
  saveToPhotos: true,
  cameraType: 'back',
  includeExtra: true,
  presentationStyle: 'fullScreen',
};
const IMAGE_LIBRARY_OPTIONS: ImageLibraryOptions = {
  mediaType: 'photo',
  // maxHeight: 3000,
  // maxWidth: 3000,
  quality: 1,
  selectionLimit: 0,
  includeBase64: false,
  includeExtra: true,
};

const styles = StyleSheet.create({
  selectedImagesWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageDescription: {
    fontSize: 16,
  },
});

interface ImageInfo extends Asset {}

const ImagePicker = () => {
  const [selectedImages, setSelectedImages] = useState<ImageInfo[]>([]);

  const handleCameraImage = async () => {
    const cameraPermission = await checkAndRequestCameraLibraryPermission(
      'CAMERA',
    );
    if (!cameraPermission) {
      return;
    }

    await launchCamera(CAMERA_OPTIONS, (response) => {
      if (response?.assets === undefined) return;
      setSelectedImages(response.assets);
    });
  };

  const handleImageLibrary = async () => {
    const libraryPermission = await checkAndRequestCameraLibraryPermission(
      'LIBRARY',
    );
    if (!libraryPermission) {
      return;
    }

    await launchImageLibrary(IMAGE_LIBRARY_OPTIONS, (response) => {
      if (response?.assets === undefined) return;
      setSelectedImages(response.assets);
    });
  };

  return (
    <CommonSafeAreaView>
      <ScreenTitle title={'React Native Image Picker'} />
      <View>
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            textAlign: 'center',
          }}>
          Selected Images
        </Text>
        {selectedImages.map((image) => (
          <View key={image.id} style={styles.selectedImagesWrapper}>
            <ScrollView horizontal>
              <Image source={{ uri: image.uri }} height={280} width={280} resizeMode="contain" />
            </ScrollView>
            <View>
              <Text
                style={
                  styles.imageDescription
                }>{`이미지명: ${image.fileName}`}</Text>
              <Text
                style={
                  styles.imageDescription
                }>{`이미지크기: ${image.fileSize}`}</Text>
              <Text
                style={
                  styles.imageDescription
                }>{`이미지타입: ${image.type}`}</Text>
            </View>
          </View>
        ))}
      </View>
      <CommonButton
        buttonTitle={'launchCamera'}
        buttonStyle={{
          backgroundColor: 'lightblue',
        }}
        buttonClick={handleCameraImage}
      />
      <CommonButton
        buttonTitle={'launchImageLibrary'}
        buttonStyle={{
          backgroundColor: 'lightgreen',
        }}
        buttonClick={handleImageLibrary}
      />
    </CommonSafeAreaView>
  );
};
export default ImagePicker;

/**
 * react-native-image-picker 결론
 * 1. android 와 iOS 모두 동작 확인
 * 2. 이미지를 선택하면 base64, uri, type, fileName, fileSize 등의 정보를 제공
 * 3. Exif 정보를 제공하지 않음 - (그대로 이미지를 업로드할 때, 포함되어있을 것으로 추측)
 * 4. 자체 리사이즈 기능이 있음
 * 5. android 버전별로 동작이 다름 (13부터 OS의 사진선택 도구 활용, 그 이하는 미디어 저장소)
 */