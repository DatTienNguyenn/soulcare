import { Box, Card } from '@mui/material';

type DrawCanvasPanelProps = {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  currentTool: 'draw' | 'paint' | 'line' | 'rectangle' | 'triangle' | 'star';
  startDrawing: (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => void;
  draw: (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => void;
  paintBucket: (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => void;
  stopDrawing: (
    e?: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => void;
};

export default function DrawCanvasPanel({
  canvasRef,
  currentTool,
  startDrawing,
  draw,
  paintBucket,
  stopDrawing,
}: DrawCanvasPanelProps) {
  return (
    <Card
      sx={{
        p: 2,
        bgcolor: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        ref={(ref: HTMLDivElement | null) => {
          if (ref) {
            ref.style.position = 'relative';
            ref.style.height = '500px';
            ref.style.borderRadius = '8px';
            ref.style.overflow = 'hidden';
            ref.style.cursor = 'crosshair';
          }
        }}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={(e) => stopDrawing(e)}
          onMouseLeave={() => stopDrawing()}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={(e) => stopDrawing(e)}
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            backgroundColor: '#fff',
            cursor: 'crosshair',
            touchAction: 'none',
          }}
        />
      </Box>
    </Card>
  );
}
