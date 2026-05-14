/**
 * Canvas Coordinate Conversion Utility
 * Handles converting screen/browser coordinates to canvas drawing coordinates
 * accounting for canvas scaling and positioning
 */

export interface CanvasCoordinates {
  x: number;
  y: number;
}

/**
 * Get the actual drawing coordinates on the canvas
 * Accounts for the difference between visual size (CSS) and actual resolution (width/height)
 */
export const getCanvasCoordinates = (
  canvas: HTMLCanvasElement,
  clientX: number,
  clientY: number
): CanvasCoordinates => {
  const rect = canvas.getBoundingClientRect();

  // Get the visual size of the canvas on screen
  const visualWidth = rect.width;
  const visualHeight = rect.height;

  // Get the actual resolution of the canvas
  const actualWidth = canvas.width;
  const actualHeight = canvas.height;

  // Calculate scale factors
  const scaleX = actualWidth / visualWidth;
  const scaleY = actualHeight / visualHeight;

  // Calculate position relative to canvas element
  const relativeX = clientX - rect.left;
  const relativeY = clientY - rect.top;

  // Scale to actual canvas resolution
  const x = relativeX * scaleX;
  const y = relativeY * scaleY;

  return { x, y };
};

/**
 * Get touch coordinates from a touch event
 */
export const getTouchCoordinates = (canvas: HTMLCanvasElement, touch: Touch): CanvasCoordinates => {
  return getCanvasCoordinates(canvas, touch.clientX, touch.clientY);
};

/**
 * Get mouse coordinates from a mouse event
 */
export const getMouseCoordinates = (
  canvas: HTMLCanvasElement,
  event: React.MouseEvent<HTMLCanvasElement>
): CanvasCoordinates => {
  return getCanvasCoordinates(canvas, event.clientX, event.clientY);
};
