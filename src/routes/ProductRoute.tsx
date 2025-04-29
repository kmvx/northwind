import React from 'react';
import { useParams } from 'react-router-dom';
import Product from '../components/Product';

const ProductRoute: React.FC = () => {
  const { id } = useParams();

  return <Product id={id} />;
};

export default ProductRoute;
