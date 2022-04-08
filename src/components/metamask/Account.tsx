import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import MetaMaskOnboarding from '@metamask/onboarding';
import { OnboardingButton } from './OnboardingButton';
import { injectedConnector } from '../../contexts/injectedConnector';
import { useBettingContext, BetState } from '../../contexts/Betting';

const Account = () => {
  const [balance, setBalance] = React.useState('');
  const { chainId, account, activate, active, library } =
    useWeb3React<Web3Provider>();
  const { betSession } = useBettingContext();

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
      <Typography variant="body2">{account}</Typography>
      <Typography variant="body2">
        Ξ {balance} (Chain id {chainId})
      </Typography>
      <Typography variant="body2">
        Bet id {betSession.betId} ({BetState[betSession.betState]})
      </Typography>
    </div>
  );
};

export default Account;
