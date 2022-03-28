import { useState } from 'react';
import MetaMaskOnboarding from '@metamask/onboarding';
import Metamaskonboard from './metamaskonboard';

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
      Betting area...
    </div>
  );
}

export default App;
