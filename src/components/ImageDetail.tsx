import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  selectedImagesWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageDescription: {
    fontSize: 16,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonStyle: {
    backgroundColor: 'lightblue',
  },
  buttonStyleAlternate: {
    backgroundColor: 'lightgreen',
  },
});

interface ImageInfo {
  [key: string]: any;
}

const ImageDetails = ({ image }: { image: ImageInfo }) => (
  <View style={styles.selectedImagesWrapper}>
    <ScrollView horizontal>
      <Image
        source={{ uri: image.path }}
        height={280}
        width={280}
        resizeMode="contain"
      />
    </ScrollView>
    <View>
      <Text style={styles.imageDescription}>{`이미지명: ${
        image.filename || ''
      }`}</Text>
      <Text style={styles.imageDescription}>{`이미지크기: ${image.size}`}</Text>
      <Text style={styles.imageDescription}>{`이미지타입: ${image.mime}`}</Text>
      <Text style={styles.imageDescription}>{`이미지 GPS: ${
        image.gps ? JSON.stringify(image.gps) : ''
      }`}</Text>
      <Text style={styles.imageDescription}>{`이미지 TIFF: ${JSON.stringify(
        image.tiff,
      )}`}</Text>
    </View>
  </View>
);

export default ImageDetails;
