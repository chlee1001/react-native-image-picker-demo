import axios from 'axios';
import RNFetchBlob from 'react-native-blob-util';

export async function getRequestPreSignedUrl() {
  const requestBody = {
    mimeType: 'image/jpeg',
  };

  const token =''
  const url = '';

  return axios.post(url, requestBody, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function uploadFileService(payload: {
  preSignedUrl: any;
  fileInfo: any;
}) {
  const { preSignedUrl, fileInfo } = payload;
  console.log('preSignedUrl', preSignedUrl.split('?')[0]);
  console.log('fileInfo', fileInfo);

  return RNFetchBlob.config({
    timeout: 1000 * 60 * 2, // 2분
  })
    .fetch(
      'PUT',
      preSignedUrl,
      { 'Content-Type': fileInfo.type },
      RNFetchBlob.wrap(fileInfo.uri),
    )
    .catch((err) => {
      const errorObj = {
        ...err,
        error: err.message,
        ...fileInfo,
      };
      throw new Error(JSON.stringify(errorObj));
    });
}

export async function requestUploadImage(file: any) {
  try {
    const response = await getRequestPreSignedUrl();
    const presignedUrl = response.data.data.preSignedUrl;
    await uploadFileService({
      preSignedUrl: presignedUrl,
      fileInfo: {
        uri: file.uri,
        type: file.type,
      },
    });
  } catch (e) {
    console.log('requestUploadImage error: ', e);
  }
}
