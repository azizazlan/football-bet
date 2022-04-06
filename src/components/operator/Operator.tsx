import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { CircularProgress } from '@mui/material';
import { BetState } from '../../contexts/Betting';

const Operator = ({ pending, betSession, startNewBet }) => {
  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex" flexDirection="row">
        <Button
          variant="contained"
          onClick={startNewBet}
          disabled={
            pending ||
            betSession.betState === BetState.OPEN ||
            betSession.betState === BetState.PICKING_TEAM ||
            betSession.betState === BetState.CLAIM
          }
        >
          start new bet
        </Button>
        <div style={{ minWidth: '0.5em' }} />
        {pending ? <CircularProgress size={27} /> : null}
      </Box>
    </Box>
  );
};

export default Operator;
