import React from 'react';
import Button from '@mui/material/Button';
import { Path, useForm, UseFormRegister, SubmitHandler } from 'react-hook-form';
import { useBettingContext } from '../../contexts/Betting';

interface IFormValues {
  'Bet Amount': string;
  betAmountInEther: number;
  selectedTeam: number;
}

type InputProps = {
  label: Path<IFormValues>;
  register: UseFormRegister<IFormValues>;
  required: boolean;
};

const Select = React.forwardRef<
  HTMLSelectElement,
  { label: string } & ReturnType<UseFormRegister<IFormValues>>
>(({ onChange, onBlur, name, label }, ref) => (
  <>
    <label>{label}</label>
    <select name={name} ref={ref} onChange={onChange} onBlur={onBlur}>
      <option value="1">1</option>
      <option value="2">2</option>
    </select>
  </>
));

const Input = ({ label, register, required }: InputProps) => (
  <>
    <label>{label}</label>
    <input {...register('betAmountInEther', { required })} />
    ETH
  </>
);

export default function EnterForm() {
  const { register, handleSubmit } = useForm<IFormValues>();
  const { enterBet } = useBettingContext();

  const onSubmit: SubmitHandler<IFormValues> = (data) => {
    console.log(JSON.stringify(data));

    enterBet({
      selectedTeam: data.selectedTeam,
      betAmountInEther: data.betAmountInEther,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input label="Bet Amount" register={register} required />
      <br />
      <Select label="Select your team" {...register('selectedTeam')} />
      <br />
      <Button variant="contained" type="submit">
        submit{' '}
      </Button>
    </form>
  );
}
