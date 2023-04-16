import React from 'react';
import Box, { IBoxProps } from '../Box/Box';

const Row = (props: IBoxProps) => (
  <Box flexDirection="row" {...props}>
    {props.children}
  </Box>
);

export default Row;
