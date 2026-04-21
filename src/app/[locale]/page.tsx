import { getTrendingProducts, getMenuOfTheDay, getAllStoreProducts } from '@/app/actions/store';
import HomeClient from './HomeClient';

export default async function Home() {
  const [menuOfTheDay, trendingProducts, restaurantSneakPeek, shopSneakPeek] = await Promise.all([
    getMenuOfTheDay(),
    getTrendingProducts(6),
    getAllStoreProducts({ type: 'RESTAURANT', limit: 4 }),
    getAllStoreProducts({ type: 'SHOP', limit: 6 })
  ]);

  return (
    <HomeClient 
      menuOfTheDay={menuOfTheDay} 
      trendingProducts={trendingProducts}
      restaurantProducts={restaurantSneakPeek.products}
      shopProducts={shopSneakPeek.products}
    />
  );
}
