import {
  CommonActions,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { NavigationAction } from '@react-navigation/routers';

export const navigationRef = useNavigationContainerRef();

function dispatchNavigationRef(action: NavigationAction) {
  navigationRef.current?.dispatch(action);
}

export function navigateScreenTo(screenName: string, params = {}) {
  dispatchNavigationRef(
    CommonActions.navigate({
      name: screenName,
      params,
    }),
  );
}

export function goBack(errorCallback = () => {}) {
  if (!navigationRef?.current) {
    return;
  }
  if (!navigationRef.current.canGoBack()) {
    errorCallback();
    return;
  }
  dispatchNavigationRef(CommonActions.goBack());
}
