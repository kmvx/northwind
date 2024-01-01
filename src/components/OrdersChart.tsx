import * as d3 from 'd3';
import * as React from 'react';
import clsx from 'clsx';
import { useQuery } from '@tanstack/react-query';
import {
  ErrorMessage,
  PanelStretched,
  WaitSpinner,
  YearFilterButtons,
} from '../ui';
import { API_URL } from '../utils';
import type { IOrders } from '../models';
import './OrdersChart.scss';

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

const GRID_PADDING_X = 20;
type Selection = d3.Selection<SVGGElement, unknown, null, undefined>;

class SVGBuilder {
  private create(ref: React.RefObject<SVGSVGElement>) {
    if (this.svgLines) return; // Already created
    if (!this.updateSizes(ref)) return;
    const svg = this.svg;
    if (!svg) return;

    {
      const maxValue = 200;
      const ordersCountByMonth = this.ordersCountByMonth;

      // Build SVG
      this.updateY(maxValue);
      const y = this.y;

      this.updateX();
      const x = this.x;

      // Create data shapes
      this.svgArea = svg
        .append('path')
        .datum(ordersCountByMonth)
        .attr('fill', 'var(--chart-line-color)')
        .attr('fill-opacity', 0.1)
        .attr(
          'd',
          d3
            .area()
            .curve(d3.curveNatural)
            .x((_: any, index: number) => x(index))
            .y0(this.height)
            .y1((d: any) => y(d)) as any,
        );
      this.svgLines = svg
        .append('path')
        .datum(ordersCountByMonth)
        .attr('fill', 'none')
        .attr('stroke', 'var(--chart-line-color)')
        .attr('stroke-width', 2)
        .attr(
          'd',
          d3
            .line()
            .curve(d3.curveNatural)
            .x((_: any, index: number) => x(index))
            .y((d: any) => y(d)) as any,
        );
      this.svgCircles = svg
        .selectAll('.whatever-circle')
        .data(ordersCountByMonth)
        .enter()
        .append('circle')
        .attr('fill', 'var(--fill-color)')
        .attr('fill-opacity', 'var(--fill-opacity)')
        .attr('stroke', 'var(--chart-line-color)')
        .attr('stroke-width', 2)
        .attr('r', 10)
        .attr('cx', (_: any, index: number) => x(index))
        .attr('cy', (d: any) => y(d));
    }

    // Focus line
    const focusElement = svg.append('g').style('visibility', 'hidden');
    this.focusLine = focusElement
      .append('line')
      .attr('x1', -GRID_PADDING_X)
      //.attr('x2', this.width + GRID_PADDING_X)
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

    // Mouse event handlers
    svgParent
      .on('mouseover', () => {
        focusElement.style('visibility', 'visible');
        tooltip.style('visibility', 'visible');
      })
      .on('mousemove', (event: MouseEvent) => {
        // Move focus line
        const focusLineY = event.offsetY - 0.5 - this.margin.top;
        this.focusLine?.attr('y1', focusLineY).attr('y2', focusLineY);
        const focusValue = Math.round(this.y.invert(focusLineY));
        focusText
          .attr('x', -GRID_PADDING_X - 30)
          .attr('y', focusLineY)
          .text(focusValue);
        focusElement.style(
          'visibility',
          focusValue >= 0 ? 'visible' : 'hidden',
        );

        // Find nearest value for tooltip
        let nearestIndex;
        let nearestDistance = Infinity;
        this.scaledArray.forEach((value, index) => {
          const distance = Math.sqrt(
            (value.x - event.offsetX) ** 2 + (value.y - event.offsetY) ** 2,
          );
          if (distance < nearestDistance) {
            nearestDistance = distance;
            nearestIndex = index;
          }
        });
        if (nearestIndex === undefined || nearestDistance > 100) {
          tooltip.style('visibility', 'hidden');
        } else {
          const ordersCount = this.ordersCountByMonth[nearestIndex];

          // Position tooltip
          tooltip
            .style(
              'left',
              this.margin.left +
                this.x(nearestIndex) -
                (tooltip.node()?.offsetWidth || 0) / 2 +
                'px',
            )
            .style(
              'top',
              this.margin.top +
                this.y(ordersCount) -
                (tooltip.node()?.offsetHeight || 0) -
                15 +
                'px',
            )
            .html(
              `<b style="font-size: 10pt;">${ordersCount}</b> orders in ${months[nearestIndex]}`,
            )
            .style('visibility', 'visible');
        }
      })
      .on('mouseout', () => {
        focusElement.style('visibility', 'hidden');
        tooltip.style('visibility', 'hidden');
      });
  }
  setData(
    data: IOrders,
    ref: React.RefObject<SVGSVGElement>,
    setYearsSet: (yearsArray: Set<number>) => void,
    yearFilter?: number,
  ) {
    this.create(ref);

    // Prepare data
    const ordersCountByMonth = this.ordersCountByMonth.fill(0);
    const yearsSet = new Set<number>();
    data.forEach((item) => {
      const orderDate = item.orderDate;
      if (!orderDate) return;
      const date = new Date(item.orderDate);
      const year = date.getFullYear();
      yearsSet.add(year);
      if (yearFilter === undefined || year === yearFilter)
        ordersCountByMonth[date.getMonth()]++;
    });
    setYearsSet(yearsSet);
    const maxValue = this.ordersCountByMonth.reduce((p, v) => Math.max(p, v));

    // Upate scales
    if (!this.updateSizes(ref)) return;
    this.updateX();
    const x = this.x;
    this.updateY(maxValue);
    const y = this.y;

    // Update data shapes
    this.svgArea
      ?.transition()
      .duration(1e3)
      .attr(
        'd',
        d3
          .area()
          .curve(d3.curveNatural)
          .x((_: any, index: number) => x(index))
          .y0(this.height)
          .y1((d: any) => y(d)) as any,
      );
    this.svgLines
      ?.transition()
      .duration(1e3)
      .attr(
        'd',
        d3
          .line()
          .curve(d3.curveNatural)
          .x((_: any, index: number) => x(index))
          .y((d: any) => y(d)) as any,
      );
    this.svgCircles
      ?.data(ordersCountByMonth)
      .transition()
      .duration(1e3)
      .attr('cx', (_: any, index: number) => x(index))
      .attr('cy', (d: any) => y(d));

    this.scaledArray = ordersCountByMonth.map((d, index) => {
      return { x: x(index) + this.margin.left, y: y(d) + this.margin.top };
    });
  }
  private updateSizes(ref: React.RefObject<SVGSVGElement>) {
    if (!ref.current) return; // HTML Element not created yet
    const parentNode = ref.current.parentNode as HTMLElement;
    if (!parentNode) return false;
    const parentWidth = parentNode.clientWidth;
    const parentHeight = parentNode.clientHeight;
    const margin = this.margin;
    this.svg = d3
      .select(ref.current)
      .attr('width', parentWidth)
      .attr('height', parentHeight)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    this.width = parentWidth - margin.left - margin.right;
    this.height = parentHeight - margin.top - margin.bottom;
    return true;
  }
  private updateX() {
    this.x = d3
      .scaleLinear()
      .domain([0, this.ordersCountByMonth.length - 1])
      .range([0, this.width]);
    const x = this.x;
    const y = this.y;

    // x axis
    this.svgXAxis?.remove();
    this.svgXAxis = this.svg
      ?.append('g')
      .attr('transform', 'translate(0,' + this.height + ')')
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

    // x grid
    this.svgXGrid?.remove();
    this.svgXGrid = this.svg
      ?.selectAll('.whatever-grid')
      .data(y.ticks(6))
      .enter()
      .append('line')
      .attr('x1', -GRID_PADDING_X)
      .attr('y1', (d: number) => Math.round(y(d)) + 0.5)
      .attr('x2', this.width + GRID_PADDING_X)
      .attr('y2', (d: number) => Math.round(y(d)) + 0.5)
      .style('stroke', 'var(--chart-text-color)')
      .style('stroke-dasharray', '2 3')
      .style('opacity', 0.3);

    // Update focus line width
    this.focusLine?.attr('x2', this.width + GRID_PADDING_X);
  }
  private updateY(maxValue: number) {
    this.y = d3.scaleLinear().domain([0, maxValue]).range([this.height, 0]);

    // y axis
    this.svgYAxis?.remove();
    this.svgYAxis = this.svg
      ?.append('g')
      .attr('transform', 'translate(-' + GRID_PADDING_X + ', 0)')
      .call(
        d3
          .axisLeft(this.y)
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
  }

  private ordersCountByMonth: Array<number> = new Array(12).fill(0);
  private width: number = 0;
  private height: number = 0;
  private x: d3.ScaleLinear<number, number, never> = d3.scaleLinear();
  private y: d3.ScaleLinear<number, number, never> = d3.scaleLinear();
  private svg?: d3.Selection<SVGGElement, unknown, null, undefined>;
  private svgXAxis?: d3.Selection<SVGGElement, unknown, null, undefined>;
  private svgXGrid?: d3.Selection<SVGLineElement, number, SVGGElement, unknown>;
  private focusLine?: d3.Selection<SVGLineElement, unknown, null, undefined>;
  private svgYAxis?: d3.Selection<SVGGElement, unknown, null, undefined>;
  private svgArea?: d3.Selection<SVGPathElement, number[], null, undefined>;
  private svgLines?: d3.Selection<SVGPathElement, number[], null, undefined>;
  private svgCircles?: d3.Selection<
    SVGCircleElement,
    number,
    SVGGElement,
    undefined
  >;
  private scaledArray: { x: number; y: number }[] = [];
  private margin = { left: 70, right: 30, top: 30, bottom: 50 } as const;
}

export default function OrdersChart({
  className,
  employeeId,
}: {
  className?: string;
  employeeId?: string;
}): JSX.Element {
  // Load data
  const { data, error, isLoading } = useQuery<IOrders>({
    queryKey: [
      API_URL + (employeeId ? '/Employees/' + employeeId : '') + '/Orders',
    ],
  });

  // State
  const [yearFilter, setYearFilter] = React.useState<number>();
  const [yearsSet, setYearsSet] = React.useState<Set<number>>(new Set());
  const [svgBuilder] = React.useState(new SVGBuilder());

  // Connect SVG element
  const ref = React.useRef<SVGSVGElement>(null);
  React.useLayoutEffect(() => {
    function update() {
      if (!data) return;
      svgBuilder.setData(data, ref, setYearsSet, yearFilter);
    }
    update();
    const element = ref.current?.parentElement;
    const resizeObserver = new ResizeObserver(update);
    if (element) resizeObserver.observe(element);
    return () => {
      if (element) resizeObserver.unobserve(element);
    };
  }, [data, yearFilter, svgBuilder]);

  // Handle errors and loading state
  if (error) return <ErrorMessage error={error} />;
  if (isLoading) return <WaitSpinner />;

  return (
    <PanelStretched className={clsx(className, 'hstack align-items-stretch')}>
      <div className="orders-chart vstack">
        <h3 className="mt-2 mb-4 text-center">
          Distribution of count of <b>orders</b> by month
        </h3>
        <div className="d-flex justify-content-end">
          <YearFilterButtons {...{ yearsSet, yearFilter, setYearFilter }} />
        </div>
        <div className="orders-chart__chart-parent flex-grow-1">
          <svg ref={ref} className="position-absolute" />
        </div>
      </div>
    </PanelStretched>
  );
}
