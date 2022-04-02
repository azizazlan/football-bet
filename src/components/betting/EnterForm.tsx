import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
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

export default function EnterForm() {
  const { control, handleSubmit } = useForm<IFormInput>();

  const { enterBet } = useBettingContext();

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
        <br />
        <Button variant="contained" type="submit">
          submit
        </Button>
      </form>
    </Paper>
  );
}
