/**
 * Drawing Metadata Capture Utility
 * Captures drawing session metadata for AI analysis and storage
 */

export interface DrawingMetadata {
  startTime: number; // Timestamp when drawing started
  endTime?: number; // Timestamp when drawing ended
  duration?: number; // Duration in milliseconds
  canvasWidth: number;
  canvasHeight: number;
  toolsUsed: string[]; // Array of tool names used
  brushColorsUsed: string[]; // Array of unique colors used
  brushSizesUsed: number[]; // Array of unique brush sizes
  undoCount: number; // Number of undo operations performed
  redoCount: number; // Number of redo operations performed
  totalStrokes: number; // Total number of strokes drawn
  fillOperations: number; // Number of paint bucket fill operations
  userAgent?: string; // Browser info
}

/**
 * Initialize drawing session metadata
 */
export const initializeDrawingMetadata = (
  canvasWidth: number,
  canvasHeight: number
): DrawingMetadata => {
  return {
    startTime: Date.now(),
    canvasWidth,
    canvasHeight,
    toolsUsed: [],
    brushColorsUsed: [],
    brushSizesUsed: [],
    undoCount: 0,
    redoCount: 0,
    totalStrokes: 0,
    fillOperations: 0,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
  };
};

/**
 * Update metadata with tool usage
 */
export const recordToolUsage = (
  metadata: DrawingMetadata,
  tool: 'draw' | 'paint' | 'line' | 'rectangle' | 'triangle' | 'star'
): void => {
  if (!metadata.toolsUsed.includes(tool)) {
    metadata.toolsUsed.push(tool);
  }
};

/**
 * Update metadata with brush color
 */
export const recordBrushColor = (metadata: DrawingMetadata, color: string): void => {
  if (!metadata.brushColorsUsed.includes(color)) {
    metadata.brushColorsUsed.push(color);
  }
};

/**
 * Update metadata with brush size
 */
export const recordBrushSize = (metadata: DrawingMetadata, size: number): void => {
  if (!metadata.brushSizesUsed.includes(size)) {
    metadata.brushSizesUsed.push(size);
  }
};

/**
 * Increment stroke count
 */
export const incrementStrokeCount = (metadata: DrawingMetadata): void => {
  metadata.totalStrokes++;
};

/**
 * Increment fill operation count
 */
export const incrementFillCount = (metadata: DrawingMetadata): void => {
  metadata.fillOperations++;
};

/**
 * Increment undo count
 */
export const incrementUndoCount = (metadata: DrawingMetadata): void => {
  metadata.undoCount++;
};

/**
 * Increment redo count
 */
export const incrementRedoCount = (metadata: DrawingMetadata): void => {
  metadata.redoCount++;
};

/**
 * Finalize drawing session metadata
 */
export const finalizeDrawingMetadata = (metadata: DrawingMetadata): DrawingMetadata => {
  metadata.endTime = Date.now();
  metadata.duration = metadata.endTime - metadata.startTime;
  return metadata;
};

/**
 * Convert metadata to JSON string for storage
 */
export const serializeMetadata = (metadata: DrawingMetadata): string => {
  return JSON.stringify(metadata);
};

/**
 * Parse metadata from JSON string
 */
export const deserializeMetadata = (jsonString: string): DrawingMetadata => {
  return JSON.parse(jsonString) as DrawingMetadata;
};

/**
 * Get human-readable duration from metadata
 */
export const getFormattedDuration = (metadata: DrawingMetadata): string => {
  if (!metadata.duration) return '0s';

  const seconds = Math.floor(metadata.duration / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${seconds}s`;
};

/**
 * Get metadata summary for display
 */
export const getMetadataSummary = (metadata: DrawingMetadata): string => {
  const summary = [
    `Duration: ${getFormattedDuration(metadata)}`,
    `Tools: ${metadata.toolsUsed.length}`,
    `Colors: ${metadata.brushColorsUsed.length}`,
    `Strokes: ${metadata.totalStrokes}`,
    `Fills: ${metadata.fillOperations}`,
    `Undo/Redo: ${metadata.undoCount}/${metadata.redoCount}`,
  ];
  return summary.join(' | ');
};
