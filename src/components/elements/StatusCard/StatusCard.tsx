import { Box, Row, StyledText } from '@mobile/components/elements';
import { RiskStatusEnum } from '@mobile/enum/status';
import theme from '@mobile/theme';

interface StatusCardProps {
  variant: RiskStatusEnum;
}

const StatusCard = (props: StatusCardProps) => {
  const getDotColor = () => {
    const colors = {
      [RiskStatusEnum.SAFE]: theme.colors.safe,
      [RiskStatusEnum.ATTENTION]: theme.colors.attention,
      [RiskStatusEnum.DANGER]: theme.colors.dangerDot,
      [RiskStatusEnum.EVACUATE]: theme.colors.black,
    };

    return colors[props.variant];
  };

  const getBackgroundColor = () => {
    const colors = {
      [RiskStatusEnum.SAFE]: theme.colors.secundary,
      [RiskStatusEnum.ATTENTION]: theme.colors.secundary,
      [RiskStatusEnum.DANGER]: theme.colors.danger,
      [RiskStatusEnum.EVACUATE]: theme.colors.evacuate,
    };

    return colors[props.variant];
  };

  const getLabel = () => {
    const colors = {
      [RiskStatusEnum.SAFE]: 'Você está seguro',
      [RiskStatusEnum.ATTENTION]: 'Tenha cuidado',
      [RiskStatusEnum.DANGER]: 'Busque abrigo',
      [RiskStatusEnum.EVACUATE]: 'Evacue a área',
    };

    return colors[props.variant];
  };

  return (
    <Row
      pdHorizontal="10px"
      pdVertical="5px"
      alignItems="center"
      backgroundColor={getBackgroundColor()}
      borderRadius="26px">
      <Box
        marginRight="10px"
        borderRadius="30px"
        backgroundColor={getDotColor()}
        width="10px"
        height="10px"
      />
      <StyledText fontFamily={theme.fonts.semiBold} value={getLabel()} />
    </Row>
  );
};

export default StatusCard;
