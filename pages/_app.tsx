import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Define pages where you DON'T want to show Layout
  const authRoutes = ['/login', '/register', '/admin'];

  const hideLayout = authRoutes.includes(router.pathname);

  return hideLayout ? (
    <Component {...pageProps} />
  ) : (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
