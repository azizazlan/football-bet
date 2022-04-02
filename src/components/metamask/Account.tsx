import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';

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
    activate(injectedConnector);
  };

  return (
    <Paper elevation={3} style={{ padding: '1em' }}>
      <Typography variant="h5">Account</Typography>
      <div style={{ marginTop: '1em' }} />
      ChainId: {chainId}
      <br />
      Account: {account}
      <br />
      Balance: Ξ{balance}
      {!active ? (
        <Box>
          <Button variant="contained" type="button" onClick={onClick}>
            Connect
          </Button>
        </Box>
      ) : null}
    </Paper>
  );
};

export default Account;
