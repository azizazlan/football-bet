import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useBettingContext } from '../../contexts/Betting';

const Claim = ({ winningTeam, getWinningTeam, win }) => {
  const { selectedTeam } = useBettingContext();
  return (
    <Paper elevation={3} style={{ padding: '1em' }}>
      <Typography variant="h5">Claim card</Typography>
      <div style={{ marginTop: '1em' }} />
      Winning team: {winningTeam}
      <br />
      Selected team: {selectedTeam}, therefore I {win ? 'win!' : 'lose :('}
      <br />
      <Box display="flex" flexDirection="row">
        <Button variant="contained" onClick={getWinningTeam}>
          Who wins?
        </Button>
        <div style={{ minWidth: '0.5em' }} />
        <Button variant="contained" disabled={!win}>
          claim
        </Button>
      </Box>
    </Paper>
  );
};

export default Claim;
