import React, { useEffect, useMemo, useRef, useState } from 'react';
import LogoIcon from '@mobile/assets/icons/ic_main_logo.svg';
import navigationService, { createStack } from '@mobile/services/navigation';
import { Box, Button, Input, StyledText } from '@mobile/components';
import theme from '@mobile/theme';
import { ScrollView, TouchableOpacity } from 'react-native';
import * as S from './Login.styles';
import { requestForegroundPermissionsAsync } from 'expo-location';
import { useDispatch } from 'react-redux';
import { authenticate, getMe } from '@mobile/store/User/action';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toaster from '@mobile/services/toaster';
import { FontAwesome } from '@expo/vector-icons';

const Login = () => {
  const dispatch = useDispatch();
  const scrollRef = useRef<ScrollView>();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [visible, setVisible] = useState(false);

  const handleSubmit = () => {
    dispatch(
      authenticate(form, (successAuth) => {
        if (successAuth) {
          dispatch(
            getMe((successMe) => {
              if (successMe) {
                navigationService.reset({ index: 0, routes: [{ name: 'Content' }] });
              } else {
                handleError();
              }
            })
          );
        } else {
          handleError();
        }
      })
    );
  };

  const handleError = () => {
    AsyncStorage.clear();
    Toaster.error(
      'Atenção!',
      'Não foi possível validar as informações de seu usuário, verifique seus dados e tente novamente'
    );
  };

  useEffect(() => {
    const initiateApp = async () => {
      try {
        await requestForegroundPermissionsAsync();
      } catch (error) {
        console.log('Error requesting location permission:', error);
      }

      const token = await AsyncStorage.getItem('accessToken');
      if (!!token) {
        dispatch(
          getMe((successMe) => {
            if (successMe) {
              navigationService.reset({ index: 0, routes: [{ name: 'Content' }] });
            }
          })
        );
      }
    };
    initiateApp();
  }, []);

  return (
    <>
      <Box position="absolute" width="100%" height="100%" zIndex={100}>
        <S.ScrollWrapper ref={scrollRef as any}>
          <S.InformationWrapper>
            <Box width="85%">
              <Box alignSelf="center" alignItems="center" marginTop="8%">
                <StyledText
                  value="Seja bem vindo!"
                  fontSize={20}
                  fontFamily={theme.fonts.semiBold}
                />
                <StyledText value="Insira seus dados abaixo para entrar" fontSize={18} />
              </Box>
              <Input
                boxProps={{
                  marginTop: '10%',
                }}
                inputProps={{
                  placeholder: 'e-mail',
                  value: form.email,
                  onChangeText: (value) => setForm({ ...form, email: value }),
                  onFocus: () => {
                    setTimeout(() => {
                      scrollRef.current?.scrollToEnd();
                    }, 200);
                  },
                }}
              />
              <Input
                boxProps={{
                  marginTop: '6%',
                }}
                inputProps={{
                  secureTextEntry: !visible,
                  placeholder: 'senha',
                  value: form.password,
                  onChangeText: (value) => setForm({ ...form, password: value }),
                  onFocus: () => {
                    setTimeout(() => {
                      scrollRef.current?.scrollToEnd();
                    }, 200);
                  },
                }}
                EndAdornment={
                  <S.Visibutton onPress={() => setVisible(!visible)}>
                    {visible ? (
                      <FontAwesome name="eye-slash" size={18} color={theme.colors.placeText} />
                    ) : (
                      <FontAwesome name="eye" size={18} color={theme.colors.placeText} />
                    )}
                  </S.Visibutton>
                }
              />
              <Box marginTop="6%" alignSelf="center">
                <TouchableOpacity onPress={() => navigationService.navigate('Recovery')}>
                  <StyledText value="Esqueceu a senha?" />
                </TouchableOpacity>
              </Box>
              <Box alignSelf="center" width="60%" marginTop="20%">
                <Button label="Entrar" onPress={handleSubmit} />
              </Box>
            </Box>
          </S.InformationWrapper>
        </S.ScrollWrapper>
      </Box>
      <Box height="100%" width="100%" backgroundColor={theme.colors.primary}>
        <Box alignSelf="center" marginTop="10%">
          <LogoIcon />
        </Box>
      </Box>
    </>
  );
};

export default Login;
