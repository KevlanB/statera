export default function CreateOrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="relative flex flex-col h-[80vh]">
      <div className="container mx-auto my-auto pt-16 px-10 flex-grow">
        {children}
      </div>
    </section>
  );
}
