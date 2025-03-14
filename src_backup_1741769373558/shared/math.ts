import type { Point2d } from '@krutoo/utils';

export function rotate(center: Point2d, point: Point2d, degrees: number): Point2d {
  const { PI, cos, sin } = Math;
  const radians = degrees * (PI / 180);

  let x = point.x;
  let y = point.y;

  // translate to origin
  x = x - center.x;
  y = y - center.y;

  // rotate around origin
  const tempX = x;
  const tempY = y;
  x = tempX * cos(radians) - tempY * sin(radians);
  y = tempX * sin(radians) + tempY * cos(radians);

  // translate back to center
  x = x + center.x;
  y = y + center.y;

  return { x, y };
}
