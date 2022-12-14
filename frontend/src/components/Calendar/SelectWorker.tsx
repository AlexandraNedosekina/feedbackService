import { Select, Stack, Title } from "@mantine/core";
import { FC } from "react";

const SelectWorker: FC = () => {
    return (
        <Stack spacing="md">
            <Title order={2}>Календарь встреч</Title>
            <Title order={4}>Записаться на общение</Title>
            <Select
                data={['Иван Иванов', 'Андрей Андреев', 'Александр Иванов']}
                placeholder="Имя и должность"
                label="Выберете сотрудника"
            />
        </Stack>
    )
}
export default SelectWorker;