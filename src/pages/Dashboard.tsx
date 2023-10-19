import * as d3 from 'd3';
import { useId, useRef, useLayoutEffect, useState } from 'react';
import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ErrorMessage, PanelStretched, WaitSpinner } from '../ui';
import { API_URL, setDocumentTitle } from '../utils';
import type { IOrders } from '../models';
import './Dashboard.scss';

const months = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'NOV',
  'OCT',
  'DEC',
] as const;

function buildSVG(
  data: IOrders,
  ref: React.RefObject<SVGSVGElement>,
  setMinYear: (year: number) => void,
  setMaxYear: (year: number) => void,
  yearFilter?: number,
) {
  type Selection = d3.Selection<SVGGElement, unknown, null, undefined>;

  if (!ref.current) return;

  // Prepare data
  const ordersCountByMonth: Array<number> = new Array(12).fill(0);
  let minYear = Infinity;
  let maxYear = -Infinity;
  data.forEach((item) => {
    const orderDate = item.orderDate;
    if (!orderDate) return;
    const date = new Date(item.orderDate);
    const year = date.getFullYear();
    if (yearFilter === undefined || year === yearFilter)
      ordersCountByMonth[date.getMonth()]++;
    minYear = Math.min(minYear, year);
    maxYear = Math.max(maxYear, year);
  });
  setMinYear(minYear);
  setMaxYear(maxYear);
  const maxValue = ordersCountByMonth.reduce((p, v) => Math.max(p, v));

  // Build SVG
  const parentNode = ref.current.parentNode as HTMLElement;
  if (!parentNode) return;
  const parentWidth = parentNode.clientWidth;
  const parentHeight = parentNode.clientHeight;
  const margin = { left: 70, right: 30, top: 30, bottom: 50 };
  d3.select(ref.current).select('*').remove(); // Clear canvas
  const svg = d3
    .select(ref.current)
    .attr('width', parentWidth)
    .attr('height', parentHeight)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
  const width = parentWidth - margin.left - margin.right;
  const height = parentHeight - margin.top - margin.bottom;
  const x = d3
    .scaleLinear()
    .domain([0, ordersCountByMonth.length - 1])
    .range([0, width]);
  const y = d3.scaleLinear().domain([0, maxValue]).range([height, 0]);

  // x axis
  svg
    .append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(
      d3.axisBottom(x).tickFormat((domainValue: d3.NumberValue) => {
        const d = domainValue as number;
        return months[d];
      }),
    )
    .call((g: Selection) => g.select('.domain').remove())
    .call((g: Selection) => g.selectAll('line').remove())
    .call((g: Selection) =>
      g
        .selectAll('text')
        .attr('fill', 'var(--chart-text-color)')
        .attr('font-size', '9pt'),
    );

  const GRID_PADDING_X = 20;

  // y axis
  svg
    .append('g')
    .attr('transform', 'translate(-' + GRID_PADDING_X + ', 0)')
    .call(
      d3
        .axisLeft(y)
        .ticks(6)
        .tickFormat((domainValue: d3.NumberValue) => {
          const d = domainValue as number;
          return d >= 1e3 ? d / 1e3 + 'k' : String(d);
        }),
    )
    .call((g: Selection) => g.select('.domain').remove())
    .call((g: Selection) => g.selectAll('line').remove())
    .call((g: Selection) =>
      g
        .selectAll('text')
        .attr('fill', 'var(--chart-text-color)')
        .attr('font-size', '9pt'),
    );

  // x grid
  svg
    .selectAll('.whatever-grid')
    .data(y.ticks(6))
    .enter()
    .append('line')
    .attr('x1', -GRID_PADDING_X)
    .attr('y1', (d: number) => Math.round(y(d)) + 0.5)
    .attr('x2', width + GRID_PADDING_X)
    .attr('y2', (d: number) => Math.round(y(d)) + 0.5)
    .style('stroke', 'var(--chart-text-color)')
    .style('stroke-dasharray', '2 3')
    .style('opacity', 0.3);

  // Area
  svg
    .append('path')
    .datum(ordersCountByMonth)
    .attr('fill', 'var(--chart-line-color)')
    .attr('fill-opacity', 0.1)
    .attr(
      'd',
      d3
        .area()
        .x((_: any, index: number) => x(index))
        .y0(height)
        .y1((d: any) => y(d)) as any,
    );

  // Lines
  svg
    .append('path')
    .datum(ordersCountByMonth)
    .attr('fill', 'none')
    .attr('stroke', 'var(--chart-line-color)')
    .attr('stroke-width', 2)
    .attr(
      'd',
      d3
        .line()
        .x((_: any, index: number) => x(index))
        .y((d: any) => y(d)) as any,
    );

  // Circles
  svg
    .selectAll('.whatever-circle')
    .data(ordersCountByMonth)
    .enter()
    .append('circle')
    .attr('fill', 'transparent')
    .attr('stroke', 'var(--chart-line-color)')
    .attr('stroke-width', 2)
    .attr('cx', (_: any, index: number) => x(index))
    .attr('cy', (d: any) => y(d))
    .attr('r', 10);

  // Focus line
  const focusElement = svg.append('g').style('visibility', 'hidden');
  const focusLine = focusElement
    .append('line')
    .attr('x1', -GRID_PADDING_X)
    .attr('x2', width + GRID_PADDING_X)
    .attr('stroke', 'var(--chart-line-color)')
    .style('stroke-dasharray', '2 3');
  const focusText = focusElement
    .append('text')
    .attr('fill', 'var(--chart-line-color)')
    .attr('font-size', '9pt')
    .attr('font-weight', 'bold')
    .attr('alignment-baseline', 'middle')
    .attr('text-anchor', 'end');

  // Tooltip
  const svgParent = d3.select(svg.node()?.parentNode?.parentNode as Element);
  svgParent.selectAll('.orders-chart__tooltip').remove();
  const tooltip = svgParent
    .append('div')
    .attr('class', 'orders-chart__tooltip')
    .style('visibility', 'hidden');

  const xScaledArray = ordersCountByMonth.map((_, index) => {
    return x(index);
  });

  // Mouse event handlers
  svgParent
    .on('mouseover', () => {
      focusElement.style('visibility', 'visible');
      tooltip.style('visibility', 'visible');
    })
    .on('mousemove', (event: MouseEvent) => {
      const index = d3.bisect(xScaledArray, event.offsetX) - 1;
      const ordersCount = ordersCountByMonth[index];

      const focusLineY = event.offsetY - 0.5 - margin.top;
      focusLine.attr('y1', focusLineY).attr('y2', focusLineY);
      const focusValue = Math.round(y.invert(focusLineY));
      focusText
        .attr('x', -GRID_PADDING_X - 30)
        .attr('y', focusLineY)
        .text(focusValue);
      focusElement.style('visibility', focusValue >= 0 ? 'visible' : 'hidden');

      tooltip
        .style(
          'left',
          margin.left +
            x(index) -
            (tooltip.node()?.offsetWidth || 0) / 2 +
            'px',
        )
        .style(
          'top',
          margin.top +
            y(ordersCount) -
            (tooltip.node()?.offsetHeight || 0) -
            15 +
            'px',
        )
        .html(`<b>${ordersCount}</b> orders in ${months[index]}`);
    })
    .on('mouseout', () => {
      focusElement.style('visibility', 'hidden');
      tooltip.style('visibility', 'hidden');
    });
}

