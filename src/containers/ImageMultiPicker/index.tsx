import React, { useState } from 'react';
import { Alert, ScrollView, Text } from 'react-native';
// import {
//     MediaType,
//     openPicker,
//     Options,
// } from '@baronha/react-native-multiple-image-picker';
// import MultipleImagePicker, {Options} from '@ko-developerhong/react-native-multiple-image-picker';

import CommonSafeAreaView from '../../components/CommonSafeAreaView';
import CommonButton from '../../components/CommonButton';
import { checkAndRequestCameraLibraryPermission } from '../../utils/permissionHelper';
import ScreenTitle from '../../components/ScreenTitle';
import ImageDetails from '../../components/ImageDetail';
import { getImageExif } from '../../utils/imageHelper';
import { requestUploadImage } from '../../utils/imageUploadService';
import { isIOS } from '../../constants/common';

// const COMMON_OPTIONS: Options = {
//   // isPreview: true,
//   // selectedColor: 'blue',
//   // allowedLivePhotos: true,
//   // allowedAlbumCloudShared: true,
//   // preventAutomaticLimitedAccessAlert: true,
//   // numberOfColumn: 3,
//   singleSelectedMode: true,
//     mediaType: 'image',
//     tapHereToChange: '앨범 변경',
//     doneTitle: '완료',
//     cancelTitle: '취소',
//     selectMessage: '선택',
//     deselectMessage: '선택 해제',
//     selectedColor: '#182F80',
//     maximumMessageTitle: '선택 불가',
//     presentationStyle: 'pageSheet',
// };

interface ImageInfo {
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

const ImageMultiPicker = () => {
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
      // const image: ImageInfo | undefined = await openCamera(COMMON_OPTIONS);
      // if (image !== undefined) {
      //   const parsedImage = createImageObject(image, isIOS);
      //   setSelectedImages([parsedImage]);
      // }
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

    // try {
    //   const tempImages = await MultipleImagePicker.openPicker(COMMON_OPTIONS);
    //   console.log('tempImages: ', tempImages);
    //
    //   const tags = await getImageExif({ imagePath: tempImages.path });
    //   console.log('tags: ', tags.gps);
    //   await requestUploadImage({
    //     uri: tempImages.path,
    //     type: tempImages.type,
    //   });
    //
    //   const imagesArray: ImageInfo[] = Array.isArray(tempImages)
    //     ? tempImages
    //     : [tempImages];
    //   const parsedImages = imagesArray.map((image) =>
    //     createImageObject(image, isIOS),
    //   );
    //
    //   setSelectedImages(parsedImages);
    // } catch (e: any) {
    //   console.log('handleImageLibrary: ', e);
    //   handleError(e);
    // }
  };

  return (
    <CommonSafeAreaView>
      <ScreenTitle title={'React Native Multi Image Picker'} />
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
export default ImageMultiPicker;
