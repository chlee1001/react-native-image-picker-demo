import React, { useState } from 'react';
import { Alert, ScrollView, Text } from 'react-native';
import {
  Image as ImageInfoProps,
  openCamera,
  openPicker,
  Options,
} from 'react-native-image-crop-picker';
import CommonSafeAreaView from '../../components/CommonSafeAreaView';
import CommonButton from '../../components/CommonButton';
import { checkAndRequestCameraLibraryPermission } from '../../utils/permissionHelper';
import ScreenTitle from '../../components/ScreenTitle';
import { isIOS } from '../../constants/common';
import ImageDetails from '../../components/ImageDetail';

const COMMON_OPTIONS: Options = {
  mediaType: 'photo',
  includeBase64: false,
  multiple: true,
  includeExif: true,
  loadingLabelText: 'Processing...',
  showsSelectedCount: true,
  showCropGuidelines: true,
  smartAlbums: [
    'UserLibrary',
    'PhotoStream',
    'Panoramas',
    'Favorites',
    'Timelapses',
    'RecentlyAdded',
    'Generic',
  ],
  forceJpg: false,
  cropping: false,
  freeStyleCropEnabled: true,
};

interface ImageInfo extends ImageInfoProps {
  exif?: null | any;

  [key: string]: any;
}

interface GPSInfo {
  latitude?: number;
  longitude?: number;
  altitude?: number;
  accuracy?: number;
}

interface TIFFInfo {
  Make?: string;
  Model?: string;
  Software?: string;
  DateTime?: string;
}

const ImageCropPicker = () => {
  const [selectedImages, setSelectedImages] = useState<ImageInfo[]>([]);

  const createImageObject = (image: ImageInfo, isIOS: boolean): ImageInfo => {
    const isAvailable = (value: any): boolean =>
      value !== undefined && value !== null;

    let gpsInfo: GPSInfo | undefined;
    let tiffInfo: TIFFInfo | undefined;

    if (isIOS) {
      gpsInfo = isAvailable(image.exif?.['{GPS}'])
        ? {
            latitude: image.exif['{GPS}'].Latitude,
            longitude: image.exif['{GPS}'].Longitude,
            altitude: image.exif['{GPS}'].Altitude,
            accuracy: image.exif['{GPS}'].HPPositioningError,
          }
        : undefined;

      tiffInfo = isAvailable(image.exif?.['{TIFF}'])
        ? {
            Make: image.exif['{TIFF}'].Make,
            Model: image.exif['{TIFF}'].Model,
            Software: image.exif['{TIFF}'].Software,
            DateTime: image.exif['{TIFF}'].DateTime,
          }
        : undefined;
    } else {
      gpsInfo = isAvailable(image.exif?.latitude)
        ? {
            latitude: image.exif.latitude,
            longitude: image.exif.longitude,
            altitude: image.exif.altitude,
            accuracy: -1, // 안드로이드에서 정확도 정보가 누락되면 -1을 할당
          }
        : undefined;

      tiffInfo = isAvailable(image.exif)
        ? {
            Make: image.exif.Make,
            Model: image.exif.Model,
            Software: image.exif.Software,
            DateTime: image.exif.DateTime,
          }
        : undefined;
    }

    return {
      ...image,
      gps: gpsInfo,
      tiff: tiffInfo,
      creationDate: isIOS ? image.creationDate : image.exif?.DateTime,
      filename: isIOS ? image.filename : image.path.split('/').pop(),
      localIdentifier: isIOS ? image.localIdentifier : undefined,
      sourceURL: isIOS ? image.sourceURL : undefined,
    };
  };

  const handleError = (error: any) => {
    if (error.code === 'E_PICKER_CANCELLED') {
      Alert.alert('사용자가 취소했습니다.');
    } else {
      // 다른 오류 처리 (필요한 경우)
    }
  };

  const handleCameraImage = async () => {
    const cameraPermission = await checkAndRequestCameraLibraryPermission(
      'CAMERA',
    );
    if (!cameraPermission) return;

    try {
      const image: ImageInfo | undefined = await openCamera(COMMON_OPTIONS);
      if (image !== undefined) {
        const parsedImage = createImageObject(image, isIOS);
        setSelectedImages([parsedImage]);
      }
    } catch (e: any) {
      console.log('handleCameraImage: ', e);
      handleError(e);
    }
  };
  const handleImageLibrary = async () => {
    const libraryPermission = await checkAndRequestCameraLibraryPermission(
      'LIBRARY',
    );
    if (!libraryPermission) return;

    try {
      const tempImages: ImageInfo | ImageInfo[] | undefined = await openPicker(
        COMMON_OPTIONS,
      );

      if (tempImages === undefined) {
        setSelectedImages([]);
        return;
      }

      const imagesArray: ImageInfo[] = Array.isArray(tempImages)
        ? tempImages
        : [tempImages];
      const parsedImages = imagesArray.map((image) =>
        createImageObject(image, isIOS),
      );

      setSelectedImages(parsedImages);
    } catch (e: any) {
      handleError(e);
    }
  };

  return (
    <CommonSafeAreaView>
      <ScreenTitle title={'React Native Image Crop Picker'} />
      <ScrollView>
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            textAlign: 'center',
          }}>
          Selected Images
        </Text>
        {selectedImages.map((image, index) => (
          <ImageDetails image={image} key={index} />
        ))}
      </ScrollView>
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
export default ImageCropPicker;

/**
 * react-native-image-crop-picker 결론
 * 1. android 와 iOS 모두 동작 확인
 * 2. 이미지를 선택하면 base64, uri, type, fileName, fileSize 등의 정보를 제공
 * 3. 이미지를 선택하면 exif 정보를 제공한다.
 * 4. crop 기능을 사용하면 메타데이터가 제대로 나오지 않는다. 대부분 사라진다. (iOS)는 이미지 이름도 사라짐
 * 5. (android) 메타데이터 누락이 있음
 * 6. (iOS) crop 기능을 사용하면 이미지 사이즈가 줄어든다.
 * 7. android 버전별로 동작이 다름 (13부터 OS의 사진선택 도구 활용, 그 이하는 미디어 저장소)
 * 8. (iOS) 갤러리 굿
 */
