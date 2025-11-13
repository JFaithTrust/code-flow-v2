import LeftSidebar from '@/components/navigation/left-sidebar';
import Navbar from '@/components/navigation/navbar';
import RideSidebar from '@/components/navigation/right-sidebar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative background-light850_dark100">
      <Navbar />
      <div className="flex">
        <LeftSidebar />
        <section className="flex min-h-screen flex-1 flex-col px-6 pt-36 pb-6 max-md:pb-14 sm:px-14">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </section>
        <RideSidebar />
      </div>
    </main>
  );
}
