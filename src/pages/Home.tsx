import { setDocumentTitle } from '../utils';
import './Home.scss';

export default function Home(): JSX.Element {
  setDocumentTitle();
  return (
    <div className="home">
      <div className="home__image">
        <img
          alt=""
          src="https://images.unsplash.com/photo-1508185066415-13f4acf9b564?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1959&q=80"
        />
      </div>
      <div className="home__details">
        <h1 className="m-2 my-5">North&shy;wind Traders</h1>
        <div className="m-2">
          <p>
            <span>This is a demo web application client for </span>
            <a
              href="https://en.wikiversity.org/wiki/Database_Examples/Northwind"
              target="_blank"
            >
              Northwind database <i className="bi bi-box-arrow-up-right" />
            </a>
            .
          </p>
          <p>
            See{' '}
            <a href="https://kmvx.tk/#/projects/northwind" target="_blank">
              project description <i className="bi bi-box-arrow-up-right" />
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
