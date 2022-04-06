import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useBettingContext } from '../../contexts/Betting';
import { TEAM } from '../../contexts/team';
import BouncingRadio from './BouncingRadio';
import goodluck from '../../assets/imgs/goodluck.png';
import CountdownTimer from './CountdownTimer';

interface IFormInput {
  'Bet Amount': string;
  betAmountInEther: number;
  selectedTeam: number;
  // selectedTeam: { label: string; value: number };
}

const schema = yup
  .object({
    betAmountInEther: yup.number().positive().required(),
    selectedTeam: yup.number().positive().integer().required(),
  })
  .required();

export default function BettingForm() {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: {},
    resolver: yupResolver(schema),
  });

  const { enterBet, pending, player, betSession } = useBettingContext();

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    enterBet({
      selectedTeam: data.selectedTeam,
      betAmountInEther: data.betAmountInEther,
    });
  };

  if (player.betId === betSession.betId) {
    // player has placed a bet
    return (
      <Box display="flex" flexDirection="column" alignItems="center">
        <img src={goodluck} alt="Good luck" />
        <Alert severity="info" icon={false}>
          You bet on {TEAM[player.teamSelected]}! Please wait for
          announcement...
        </Alert>
        <CountdownTimer />
      </Box>
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
          {errors.betAmountInEther ? (
            <Alert severity="error" icon={false}>
              Must enter value of at least 0.00015
            </Alert>
          ) : null}
          <br />
          <BouncingRadio register={register} errors={errors} />
          <Box my={1} display="flex" flexDirection="row" alignItems="center">
            <Button
              variant="contained"
              type="submit"
              disabled={pending || player.betId === betSession.betId}
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
