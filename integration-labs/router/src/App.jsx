import {
  Link,
  NavLink,
  Outlet,
  useLoaderData,
  useNavigation,
  useParams,
  useRouteError,
  useSearchParams,
} from "react-router";

export function RootLayout() {
  const navigation = useNavigation();
  return (
    <div className="shell">
      <header>
        <strong>React Router 8 · real Data Router</strong>
        <nav>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/projects/alpha">Alpha</NavLink>
          <NavLink to="/projects/beta?tab=activity">Beta + search</NavLink>
          <NavLink to="/projects/missing">404 boundary</NavLink>
        </nav>
      </header>
      {navigation.state !== "idle" && <div className="pending" role="status">navigation: {navigation.state}</div>}
      <main><Outlet /></main>
    </div>
  );
}

export function Home() {
  return (
    <section>
      <h1>Real Router Integration</h1>
      <p>This app uses an actual Data Router. Route matching, loaders, params, search params, pending navigation, nested outlets and route errors are handled by React Router—not React Core.</p>
      <Link to="/projects/alpha">Open project route</Link>
    </section>
  );
}

export function ProjectLayout() {
  const project = useLoaderData();
  const { projectId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") ?? "overview";
  return (
    <section>
      <h1>{project.name}</h1>
      <p>params.projectId = <code>{projectId}</code> · loader owner = <strong>{project.owner}</strong></p>
      <div className="row">
        <button onClick={() => setSearchParams({ tab: "overview" })}>tab=overview</button>
        <button onClick={() => setSearchParams({ tab: "activity" })}>tab=activity</button>
      </div>
      <p>URL search state: <code>{tab}</code></p>
      <nav><Link to=".">Overview child</Link><Link to="activity">Activity child</Link></nav>
      <Outlet />
    </section>
  );
}

export function ProjectOverview() {
  return <article><h2>Nested index route</h2><p>Rendered through the parent route's Outlet.</p></article>;
}

export function ProjectActivity() {
  const project = useLoaderData();
  return <article><h2>Nested activity</h2><ul>{project.activity.map((item) => <li key={item}>{item}</li>)}</ul></article>;
}

export function RouteError() {
  const error = useRouteError();
  return <section role="alert"><h1>Route Error Boundary</h1><p>{error?.status ?? "Error"} {error?.statusText ?? error?.message}</p><Link to="/">Return home</Link></section>;
}
