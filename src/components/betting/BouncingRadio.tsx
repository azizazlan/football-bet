import Alert from '@mui/material/Alert';

const BouncingRadio = ({ register, errors }) => {
  return (
    <div>
      <div>
        <input
          id="team_blue"
          type="radio"
          value={1}
          {...register('selectedTeam')}
        />
        <label htmlFor="team_blue">Blue ball</label>
        <input type="radio" value={2} {...register('selectedTeam')} />
        <label htmlFor="team_red">Red ball</label>
      </div>
      {errors.selectedTeam ? (
        <Alert severity="error" icon={false}>
          Select a ball!
        </Alert>
      ) : null}
    </div>
  );
};

export default BouncingRadio;
