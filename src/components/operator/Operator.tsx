import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CircularProgress } from '@mui/material';

enum BET_STATE {
  OPEN,
  CLOSED,
  PICKING_TEAM,
  CLAIM,
}

const Operator = ({ pending, betState, startNewBet }) => {
  return (
    <div>
      <Typography variant="h5">Operator</Typography>
      <Box display="flex" flexDirection="row" alignItems="center">
        <Button
          variant="contained"
          onClick={startNewBet}
          disabled={
            pending || betState === 0 || betState === 2 || betState === 3
          }
        >
          start new bet
        </Button>
        <div style={{ minWidth: '0.5em' }} />
        {pending ? <CircularProgress size={27} /> : null}
      </Box>
    </div>
  );
};

export default Operator;
