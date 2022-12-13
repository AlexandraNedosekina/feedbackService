import { DatePicker } from '@mantine/dates';
import 'dayjs/locale/ru';
import { useState } from 'react';

function DateInput() {
  const [value, setValue] = useState(null);
  return (
    <DatePicker
      placeholder="Дата и время"
      label="Выберете время"
      value={value}
      onChange={setValue}
      locale="ru"

    />

  )
}
export default DateInput;