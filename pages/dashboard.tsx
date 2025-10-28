import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Layout from '../components/Layout';
import { getProducts, Product } from '../lib/data';

type Props = {
  totalProducts: number;
  lowStockItems: number;
  lastUpdated: string;
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const products = getProducts();
  return {
    props: {
      totalProducts: products.length,
      lowStockItems: products.filter(p => p.inventory < 10).length,
      lastUpdated: new Date().toISOString()
    }
  };
};

const Dashboard: NextPage<Props> = ({ totalProducts, lowStockItems, lastUpdated }) => (
  <Layout>
    <Head><title>Dashboard</title></Head>
    <h1>Inventory Dashboard</h1>
    <p>Total Products: {totalProducts}</p>
    <p>Low Stock Items: {lowStockItems}</p>
    <small>Last Updated: {new Date(lastUpdated).toLocaleString()}</small>
  </Layout>
);

export default Dashboard;
