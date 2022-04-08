import { useState } from 'react';
import { Typography } from '@mui/material';
import useInterval from './useInterval';

const CountdownTimer = () => {
  const [seconds, setSeconds] = useState(120);
  useInterval(() => {
    let secs = seconds - 1;
    setSeconds(secs);
  }, 1000);

  return <Typography variant="caption">{seconds} seconds</Typography>;
};

export default CountdownTimer;
