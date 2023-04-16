import { Box, Col, StyledText } from '@mobile/components/elements';
import theme from '@mobile/theme';
import { StatusCard } from '@mobile/components';
import { RiskStatusEnum } from '@mobile/enum/status';

export interface MapStatusCardProps {
  variant: RiskStatusEnum;
}

const MapStatusCard = (props: MapStatusCardProps) => {
  return (
    <Col
      pdVertical="5px"
      pdHorizontal="20%"
      alignItems="center"
      borderRadius="26px"
      backgroundColor={theme.colors.secundary}
      shadowBox>
      {(props.variant === RiskStatusEnum.DANGER || props.variant === RiskStatusEnum.EVACUATE) && (
        <Box pdBottom="5px">
          <StyledText fontSize={18} fontFamily={theme.fonts.bold} value="ATENÇÃO" />
        </Box>
      )}
      <StatusCard variant={props.variant} />
    </Col>
  );
};

export default MapStatusCard;
