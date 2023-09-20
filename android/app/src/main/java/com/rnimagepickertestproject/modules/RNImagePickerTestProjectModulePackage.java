package com.rnimagepickertestproject.modules;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class RNImagePickerTestProjectModulePackage implements ReactPackage {
  public static ReactApplicationContext reactContext;

  @Override
  public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
    RNImagePickerTestProjectModulePackage.reactContext = reactContext;
    List<NativeModule> modules = new ArrayList<>();
    modules.add(new ImageConverter(reactContext));

    return modules;
  }

  @Override
  public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
    return Collections.emptyList();
  }
}
