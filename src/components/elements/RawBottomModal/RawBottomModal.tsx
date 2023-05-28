import BottomSheet, { BottomSheetModalProps, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import theme from '@mobile/theme';
import React, { forwardRef } from 'react';

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
      {props.children}
    </BottomSheet>
  );
});

export default RawBottomModal;
