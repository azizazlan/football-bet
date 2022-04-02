import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CircularProgress } from '@mui/material';

enum BET_STATE {
  OPEN,
  CLOSED,
  PICKING_TEAM,
  CLAIM,
}

const Operator = ({ pending, betState, getBetState, startNewBet }) => {
  React.useEffect(() => {
    getBetState();
  }, []);

  return (
    <Paper elevation={3} style={{ padding: '1em' }}>
      <Typography variant="h5">Operator</Typography>
      <div style={{ marginTop: '1em' }} />
      <div>Bet state: {BET_STATE[betState]}</div>
      <Box display="flex" flexDirection="row" alignItems="center">
        <Button variant="contained" onClick={getBetState}>
          bet state
        </Button>
        <div style={{ minWidth: '0.5em' }} />
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
    </Paper>
  );
};

export default Operator;
