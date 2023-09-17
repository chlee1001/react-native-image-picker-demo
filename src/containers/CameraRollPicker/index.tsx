import CommonSafeAreaView from '../../components/CommonSafeAreaView';
import CommonButton from '../../components/CommonButton';
import React, { useEffect, useState } from 'react';
import ScreenTitle from '../../components/ScreenTitle';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { Album } from '@react-native-camera-roll/camera-roll/src/CameraRoll';
import { navigateScreenTo } from '../../utils/navigationHelper';

const CameraRollPicker = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const handleCameraImage = () => {
    navigateScreenTo('PhotoCamera');
  };
  const handleImageLibrary = () => {
    navigateScreenTo('PhotoGallery', {
      albums: albums,
    });
  };

  const getAlbums = async () => {
    const cameraRollAlbums = await CameraRoll.getAlbums({
      assetType: 'Photos',
      albumType: 'All',
    });

    cameraRollAlbums.sort((a, b) => {
      if (a.type === 'SmartAlbum' && b.type === 'Album') {
        return -1;
      }
      if (a.type === 'Album' && b.type === 'SmartAlbum') {
        return 1;
      }
      return 0;
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
