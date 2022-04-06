import { Alert } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useBettingContext } from '../../contexts/Betting';
import { TEAM } from '../../contexts/team';
import youlost from '../../assets/imgs/youlost.png';
import youwin from '../../assets/imgs/youwin.png';
import animate from '../../assets/imgs/giphy.gif';
import nada from '../../assets/imgs/nobet.png';

const Claim = () => {
  const { betSession, player, winningTeam, claim } = useBettingContext();

  if (betSession.betId !== player.betId) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center">
        <img src={nada} alt="You have not place a bet" />
        <Alert severity="info" icon={false}>
          Betting session closed.
        </Alert>
      </Box>
    );
  }

  if (
    winningTeam !== 0 &&
    winningTeam !== player.teamSelected &&
    betSession.betId === player.betId
  ) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center">
        <img src={youlost} alt="You lost" />
        <Alert severity="info" icon={false}>
          {TEAM[winningTeam]} wins! You bet on {TEAM[player.teamSelected]}.
        </Alert>
      </Box>
    );
  }

  if (
    winningTeam !== 0 &&
    winningTeam === player.teamSelected &&
    betSession.betId === player.betId &&
    !player.hasClaimed
  ) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center">
        <img src={youwin} alt="You win" />
        <Alert severity="success" icon={false}>
          {TEAM[winningTeam]} wins!
        </Alert>
        <Button variant="contained" onClick={claim}>
          claim
        </Button>
      </Box>
    );
  }

  if (
    winningTeam !== 0 &&
    winningTeam === player.teamSelected &&
    betSession.betId === player.betId &&
    player.hasClaimed
  ) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center">
        <img src={youwin} alt="You win" />
        <Alert severity="success" icon={false}>
          <strong>Ξ</strong>
          {player.amountClaimed} has been transferrred to your wallet!
        </Alert>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <img src={animate} style={{ width: '150px', height: 'auto' }} />
      <Alert severity="info" icon={false}>
        Checking your bet...
      </Alert>
    </Box>
  );
};

export default Claim;
