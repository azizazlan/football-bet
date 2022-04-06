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
import animate from '../../assets/imgs/giphy.gif';
import { BetState } from '../../contexts/Betting';

const Betting = () => {
  const { account, activate } = useWeb3React<Web3Provider>();

  const {
    delayInterval,
    pending,
    betSession,
    updateBetSession,
    startNewBet,
    getWinningTeam,
  } = useBettingContext();

  React.useEffect(() => {
    activate(injectedConnector);
  }, [injectedConnector, betSession]);

  useInterval(() => {
    updateBetSession();

    if (
      betSession.betState === BetState.PICKING_TEAM ||
      betSession.betState === BetState.CLAIM
    ) {
      getWinningTeam();
    }
  }, delayInterval);

  const { betState } = betSession;

  if (betState === 0) {
    return <BettingForm />;
  }

  if (betState === 2) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <img src={animate} style={{ width: '150px', height: 'auto' }} />
        <Alert severity="info" icon={false}>
          Randomly selecting wining ball...
        </Alert>
      </div>
    );
  }

  if (betState === 3) {
    return <Claim />;
  }

  return (
    <div>
      {account === '0x830227c880d2281Ae91Cf8097628C889E4D92E8f' ? (
        <div>
          <Operator
            betSession={betSession}
            pending={pending}
            startNewBet={startNewBet}
          />
        </div>
      ) : (
        <Alert severity="info" icon={false}>
          Betting session closed!
        </Alert>
      )}
    </div>
  );
};

export default Betting;
