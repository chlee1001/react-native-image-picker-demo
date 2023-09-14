import { Edge } from 'react-native-safe-area-context';
import { PropsWithChildren } from 'react';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';

interface Props {
  edges?: readonly Edge[];
  backgroundColor?: string;

  [key: string]: any;
}

const CommonSafeAreaView = ({
  edges = ['top'],
  backgroundColor = 'rgb(255,255,255)',
  children,
  ...rest
}: PropsWithChildren<Props>) => {
  return (
    <RNSafeAreaView
      edges={edges}
      style={{
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor,
      }}
      {...rest}>
      {children}
    </RNSafeAreaView>
  );
};

export default CommonSafeAreaView;
