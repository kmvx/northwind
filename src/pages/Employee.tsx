import * as ReactQuery from '@tanstack/react-query';
import { NavLink, useParams } from 'react-router-dom';
import { Orders } from '.';
import { OrdersChart } from '../components';
import { ErrorMessage, Flag, PanelCentred, WaitSpinner } from '../ui';
import {
  API_URL,
  joinFields,
  getEmployeeNameByData,
  formatDateFromString,
  formatYearsOldFromDateString,
  setDocumentTitle,
} from '../utils';
import { Employees } from '.';
import type { IEmployee, ITerritories, IRegions } from '../models';

function Territories({ employeeId }: { employeeId?: string }) {
  const { data, error, isLoading } = ReactQuery.useQuery<ITerritories>({
    queryKey: [API_URL + '/Employees/' + employeeId + '/Territories'],
  });
  const { data: dataRegions } = ReactQuery.useQuery<IRegions>({
    queryKey: [API_URL + '/Regions'],
  });
  if (error) return <ErrorMessage error={error} />;
  if (isLoading) return <WaitSpinner />;
  if (!data) return <div>No data</div>;

  // Regions map
  const regionsMap = new Map<number, string>();
  dataRegions?.forEach((region) =>
    regionsMap.set(region.regionId, region.regionDescription),
  );

  return (
    <div className="hstack">
      <i className="bi bi-globe2 m-2" title="Territories" />
      <span className="m-2">
        {data.reduce<JSX.Element | undefined>(
          (acc, item) => (
            <>
              {acc && <>{acc}, </>}
              <b
                title={`Index: ${item.territoryId}\nRegion: ${
                  regionsMap.get(item.regionId) || item.regionId
                }`}
              >
                {item.territoryDescription}
              </b>
            </>
          ),
          undefined,
        )}
      </span>
    </div>
  );
}

function EmployeeLink({
  id,
  className,
}: {
  id: number;
  className?: string;
}): JSX.Element {
  const hasReportsTo = Boolean(id);

  // Network data
  const { data, error, isLoading } = ReactQuery.useQuery<IEmployee>({
    queryKey: [API_URL + '/Employees/' + id],
    enabled: hasReportsTo,
  });

  if (error) return <ErrorMessage error={error} />;
  if (isLoading) {
    if (hasReportsTo) return <WaitSpinner />;
    else return <></>;
  }
  if (!data) return <div>No data</div>;
  return (
    <span className={className}>
      <span>Reports to </span>
      <NavLink to={'/employees/' + id}>{getEmployeeNameByData(data)}</NavLink>
    </span>
  );
}

export default function Employee(): JSX.Element {
  const { id } = useParams();

  // Network data
  const { data, error, isLoading } = ReactQuery.useQuery<IEmployee>({
    queryKey: [API_URL + '/Employees/' + id],
  });

  const name = data ? getEmployeeNameByData(data) : undefined;
  setDocumentTitle(name, 'Employee');
  if (error) return <ErrorMessage error={error} />;
  if (isLoading) return <WaitSpinner />;
  if (!data) return <div>No data</div>;
  return (
    <PanelCentred className="employee">
      <h1 className="text-center m-2">{name}</h1>
      <div className="m-2">
        <div className="text-center m-2 fs-5">
          <b>{data.title}</b>, employee
        </div>
        <div className="row">
          <div className="col-md-7">
            <div className="hstack" title="Address">
              <i className="bi bi-geo-alt m-2" />
              <Flag className="ms-2" country={data.country} />
              <b className="m-2">
                {joinFields(
                  data.country,
                  data.region,
                  data.city,
                  data.address,
                  data.postalCode,
                )}
              </b>
            </div>
            <Territories employeeId={id} />
          </div>
          <div className="col-md-5">
            <div className="hstack" title="Home phone">
              <i className="bi bi-telephone m-2" />
              <span className="m-2">
                <b>{data.homePhone}</b> <span>Home</span>
              </span>
            </div>
            <div className="hstack">
              <i className="bi bi-balloon m-2" />
              <span className="m-2">
                Birth date: <b>{formatDateFromString(data.birthDate)}</b>
                &nbsp;({formatYearsOldFromDateString(data.birthDate)})
              </span>
            </div>
          </div>
        </div>
        {/*
        <img src={'data:image/bmp;base64,' + data.photo} />
        */}
        <div className="hstack">
          <img
            src={`/assets/img/database/${data.firstName.toLowerCase()}.jpg`}
            width="103px"
            className="m-2"
            alt=""
          />
          <div className="hstack align-items-start" title="Notes">
            <i className="bi bi-card-text m-2" />
            <div className="m-2" style={{ maxWidth: '800px' }}>
              {data.notes}
            </div>
          </div>
        </div>
        {data.reportsTo && (
          <div className="hstack">
            <i className="bi bi-flag m-2" />
            <EmployeeLink id={data.reportsTo} className="m-2" />
          </div>
        )}
      </div>
      <div className="m-2">
        <Employees reportsTo={id} />
      </div>
      <div className="m-2">
        <OrdersChart employeeId={id} />
      </div>
      <div className="d-flex justify-content-center">
        <NavLink
          to={'/employees/' + id + '/orders'}
          className="btn btn-outline-primary m-2"
        >
          Orders
        </NavLink>
      </div>
      <Orders />
    </PanelCentred>
  );
}
