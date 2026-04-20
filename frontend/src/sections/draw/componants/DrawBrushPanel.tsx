import { ChangeEvent } from 'react';
import { Box, Card, Slider, TextField, Tooltip, Typography } from '@mui/material';

type DrawBrushPanelProps = {
  brushColor: string;
  brushSize: number;
  brushOpacity: number;
  currentTool: 'draw' | 'paint' | 'line' | 'rectangle' | 'triangle' | 'star';
  isDrawTool: boolean;
  onColorChange: (value: string) => void;
  onSizeChange: (value: number) => void;
  onOpacityChange: (value: number) => void;
  t: any;
};

const PRESET_COLORS = [
  '#000000',
  '#FF0000',
  '#00FF00',
  '#0000FF',
  '#FFD700',
  '#FFA500',
  '#800080',
  '#FFC0CB',
];

export default function DrawBrushPanel({
  brushColor,
  brushSize,
  brushOpacity,
  currentTool,
  isDrawTool,
  onColorChange,
  onSizeChange,
  onOpacityChange,
  t,
}: DrawBrushPanelProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Card sx={{ p: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 2 }}>
          {t('draw.color')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <input
            type="color"
            value={brushColor}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onColorChange(e.target.value)}
            style={{
              width: 50,
              height: 50,
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          />
          <TextField
            size="small"
            value={brushColor}
            onChange={(e) => {
              if (e.target.value.startsWith('#')) {
                onColorChange(e.target.value);
              }
            }}
            placeholder={t('draw.colorPlaceholder')}
            sx={{ flex: 1 }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
          {PRESET_COLORS.map((color) => (
            <Tooltip key={color} title={color}>
              <Box
                onClick={() => onColorChange(color)}
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: color,
                  border: brushColor === color ? '3px solid #000' : '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'scale(1.1)',
                  },
                }}
              />
            </Tooltip>
          ))}
        </Box>
      </Card>

      <Card hidden={!isDrawTool} sx={{ p: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 2 }}>
          {currentTool === 'draw'
            ? t('draw.brushSize', { size: brushSize })
            : t('draw.shapeSize', { size: brushSize })}
        </Typography>
        <Slider
          value={brushSize}
          onChange={(_, value) => onSizeChange(value as number)}
          min={1}
          max={50}
          step={1}
          marks={[
            { value: 1, label: '1' },
            { value: 50, label: '50' },
          ]}
        />
      </Card>

      <Card hidden={!isDrawTool} sx={{ p: 1 }}>
        <Typography variant="subtitle2" sx={{ mb: 2 }}>
          {t('draw.opacity', { value: Math.round(brushOpacity * 100) })}
        </Typography>
        <Slider
          value={brushOpacity}
          onChange={(_, value) => onOpacityChange(value as number)}
          min={0.1}
          max={1}
          step={0.1}
          marks={[
            { value: 0.1, label: '10%' },
            { value: 1, label: '100%' },
          ]}
        />
      </Card>
    </Box>
  );
}
