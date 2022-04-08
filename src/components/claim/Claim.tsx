import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useBettingContext } from '../../contexts/Betting';
import youwin from '../../assets/imgs/youwin.png';

const Claim = () => {
  const { claim, player } = useBettingContext();
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <img
        src={youwin}
        alt="You win"
        style={{ width: '250px', height: 'auto', margin: '1em' }}
      />
      {parseFloat(player.amountClaimed) > 0 ? null : (
        <Button variant="contained" onClick={claim}>
          claim
        </Button>
      )}
    </Box>
  );
};

export default Claim;
