import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-[60vh] bg-gray-50 flex items-center justify-center py-12 px-4 pt-28">{children}</main>
      <Footer />
    </>
  );
}
