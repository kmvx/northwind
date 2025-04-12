import React from 'react';
import * as d3 from 'd3';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import type { NavigateFunction } from 'react-router-dom';

import { ErrorMessage, PanelBasic, WaitSpinner } from '../ui';
import { addTooltip } from './Chart';
import './WorldMapChart.scss';

function updateChart({
  current,
  width,
  height,
  itemsPerCountryCount,
  maxItemsCountPerCountry,
  hue,
  allowZoom,
  name,
  navigate,
}: {
  current: SVGSVGElement;
  width: number;
  height: number;
  itemsPerCountryCount: Map<string, number>;
  maxItemsCountPerCountry: number;
  hue: number;
  allowZoom: boolean;
  name: string;
  navigate: NavigateFunction;
}) {
  d3.json(
    'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson',
  ).then(function (data: any) {
    const projection = d3
      .geoNaturalEarth1()
      //.geoAzimuthalEqualArea()
      //.geoCylindricalEqualArea()
      .scale(width / 1.5 / Math.PI)
      .translate([width / 2.2, height / 2]);

    // Draw the map
    const svg = d3.select(current);
    svg.selectAll('*').remove();

    const svgGroup = svg.append('g');

    // Background
    svgGroup
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', width)
      .attr('height', height)
      .attr('fill', `hsl(${hue} 100% 50%`)
      .attr('fill-opacity', 0.1);

    // Countries
    function getCountryName(d: any) {
      const country = d.properties.name;
      if (country === 'England') return 'UK';
      else return country;
    }
    svgGroup
      .append('g')
      .selectAll('path')
      .data(data.features)
      .join('path')
      .attr('class', 'world-map-chart__country')
      .attr('data-country', (d: any) => getCountryName(d))
      .attr(
        'data-count',
        (d: any) => itemsPerCountryCount.get(getCountryName(d)) || 'no',
      )
      .attr('fill', function (d: any) {
        const count = itemsPerCountryCount.get(getCountryName(d));
        if (count) {
          return `hsl(${hue} 100% ${
            80 - Math.round((count / maxItemsCountPerCountry) * 60)
          }%)`;
        } else return 'hsl(0 0% 75%)';
      })
      .attr('d', d3.geoPath().projection(projection) as any);

    // Zoom
    if (allowZoom) {
      const zoomObject = d3
        .zoom()
        .scaleExtent([1, 4])
        .on('zoom', function (event) {
          function isFloatSame(a: number, b: number) {
            return Math.abs(a - b) < 1e-5;
          }
          if (
            isFloatSame(event.transform.k, 1) &&
            String(event.transform) !== String(d3.zoomIdentity)
          ) {
            // Reset scale and translate values on scale out
            setTimeout(() => {
              zoomObject.transform(svgGroup as any, d3.zoomIdentity);
            }, 1e3);
          } else svgGroup.attr('transform', event.transform);
        });
      svg.call(zoomObject as any);
    }

    // Tooltip
    addTooltip({ svg, hue, name, navigate });
  });
}

interface CountriesQueryResultType {
  countries?: string[];
  error: Error | null;
  isLoading: boolean;
  refetch: () => void;
}

function WorldMapChart({
  className,
  name,
  countriesQueryResult,
  hue = 216,
  allowZoom = false,
}: {
  className?: string;
  name: string;
  countriesQueryResult: CountriesQueryResultType;
  hue?: number;
  allowZoom?: boolean;
}): React.JSX.Element {
  // Prepare data for the chart
  const { itemsPerCountryCount, maxItemsCountPerCountry } =
    React.useMemo(() => {
      const itemsPerCountryCount = new Map<string, number>();
      let maxItemsCountPerCountry = 0;
      countriesQueryResult.countries?.forEach((country) => {
        const count = (itemsPerCountryCount.get(country) || 0) + 1;
        maxItemsCountPerCountry = Math.max(maxItemsCountPerCountry, count);
        itemsPerCountryCount.set(country, count);
      });
      return { itemsPerCountryCount, maxItemsCountPerCountry };
    }, [countriesQueryResult.countries]);

  // SVG chart
  const navigate = useNavigate();
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
        allowZoom,
        name,
        navigate,
      });
    }
    update();
    const element = ref.current?.parentElement;
    const resizeObserver = new ResizeObserver(update);
    if (element) resizeObserver.observe(element);
    return () => {
      if (element) resizeObserver.unobserve(element);
    };
  }, [
    itemsPerCountryCount,
    maxItemsCountPerCountry,
    hue,
    allowZoom,
    name,
    navigate,
  ]);

  // Handle errors and loading state
  const { error, isLoading, refetch } = countriesQueryResult;
  if (!error && !isLoading && itemsPerCountryCount.size === 0) return <></>;

  const getContent = () => {
    if (error) return <ErrorMessage error={error} retry={refetch} />;
    if (isLoading) return <WaitSpinner />;
    return <svg ref={ref} className="position-absolute" />;
  };

  return (
    <PanelBasic className={clsx('world-map-chart', className, 'vstack')}>
      <h3 className="mt-2 mb-4 text-center">
        Distribution of count of <b>{name}</b> by countries
      </h3>
      <div className="world-map-chart__chart-parent flex-grow-1 d-flex justify-content-center">
        {getContent()}
      </div>
    </PanelBasic>
  );
}

export function CustomersWorldMapChart({
  countriesQueryResult,
  className,
  hue,
  allowZoom,
}: {
  countriesQueryResult: CountriesQueryResultType;
  className?: string;
  hue?: number;
  allowZoom?: boolean;
}): React.JSX.Element {
  return (
    <WorldMapChart
      countriesQueryResult={countriesQueryResult}
      className={className}
      name="customers"
      hue={hue}
      allowZoom={allowZoom}
    />
  );
}

export function OrdersWorldMapChart({
  countriesQueryResult,
  className,
  hue,
  allowZoom,
}: {
  countriesQueryResult: CountriesQueryResultType;
  className?: string;
  hue?: number;
  allowZoom?: boolean;
}): React.JSX.Element {
  return (
    <WorldMapChart
      countriesQueryResult={countriesQueryResult}
      className={className}
      name="orders"
      hue={hue}
      allowZoom={allowZoom}
    />
  );
}

export function SuppliersWorldMapChart({
  countriesQueryResult,
  className,
  hue,
  allowZoom,
}: {
  countriesQueryResult: CountriesQueryResultType;
  className?: string;
  hue?: number;
  allowZoom?: boolean;
}): React.JSX.Element {
  return (
    <WorldMapChart
      countriesQueryResult={countriesQueryResult}
      className={className}
      name="suppliers"
      hue={hue}
      allowZoom={allowZoom}
    />
  );
}
