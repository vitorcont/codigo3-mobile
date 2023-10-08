import { Row, Box, StyledText, Button } from '@mobile/components/elements';
import theme from '@mobile/theme';
import React, { useContext, useState } from 'react';
import * as S from './styles';
import { LocationContext } from '@mobile/context/LocationContext';
import LogoutModal from '../LogoutModal/LogoutModal';
import { actionLogout } from '@mobile/store/User/action';
import { useDispatch } from 'react-redux';

interface ITopBar {}

const TopBar = (props: ITopBar) => {
  const { userLocation } = useContext(LocationContext)!;
  const [logout, setLogout] = useState(false);
  const dispatch = useDispatch();

  return (
    <>
      <LogoutModal
        visible={logout}
        setVisible={setLogout}
        onAccept={() => dispatch(actionLogout())}
      />
      <Row
        position="absolute"
        top="0px"
        justifyContent="space-between"
        alignSelf="center"
        alignItems="flex-end"
        zIndex={2}
        width="100%"
        flexDirection="column">
        <Box
          pdHorizontal="28px"
          borderRadius="10px"
          width="100%"
          shadowBox
          pdBottom="12px"
          marginBottom="-15px"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          pdTop="12%"
          backgroundColor={theme.colors.white}>
          <Box flexDirection="row" alignItems="flex-end">
            <StyledText
              fontSize={18}
              fontFamily={theme.fonts.semiBold}
              value={`${((userLocation ? userLocation?.speed ?? 0 : 0) * 3.6).toFixed(0)} `}
            />
            <StyledText fontFamily={theme.fonts.semiBold} value={'Km/h'} />
          </Box>
          <S.ExitButton onPress={() => setLogout(true)}>
            <Box pdVertical="5%" pdHorizontal="10%" alignItems="center">
              <StyledText value="Sair" fontFamily={theme.fonts.semiBold} color="white" />
            </Box>
          </S.ExitButton>
        </Box>
      </Row>
    </>
  );
};

export default TopBar;
