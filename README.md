# React-Native Image Picker Library Test

<div align="center">

[//]: # (  <img src="프로젝트 로고 URL" alt="로고 이미지" width="150">)
  <br>
  <h3>적합한 라이브러리를 찾기 위한 데모 앱프로젝트</h3>
</div>

---

## 📑 목차

- [프로젝트 소개](#프로젝트-소개)
- [기능](#기능)
- [설치 방법](#설치-방법)
- [사용 방법](#사용-방법)
- [기여 방법](#기여-방법)

## 📜 프로젝트 소개

RN 프로젝트에서 이미지 피커로 사용하는 여러가지 라이브러리 중 적합한 것을 찾기 위한 프로젝트
 - 메타데이터 포함되어야함 (특히 GPS 정보)
 - 이미지 다중선택 기능 필수 / 크롭 기능 필수 아님
 - 안드로이드의 경우, 여러 버전에서 잘 되어야함 
 - 이미지 모두 허용, 선택 허용 권한에 따른 분기처리가 되어야함 
   - iOS 전체   
   - Android 14 이상

## ⚙️ 기능

- 사진 촬영
- 사진 선택 및 불러오기
- 사진 정보 간단 조회


- [x] react-native-image-picker (v7.0.0)
  1. android 와 iOS 모두 동작 확인
  2. 이미지를 선택하면 base64, uri, type, fileName, fileSize 등의 정보를 제공
  3. Exif 정보 출력 불가능 -> Exif 정보를 따로 불러와야 함
  4. 이미지를 업로드했을 떄, 이미지의 Exif 정보 그대로 업로드 됨
  5. 카메라 기능을 통해 촬영한 이미지는 Exif GPS 정보가 없음
  6. 리사이즈 기능이 있음 
  7. 리사이징을 통하면 Exif GPS 정보가 사라짐 
  8. android 버전별로 동작이 다름 (13부터 OS의 사진선택 도구 활용, 그 이하는 미디어 저장소)
  9. iOS 사진선택 / 모든 사진 허용 권한 구분 어려움


- [x] react-native-image-crop-picker
  1. android 와 iOS 모두 동작 확인
  2. 이미지를 선택하면 base64, uri, type, fileName, fileSize 등의 정보를 제공
  3. 이미지를 선택하면 exif 정보를 제공한다.
  4. crop 기능을 사용하면 메타데이터가 제대로 나오지 않는다. 대부분 사라진다. (iOS)는 이미지 이름도 사라짐
  5. (android) 메타데이터 누락이 있음
  6. (iOS) crop 기능을 사용하면 이미지 사이즈가 줄어든다.
  7. android 버전별로 동작이 다름 (13부터 OS의 사진선택 도구 활용, 그 이하는 미디어 저장소)
  8. iOS 버전 상관없이 동일한 동작


- [x] @baronha/react-native-multiple-image-picker (v1.0.4)
  1. android 와 iOS 모두 동작 확인
  2. 이미지를 선택하면 base64, uri(path), type, fileName, fileSize 등의 정보를 제공
  3. Exif 정보 출력 불가능 -> Exif 정보를 따로 불러와야 함
  4. android 에서는 Exif 정보가 살아있지만, iOS 에서는 Exif 정보가 사라짐
  5. 이미지를 업로드했을 떄, 이미지가 가지고 있는 Exif 정보 포함됨 (iOS는 사라진 상태로 업로드)
  6. 카메라 기능은 별도로 없고, OpenPicker 내에 있음
  7. 이미지 크롭 기능 있음
  8. android, iOS 모두 버전 상관없이 동일한 동작
  9. iOS 사진선택 / 모든 사진 허용 권한 구분 가능


- [x] @ko-developerhong/react-native-multiple-image-picker (v1.0.1 with custom patch)
  - @baronha/react-native-multiple-image-picker 와 베이스가 동일하여 거의 동일한 동작을 보임


- [ ] @react-native-camera-roll/camera-roll

## 🛠 설치 방법

1. 프로젝트를 클론하세요:
   ```sh
   git clone https://github.com/chlee1001/react-native-image-picker-demo.git
    ```

2. 의존성을 설치하세요:
   ```sh
   cd react-native-image-picker-demo
   yarn install
   
   cd ios
   bundle install
   pod install
   ```

3. 프로젝트를 실행하세요:
   ```sh
    yarn start
   ```

## 📖 사용 방법

앱 실행 후 원하는 라이브러리를 선택하여 사용하세요.

- [react-native-image-picker](https://www.npmjs.com/package/react-native-image-picker)
- [react-native-image-crop-picker](https://www.npmjs.com/package/react-native-image-crop-picker)
- [react-native-multiple-image-picker](https://www.npmjs.com/package/@baronha/react-native-multiple-image-picker)
- [@ko-developerhong/react-native-multiple-image-picker](https://www.npmjs.com/package/@ko-developerhong/react-native-multiple-image-picker)
- [@react-native-camera-roll/camera-roll](https://www.npmjs.com/package/@react-native-camera-roll/camera-roll)

## 🤝 기여 방법

1. Fork 해주세요! (프로젝트 상단에 있는 'Fork' 버튼을 클릭하세요)
2. 새 브랜치를 만드세요:
   ```sh
   git checkout -b my-new-feature
    ```
3. 변경 사항을 커밋하세요:
   ```sh
   git commit -am 'Add some feature'
    ```
4. 브랜치에 푸시하세요:
    ```sh
    git push origin my-new-feature
     ```
5. Pull Request를 보내주세요!
