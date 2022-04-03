import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
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
    activate(injectedConnector);
  };

  return (
    <div>
      {account}
      <br />
      <strong>Ξ</strong>
      {balance} (Chain {chainId})
      {!active ? (
        <Box>
          <Button variant="contained" type="button" onClick={onClick}>
            Connect
          </Button>
        </Box>
      ) : null}
    </div>
  );
};

export default Account;
