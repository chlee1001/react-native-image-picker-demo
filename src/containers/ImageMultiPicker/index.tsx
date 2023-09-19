import React, { useState } from 'react';
import { Alert, ScrollView, Text } from 'react-native';
import MultipleImagePicker, {
  MediaType,
  Options,
} from '@baronha/react-native-multiple-image-picker';
// import MultipleImagePicker, {Options} from '@ko-developerhong/react-native-multiple-image-picker';
import CommonSafeAreaView from '../../components/CommonSafeAreaView';
import CommonButton from '../../components/CommonButton';
import { checkAndRequestCameraLibraryPermission } from '../../utils/permissionHelper';
import ScreenTitle from '../../components/ScreenTitle';
import ImageDetails from '../../components/ImageDetail';
import { getImageExif } from '../../utils/imageHelper';
import { requestUploadImage } from '../../utils/imageUploadService';
import { isIOS } from '../../constants/common';

const MAX_ASSET = 3;
const COMMON_OPTIONS: Options<MediaType.IMAGE> = {
  usedCameraButton: true,
  isPreview: true,
  numberOfColumn: 4,
  maxSelectedAssets: 3,
  allowedLivePhotos: true,
  // custom
  tapHereToChange: '앨범 변경',
  doneTitle: '완료',
  cancelTitle: '취소',
  selectMessage: '선택',
  deselectMessage: '선택 해제',
  selectedColor: '#182F80',
  maximumMessageTitle: '선택 불가',
  maximumMessage: `파일은 최대 ${MAX_ASSET}개 까지 첨부가능합니다.`,
  messageTitleButton: '확인',
  waitMessage: '사진을 불러오는 중입니다.',
  presentationStyle: 'pageSheet',
  preventAutomaticLimitedAccessAlertColor: '#182F80',
  customLocalizedTitle: {
    Recents: '최근 항목',
    Screenshots: '스크린샷',
    Selfies: '셀카',
    Favorites: '즐겨찾기',
  },
};

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
      gpsInfo = isAvailable(image.exif?.gps)
        ? {
            latitude: image.exif.gps.Latitude,
            longitude: image.exif.gps.Longitude,
            altitude: image.exif.gps.Altitude,
            accuracy: image.exif.gps.HPPositioningError,
          }
        : undefined;

      tiffInfo = isAvailable(image.exif)
        ? {
            Make: image.exif.Make.value[0],
            Model: image.exif.Model.value[0],
            Software: image.exif.Software.value[0],
            DateTime: image.exif.DateTime.value[0],
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
      filename: isIOS ? image.fileName : image.path.split('/').pop(),
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

    try {
      const pickedImages = await MultipleImagePicker.openPicker(COMMON_OPTIONS);

      const editGPSImages: ImageInfo[] = await Promise.all(
        pickedImages.map(async (image: ImageInfo) => {
          const tags = await getImageExif({ imagePath: image.path });
          image = { ...image, exif: { ...tags.exif, gps: { ...tags.gps } } };
          return image;
        }),
      );

      const uploadImages = editGPSImages.map(async (image) => {
        await requestUploadImage({
          uri: image.path,
          type: image.type,
        });
      });
      await Promise.all(uploadImages);

      const imagesArray: ImageInfo[] = Array.isArray(editGPSImages)
        ? editGPSImages
        : [editGPSImages];
      const parsedImages = imagesArray.map((image) =>
        createImageObject(image, isIOS),
      );

      setSelectedImages(parsedImages);
    } catch (e: any) {
      console.log('handleImageLibrary: ', e);
      handleError(e);
    }
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
