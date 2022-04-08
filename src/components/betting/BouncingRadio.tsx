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
        defaultValue="female"
        name="radio-buttons-group"
      >
        <FormControlLabel
          disabled={pending}
          value={1}
          control={<Radio {...register('selectedTeam')} />}
          label="Blue ball"
        />
        <FormControlLabel
          disabled={pending}
          value={2}
          control={<Radio {...register('selectedTeam')} />}
          label="Red ball"
        />
      </RadioGroup>
      {errors.selectedTeam ? (
        <Alert severity="error" icon={false}>
          Select a ball!
        </Alert>
      ) : null}
    </div>
  );
};

export default BouncingRadio;
