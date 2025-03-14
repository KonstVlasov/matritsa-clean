import { Point2d, useBoundingClientRect } from '@krutoo/utils';
import classNames from 'classnames';
import { HTMLAttributes, useRef } from 'react';
import bg from '#images/matrix-bg.png';
import { MatrixValueKey } from '#shared/api';
import { rotate } from '#shared/math';
import styles from './destiny-matrix.m.css';

export interface DestinyMatrixProps extends HTMLAttributes<HTMLDivElement> {
  data?: Partial<Record<MatrixValueKey, number>>;
}

export type CircleColor = 'green' | 'yellow' | 'purple' | 'blue' | 'turquoise' | 'orange' | 'red';

export interface CircleData {
  value?: string | number;
  color?: CircleColor;
}

function Circle({
  x,
  y,
  d,
  v,
  color,
}: {
  x: number;
  y: number;
  d: number;
  v?: string | number;
  color?: CircleColor;
}) {
  return (
    <div
      className={classNames(styles.circle, styles[`circle-${color}`])}
      style={{
        width: d,
        height: d,
        top: y - d / 2,
        left: x - d / 2,
        fontSize: d / 2,
      }}
    >
      {v}
    </div>
  );
}

export function DestinyMatrix({ data = {}, className, style, ...restProps }: DestinyMatrixProps) {
  const ref = useRef<HTMLDivElement>(null);
  const area = useBoundingClientRect(ref);

  const minSize = Math.min(area.width, area.height);
  const diagonal = minSize * 0.85;
  const rectSize = squareSizeByDiagonal(diagonal);

  const center: Point2d = {
    x: area.width / 2,
    y: area.height / 2,
  };

  const radius = {
    m: rectSize * 0.14,
    s: rectSize * 0.09,
  };

  const strokeWidth = Math.max(1, minSize * 0.004);

  const corners: Point2d[] = [];

  for (let i = 0; i < 8; i++) {
    corners.push(
      rotate(
        {
          x: area.width / 2,
          y: area.height / 2,
        },
        {
          x: area.width / 2 + minSize / 2 - 2,
          y: area.height / 2,
        },
        i * (360 / 8),
      ),
    );
  }

  const inner: CircleData[] = [
    //
    { value: data['C'], color: 'red' },
    { value: data['I'], color: undefined },
    { value: data['D'], color: 'red' },
    { value: data['H'], color: undefined },
    { value: data['A'], color: 'purple' },
    { value: data['F'], color: undefined },
    { value: data['B'], color: 'purple' },
    { value: data['G'], color: undefined },
  ];

  const outer1: CircleData[] = [
    //
    { value: data['T'], color: undefined },
    { value: data['2'], color: undefined },
    { value: data['P'], color: undefined },
    { value: data['3'], color: undefined },
    { value: data['R'], color: 'blue' },
    { value: data['Z'], color: undefined },
    { value: data['M'], color: 'blue' },
    { value: data['6'], color: undefined },
  ];

  const outer2: CircleData[] = [
    //
    { value: data['S'], color: 'orange' },
    { value: data['1'], color: undefined },
    { value: data['O'], color: 'orange' },
    { value: data['4'], color: undefined },
    { value: data['Q'], color: 'turquoise' },
    { value: data['Y'], color: undefined },
    { value: data['N'], color: 'turquoise' },
    { value: data['5'], color: undefined },
  ];

  return (
    <div
      ref={ref}
      className={classNames(styles.root, className)}
      style={
        {
          ...style,
          '--destiny-matrix-stroke-w': `${strokeWidth}px`,
        } as any
      }
      {...restProps}
    >
      {area.ready && (
        <>
          <img className={styles.img} src={bg} alt='' />
          <svg
            className={styles.svg}
            width={area.width}
            height={area.height}
            viewBox={`0 0 ${area.width} ${area.height}`}
          >
            <rect
              fill='none'
              stroke='black'
              strokeWidth={strokeWidth}
              x={area.width / 2 - rectSize / 2}
              y={area.height / 2 - rectSize / 2}
              width={rectSize}
              height={rectSize}
            />
            <rect
              fill='none'
              stroke='black'
              strokeWidth={strokeWidth}
              x={area.width / 2 - rectSize / 2}
              y={area.height / 2 - rectSize / 2}
              width={rectSize}
              height={rectSize}
              style={{
                transformBox: 'fill-box',
                transformOrigin: 'center',
                transform: 'rotate(45deg)',
              }}
            />

            {/* cross black */}
            <path
              stroke='black'
              strokeWidth={strokeWidth}
              d={`M ${center.x - rectSize / 2} ${center.y} L ${center.x + rectSize / 2} ${center.y} M ${center.x} ${center.y - rectSize / 2} L ${center.x} ${center.y + rectSize / 2}`}
            />

            {/* cross 45deg black */}
            <path
              stroke='purple'
              strokeWidth={strokeWidth}
              d={`M ${center.x - rectSize / 2} ${center.y - rectSize / 2} L ${center.x + rectSize / 2} ${center.y + rectSize / 2}`}
            />
            <path
              stroke='red'
              strokeWidth={strokeWidth}
              d={`M ${center.x - rectSize / 2} ${center.y + rectSize / 2} L ${center.x + rectSize / 2} ${center.y - rectSize / 2}`}
            />

            {/* 8-corner shape */}
            {/* <path
              fill='none'
              stroke='black'
              strokeWidth={strokeWidth}
              d={`${corners
                .map((item, index) =>
                  index === 0 ? `M ${item.x} ${item.y}` : `L ${item.x} ${item.y}`,
                )
                .join(' ')} Z`}
            /> */}
          </svg>

          {/* CENTER */}
          <Circle x={center.x} y={center.y} d={radius.m} v={data['E']} color='yellow' />

          {/* INNER */}
          {inner.map(({ value, color }, index) => (
            <Circle
              key={index}
              {...rotate(
                center,
                {
                  x: center.x + diagonal / 2,
                  y: center.y,
                },
                45 * index,
              )}
              d={radius.m}
              v={value}
              color={color}
            />
          ))}

          {/* OUTER 1 */}
          {outer1.map(({ value, color }, index) => (
            <Circle
              key={index}
              {...rotate(
                center,
                {
                  x: center.x + diagonal / 2 - radius.m / 2 - radius.s / 2,
                  y: center.y,
                },
                45 * index,
              )}
              d={radius.s}
              v={value}
              color={color}
            />
          ))}

          {/* OUTER 2 */}
          {outer2.map(({ value, color }, index) => (
            <Circle
              key={index}
              {...rotate(
                center,
                {
                  x: center.x + diagonal / 2 - radius.m / 2 - radius.s * 1.5,
                  y: center.y,
                },
                45 * index,
              )}
              d={radius.s}
              v={value}
              color={color}
            />
          ))}

          {/* U V */}
          <Circle
            x={center.x + radius.m / 2 + radius.s / 2}
            y={center.y}
            d={radius.s}
            v={data['U']}
          />
          <Circle
            x={center.x + radius.m / 2 + radius.s * 1.5}
            y={center.y}
            d={radius.s}
            v={data['V']}
          />

          {/* X W */}
          <Circle
            x={center.x - (diagonal / 2 - radius.m / 2 - radius.s * 2) / 2}
            y={center.y}
            d={radius.s}
            v={data['X']}
            color='green'
          />
          <Circle
            x={center.x}
            y={center.y - (diagonal / 2 - radius.m / 2 - radius.s * 2) / 2}
            d={radius.s}
            v={data['W']}
            color='green'
          />

          {/* L J K */}
          <Circle
            x={center.x + rectSize / 2 - squareSizeByDiagonal(diagonal / 2 / 4)}
            y={center.y + squareSizeByDiagonal(diagonal / 2 / 4)}
            d={radius.s}
            v={data['L']}
          />
          <Circle
            x={center.x + rectSize / 2 - squareSizeByDiagonal(diagonal / 2 / 2)}
            y={center.y + squareSizeByDiagonal(diagonal / 2 / 2)}
            d={radius.s}
            v={data['J']}
          />
          <Circle
            x={center.x + rectSize / 2 - squareSizeByDiagonal((diagonal / 2) * (3 / 4))}
            y={center.y + squareSizeByDiagonal((diagonal / 2) * (3 / 4))}
            d={radius.s}
            v={data['K']}
          />
        </>
      )}
    </div>
  );
}

function squareSizeByDiagonal(diagonal: number) {
  return Math.sqrt(diagonal ** 2 / 2);
}
