import Box from '@mui/material/Box';
import { Web3Provider } from '@ethersproject/providers';
import { Web3ReactProvider } from '@web3-react/core';
import MetaMaskOnboarding from '@metamask/onboarding';
import Betting from './components/betting/Betting';
import Account from './components/metamask/Account';
import { BettingContextProvider, useBettingContext } from './contexts/Betting';
import logo from './assets/imgs/moneycome.png';

const Header = () => {
  const { betSession } = useBettingContext();
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
          style={{ width: '155px', height: 'auto' }}
        />
      </Box>
      <Box display="flex" flexDirection="column" mx={3} my={0} flexGrow={1}>
        <Account />
        BID: {betSession.betId === -1 ? 'Loading...' : betSession.betId}
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
          <Betting />
        </Box>
      </BettingContextProvider>
    </Web3ReactProvider>
  );
}

export default App;
