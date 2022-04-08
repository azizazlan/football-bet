import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Alert from '@mui/material/Alert';

const BouncingRadio = ({ pending, register, errors }) => {
  return (
    <div>
      <FormLabel id="selectedTeam">Pick your bet</FormLabel>
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        name="radio-buttons-group"
      >
        <FormControlLabel
          disabled={pending}
          value={1}
          control={<Radio {...register('selectedTeam')} />}
          label="Blue team"
        />
        <FormControlLabel
          disabled={pending}
          value={2}
          control={<Radio {...register('selectedTeam')} />}
          label="Red team"
        />
      </RadioGroup>
      {errors.selectedTeam ? (
        <Alert severity="error" icon={false}>
          Select a team!
        </Alert>
      ) : null}
    </div>
  );
};

export default BouncingRadio;
