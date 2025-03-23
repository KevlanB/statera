export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="container flex flex-col items-center justify-center gap-4 mx-auto">
      <div className="inline-block w-full text-center justify-center">
        {children}
      </div>
    </section>
  );
}
