import React, { useEffect, useMemo, useRef, useState } from 'react';
import LogoIcon from '@mobile/assets/icons/ic_secundary_logo.svg';
import navigationService, { createStack } from '@mobile/services/navigation';
import { Box, Button, Input, StyledText } from '@mobile/components';
import theme from '@mobile/theme';
import { ScrollView, TouchableOpacity } from 'react-native';
import * as S from './Recovery.styles';
import { Entypo } from '@expo/vector-icons';
import { winHeight } from '@mobile/services/dimensions';

const Recovery = () => {
  const scrollRef = useRef<ScrollView>();
  return (
    <>
      <Box position="absolute" width="100%" height="100%" zIndex={100}>
        <S.ScrollWrapper ref={scrollRef as any}>
          <S.InformationWrapper>
            <Box alignSelf="flex-start">
              <TouchableOpacity onPress={() => navigationService.back()}>
                <Box flexDirection="row" alignItems="center">
                  <Entypo name="chevron-thin-left" size={20} color={theme.colors.primary} />
                  <Box marginLeft="5px">
                    <StyledText value="Voltar" fontFamily={theme.fonts.semiBold} fontSize={18} />
                  </Box>
                </Box>
              </TouchableOpacity>
            </Box>
            <Box width="95%" marginTop="10%" alignSelf="center" alignItems="center">
              <StyledText value="Esqueceu sua senha?" fontSize={20} />
              <Box marginTop="10%">
                <StyledText value="Não tem problema, podemos te ajudar..." textAlign="center" />
              </Box>
              <Box marginTop="5%" pdHorizontal="8%">
                <StyledText
                  textAlign="center"
                  value="Insira seus dados abaixo, um email com uma nova senha será enviado para você, então basta utilizar esta nova senha para entrar"
                />
              </Box>
              <Input
                boxProps={{
                  marginTop: '12%',
                  width: '80%',
                }}
                inputProps={{
                  placeholder: 'e-mail',
                  onFocus: () => {
                    scrollRef.current?.scrollTo({
                      y: winHeight * 0.25,
                    });
                  },
                }}
              />

              <Box alignSelf="center" width="60%" marginTop="30%">
                <Button label="Enviar" onPress={() => navigationService.navigate('Content')} />
              </Box>
            </Box>
          </S.InformationWrapper>
        </S.ScrollWrapper>
      </Box>
      <Box height="100%" width="100%" backgroundColor={theme.colors.primary}>
        <Box alignSelf="center" marginTop="15%">
          <LogoIcon />
        </Box>
      </Box>
    </>
  );
};

export default Recovery;
