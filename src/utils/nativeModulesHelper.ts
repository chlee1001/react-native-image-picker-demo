import { NativeModules } from 'react-native';

interface ImageConverterInterface {
  convertImageAtPath(path: string): Promise<string>;
}

const ImageConverter = NativeModules.ImageConverter as ImageConverterInterface;
/**
 * Android, iOS에서 HEIC 이미지를 JPG로 변환
 * @param imagePath // (저장위치/파일명.확장자)
 *
 */
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
