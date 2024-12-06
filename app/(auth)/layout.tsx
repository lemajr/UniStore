import Image from "next/image";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (     

      <section className="flex min-h-screen flex-col items-center bg-white p-4 py-20 lg:justify-center lg:p-10 lg:py-0">
        <div className="mb-16 lg:justify-center">
          <Image
            src="/logo.png"
            alt="logo"
            width={224}
            height={82}
            className="h-12 w-[224px]"
          />
        </div>
        {children}
      </section>
  );
};

export default Layout;
