import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

enum BET_STATE {
  OPEN,
  CLOSED,
  PICKING_TEAM,
  CLAIM,
}

const Operator = ({ betState, getBetState, startNewBet }) => {
  React.useEffect(() => {
    getBetState();
  }, [getBetState]);

  return (
    <Paper elevation={3} style={{ padding: '1em' }}>
      <Typography variant="h5">Operator Card</Typography>
      <div style={{ marginTop: '1em' }} />
      <div>Bet state: {BET_STATE[betState]}</div>
      <Box display="flex" flexDirection="row">
        <Button variant="contained" onClick={getBetState}>
          bet state
        </Button>
        <div style={{ minWidth: '0.5em' }} />
        <Button
          variant="contained"
          onClick={startNewBet}
          disabled={betState === 1 ? false : true}
        >
          start new bet
        </Button>
      </Box>
    </Paper>
  );
};

export default Operator;
