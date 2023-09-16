import React, {useState} from 'react';
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
import { getImageExif } from '../../utils/imageHelper';
import { requestUploadImage } from '../../utils/imageUploadService';

const CAMERA_OPTIONS: CameraOptions = {
  mediaType: 'photo',
  includeBase64: true,
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
  includeBase64: true,
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

/**
 * React Native Image Picker
 */
const ImagePicker = () => {
  const [selectedImages, setSelectedImages] = useState<ImageInfo[]>([]);

  const handleCameraImage = async () => {
    const cameraPermission = await checkAndRequestCameraLibraryPermission(
      'CAMERA',
    );
    if (!cameraPermission) {
      return;
    }

    await launchCamera(CAMERA_OPTIONS, async (response) => {
      if (response?.assets === undefined) return;
      const { base64, ...rest } = response.assets[0];
      const tags = await getImageExif({ imageBase64: base64 });
      console.log('tags: ', tags.gps);
      await requestUploadImage({
        uri: rest.uri,
        type: rest.type,
      });
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
    await launchImageLibrary(IMAGE_LIBRARY_OPTIONS, async (response) => {
      if (response?.assets === undefined) return;
      const { base64, ...rest } = response.assets[0];
      const tags = await getImageExif({ imageBase64: base64 });
      console.log('tags: ', tags.gps);
      await requestUploadImage({
        uri: rest.uri,
        type: rest.type,
      });
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
        <ScrollView horizontal>
          {selectedImages.map((image) => (
            <View key={image.id} style={styles.selectedImagesWrapper}>
              <Image
                source={{ uri: image.uri }}
                height={280}
                width={280}
                resizeMode="contain"
              />

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
        </ScrollView>
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