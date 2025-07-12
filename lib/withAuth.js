'use client';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import DesignerLoader from '@/components/DesignerLoader';
import { ToastContainer, toast } from 'react-toastify';

export default function withAuth(Component) {
  return function AuthWrapper(props) {
    const { status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const hasRedirected = useRef(false);

    useEffect(() => {
      const allowedPaths = ['/', '/login', '/signup'];
      
      if (status === 'unauthenticated' && !allowedPaths.includes(pathname) && !hasRedirected.current) {
        hasRedirected.current = true;
        
        // Show toast immediately
        toast.error('Please login to access this page, redirecting to login page', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        // Redirect after 2 seconds
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    }, [status, pathname, router]);

    // Always render ToastContainer
    const toastContainer = (
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    );

    if (status === 'loading') {
      return (
        <div className='h-screen w-screen flex justify-center items-center'>
          {toastContainer}
          <DesignerLoader />
        </div>
      );
    }

    // For unauthenticated users on protected routes, show loading state while toast is displayed
    const allowedPaths = ['/', '/login', '/signup'];
    if (status === 'unauthenticated' && !allowedPaths.includes(pathname)) {
      return (
        <div className='h-screen w-screen flex justify-center items-center'>
          {toastContainer}
          <DesignerLoader />
        </div>
      );
    }

    // For all other cases, render the component
    return (
      <>
        <Component {...props} />
        {toastContainer}
      </>
    );
  };
}