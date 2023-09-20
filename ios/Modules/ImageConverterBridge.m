//
//  ImageConverter.m
//  RNImagePickerTestProject
//
//  Created by rudy.lee on 2023/09/20.
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(ImageConverter, NSObject)

RCT_EXTERN_METHOD(convertImageAtPath:(NSString *)path resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

@end


