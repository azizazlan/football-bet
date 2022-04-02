import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Web3Provider } from '@ethersproject/providers';
import { Web3ReactProvider } from '@web3-react/core';
import MetaMaskOnboarding from '@metamask/onboarding';
import { OnboardingButton } from './components/metamask';
import Betting from './components/betting/Betting';
import { BettingContextProvider } from './contexts/Betting';
import logo from './assets/imgs/moneycome.png';

const Header = () => {
  return (
    <Box display="flex" flexDirection="row" style={{ width: '100%' }}>
      <Box flexGrow={1}>
        <Typography variant="h4">Win some ethers!</Typography>
      </Box>
      <Box>
        <img
          src={logo}
          alt="moneycome logo"
          style={{ width: '95px', height: 'auto' }}
        />
      </Box>
    </Box>
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
      <Box mx={3} my={3}>
        <Header />
        <OnboardingButton />
      </Box>
    );
  }

  return (
    <Box mx={3} my={3}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Header />
        <BettingContextProvider>
          <Betting />
        </BettingContextProvider>
      </Web3ReactProvider>
    </Box>
  );
}

export default App;
