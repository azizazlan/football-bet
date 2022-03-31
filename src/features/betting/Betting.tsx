import React from 'react';
import { useAppDispatch } from '../../app/hook';

import { increment, getBetStateAsync } from './bettingSlice';

const Betting = () => {
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    console.log('tun M do something....');
    dispatch(getBetStateAsync(69));
  }, []);

  return <div>Betting areas</div>;
};

export default Betting;
