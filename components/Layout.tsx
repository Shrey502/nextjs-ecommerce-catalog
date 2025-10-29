import React, { ReactNode } from 'react';
import Link from 'next/link';
import Head from 'next/head';

type Props = {
  children: ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <div>
      <Head>
        <title>Next.js E-Commerce</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      
      {/* Navigation Bar */}
      <nav style={navStyle}>
        <Link href="/" style={linkStyle}>Home (SSG)</Link>
        <Link href="/dashboard" style={linkStyle}>Dashboard (SSR)</Link>
        <Link href="/admin" style={linkStyle}>Admin (CSR)</Link>
      </nav>

      {/* Page Content */}
      <main style={mainStyle}>
        {children}
      </main>
    </div>
  );
};

// Basic inline styles for the layout
const navStyle: React.CSSProperties = {
  backgroundColor: '#333',
  padding: '1rem',
  display: 'flex',
  gap: '1rem',
};

const linkStyle: React.CSSProperties = {
  color: 'white',
  textDecoration: 'none',
  fontWeight: 'bold',
};

const mainStyle: React.CSSProperties = {
  padding: '1rem',
};

<div style={{
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "40px",
}}>

</div>
export default Layout;