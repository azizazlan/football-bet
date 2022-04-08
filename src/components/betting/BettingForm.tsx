import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import CircularProgress from '@mui/material/CircularProgress';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useBettingContext, BetState } from '../../contexts/Betting';
import { TEAM } from '../../contexts/team';
import BouncingRadio from './BouncingRadio';
import CountdownTimer from './CountdownTimer';

interface IFormInput {
  'Bet Amount': string;
  betAmountInEther: number;
  selectedTeam: number;
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

  if (
    betSession.betState !== BetState.CLOSED &&
    player.betId === betSession.betId
  ) {
    // player has placed a bet
    return (
      <Box display="flex" flexDirection="column">
        <div>
          You bet on {TEAM[player.teamSelected]}! Please wait for result.
        </div>
        <CountdownTimer />
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="row">
      <Box flexGrow={1}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <BouncingRadio
            pending={pending}
            register={register}
            errors={errors}
          />
          <Controller
            defaultValue={0}
            render={({ field }) => (
              <OutlinedInput
                disabled={pending}
                id="betAmountInEther"
                fullWidth
                {...field}
                startAdornment={
                  <InputAdornment position="start">
                    <strong>Ξ</strong>
                  </InputAdornment>
                }
                endAdornment={
                  <InputAdornment position="end">
                    <Button
                      variant="contained"
                      type="submit"
                      disabled={pending || player.betId === betSession.betId}
                    >
                      bet {pending ? <CircularProgress size={21} /> : null}
                    </Button>
                  </InputAdornment>
                }
              />
            )}
            name="betAmountInEther"
            control={control}
          />
          <FormHelperText id="betAmountInEther">
            Minimum bet amount is Ξ0.00015
          </FormHelperText>
          {errors.betAmountInEther ? (
            <div>Must enter value of at least 0.00015</div>
          ) : null}
        </form>
      </Box>
    </Box>
  );
}
