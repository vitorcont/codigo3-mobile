import { PureModal, Box, StyledText, Button } from '@mobile/components/elements';
import { PureModalProps } from '@mobile/components/elements/PureModal/PureModal';
import theme from '@mobile/theme';
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as S from './styles';
import { Feather } from '@expo/vector-icons';

interface ICodeModal extends PureModalProps {
  onSelectPriority: (code: 1 | 2 | 3) => void;
}

const CodeModal = (props: ICodeModal) => {
  const priority = [
    {
      color: theme.colors.codeOne,
    },
    {
      color: theme.colors.codeTwo,
    },
    {
      color: theme.colors.codeThree,
    },
  ];

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
            value="Selecione a prioridade do deslocamento"
            fontFamily={theme.fonts.semiBold}
          />
          <Box marginTop="10px" width="100%" alignItems="center">
            {priority.map((item, index) => (
              <Box marginTop="20px" width="80%">
                <Button
                  StartAdornment={<Feather name="circle" size={20} color="white" />}
                  label={`Código ${index + 1}`}
                  backgroundColor={item.color}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </PureModal>
  );
};

export default CodeModal;
