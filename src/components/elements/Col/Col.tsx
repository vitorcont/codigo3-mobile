import React from 'react';
import Box, { IBoxProps } from '../Box/Box';

const Col = (props: IBoxProps) => (
  <Box flexDirection="column" {...props}>
    {props.children}
  </Box>
);

export default Col;
