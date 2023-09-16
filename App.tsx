import React from 'react';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { navigationRef } from './src/utils/navigationHelper';
import PickerGroup from './src/containers/PickerGroup';
import ImagePicker from './src/containers/ImagePicker';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ImageCropPicker from './src/containers/ImageCropPicker';
import ImageMultiPicker from './src/containers/ImageMultiPicker';

type RootStackParamList = {
  Home: undefined;
  ImagePicker: undefined;
  ImageCropPicker: undefined;
  ImageMultiPicker: undefined;
};

const RootStack = createStackNavigator<RootStackParamList>();

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer ref={navigationRef}>
          <RootStack.Navigator initialRouteName="Home">
            <RootStack.Screen
              name="Home"
              component={PickerGroup}
              options={{ headerShown: false }}
            />
            <RootStack.Screen
              name="ImagePicker"
              component={ImagePicker}
              options={{ headerShown: false }}
            />
            <RootStack.Screen
              name="ImageCropPicker"
              component={ImageCropPicker}
              options={{ headerShown: false }}
            />
            <RootStack.Screen
              name="ImageMultiPicker"
              component={ImageMultiPicker}
              options={{ headerShown: false }}
            />
          </RootStack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
