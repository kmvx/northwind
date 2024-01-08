import * as React from 'react';
import * as d3 from 'd3';
import clsx from 'clsx';
import { useQuery } from '@tanstack/react-query';

import { API_URL } from '../utils';
import { ErrorMessage, PanelStretched, WaitSpinner } from '../ui';
import { addTooltip } from './Chart';
import './BarChart.scss';

function updateChart({
  current,
  width,
  height,
  itemsPerCountryCount,
  maxItemsCountPerCountry,
  hue,
  name,
}: {
  current: SVGSVGElement;
  width: number;
  height: number;
  itemsPerCountryCount: Map<string, number>;
  maxItemsCountPerCountry: number;
  hue: number;
  name: string;
}) {
  // Prepare data
  const itemsPerCountryCountArray = [...itemsPerCountryCount]
    .map(([country, count]) => ({
      country,
      count,
    }))
    .sort((a, b) => b.count - a.count);

  // Draw the map
  const svgBase = d3.select(current);
  svgBase.selectAll('*').remove();

  const margin = { top: 30, right: 30, bottom: 100, left: 60 };
  const widthChart = width - margin.left - margin.right;
  const heightChart = height - margin.top - margin.bottom;
  const svg = svgBase
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // X axis
  const x = d3
    .scaleBand()
    .range([0, widthChart])
    .domain(
      itemsPerCountryCountArray.map(function (d) {
        return d.country;
      }),
    )
    .padding(0.2);
  svg
    .append('g')
    .attr('transform', 'translate(0,' + (5 + heightChart) + ')')
    .style('color', 'var(--chart-text-color)')
    .call(d3.axisBottom(x))
    .selectAll('text')
    .attr('transform', 'translate(-10, 0) rotate(-45)')
    .style('font-size', '1rem')
    .style('text-anchor', 'end');

  // Y axis
  const y = d3
    .scaleLinear()
    .domain([0, maxItemsCountPerCountry])
    .range([heightChart, 0]);
  svg
    .append('g')
    .style('color', 'var(--chart-text-color)')
    .call(d3.axisLeft(y))
    .selectAll('text')
    .attr('fill', 'var(--chart-text-color)')
    .style('font-size', '0.8rem');

  // Bars
  svg
    .selectAll('.whatever')
    .data(itemsPerCountryCountArray)
    .join('rect')
    .attr('class', 'bar-chart__country')
    .attr('data-country', (d) => d.country)
    .attr('data-count', (d) => d.count)
    .attr('x', function (d) {
      return x(d.country) as any;
    })
    .attr('y', function (d) {
      return y(d.count);
    })
    .attr('width', x.bandwidth())
    .attr('height', function (d) {
      return heightChart - y(d.count);
    })
    .attr('fill', `hsl(${hue} 100% 90%`)
    .attr('stroke', `hsl(${hue} 100% 50%`)
    .attr('stroke-width', 2);

  addTooltip({ svg: svgBase, hue, name });
}

function BarChart({
  className,
  name,
  urlPath,
  countrySelector,
  hue,
}: {
  className?: string;
  name: string;
  urlPath: string;
  countrySelector: (item: any) => string;
  hue: number;
}): JSX.Element {
  // Load data
  const { data, error, isLoading } = useQuery<any[]>({
    queryKey: [API_URL + urlPath],
  });

  // Prepare data for the chart
  const { itemsPerCountryCount, maxItemsCountPerCountry } =
    React.useMemo(() => {
      const itemsPerCountryCount = new Map<string, number>();
      let maxItemsCountPerCountry = 0;
      data?.forEach((order) => {
        let country = countrySelector(order);
        if (country === 'UK') country = 'England';
        const count = (itemsPerCountryCount.get(country) || 0) + 1;
        maxItemsCountPerCountry = Math.max(maxItemsCountPerCountry, count);
        itemsPerCountryCount.set(country, count);
      });
      return { itemsPerCountryCount, maxItemsCountPerCountry };
    }, [data, countrySelector]);

  // SVG chart
  const ref = React.useRef<SVGSVGElement>(null);
  React.useLayoutEffect(() => {
    function update() {
      const current = ref.current;
      if (!current) return;
      const parentNode = current.parentNode as HTMLElement;
      if (!parentNode) return;
      const width = parentNode.clientWidth;
      const height = parentNode.clientHeight;
      d3.select(current).attr('width', width).attr('height', height);
      updateChart({
        current,
        width,
        height,
        itemsPerCountryCount,
        maxItemsCountPerCountry,
        hue,
        name,
      });
    }
    update();
    const element = ref.current?.parentElement;
    const resizeObserver = new ResizeObserver(update);
    if (element) resizeObserver.observe(element);
    return () => {
      if (element) resizeObserver.unobserve(element);
    };
  }, [itemsPerCountryCount, maxItemsCountPerCountry, hue, name]);

  // Handle errors and loading state
  if (error) return <ErrorMessage error={error} />;
  if (isLoading) return <WaitSpinner />;
  return (
    <PanelStretched className={clsx('world-map-chart', className, 'vstack')}>
      <h3 className="mt-2 mb-4 text-center">
        Distribution of count of <b>{name}</b> by countries
      </h3>
      <div className="world-map-chart__chart-parent flex-grow-1">
        <svg ref={ref} className="position-absolute" />
      </div>
    </PanelStretched>
  );
}

export function CustomersBarChart({
  className,
}: {
  className?: string;
}): JSX.Element {
  return (
    <BarChart
      className={className}
      name="customers"
      urlPath="/Customers"
      countrySelector={(item) => item.country}
      hue={30}
    />
  );
}

export function OrdersBarChart({
  className,
}: {
  className?: string;
}): JSX.Element {
  return (
    <BarChart
      className={className}
      name="orders"
      urlPath="/Orders"
      countrySelector={(item) => item.shipCountry}
      hue={216}
    />
  );
}

export function SuppliersBarChart({
  className,
}: {
  className?: string;
}): JSX.Element {
  return (
    <BarChart
      className={className}
      name="suppliers"
      urlPath="/Suppliers"
      countrySelector={(item) => item.country}
      hue={120}
    />
  );
}
