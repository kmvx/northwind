import * as ReactQuery from '@tanstack/react-query';
import { NavLink, useParams } from 'react-router-dom';
import { ErrorMessage, PanelCentred, WaitSpinner } from '../ui';
import {
  API_URL,
  joinFields,
  getEmployeeNameByData,
  formatDateFromString,
  formatYearsOldFromDateString,
  setDocumentTitle,
  getFlagImageURLByCountryName,
} from '../utils';
import { Employees } from '.';
import type { IEmployee } from '../models';

function EmployeeLink({
  id,
  className,
}: {
  id: number;
  className?: string;
}): JSX.Element {
  const hasReportsTo = Boolean(id);
  const { data, error, isLoading } = ReactQuery.useQuery<IEmployee>(
    [API_URL + '/Employees/' + id],
    {
      enabled: hasReportsTo,
    },
  );
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
  const { data, error, isLoading } = ReactQuery.useQuery<IEmployee>([
    API_URL + '/Employees/' + id,
  ]);
  if (error) return <ErrorMessage error={error} />;
  if (isLoading) return <WaitSpinner />;
  if (!data) return <div>No data</div>;
  const name = getEmployeeNameByData(data);
  setDocumentTitle(name, 'Employee');
  return (
    <PanelCentred className="w-75">
      <h1 className="text-center m-2">{name}</h1>
      <div className="m-2">
        <div className="text-center m-2 fs-5">
          <b>{data.title}</b>, employee
        </div>
        <div className="row">
          <div className="col-md-7">
            <div className="hstack" title="Address">
              <i className="bi bi-geo-alt m-2" />
              <img
                className="ms-2"
                src={getFlagImageURLByCountryName(data.country)}
                height="20px"
                alt=""
              />
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
            <div className="hstack" title="Home phone">
              <i className="bi bi-telephone m-2" />
              <span className="m-2">
                <b>{data.homePhone}</b> <span>Home</span>
              </span>
            </div>
          </div>
          <div className="col-md-5">
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
            src={`assets/img/database/${data.firstName.toLowerCase()}.jpg`}
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
        <div className="d-flex justify-content-center">
          <NavLink
            to={'/employees/' + id + '/orders'}
            className="btn btn-outline-primary m-2"
          >
            Orders
          </NavLink>
        </div>
      </div>
      <Employees reportsTo={id} />
    </PanelCentred>
  );
}
