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
            betSession.betState === BetState.RANDOM ||
            betSession.betState === BetState.CLAIM
          }
        >
          new bet session {pending ? <CircularProgress size={27} /> : null}
        </Button>
      </Box>
    </Box>
  );
};

export default Operator;
