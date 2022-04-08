import React from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useBettingContext } from '../../contexts/Betting';
import BettingForm from './BettingForm';
import Operator from '../operator/Operator';
import Claim from '../claim/Claim';
import useInterval from './useInterval';
import { injectedConnector } from '../../contexts/injectedConnector';
import { BetState } from '../../contexts/Betting';

const Betting = () => {
  const { account, activate } = useWeb3React<Web3Provider>();

  const {
    player,
    delayInterval,
    pending,
    betSession,
    updateBetSession,
    startNewBet,
    updateWinningTeam,
  } = useBettingContext();

  React.useEffect(() => {
    activate(injectedConnector);
  }, [injectedConnector, betSession]);

  useInterval(() => {
    if (betSession.betState === BetState.CLAIM) {
      updateWinningTeam();
    }
    updateBetSession();
  }, delayInterval);

  if (betSession.betState === 2) {
    return <div>Getting random result...</div>;
  }

  if (
    betSession.betState === 3 &&
    betSession.betId === player.betId &&
    betSession.winningTeam > 0 &&
    betSession.winningTeam === player.teamSelected
  ) {
    return <Claim />;
  }

  if (
    betSession.betState === 3 &&
    betSession.betId === player.betId &&
    betSession.winningTeam > 0 &&
    betSession.winningTeam !== player.teamSelected
  ) {
    return <div>Sorry, you lost :(</div>;
  }

  if (betSession.betState === 3 && betSession.winningTeam === -1) {
    return <div>Checking claim...</div>;
  }

  if (betSession.betState === 0) {
    return <BettingForm />;
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
        <div>Betting session closed.</div>
      )}
    </div>
  );
};

export default Betting;
