import React, { useState } from 'react';
import { Alert, ScrollView, Text } from 'react-native';
import {
  clean,
  Image as ImageInfoProps,
  openCamera,
  openCropper,
  openPicker,
  Options,
} from 'react-native-image-crop-picker';
import CommonSafeAreaView from '../../components/CommonSafeAreaView';
import CommonButton from '../../components/CommonButton';
import { checkAndRequestCameraLibraryPermission } from '../../utils/permissionHelper';
import ScreenTitle from '../../components/ScreenTitle';
import { isIOS } from '../../constants/common';
import ImageDetails from '../../components/ImageDetail';
import { requestUploadImage } from '../../utils/imageUploadService';


const COMMON_OPTIONS: Options = {
  mediaType: 'photo',
  multiple: true,
  includeBase64: true,
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
            accuracy: image.exif['{GPS}'].HPositioningError,
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
      gpsInfo = isAvailable(image.exif?.Latitude)
        ? {
            latitude: image.exif.Latitude,
            longitude: image.exif.Longitude,
            altitude: image.exif.Altitude,
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

      // const croppedImages = await Promise.all(
      //     imagesArray.map(async(image,) => {
      //         return await  openCropper({
      //             ...COMMON_OPTIONS,
      //             path: image.path,
      //             width: image.width,
      //             height: image.height,
      //         }).then(async(croppedImage) => {
      //
      //             try {
      //                 // 원본 이미지의 EXIF 데이터 가져오기]
      //                 const exifData = await getImageExif({ imagePath: image.path });
      //
      //                 console.log('exifData: ', exifData)
      //                 // Crop된 이미지에 EXIF 데이터 적용하고, 새 이미지 경로 가져오기
      //                 if (exifData && croppedImage.path) {
      //                     const outputPath = `${RNFS.DocumentDirectoryPath}/${image.filename}.jpg`;
      //                     await applyExifToImage(exifData.exif, croppedImage.path, outputPath);
      //
      //                     // 업로드를 위한 새 이미지 경로 설정
      //                     croppedImage.path = outputPath;
      //                 }
      //             } catch (error) {
      //                 console.error('Error applying EXIF data2:', error);
      //             }
      //
      //             await requestUploadImage({
      //                 uri: croppedImage.path,
      //                 type: croppedImage.mime,
      //             });
      //             return createImageObject(croppedImage, isIOS);
      //         }).catch(e => {
      //             console.log('openCropper: ', e);
      //             return createImageObject(image, isIOS);
      //         });
      //     })
      // );

      // setSelectedImages(croppedImages);

      const parsedImages = imagesArray.map((image) =>
        createImageObject(image, isIOS),
      );
      setSelectedImages(parsedImages);
    } catch (e: any) {
      handleError(e);
    }
  };

  const handleCleanUp = async () => {
    clean()
      .then(() => {
        console.log('removed all tmp images from tmp directory');
      })
      .catch((e) => {
        Alert.alert(e);
      });
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
      <CommonButton
        buttonTitle={'Clean Up'}
        buttonStyle={{
          backgroundColor: 'gray',
        }}
        buttonClick={handleCleanUp}
      />
    </CommonSafeAreaView>
  );
};
export default ImageCropPicker;
