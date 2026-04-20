import { useRef, useState, useEffect } from 'react';
import { Card, Grid, Stack, Container } from '@mui/material';
import { useSettingsContext } from 'src/components/settings';
import { useLocales } from 'src/locale/use-locales';

import DrawHeader from './componants/DrawHeader';
import DrawCanvasPanel from './componants/DrawCanvasPanel';
import DrawToolPanel from './componants/DrawToolPanel';
import DrawBrushPanel from './componants/DrawBrushPanel';

// ----------------------------------------------------------------------

interface DrawingState {
  imageData: ImageData | null;
  timestamp: number;
}

export default function DrawView() {
  const settings = useSettingsContext();
  const { t } = useLocales();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(3);
  const [brushOpacity, setBrushOpacity] = useState(1);
  const [history, setHistory] = useState<DrawingState[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const [currentTool, setCurrentTool] = useState<
    'draw' | 'paint' | 'line' | 'rectangle' | 'triangle' | 'star'
  >('draw');
  const [shapeStart, setShapeStart] = useState<{ x: number; y: number } | null>(null);
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    if (container) {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = Math.max(rect.height, 500);
    }

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      saveToHistory();
    }
  }, []);

  const getContext = () => canvasRef.current?.getContext('2d');

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    const ctx = getContext();
    if (!canvas || !ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push({ imageData, timestamp: Date.now() });

    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const paintBucket = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    const ctx = getContext();
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    floodFill(ctx, x, y, brushColor);
    saveToHistory();
  };

  const undo = () => {
    if (historyStep > 0) {
      const newStep = historyStep - 1;
      const ctx = getContext();
      if (ctx && history[newStep]?.imageData) {
        ctx.putImageData(history[newStep].imageData as ImageData, 0, 0);
        setHistoryStep(newStep);
      }
    }
  };

  const redo = () => {
    if (historyStep < history.length - 1) {
      const newStep = historyStep + 1;
      const ctx = getContext();
      if (ctx && history[newStep]?.imageData) {
        ctx.putImageData(history[newStep].imageData as ImageData, 0, 0);
        setHistoryStep(newStep);
      }
    }
  };

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    const ctx = getContext();
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    if (currentTool === 'draw') {
      setIsDrawing(true);
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else if (currentTool === 'paint') {
      paintBucket(e);
    } else {
      // Shape tools
      setShapeStart({ x, y });
      setIsDrawing(true);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = getContext();
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    if ('touches' in e) {
      e.preventDefault();
    }

    if (currentTool === 'draw') {
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = brushOpacity;
      ctx.strokeStyle = brushColor;

      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (shapeStart && history[historyStep]?.imageData) {
      // Restore canvas to last saved state
      ctx.putImageData(history[historyStep].imageData!, 0, 0);
      // Draw preview shape
      drawShape(ctx, shapeStart.x, shapeStart.y, x, y, currentTool, false);
      setLastPos({ x, y });
    }
  };

  const stopDrawing = (
    e?: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const ctx = getContext();
    if (!ctx) return;

    if (currentTool === 'draw') {
      ctx.globalAlpha = 1;
      ctx.closePath();
    } else if (shapeStart && history[historyStep]?.imageData) {
      let x: number, y: number;
      if (e) {
        const rect = canvasRef.current!.getBoundingClientRect();
        x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
        y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
      } else if (lastPos) {
        x = lastPos.x;
        y = lastPos.y;
      } else {
        // Cancel if no position
        setIsDrawing(false);
        setShapeStart(null);
        setLastPos(null);
        return;
      }
      // Restore canvas to last saved state
      ctx.putImageData(history[historyStep].imageData!, 0, 0);
      // Draw final shape
      drawShape(ctx, shapeStart.x, shapeStart.y, x, y, currentTool, true);
    }

    if (isDrawing) {
      setIsDrawing(false);
      setShapeStart(null);
      setLastPos(null);
      saveToHistory();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = getContext();
    if (!canvas || !ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveToHistory();
  };

  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `drawing-${new Date().getTime()}.png`;
    link.click();
  };

  const handleBrushColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBrushColor(e.target.value);
  };

  const floodFill = (
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    fillColor: string
  ) => {
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;

    const startIdx = (Math.floor(startY) * width + Math.floor(startX)) * 4;
    const targetR = data[startIdx];
    const targetG = data[startIdx + 1];
    const targetB = data[startIdx + 2];
    const targetA = data[startIdx + 3];

    const fillColorNum = parseInt(fillColor.slice(1), 16);
    const fillR = (fillColorNum >> 16) & 255;
    const fillG = (fillColorNum >> 8) & 255;
    const fillB = fillColorNum & 255;

    const stack: [number, number][] = [[Math.floor(startX), Math.floor(startY)]];
    const visited = new Set<string>();

    while (stack.length > 0) {
      const [x, y] = stack.pop()!;
      const key = `${x},${y}`;

      if (visited.has(key) || x < 0 || x >= width || y < 0 || y >= height) continue;
      visited.add(key);

      const idx = (y * width + x) * 4;
      if (
        data[idx] === targetR &&
        data[idx + 1] === targetG &&
        data[idx + 2] === targetB &&
        data[idx + 3] === targetA
      ) {
        data[idx] = fillR;
        data[idx + 1] = fillG;
        data[idx + 2] = fillB;
        data[idx + 3] = 255;

        stack.push([x + 1, y]);
        stack.push([x - 1, y]);
        stack.push([x, y + 1]);
        stack.push([x, y - 1]);
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const drawShape = (
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    tool: string,
    isFinal: boolean
  ) => {
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = brushColor;
    ctx.globalAlpha = isFinal ? brushOpacity : brushOpacity * 0.8; // Fade for preview
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const width = endX - startX;
    const height = endY - startY;

    switch (tool) {
      case 'line':
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        break;
      case 'rectangle':
        ctx.strokeRect(startX, startY, width, height);
        break;
      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(startX + width / 2, startY);
        ctx.lineTo(startX, endY);
        ctx.lineTo(endX, endY);
        ctx.closePath();
        ctx.stroke();
        break;
      case 'star':
        drawStar(
          ctx,
          startX + width / 2,
          startY + height / 2,
          5,
          Math.min(Math.abs(width), Math.abs(height)) / 2
        );
        break;
      default:
        break;
    }
  };

  const drawStar = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    spikes: number,
    outerRadius: number,
    innerRadius?: number
  ) => {
    let rot = (Math.PI / 2) * 3;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      const outerX = cx + Math.cos(rot) * outerRadius;
      const outerY = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(outerX, outerY);
      rot += step;

      const innerX = cx + Math.cos(rot) * (innerRadius || outerRadius * 0.5);
      const innerY = cy + Math.sin(rot) * (innerRadius || outerRadius * 0.5);
      ctx.lineTo(innerX, innerY);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.stroke();
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Stack spacing={3}>
        <DrawHeader
          title={t('draw.header')}
          subtitle={t('draw.subtitle')}
          onUndo={undo}
          onRedo={redo}
          onClear={clearCanvas}
          onDownload={downloadDrawing}
          disableUndo={historyStep <= 0}
          disableRedo={historyStep >= history.length - 1}
          t={t}
        />

        <Grid container spacing={3}>
          <Grid item xs={12} md={9}>
            <DrawCanvasPanel
              canvasRef={canvasRef}
              currentTool={currentTool}
              startDrawing={startDrawing}
              draw={draw}
              paintBucket={paintBucket}
              stopDrawing={stopDrawing}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <DrawToolPanel currentTool={currentTool} setCurrentTool={setCurrentTool} t={t} />
            <DrawBrushPanel
              brushColor={brushColor}
              brushSize={brushSize}
              brushOpacity={brushOpacity}
              currentTool={currentTool}
              isDrawTool={currentTool !== 'paint'}
              onColorChange={setBrushColor}
              onSizeChange={setBrushSize}
              onOpacityChange={setBrushOpacity}
              t={t}
            />
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
}
