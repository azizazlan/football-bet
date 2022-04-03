import React from 'react';
import Alert from '@mui/material/Alert';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useBettingContext } from '../../contexts/Betting';
import BettingForm from './BettingForm';
import Operator from '../operator/Operator';
import Claim from '../claim/Claim';
import useInterval from './useInterval';
import { injectedConnector } from '../../contexts/injectedConnector';

const Betting = () => {
  const { account, activate } = useWeb3React<Web3Provider>();

  const {
    delayInterval,
    pending,
    getBetState,
    betState,
    startNewBet,
    getWinningTeam,
  } = useBettingContext();

  React.useEffect(() => {
    getBetState();
    activate(injectedConnector);
  }, [injectedConnector, betState]);

  useInterval(() => {
    getBetState();

    if (betState === 2 || betState === 3) {
      getWinningTeam();
    }
  }, delayInterval);

  if (betState === 0) {
    return <BettingForm />;
  }

  if (betState === 2) {
    return (
      <Alert severity="info" icon={false}>
        Randomly selecting wining team...
      </Alert>
    );
  }

  if (betState === 3) {
    return <Claim />;
  }

  return (
    <div>
      {account === '0x830227c880d2281Ae91Cf8097628C889E4D92E8f' ? (
        <Operator
          pending={pending}
          betState={betState}
          startNewBet={startNewBet}
        />
      ) : (
        <Alert severity="info" icon={false}>
          Betting session closed!
        </Alert>
      )}
    </div>
  );
};

export default Betting;
