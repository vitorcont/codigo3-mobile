import BottomSheet, { BottomSheetModalProps, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import Window from '@mobile/services/dimensions';
import theme from '@mobile/theme';
import React, { forwardRef } from 'react';
import { Text } from 'react-native';
import Box from '../Box/Box';

export interface RawBottomModalProps extends BottomSheetModalProps {
  children: React.ReactNode;
}

const RawBottomModal = forwardRef<BottomSheet, RawBottomModalProps>((props, ref) => {
  return (
    <BottomSheet
      {...props}
      backgroundStyle={{
        backgroundColor: theme.colors.white,
      }}
      handleIndicatorStyle={{
        backgroundColor: theme.colors.drawerIndicator,
        width: '30%',
      }}
      ref={ref}
      index={0}>
      <BottomSheetScrollView
        style={{
          width: '100%',
          marginTop: Window.heightScale(0.025),
        }}>
        <Box width="100%" pdBottom="10%">
          {props.children}
        </Box>
      </BottomSheetScrollView>
    </BottomSheet>
  );
});

export default RawBottomModal;
