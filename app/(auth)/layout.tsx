import Image from "next/image";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (     

      <section className="flex min-h-svh flex-col items-center bg-white p-10 py-20 justify-center lg:p-10 lg:py-0">
        <div className="mb-5 md:mb-10 lg:justify-center">
          <Image
            src="/logo.png"
            alt="logo"
            width={200}
            height={200}
            className="h-12 w-[224px]"
          />
        </div>
        {children}
      </section>
  );
};

export default Layout;
