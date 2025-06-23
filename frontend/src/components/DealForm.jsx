import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { createDeal } from '@/store/slices/dealSlice';

export default function DealForm() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    dealname: '',
    amount: '',
    pipeline: '',
    dealstage: '',
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createDeal(formData));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="dealname" placeholder="Deal Name" onChange={handleChange} />
      <input name="amount" placeholder="Amount" onChange={handleChange} />
      <input name="pipeline" placeholder="Pipeline ID" onChange={handleChange} />
      <input name="dealstage" placeholder="Deal Stage" onChange={handleChange} />
      <button type="submit">Create Deal</button>
    </form>
  );
}