const YearFilterButtons: React.FC<{
  minYear?: number;
  maxYear?: number;
  yearFilter?: number;
  setYearFilter: (year?: number) => void;
}> = ({ minYear, maxYear, yearFilter, setYearFilter }) => {
  const id = useId();
  const yearsArray =
    minYear === undefined || maxYear === undefined
      ? []
      : Array.from({ length: maxYear - minYear + 1 }).map(
          (_, index) => minYear + index,
        );
  return (
    <div className="btn-group flex-wrap align-items-center m-2">
      <input
        type="radio"
        className="btn-check"
        id={id}
        name="YearFilterRadio"
        autoComplete="off"
        checked={yearFilter === undefined}
        onChange={() => setYearFilter()}
      />
      <label className="btn btn-outline-primary py-2 px-3" htmlFor={id}>
        All
      </label>
      {yearsArray.map((v) => (
        <React.Fragment key={v}>
          <input
            type="radio"
            className="btn-check"
            id={id + v}
            name={'YearFilterRadio' + v}
            autoComplete="off"
            checked={yearFilter === v}
            onChange={() => setYearFilter(v)}
          />
          <label className="btn btn-outline-primary py-2 px-3" htmlFor={id + v}>
            {v}
          </label>
        </React.Fragment>
      ))}
    </div>
  );
};

function OrdersChart(): JSX.Element {
  // Load data
  const { data, error, isLoading } = useQuery<IOrders>([API_URL + '/Orders']);

  // State
  const [yearFilter, setYearFilter] = useState<number>();
  const [minYear, setMinYear] = useState<number>();
  const [maxYear, setMaxYear] = useState<number>();

  // Connect SVG element
  const ref = useRef<SVGSVGElement>(null);
  useLayoutEffect(() => {
    function update() {
      if (!data) return;
      buildSVG(data, ref, setMinYear, setMaxYear, yearFilter);
    }
    update();
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('resize', update);
    };
  }, [data, yearFilter]);

  // Handle errors and loading state
  if (error) return <ErrorMessage error={error} />;
  if (isLoading) return <WaitSpinner />;

  return (
    <PanelStretched>
      <div className="orders-chart">
        <h3 className="mt-2 mb-4 text-center">
          Distribution of count of orders by month
        </h3>
        <div className="d-flex justify-content-end">
          <YearFilterButtons
            {...{ minYear, maxYear, yearFilter, setYearFilter }}
          />
        </div>
        <div className="orders-chart__chart-parent">
          <svg ref={ref} className="position-absolute" />
        </div>
      </div>
    </PanelStretched>
  );
}

export default function Dashboard(): JSX.Element {
  setDocumentTitle('Dashboard');
  return (
    <section>
      <OrdersChart />
    </section>
  );
}
