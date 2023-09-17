import { Album } from '@react-native-camera-roll/camera-roll/src/CameraRoll';
import CommonSafeAreaView from '../../components/CommonSafeAreaView';
import ScreenTitle from '../../components/ScreenTitle';
import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import CommonSimpleDropdown from '../../components/CommonSimpleDropdown';
import { useRoute } from '@react-navigation/native';
import {
  CameraRoll,
  GetPhotosParams,
  PhotoIdentifier,
  useCameraRoll,
} from '@react-native-camera-roll/camera-roll';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import CommonButton from '../../components/CommonButton';
import { openSettings } from 'react-native-permissions';
import SelectImageOrder from './components/SelectedImageOrder';
import { requestUploadImage } from '../../utils/imageUploadService';
import { isIOS } from '../../constants/common';

function EmptyImages({ isLoading }: { isLoading: boolean }) {
  if (isLoading) return null;
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>사진이 없습니다.</Text>
    </View>
  );
}

interface PhotoGalleryProps {
  albums: Album[];
}

interface ImageInfo {
  uri: string;
  filepath: string;
  imageSize: {
    width?: number;
    height?: number;
  };
  fileSize: number | null;
  fileName: string | null;
  fileExtension: string | null;
  orientation: number | null;
  gps: {
    latitude?: number;
    longitude?: number;
    altitude?: number;
    speed?: number;
  };
  timeStamp?: number;
  modificationTime?: number;
}

