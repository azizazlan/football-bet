import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { useBettingContext } from '../../contexts/Betting';

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
  const { chainId, account, activate, active } = useWeb3React<Web3Provider>();

  const { count, getBetState, betState, startNewBet } = useBettingContext();
  const onClick = () => {
    activate(injectedConnector);
  };

  return (
    <div>
      <div>ChainId: {chainId}</div>
      <div>Account: {account}</div>
      {active ? (
        <div>✅ </div>
      ) : (
        <button type="button" onClick={onClick}>
          Connect
        </button>
      )}
      <div>
        <div>Bet state: {betState}</div>
        <button type="button" onClick={getBetState}>
          bet state
        </button>
      </div>
      <div>
        <button type="button" onClick={startNewBet}>
          start new bet
        </button>
      </div>
    </div>
  );
};

export default Betting;
