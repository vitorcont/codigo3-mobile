import { PureModal, Col, Box, StyledText, StatusCard, Button } from '@mobile/components';
import { PureModalProps } from '@mobile/components/elements/PureModal/PureModal';
import { RiskStatusEnum } from '@mobile/enum/status';
import theme from '@mobile/theme';
import {} from 'react-native';

export interface WarningModalProps extends PureModalProps {
  variant: RiskStatusEnum;
  title: string;
  description: string;
}

const WarningModal = (props: WarningModalProps) => {
  return (
    <PureModal {...props}>
      <Col
        pdVertical="6%"
        pdHorizontal="10%"
        alignItems="center"
        borderRadius="26px"
        backgroundColor={theme.colors.secundary}
        shadowBox>
        {props.variant !== RiskStatusEnum.ATTENTION && (
          <Box pdBottom="5px">
            <StyledText fontSize={18} fontFamily={theme.fonts.bold} value="ATENÇÃO" />
          </Box>
        )}
        <StatusCard variant={props.variant} />
        <Box marginTop="10px" pdBottom="5px">
          <StyledText
            textAlign="center"
            fontSize={18}
            fontFamily={theme.fonts.bold}
            value={props.title}
          />
        </Box>
        <Box marginTop="10px" pdBottom="5px">
          <StyledText
            textAlign="center"
            fontSize={14}
            fontFamily={theme.fonts.regular}
            value={props.description}
          />
        </Box>
        <Box marginTop="20px" pdBottom="5px">
          <Button label="Fechar" onPress={() => props.setVisible(false)} />
        </Box>
      </Col>
    </PureModal>
  );
};

export default WarningModal;
