import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Select from 'react-select';
import {
  Path,
  useForm,
  UseFormRegister,
  SubmitHandler,
  Controller,
} from 'react-hook-form';
import { useBettingContext } from '../../contexts/Betting';

interface IFormInput {
  'Bet Amount': string;
  betAmountInEther: number;
  selectedTeam: { label: string; value: number };
}

type InputProps = {
  label: Path<IFormInput>;
  register: UseFormRegister<IFormInput>;
  required: boolean;
};

export default function BettingForm() {
  const { control, handleSubmit } = useForm<IFormInput>({
    defaultValues: {
      selectedTeam: { value: 1, label: 'BlueTeam' },
    },
  });

  const { enterBet, pending } = useBettingContext();

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    enterBet({
      selectedTeam: data.selectedTeam.value,
      betAmountInEther: data.betAmountInEther,
    });
  };

  return (
    <Paper elevation={3} style={{ padding: '1em' }}>
      <Typography variant="h5">Betting card</Typography>
      <div style={{ marginTop: '1em' }} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          defaultValue={0}
          render={({ field }) => (
            <TextField
              fullWidth
              {...field}
              label="Amount ETH"
              InputLabelProps={{ shrink: true }}
              helperText="Minimum bet is 0.00015 Ether"
            />
          )}
          name="betAmountInEther"
          control={control}
        />
        <br />
        <Controller
          control={control}
          name="selectedTeam"
          render={({ field }) => (
            <Select
              {...field}
              options={[
                { value: 1, label: 'Blue Team' },
                { value: 2, label: 'Red Team' },
              ]}
            />
          )}
        />
        <Box my={1} display="flex" flexDirection="row" alignItems="center">
          <Button variant="contained" type="submit" disabled={pending}>
            submit
          </Button>
          <div style={{ width: '0.5em' }} />
          {pending ? <CircularProgress size={21} /> : null}
        </Box>
      </form>
    </Paper>
  );
}
