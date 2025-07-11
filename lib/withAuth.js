// lib/withAuth.js
'use client';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import DesignerLoader from '@/components/DesignerLoader';

export default function withAuth(Component) {
  return function AuthWrapper(props) {
    const { status } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
      const allowedPaths = ['/', '/login', '/signup'];
      if (status === 'unauthenticated' && !allowedPaths.includes(pathname)) {
        router.push('/login');
      }
    }, [status, pathname, router]);

    if (status === 'loading') {
      return <div className='h-screen w-screen flex justify-center items-center'><DesignerLoader/></div>;  // You can use a spinner here.
    }

    return <Component {...props} />;
  };
}
