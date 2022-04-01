import React from 'react';
import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import Button from '@mui/material/Button';
import { useBettingContext } from '../../contexts/Betting';
import EnterForm from './EnterForm';

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
  const [balance, setBalance] = React.useState('');

  const { chainId, account, activate, active, library } =
    useWeb3React<Web3Provider>();

  React.useEffect(() => {
    if (!library) return;
    if (!account) return;

    library.getBalance(account).then((balances) => {
      const bal = ethers.utils.formatUnits(balances.toString(), 18);
      setBalance(bal);
    });
  }, [library, account]);

  const {
    count,
    getBetState,
    betState,
    startNewBet,
    enterBet,
    winningTeam,
    getWinningTeam,
    win,
  } = useBettingContext();
  const onClick = () => {
    activate(injectedConnector);
  };

  return (
    <div style={{ margin: '1em' }}>
      <div>ChainId: {chainId}</div>
      <div>Account: {account}</div>
      <div>Balance: Ξ{balance}</div>
      {active ? (
        <div>✅</div>
      ) : (
        <Button variant="contained" type="button" onClick={onClick}>
          Connect
        </Button>
      )}
      <div style={{ marginTop: '1em' }}>
        <div>Bet state: {betState}</div>
        <Button variant="contained" onClick={getBetState}>
          bet state
        </Button>
      </div>
      <div style={{ marginTop: '1em' }}>
        <Button variant="contained" onClick={startNewBet}>
          start new bet
        </Button>
      </div>
      <div style={{ marginTop: '1em' }}>
        <EnterForm />
      </div>
      <div style={{ marginTop: '1em' }}>
        <div>Winning team: {winningTeam}</div>
        <Button variant="contained" onClick={getWinningTeam}>
          who wins?
        </Button>
      </div>
      <div style={{ marginTop: '1em' }}>
        {win ? 'I won!' : 'Lost'}
        <br />
        <Button variant="contained" disabled={!win}>
          claim
        </Button>
      </div>
    </div>
  );
};

export default Betting;
