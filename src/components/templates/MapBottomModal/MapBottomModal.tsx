import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import {
  Box,
  Button,
  RawBottomModal,
  Row,
  StatusCard,
  StyledText,
} from '@mobile/components/elements';
import theme from '@mobile/theme';
import React, { forwardRef } from 'react';
import { Linking, ScrollView } from 'react-native';
import { Feather, MaterialIcons, Ionicons, Entypo } from '@expo/vector-icons';
import { openWebSite } from '@mobile/services/contacts';
import { WebView } from 'react-native-webview';
import { RiskStatusEnum } from '@mobile/enum/status';

export interface MapBottomModalProps {}

const MapBottomModal = forwardRef<BottomSheet, MapBottomModalProps>((props, ref) => {
  const cardsData = [
    {
      status: RiskStatusEnum.SAFE,
      description: 'Baixo risco, não há indícios de processos destrutivos',
    },
    {
      status: RiskStatusEnum.ATTENTION,
      description: 'Médio risco, como chuvas leves, medianas e pista molhada.',
    },
    {
      status: [RiskStatusEnum.DANGER],
      description:
        'Alto risco, como tempestades, rajadas de vento e raios, busque abrigo imediatamente.',
    },
    {
      status: [RiskStatusEnum.EVACUATE],
      description:
        'Risco extremo, deslizamentos, alagamentos e incêncios, saia da área imediatamente.',
    },
  ];

  return (
    <RawBottomModal {...props} ref={ref} snapPoints={['6%', '80%']}>
      <Box width="90%" alignSelf="center" alignItems="center">
        <StyledText
          fontFamily={theme.fonts.bold}
          fontSize={18}
          value="Em caso de emegência, entre em contato"
        />
        <Box marginVertical="20px">
          <Button
            StartAdornment={<Feather name="phone" size={18} color={theme.colors.white} />}
            label="Discar 199"
            onPress={() => Linking.openURL(`tel:${199}`)}
          />
        </Box>
        <Box marginTop="40px" />
        <StyledText
          fontFamily={theme.fonts.bold}
          fontSize={18}
          value="Entenda a classificação de riscos abaixo"
        />
        {cardsData.map((status) => (
          <Box
            borderColor={theme.colors.primary}
            borderRadius="26px"
            width="100%"
            borderWidth="4px"
            marginTop="15px">
            <Box pdHorizontal="20px" pdVertical="16px">
              <Box alignSelf="flex-start" pdBottom="10px">
                <StatusCard variant={status.status as any} />
              </Box>
              <StyledText fontSize={14} value={status.description} />
            </Box>
          </Box>
        ))}
        <Box marginTop="40px" />
        <StyledText fontFamily={theme.fonts.bold} fontSize={18} value="Últimas notícias" />
        <Box
          borderColor={theme.colors.primary}
          borderRadius="26px"
          width="100%"
          height="500px"
          borderWidth="4px"
          marginTop="20px"
          overflow="hidden">
          <WebView
            style={{
              width: '100%',
              height: '100%',
            }}
            scrollEnabled
            nestedScrollEnabled
            originWhitelist={['*']}
            source={{
              uri: 'https://twitter.com/defesacivilsp?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor',
            }}
          />
        </Box>
        <Box marginTop="40px" />
        <StyledText
          fontFamily={theme.fonts.bold}
          fontSize={18}
          value="Acompanhe nas redes sociais"
        />
        <Row marginTop="20px" justifyContent="space-around" width="100%">
          <Button
            StartAdornment={<Entypo name="twitter" size={18} color={theme.colors.white} />}
            label="Twitter"
            onPress={() =>
              openWebSite(
                `https://twitter.com/defesacivilsp?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor`
              )
            }
          />
          <Button
            StartAdornment={<Entypo name="instagram" size={18} color={theme.colors.white} />}
            label="Instagram"
            onPress={() => openWebSite(`https://www.instagram.com/defesacivilsp/`)}
          />
        </Row>
      </Box>
    </RawBottomModal>
  );
});

export default MapBottomModal;
