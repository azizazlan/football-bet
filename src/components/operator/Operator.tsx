import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { CircularProgress } from '@mui/material';

const Operator = ({ pending, betState, startNewBet }) => {
  return (
    <Box display="flex" flexDirection="row" alignItems="center">
      <Button
        variant="contained"
        onClick={startNewBet}
        disabled={pending || betState === 0 || betState === 2 || betState === 3}
      >
        start new bet
      </Button>
      <div style={{ minWidth: '0.5em' }} />
      {pending ? <CircularProgress size={27} /> : null}
    </Box>
  );
};

export default Operator;
