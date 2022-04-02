import { Typography } from '@mui/material';
import { Web3Provider } from '@ethersproject/providers';
import { Web3ReactProvider } from '@web3-react/core';
import MetaMaskOnboarding from '@metamask/onboarding';
import { OnboardingButton } from './components/metamask';
import Betting from './components/betting/Betting';
import { BettingContextProvider } from './contexts/Betting';

const Header = () => {
  return (
    <div
      style={{
        margin: '1em',
        marginBottom: '7px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h3">MoneyCome</Typography>
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
        <OnboardingButton />
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
