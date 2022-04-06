import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import useInterval from './useInterval';

const CountdownTimer = () => {
  const [seconds, setSeconds] = useState(60);
  useInterval(() => {
    let secs = seconds - 1;
    setSeconds(secs);
  }, 1000);

  return <Typography variant="body2">{seconds} seconds</Typography>;
};

export default CountdownTimer;
