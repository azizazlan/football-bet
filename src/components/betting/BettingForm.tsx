import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
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
import { TEAM } from '../../contexts/team';

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
      selectedTeam: { value: 1, label: TEAM[1] },
    },
  });

  const { enterBet, pending, hasPlayerBet, selectedTeam } = useBettingContext();

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    enterBet({
      selectedTeam: data.selectedTeam.value,
      betAmountInEther: data.betAmountInEther,
    });
  };

  if (hasPlayerBet) {
    return (
      <Alert severity="info" icon={false}>
        You bet on {TEAM[selectedTeam]}! Please wait for upcoming announcement
        and good luck!!!
      </Alert>
    );
  }

  return (
    <Box display="flex" flexDirection="row">
      <Box flexGrow={1}>
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
            <Button
              variant="contained"
              type="submit"
              disabled={pending || hasPlayerBet}
            >
              submit
            </Button>
            <div style={{ width: '0.5em' }} />
            {pending ? <CircularProgress size={21} /> : null}
          </Box>
        </form>
      </Box>
    </Box>
  );
}
