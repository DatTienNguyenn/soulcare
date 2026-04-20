import { Stack, Typography, Button } from '@mui/material';

type DiaryHeaderProps = {
  title: string;
  buttonLabel: string;
  onOpenDialog: VoidFunction;
};

export default function DiaryHeader({ title, buttonLabel, onOpenDialog }: DiaryHeaderProps) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Typography variant="h3">{title}</Typography>
      <Button variant="contained" sx={{ bgcolor: 'primary.main' }} onClick={onOpenDialog}>
        {buttonLabel}
      </Button>
    </Stack>
  );
}
