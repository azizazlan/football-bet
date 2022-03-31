import MetaMaskOnboarding from '@metamask/onboarding';
import Metamaskonboard from './features/metamaskonboard/index';
import Betting from './features/betting/Betting';

const Header = () => {
  return (
    <div
      style={{ marginBottom: '7px', display: 'flex', flexDirection: 'column' }}
    >
      MoneyCome
    </div>
  );
};

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
    <div>
      <Header />
      <Betting />
    </div>
  );
}

export default App;
