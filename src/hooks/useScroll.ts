import { useState } from 'react';

const useScroll = () => {
  const [scrolled, setScrolled] = useState(false);

  const onScroll = (event: { nativeEvent: { contentOffset: { y: number; }; }; }) => {
    if (event.nativeEvent.contentOffset.y > 0) {
      if (!scrolled) {
        setScrolled(true);
      }
    } else if (scrolled) {
      setScrolled(false);
    }
  };

  return [scrolled, onScroll];
};

export default useScroll;