const PICKER_HEIGHT = 20;
const PhotoGallery = () => {
  const route = useRoute();
  const params = route.params as PhotoGalleryProps;
  const { albums } = params;
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [selectedImages, setSelectedImages] = useState<Array<ImageInfo>>([]);
  const [numColumns, setNumColumns] = useState(3);
  const [images, setImages] = useState<
    Array<{ data: PhotoIdentifier; uri: string }>
  >([]);
  const [limited, setLimited] = useState(false);
  const optionParams = useRef<GetPhotosParams>({
    first: PICKER_HEIGHT,
    assetType: 'Photos',
    includeSharedAlbums: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  const [photos, getPhotos] = useCameraRoll();
  const { width: deviceWidth } = useWindowDimensions();

  const getImagesFromDevice = async () => {
    if (!optionParams.current) {
      return;
    }
    setIsLoading(true);
    await getPhotos({
      ...optionParams.current,
      groupName:
        selectedAlbum?.title === 'All Photos' ? '' : selectedAlbum?.title,
    });
  };



  const handleOnEndReached = () => {
    if (!photos.page_info.has_next_page) {
      return;
    }
    getImagesFromDevice().then();
  };
  const handleOnRefreshImage = async () => {
    optionParams.current = {
      ...optionParams.current,
      first: images.length,
    };
    await getImagesFromDevice();
  };

  const handleOnPressImage = async (image: {
    data: PhotoIdentifier;
    uri: string;
  }) => {
    if (!image) return;

    const imageData: PhotoIdentifier = isIOS
      ? await CameraRoll.iosGetImageDataById(image.data.node.image.uri)
      : image.data;

    const imageInfo = {
      uri: image.data.node.image.uri,
      filepath: imageData.node.image?.filepath || imageData.node.image?.uri,
      imageSize: {
        width: imageData.node.image?.width,
        height: imageData.node.image?.height,
      },
      fileSize: imageData.node.image?.fileSize,
      fileName: imageData.node.image?.filename,
      fileExtension: imageData.node.image?.extension,
      orientation: imageData.node.image?.orientation,
      gps: {
        latitude: imageData.node.location?.latitude,
        longitude: imageData.node.location?.longitude,
        altitude: imageData.node.location?.altitude,
        speed: imageData.node.location?.speed,
      },
      timeStamp: imageData.node.timestamp,
      modificationTime: imageData.node.modificationTimestamp,
    };

    if (
      selectedImages.find(
        (selectedImage) => selectedImage.filepath === imageInfo.filepath,
      )
    ) {
      setSelectedImages((prevState) =>
        prevState.filter(
          (selectedImage) => selectedImage.filepath !== imageInfo.filepath,
        ),
      );
      return;
    }
    setSelectedImages((prevState) => prevState.concat(imageInfo));
  };

  const handleOnUploadImage = async () => {
    selectedImages.map(async (selectedImage) => {
      await requestUploadImage({
        uri: selectedImage.filepath,
        type: 'image',
      });
    });
  };

  const dStyles = useCallback(
    () =>
      StyleSheet.create({
        imageBackground: {
          width: Math.floor(deviceWidth / numColumns) - 16,
          height: Math.floor(deviceWidth / numColumns) - 16,
          alignItems: 'flex-end',
          padding: 2,
        },
      }),
    [numColumns],
  );
  const renderImages = (image: { data: PhotoIdentifier; uri: string }) => {
    const isSelected = selectedImages.find(
      (selectedImage) => selectedImage.uri === image.uri,
    );

    const imageContainerStyle = isSelected
      ? styles.selectedImageContainer
      : styles.imageContainer;

    return (
      <TouchableOpacity
        onPress={async () => {
          await handleOnPressImage(image);
        }}
        style={imageContainerStyle}>
        <ImageBackground
          source={{ uri: image.uri }}
          resizeMode="cover"
          style={dStyles().imageBackground}>
          {isSelected && (
            <SelectImageOrder
              orderNumber={
                selectedImages.findIndex(
                  (selectedImage) => selectedImage.uri === image.uri,
                ) + 1
              }
            />
          )}
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  const memoizedRenderImages = useMemo(
    () => renderImages,
    [images, selectedImages, numColumns],
  );

  useEffect(() => {
    setNumColumns(Math.floor(deviceWidth / 100));
  }, [deviceWidth]);

  useEffect(() => {
    getImagesFromDevice().then();
  }, [selectedAlbum]);

  useEffect(() => {
    if (photos.edges.length === 0) {
      return;
    }
    setIsLoading(false);
    if (photos.page_info.has_next_page) {
      optionParams.current = {
        ...optionParams.current,
        first: optionParams.current.first + PICKER_HEIGHT,
      };


    }
    const newImages = photos.edges.map((edge) => {
      return {
        uri: edge.node.image.uri,
        data: edge,
      };
    });

    Image.queryCache?.(newImages.map((image) => image.uri)).then();
    setImages(newImages);
    setLimited(photos.limited || false);
  }, [photos]);

  return (
    <>
      <CommonSafeAreaView>
        <ScreenTitle title="CameraRollPicker" />
        {limited && (
          <TouchableOpacity
            onPress={() => {
              openSettings().catch(() => console.warn('cannot open settings'));
            }}
            style={styles.limitedTextContainer}>
            <Text>선택한 사진만 보기가 활성화되어있습니다.</Text>
          </TouchableOpacity>
        )}
        {/* Dropdown with Albums */}
        <View
          style={{
            display: 'flex',
            alignItems: 'center',
          }}>
          <CommonSimpleDropdown
            title={selectedAlbum?.title || 'Select an album'}
            items={albums.map((album) => ({
              label: `${album.title} (${album.count})`,
              value: album.title,
            }))}
            onSelect={(item) => {
              setSelectedAlbum(() => {
                return (
                  albums.find((album) => album.title === item.value) || null
                );
              });
            }}
          />
        </View>
        <View style={styles.imageScrollContainer}>
          <FlatList
            key={numColumns}
            data={images}
            renderItem={({ item }) => memoizedRenderImages(item)}
            numColumns={numColumns}
            keyExtractor={(item) => item.uri}
            horizontal={false}
            ListEmptyComponent={<EmptyImages isLoading={isLoading} />}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            refreshing={false}
            onEndReachedThreshold={2.5}
            onEndReached={() => handleOnEndReached()}
            onRefresh={() => handleOnRefreshImage()}
            contentContainerStyle={styles.imageScrollContentContainer}
          />
        </View>
        <CommonButton
          buttonTitle={'선택완료'}
          buttonStyle={{
            backgroundColor: 'lightblue',
            paddingVertical: 16,
          }}
          buttonClick={handleOnUploadImage}
        />
      </CommonSafeAreaView>
      {/* 로딩 스피너 */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <Text style={{ color: 'white', fontSize: 16 }}>Loading...</Text>
        </View>
      )}
    </>
  );
};

export default PhotoGallery;

const styles = StyleSheet.create({
  limitedTextContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: 'lightgray',
  },
  imageScrollContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  imageScrollContentContainer: {
    paddingBottom: 12,
    marginBottom: -12,
    alignItems: 'flex-start',
  },
  imageContainer: {
    margin: 1,
    borderColor: '#ffffff',
    borderWidth: 2.5,
  },
  selectedImageContainer: {
    margin: 1,
    borderColor: 'lightsalmon',
    borderWidth: 2.5,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
