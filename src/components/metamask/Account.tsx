import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import MetaMaskOnboarding from '@metamask/onboarding';
import { OnboardingButton } from './OnboardingButton';
import { injectedConnector } from '../../contexts/injectedConnector';

const Account = () => {
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

  const onClick = () => {
    window.location.reload();
    activate(injectedConnector);
  };

  if (!MetaMaskOnboarding.isMetaMaskInstalled()) {
    return (
      <Box my={3}>
        <OnboardingButton />
      </Box>
    );
  }

  if (!active) {
    return (
      <Box my={3}>
        <Button variant="contained" type="button" onClick={onClick}>
          Connect to Metamask
        </Button>
      </Box>
    );
  }

  return (
    <div>
      {account}
      <br />
      <strong>Ξ</strong>
      {balance} (Chain {chainId})
    </div>
  );
};

export default Account;
