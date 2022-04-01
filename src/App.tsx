import { Web3Provider } from '@ethersproject/providers';
import { Web3ReactProvider } from '@web3-react/core';
import MetaMaskOnboarding from '@metamask/onboarding';
import Metamaskonboard from './features/metamaskonboard/index';
import Betting from './features/betting/Betting';
import { BettingContextProvider } from './contexts/Betting';

const Header = () => {
  return (
    <div
      style={{ marginBottom: '7px', display: 'flex', flexDirection: 'column' }}
    >
      MoneyCome
    </div>
  );
};

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

function App() {
  if (!MetaMaskOnboarding.isMetaMaskInstalled()) {
    return (
      <div>
        <Header />
        <Metamaskonboard />
      </div>
    );
  }

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Header />
      <BettingContextProvider>
        <Betting />
      </BettingContextProvider>
    </Web3ReactProvider>
  );
}

export default App;
