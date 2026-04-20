import { Card, Grid, Button, Tooltip } from '@mui/material';
import Iconify from 'src/components/iconify';

type DrawActionPanelProps = {
  onUndo: VoidFunction;
  onRedo: VoidFunction;
  onClear: VoidFunction;
  onDownload: VoidFunction;
  disableUndo: boolean;
  disableRedo: boolean;
  t: any;
};

export default function DrawActionPanel({
  onUndo,
  onRedo,
  onClear,
  onDownload,
  disableUndo,
  disableRedo,
  t,
}: DrawActionPanelProps) {
  return (
    <Card sx={{ p: 2 }}>
      <Grid container spacing={1.5}>
        <Grid item xs={6}>
          <Tooltip title={t('draw.undoTooltip')}>
            <span>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Iconify icon="solar:undo-left-bold" />}
                onClick={onUndo}
                disabled={disableUndo}
              >
                {t('draw.undo')}
              </Button>
            </span>
          </Tooltip>
        </Grid>

        <Grid item xs={6}>
          <Tooltip title={t('draw.redoTooltip')}>
            <span>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Iconify icon="solar:undo-right-bold" />}
                onClick={onRedo}
                disabled={disableRedo}
              >
                {t('draw.redo')}
              </Button>
            </span>
          </Tooltip>
        </Grid>

        <Grid item xs={6}>
          <Button
            fullWidth
            variant="outlined"
            color="error"
            startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
            onClick={onClear}
          >
            {t('draw.clear')}
          </Button>
        </Grid>

        <Grid item xs={6}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<Iconify icon="solar:download-bold" />}
            onClick={onDownload}
          >
            {t('draw.download')}
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
}
