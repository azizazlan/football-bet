import Box from '@mui/material/Box';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useBettingContext } from '../../contexts/Betting';
import EnterForm from './EnterForm';
import Operator from '../operator/Operator';
import Claim from '../claim/Claim';
import { Account } from '../metamask';

const Betting = () => {
  const { account } = useWeb3React<Web3Provider>();

  const {
    pending,
    getBetState,
    betState,
    startNewBet,
    winningTeam,
    getWinningTeam,
    win,
    claim,
  } = useBettingContext();

  return (
    <Box
      mx={1}
      my={1}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Account />
      {account === '0x830227c880d2281Ae91Cf8097628C889E4D92E8f' ? (
        <Operator
          betState={betState}
          getBetState={getBetState}
          startNewBet={startNewBet}
        />
      ) : null}
      <EnterForm />
      <Claim
        winningTeam={winningTeam}
        getWinningTeam={getWinningTeam}
        win={win}
        claim={claim}
      />
    </Box>
  );
};

export default Betting;
