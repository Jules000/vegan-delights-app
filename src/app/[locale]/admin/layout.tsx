import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';

export const metadata = {
  title: 'Admin Dashboard | Vegan Delights',
  robots: { index: false, follow: false }
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-admin-cream text-admin-forest">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-y-auto w-full">
        <Header />
        <div className="p-8 max-w-[1400px] mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
