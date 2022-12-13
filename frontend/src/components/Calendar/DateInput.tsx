import { Button, Grid, Stack } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import 'dayjs/locale/ru';
import { useState } from 'react';

function DateInput() {
  const [value, setValue] = useState(null);
  return (
    <>
      <Stack spacing="md">
        <DatePicker
          placeholder="Дата и время"
          label="Выберете время"
          value={value}
          onChange={setValue}
          locale="ru"

        />
        <Button>
          Записаться
        </Button>
      </Stack>
    </>
  )
}
export default DateInput;