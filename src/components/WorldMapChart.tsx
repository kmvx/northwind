import * as React from 'react';
import * as d3 from 'd3';
import clsx from 'clsx';
import { useQuery } from '@tanstack/react-query';

import { API_URL } from '../utils';
import { ErrorMessage, PanelStretched, WaitSpinner } from '../ui';
import type { IOrders } from '../models';
import './WorldMapChart.scss';

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
  d3.json(
    'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson',
  ).then(function (data: any) {
    const projection = d3
      .geoNaturalEarth1()
      .scale(width / 1.5 / Math.PI)
      .translate([width / 2.2, height / 2]);

    // Draw the map
    const svg = d3.select(current);
    svg.selectAll('*').remove();

    // Background
    svg
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', width)
      .attr('height', height)
      .attr('fill', `hsl(${hue} 100% 50%`)
      .attr('fill-opacity', 0.1);

    // Countries
    svg
      .append('g')
      .selectAll('path')
      .data(data.features)
      .join('path')
      .attr(
        'class',
        (d: any) => 'world-map-chart__country x-' + d.properties.name,
      )
      .attr('data-country', (d: any) => d.properties.name)
      .attr(
        'data-count',
        (d: any) => itemsPerCountryCount.get(d.properties.name) || 'no',
      )
      .attr('fill', function (d: any) {
        const count = itemsPerCountryCount.get(d.properties.name);
        if (count) {
          return `hsl(${hue} 100% ${
            80 - Math.round((count / maxItemsCountPerCountry) * 60)
          }%)`;
        } else return 'hsl(0 0% 75%)';
      })
      .attr('d', d3.geoPath().projection(projection) as any);

    const svgParent = d3.select(svg.node()?.parentNode as Element);
    svgParent.selectAll('.world-map-chart__tooltip').remove();
    const tooltip = svgParent
      .append('div')
      .attr('class', 'world-map-chart__tooltip')
      .style('border-color', `hsl(${hue} 100% 50%`)
      .style('visibility', 'hidden');
    svgParent
      .on('mousemove', (event: MouseEvent) => {
        tooltip
          .style(
            'left',
            event.offsetX - (tooltip.node()?.clientWidth || 0) - 20 + 'px',
          )
          .style('top', event.offsetY + 20 + 'px')
          .style('visibility', 'visible');
        const target = d3.select(event.target as Element);
        const country = target.attr('data-country');
        if (country) {
          tooltip
            .html(
              `<b>${country}</b>: <b>${target.attr('data-count')}</b> ${name}`,
            )
            .style('visibility', 'visible');
        } else {
          tooltip.html('').style('visibility', 'hidden');
        }
      })
      .on('mouseout', () => {
        tooltip.html('').style('visibility', 'hidden');
      });
  });
}

function WorldMapChart({
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
  const { data, error, isLoading } = useQuery<IOrders>({
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

export function CustomersWorldMapChart({
  className,
}: {
  className?: string;
}): JSX.Element {
  return (
    <WorldMapChart
      className={className}
      name="customers"
      urlPath="/Customers"
      countrySelector={(item) => item.country}
      hue={30}
    />
  );
}

export function OrdersWorldMapChart({
  className,
}: {
  className?: string;
}): JSX.Element {
  return (
    <WorldMapChart
      className={className}
      name="orders"
      urlPath="/Orders"
      countrySelector={(item) => item.shipCountry}
      hue={216}
    />
  );
}

export function SuppliersWorldMapChart({
  className,
}: {
  className?: string;
}): JSX.Element {
  return (
    <WorldMapChart
      className={className}
      name="suppliers"
      urlPath="/Suppliers"
      countrySelector={(item) => item.country}
      hue={120}
    />
  );
}
