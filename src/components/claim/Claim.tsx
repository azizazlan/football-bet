import { Alert } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useBettingContext } from '../../contexts/Betting';
import { TEAM } from '../../contexts/team';

const Claim = () => {
  const { selectedTeam, winningTeam, win, claim } = useBettingContext();

  if (
    winningTeam !== 0 &&
    selectedTeam !== 0 &&
    winningTeam !== selectedTeam &&
    !win
  ) {
    return (
      <Alert severity="info" icon={false}>
        Sorry you lost!
      </Alert>
    );
  }

  if (
    winningTeam !== 0 &&
    selectedTeam !== 0 &&
    winningTeam === selectedTeam &&
    win
  ) {
    return (
      <div>
        <Alert severity="success" icon={false}>
          {TEAM[winningTeam]} wins! You win!
        </Alert>
        <Box display="flex" flexDirection="row">
          <Button variant="contained" disabled={!win} onClick={claim}>
            claim
          </Button>
        </Box>
      </div>
    );
  }

  return (
    <Alert severity="info" icon={false}>
      Checking your bet ...
    </Alert>
  );
};

export default Claim;
