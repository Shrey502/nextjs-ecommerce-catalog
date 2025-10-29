import type { GetStaticProps, GetStaticPaths, NextPage } from 'next';
import Head from 'next/head';
import { getProducts, Product } from '../../lib/data';
import { ParsedUrlQuery } from 'querystring';
import Layout from '../../components/Layout';

interface IParams extends ParsedUrlQuery {
  slug: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const products = getProducts();

  const paths = products.map((product) => ({
    params: { slug: product.slug },
  }));

  return {
    paths,
    fallback: 'blocking', // ✅ dynamically build new pages if needed
  };
};

export const getStaticProps: GetStaticProps<{ product: Product }, IParams> = async ({ params }) => {
  const products = getProducts();
  const product = products.find((p) => p.slug === params?.slug);

  if (!product) return { notFound: true };

  return {
    props: { product },
    revalidate: 60, // ✅ ISR (refresh every minute)
  };
};

const ProductDetailPage: NextPage<{ product: Product }> = ({ product }) => {
  return (
    <>
      <Head><title>{product.name}</title></Head>

      <div style={{ padding: '20px' }}>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <strong>₹{product.price}</strong>
        <p>Stock: {product.inventory}</p>
        <p>Category: {product.category}</p>
        <p>Last Updated: {new Date(product.lastUpdated).toLocaleString()}</p>
      </div>
    </>
  )
}

export default ProductDetailPage;
