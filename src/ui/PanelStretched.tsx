export default function PanelStretched({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <section className="container bg-light shadow rounded p-2 my-2">
      {children}
    </section>
  );
}
