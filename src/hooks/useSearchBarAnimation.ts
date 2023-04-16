import { useRef } from 'react';
import { Animated } from 'react-native';

const useSearchBarAnimation = () => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const diffClamp = useRef(Animated.diffClamp(scrollY, 0, 100)).current;

  const translateY = diffClamp.interpolate({
    inputRange: [0, 150],
    outputRange: [0, -150],
    extrapolate: 'clamp',
  });

  const onScroll = Animated.event(
    [
      {
        nativeEvent: {
          contentOffset: {
            y: scrollY,
          },
        },
      },
    ],
    { useNativeDriver: true },
  );

  return {
    onScroll,
    transform: [{ translateY }],
  };
};

export default useSearchBarAnimation;
