/**
 * Drawing Serialization Utility
 * Converts HTML5 Canvas drawing commands to JSON and vice versa
 */

export interface DrawingCommand {
  type: 'stroke' | 'shape' | 'fill';
  tool: 'draw' | 'paint' | 'line' | 'rectangle' | 'triangle' | 'star';
  points?: Array<[number, number]>; // For strokes: array of [x, y]
  x?: number; // For shapes: start x
  y?: number; // For shapes: start y
  w?: number; // For shapes: width
  h?: number; // For shapes: height
  color: string;
  size?: number; // Brush size
  opacity?: number; // Brush opacity
  timestamp: number; // When this command was drawn
}

export interface DrawingData {
  version: 1;
  canvasWidth: number;
  canvasHeight: number;
  commands: DrawingCommand[];
}

/**
 * Serialize canvas ImageData to JSON-compatible drawing data
 * This creates a pixel-based representation
 */
export const serializeCanvasToBase64 = (canvas: HTMLCanvasElement): string => {
  return canvas.toDataURL('image/png');
};

/**
 * Serialize canvas ImageData to drawing commands (vector-based)
 * Extracts the pixel data and creates a compact JSON representation
 */
export const serializeCanvasToJSON = (
  canvas: HTMLCanvasElement,
  commands: DrawingCommand[]
): DrawingData => {
  return {
    version: 1,
    canvasWidth: canvas.width,
    canvasHeight: canvas.height,
    commands: commands,
  };
};

/**
 * Restore canvas from drawing data JSON
 * Replays the drawing commands to redraw on the canvas
 */
export const restoreCanvasFromJSON = (
  canvas: HTMLCanvasElement,
  data: DrawingData,
  onRestore?: (progress: number) => void
): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Resize canvas to match saved dimensions
  canvas.width = data.canvasWidth;
  canvas.height = data.canvasHeight;

  // Clear and fill white background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (!data.commands || data.commands.length === 0) {
    onRestore?.(100);
    return;
  }

  // Replay each command
  data.commands.forEach((command, index) => {
    const progress = (index / data.commands.length) * 100;
    onRestore?.(progress);

    switch (command.type) {
      case 'stroke':
        replayStroke(ctx, command);
        break;
      case 'shape':
        replayShape(ctx, command);
        break;
      case 'fill':
        replayFill(ctx, command);
        break;
    }
  });

  onRestore?.(100);
};

/**
 * Restore canvas from Base64 image data
 */
export const restoreCanvasFromImage = (
  canvas: HTMLCanvasElement,
  imageData: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      resolve();
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageData;
  });
};

/**
 * Replay a stroke command on the canvas
 */
const replayStroke = (ctx: CanvasRenderingContext2D, command: DrawingCommand): void => {
  if (!command.points || command.points.length === 0) return;

  ctx.strokeStyle = command.color;
  ctx.lineWidth = command.size || 1;
  ctx.globalAlpha = command.opacity ?? 1;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  ctx.moveTo(command.points[0][0], command.points[0][1]);

  for (let i = 1; i < command.points.length; i++) {
    ctx.lineTo(command.points[i][0], command.points[i][1]);
  }

  ctx.stroke();
  ctx.globalAlpha = 1;
};

/**
 * Replay a shape command on the canvas
 */
const replayShape = (ctx: CanvasRenderingContext2D, command: DrawingCommand): void => {
  if (command.x === undefined || command.y === undefined) return;

  ctx.strokeStyle = command.color;
  ctx.lineWidth = command.size || 2;
  ctx.globalAlpha = command.opacity ?? 1;

  switch (command.tool) {
    case 'line':
      ctx.beginPath();
      ctx.moveTo(command.x, command.y);
      ctx.lineTo(command.w ?? 0, command.h ?? 0);
      ctx.stroke();
      break;

    case 'rectangle':
      ctx.strokeRect(command.x, command.y, command.w ?? 0, command.h ?? 0);
      break;

    case 'triangle':
      replayTriangle(ctx, command);
      break;

    case 'star':
      replayStar(ctx, command);
      break;
  }

  ctx.globalAlpha = 1;
};

/**
 * Replay a triangle shape
 */
const replayTriangle = (ctx: CanvasRenderingContext2D, command: DrawingCommand): void => {
  if (
    command.x === undefined ||
    command.y === undefined ||
    command.w === undefined ||
    command.h === undefined
  )
    return;

  const centerX = command.x + (command.w ?? 0) / 2;
  const centerY = command.y;
  const baseY = command.y + (command.h ?? 0);
  const leftX = command.x;
  const rightX = command.x + (command.w ?? 0);

  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(rightX, baseY);
  ctx.lineTo(leftX, baseY);
  ctx.closePath();
  ctx.stroke();
};

/**
 * Replay a star shape
 */
const replayStar = (ctx: CanvasRenderingContext2D, command: DrawingCommand): void => {
  if (command.x === undefined || command.y === undefined || command.w === undefined) return;

  const cx = command.x + (command.w ?? 0) / 2;
  const cy = command.y + ((command.h ?? 0) / 2 || (command.w ?? 0) / 2);
  const radius = (command.w ?? 0) / 2;

  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
  ctx.stroke();
};

/**
 * Replay a fill command
 */
const replayFill = (ctx: CanvasRenderingContext2D, command: DrawingCommand): void => {
  if (command.x === undefined || command.y === undefined) return;

  ctx.fillStyle = command.color;
  ctx.globalAlpha = command.opacity ?? 1;

  // Simple fill at a point (flood fill not replayed, just mark as filled)
  ctx.fillRect(command.x, command.y, 1, 1);

  ctx.globalAlpha = 1;
};

/**
 * Restore canvas from Base64 image data
 */
export const restoreCanvasFromBase64 = (
  canvas: HTMLCanvasElement,
  base64Data: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      resolve();
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = base64Data;
  });
};
