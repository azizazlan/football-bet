import { useState } from 'react';
import useInterval from './useInterval';

const CountdownTimer = () => {
  const [seconds, setSeconds] = useState(120);
  useInterval(() => {
    let secs = seconds - 1;
    setSeconds(secs);
  }, 1000);

  return <div>{seconds} seconds</div>;
};

export default CountdownTimer;
