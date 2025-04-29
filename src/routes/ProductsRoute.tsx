import React from 'react';
import { useParams } from 'react-router-dom';
import Products from '../components/Products';

const ProductsRoute: React.FC = () => {
  // Params
  const { categoryId } = useParams();

  return <Products categoryId={categoryId} />;
};

export default ProductsRoute;
