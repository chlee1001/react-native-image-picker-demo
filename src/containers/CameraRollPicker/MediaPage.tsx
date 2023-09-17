import React, { useCallback, useMemo, useState } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { Alert } from 'react-native';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import FastImage, { OnLoadEvent } from 'react-native-fast-image';
import { useRoute } from '@react-navigation/native';
import { goBack } from '../../utils/navigationHelper';
import { SAFE_AREA_PADDING } from '../../constants/common';
import { StatusBarBlurBackground } from '../../components/StatusBarBlurBackground';
import {requestUploadImage} from "../../utils/imageUploadService";

const requestSavePermission = async (): Promise<boolean> => {
  return true;
};

export function MediaPage() {
  const route = useRoute();
  const { path, type } = route.params as {
    path: string;
    type: 'photo';
  };
  const [hasMediaLoaded, setHasMediaLoaded] = useState(false);
  const [savingState, setSavingState] = useState<'none' | 'saving' | 'saved'>(
    'none',
  );

  const onMediaLoad = useCallback((event: OnLoadEvent) => {
    console.log(
      `Image loaded. Size: ${event.nativeEvent.width}x${event.nativeEvent.height}`,
    );
  }, []);
  const onMediaLoadEnd = useCallback(() => {
    console.log('media has loaded.');
    setHasMediaLoaded(true);
  }, []);

  const onSavePressed = useCallback(async () => {
    try {
      setSavingState('saving');

      const hasPermission = await requestSavePermission();
      if (!hasPermission) {
        Alert.alert(
          'Permission denied!',
          'Vision Camera does not have permission to save the media to your camera roll.',
        );
        return;
      }
      await CameraRoll.save(`file://${path}`, {
        type: type,
      });
      setSavingState('saved');
      await requestUploadImage({
        uri: path,
        type,
      });
      goBack();
      goBack()
    } catch (e) {
      const message = e instanceof Error ? e.message : JSON.stringify(e);
      setSavingState('none');
      Alert.alert(
        'Failed to save!',
        `An unexpected error occured while trying to save your ${type}. ${message}`,
      );
    }
  }, [path, type]);

  const source = useMemo(() => ({ uri: `file://${path}` }), [path]);

  const screenStyle = useMemo(
    () => ({ opacity: hasMediaLoaded ? 1 : 0 }),
    [hasMediaLoaded],
  );

  return (
    <View style={[styles.container, screenStyle]}>
      {type === 'photo' && (
        <FastImage
          source={source}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
          onLoadEnd={onMediaLoadEnd}
          onLoad={onMediaLoad}
        />
      )}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => {
          goBack();
        }}>
        <IonIcon name="close" size={35} color="white" style={styles.icon} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={onSavePressed}
        disabled={savingState !== 'none'}>
        {savingState === 'none' && (
          <IonIcon
            name="download"
            size={32}
            color="white"
            style={styles.icon}
          />
        )}
        {savingState === 'saved' && (
          <IonIcon
            name="checkmark"
            size={36}
            color="white"
            style={styles.icon}
          />
        )}
        {savingState === 'saving' && <ActivityIndicator color="white" />}
      </TouchableOpacity>

      <StatusBarBlurBackground />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  closeButton: {
    position: 'absolute',
    top: SAFE_AREA_PADDING.paddingTop,
    left: SAFE_AREA_PADDING.paddingLeft,
    width: 40,
    height: 40,
  },
  saveButton: {
    position: 'absolute',
    bottom: SAFE_AREA_PADDING.paddingBottom + 20,
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 52,
    borderStyle: 'solid',
    borderWidth: 3,
    borderColor: 'white',
  },
  icon: {
    textShadowColor: 'black',
    textShadowOffset: {
      height: 0,
      width: 0,
    },
    textShadowRadius: 1,
  },
});
