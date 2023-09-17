import CommonSafeAreaView from '../../components/CommonSafeAreaView';
import CommonButton from '../../components/CommonButton';
import React, { useEffect, useState } from 'react';
import ScreenTitle from '../../components/ScreenTitle';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { Album } from '@react-native-camera-roll/camera-roll/src/CameraRoll';
import { navigateScreenTo } from '../../utils/navigationHelper';

const CameraRollPicker = () => {
  const [albums, setAlbums] = useState<Album[]>([
    {
      title: '전체보기',
      count: 0,
    },
  ]);
  const handleCameraImage = () => {
    console.log('handleCameraImage');
  };
  const handleImageLibrary = () => {
    navigateScreenTo('PhotoGallery', {
      albums: albums,
    });
  };

  const getAlbums = async () => {
    const cameraRollAlbums = await CameraRoll.getAlbums({
      assetType: 'Photos',
    });

    const allPhotos = {
      title: 'All Photos',
      count: cameraRollAlbums.reduce((acc, cur) => acc + cur.count, 0),
    };
    setAlbums(() => {
      return [allPhotos, ...cameraRollAlbums];
    });
  };

  useEffect(() => {
    getAlbums().then();
  }, []);

  return (
    <CommonSafeAreaView>
      <ScreenTitle title="CameraRollPicker" />
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

export default CameraRollPicker;
