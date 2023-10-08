import { PureModal, Box, StyledText, Button } from '@mobile/components/elements';
import { PureModalProps } from '@mobile/components/elements/PureModal/PureModal';
import theme from '@mobile/theme';
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as S from './styles';

interface ILogoutModal extends PureModalProps {
  onAccept: () => void;
}

const LogoutModal = (props: ILogoutModal) => {
  return (
    <PureModal visible={props.visible} setVisible={props.setVisible}>
      <Box pdHorizontal="5%" pdVertical="10px" flexDirection="column">
        <Box
          width="30px"
          height="30px"
          alignSelf="flex-end"
          alignItems="center"
          justifyContent="center"
          backgroundColor={theme.colors.primary}
          borderRadius="30px">
          <S.MapButton onPress={() => props.setVisible(false)}>
            <MaterialCommunityIcons name="close" size={26} color="white" />
          </S.MapButton>
        </Box>
        <Box pdHorizontal="10%" alignItems="center" marginTop="16px" pdBottom="10%">
          <StyledText
            textAlign="center"
            fontSize={18}
            value="Você deseja mesmo sair de sua conta?"
            fontFamily={theme.fonts.semiBold}
          />
          <Box marginTop="40px" width="80%" alignItems="center">
            <Button onPress={() => props.onAccept()} label={`Sim`} width="80%" />
          </Box>
          <Box marginTop="10px" width="80%" alignItems="center">
            <Button
              onPress={() => props.setVisible(false)}
              label="Não"
              width="80%"
              backgroundColor={'red'}
            />
          </Box>
        </Box>
      </Box>
    </PureModal>
  );
};

export default LogoutModal;
