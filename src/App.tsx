import Box from '@mui/material/Box';
import { Web3Provider } from '@ethersproject/providers';
import { Web3ReactProvider } from '@web3-react/core';
import MetaMaskOnboarding from '@metamask/onboarding';
import Betting from './components/betting/Betting';
import Account from './components/metamask/Account';
import { BettingContextProvider } from './contexts/Betting';
import logo from './assets/imgs/logo.png';

const Header = () => {
  return (
    <Box
      display="flex"
      flexDirection="row"
      style={{ width: '100%', marginBottom: '1em' }}
    >
      <Box>
        <img
          src={logo}
          alt="moneycome logo"
          style={{ width: '115px', height: 'auto' }}
        />
      </Box>
      <Box display="flex" flexDirection="column" mx={3} my={0} flexGrow={1}>
        <Account />
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
      <Box mx={1} my={1}>
        <Header />
      </Box>
    );
  }
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <BettingContextProvider>
        <Box mx={1} my={1}>
          <Header />
          <Box mx={1} my={1}>
            <Betting />
          </Box>
        </Box>
      </BettingContextProvider>
    </Web3ReactProvider>
  );
}

export default App;
