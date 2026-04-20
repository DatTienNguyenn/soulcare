import { Stack, Typography, Button, Tooltip } from '@mui/material';
import Iconify from 'src/components/iconify';

type DrawHeaderProps = {
  title: string;
  subtitle: string;
  onUndo: VoidFunction;
  onRedo: VoidFunction;
  onClear: VoidFunction;
  onDownload: VoidFunction;
  disableUndo: boolean;
  disableRedo: boolean;
  t: any;
};

export default function DrawHeader({
  title,
  subtitle,
  onUndo,
  onRedo,
  onClear,
  onDownload,
  disableUndo,
  disableRedo,
  t,
}: DrawHeaderProps) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <div>
        <Typography variant="h3" sx={{ mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {subtitle}
        </Typography>
      </div>
      <Stack direction="row" spacing={2}>
        <Button
          variant="outlined"
          startIcon={<Iconify icon="solar:undo-left-bold" />}
          onClick={onUndo}
          disabled={disableUndo}
          size="medium"
        >
          {t('draw.undo')}
        </Button>
        <Button
          variant="outlined"
          startIcon={<Iconify icon="solar:undo-right-bold" />}
          onClick={onRedo}
          disabled={disableRedo}
          size="medium"
        >
          {t('draw.redo')}
        </Button>
        <Button
          variant="outlined"
          color="error"
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
          onClick={onClear}
          size="medium"
        >
          {t('draw.clear')}
        </Button>
        <Button
          variant="contained"
          startIcon={<Iconify icon="solar:download-bold" />}
          onClick={onDownload}
          size="medium"
        >
          {t('draw.download')}
        </Button>
      </Stack>
    </Stack>
  );
}
