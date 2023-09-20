import { NativeModules } from 'react-native';

interface ImageConverterInterface {
  convertImageAtPath(path: string): Promise<string>; // path: file://~
}

const ImageConverter = NativeModules.ImageConverter as ImageConverterInterface;

async function convertImage(imagePath: string): Promise<string> {
  try {
    const newPath = await ImageConverter.convertImageAtPath(imagePath);
    if (newPath.startsWith('file://')) {
      return newPath;
    }
    return `file://${newPath}`;
  } catch (error) {
    throw error;
  }
}

export { convertImage };
