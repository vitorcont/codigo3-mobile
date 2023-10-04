import { PureModal, Box, StyledText, Button } from '@mobile/components/elements';
import { PureModalProps } from '@mobile/components/elements/PureModal/PureModal';
import theme from '@mobile/theme';
import React from 'react';

import { ActivityIndicator } from 'react-native';

interface ILoadingModal extends PureModalProps {}

const LoadingModal = (props: ILoadingModal) => {
  return (
    <PureModal visible={props.visible} setVisible={props.setVisible}>
      <Box pdVertical="10%" alignItems="center">
        <ActivityIndicator size={'large'} color={theme.colors.primary} />
        <Box marginTop="25px">
          <StyledText fontFamily={theme.fonts.semiBold} value="Aguarde um instante..." />
        </Box>
      </Box>
    </PureModal>
  );
};

export default LoadingModal;
