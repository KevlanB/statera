import Image from "next/image";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-center justify-center w-screen h-screen">
      {/* Container principal */}
      <div className="flex flex-col md:flex-row w-full h-full dark:bg-black bg-white">
        {/* Vídeo (visível apenas em desktop) */}
        <div className="hidden md:block md:w-1/2 relative">
          <video
            autoPlay
            loop
            muted
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/forest2.mp4" type="video/mp4" />
            Seu navegador não suporta o elemento de vídeo.
          </video>
          <div className="absolute inset-0 bg-black bg-opacity-20 backdrop-blur-sm" />

          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <Image
              alt="Imagem central"
              className="w-40 h-40 object-cover rounded-md"
              src="/logo.jpg"
            />
            <h1 className="font-bold text-white text-4xl">Statera Amazon</h1>
          </div>
        </div>

        {/* Formulário de login */}
        <div className="w-full md:w-1/2 p-8  flex items-center justify-center">
          <div className="inline-block max-w-lg text-center justify-center w-full">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
