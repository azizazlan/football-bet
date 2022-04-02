import React from 'react';
import Alert from '@mui/material/Alert';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { useBettingContext } from '../../contexts/Betting';
import BettingForm from './BettingForm';
import Operator from '../operator/Operator';
import Claim from '../claim/Claim';
import { Account } from '../metamask';

enum TEAM {
  'Yet to announce' = 0,
  'Blue Team' = 1,
  'Red Team' = 2,
}

export const injectedConnector = new InjectedConnector({
  supportedChainIds: [
    1, // Mainet
    3, // Ropsten
    4, // Rinkeby
    5, // Goerli
    42, // Kovan
    97, // BNB Test
  ],
});

const Betting = () => {
  const { account, activate } = useWeb3React<Web3Provider>();

  const {
    pending,
    getBetState,
    betState,
    startNewBet,
    winningTeam,
    getWinningTeam,
    selectedTeam,
    win,
    claim,
  } = useBettingContext();

  React.useEffect(() => {
    activate(injectedConnector);
    getBetState();
    if (betState == 3) {
      getWinningTeam();
    }
  }, [betState]);

  if (betState === 0) {
    return (
      <div>
        <Account />
        <BettingForm />
      </div>
    );
  }

  if (betState === 2) {
    return (
      <div>
        <Account />
        <Alert severity="info">Randomly selecting wining team...</Alert>
      </div>
    );
  }

  if (win && betState === 3) {
    return (
      <div>
        <Account />
        <Claim
          winningTeam={winningTeam}
          getWinningTeam={getWinningTeam}
          win={win}
          claim={claim}
        />
      </div>
    );
  }

  if (betState === 3) {
    return (
      <div>
        <Account />
        <Alert severity="warning">
          You chose {TEAM[selectedTeam]}. Sorry, you lose!
        </Alert>
      </div>
    );
  }

  return (
    <div>
      <Account />
      {account === '0x830227c880d2281Ae91Cf8097628C889E4D92E8f' ? (
        <Operator
          pending={pending}
          betState={betState}
          getBetState={getBetState}
          startNewBet={startNewBet}
        />
      ) : (
        <Alert severity="info">Betting closed! Wait for next session!</Alert>
      )}
    </div>
  );
};

export default Betting;
