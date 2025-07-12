'use client';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import DesignerLoader from '@/components/DesignerLoader';

export default function withAuth(Component) {
  return function AuthWrapper(props) {
    const { status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [isRedirecting, setIsRedirecting] = useState(false);
    const redirectTimerRef = useRef(null);

    useEffect(() => {
      const allowedPaths = ['/', '/login', '/signup'];
      if (status === 'unauthenticated' && !allowedPaths.includes(pathname) && !isRedirecting) {
        setIsRedirecting(true);
        
        // Show toast notification
        toast.info('Please log in to access this page. Redirecting in 5 seconds...', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // Wait 5 seconds before redirecting
        redirectTimerRef.current = setTimeout(() => {
          router.push('/login');
        }, 5000);
      }

      // Cleanup timer if component unmounts or dependencies change
      return () => {
        if (redirectTimerRef.current) {
          clearTimeout(redirectTimerRef.current);
        }
      };
    }, [status, pathname, router, isRedirecting]);

    if (status === 'loading') {
      return <div className='h-screen w-screen flex justify-center items-center'><DesignerLoader/></div>;
    }

    return <Component {...props} />;
  };
}