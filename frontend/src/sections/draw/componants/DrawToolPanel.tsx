import { Grid, Button, Card, Typography } from '@mui/material';
import Iconify from 'src/components/iconify';

type DrawToolPanelProps = {
  currentTool: 'draw' | 'paint' | 'line' | 'rectangle' | 'triangle' | 'star';
  setCurrentTool: (tool: 'draw' | 'paint' | 'line' | 'rectangle' | 'triangle' | 'star') => void;
  t: any;
};

export default function DrawToolPanel({ currentTool, setCurrentTool, t }: DrawToolPanelProps) {
  return (
    <Card sx={{ p: 2, mb: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 2 }}>
        {t('draw.tools')}
      </Typography>
      <Grid container spacing={1.5}>
        <Grid item xs={6}>
          <Button
            fullWidth
            variant={currentTool === 'draw' ? 'contained' : 'outlined'}
            startIcon={<Iconify icon="solar:pen-outline" />}
            onClick={() => setCurrentTool('draw')}
          >
            {t('draw.toolDraw')}
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            fullWidth
            variant={currentTool === 'paint' ? 'contained' : 'outlined'}
            startIcon={<Iconify icon="solar:palette-outline" />}
            onClick={() => setCurrentTool('paint')}
          >
            {t('draw.toolPaint')}
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            fullWidth
            variant={currentTool === 'line' ? 'contained' : 'outlined'}
            startIcon={<Iconify icon="mdi:vector-line" />}
            onClick={() => setCurrentTool('line')}
          >
            {t('draw.toolLine')}
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            fullWidth
            variant={currentTool === 'star' ? 'contained' : 'outlined'}
            startIcon={<Iconify icon="mdi:star-outline" />}
            onClick={() => setCurrentTool('star')}
          >
            {t('draw.toolStar')}
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            fullWidth
            variant={currentTool === 'rectangle' ? 'contained' : 'outlined'}
            startIcon={<Iconify icon="mdi:rectangle-outline" />}
            onClick={() => setCurrentTool('rectangle')}
          >
            {t('draw.toolRectangle')}
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            fullWidth
            variant={currentTool === 'triangle' ? 'contained' : 'outlined'}
            startIcon={<Iconify icon="mdi:triangle-outline" />}
            onClick={() => setCurrentTool('triangle')}
          >
            {t('draw.toolTriangle')}
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
}
