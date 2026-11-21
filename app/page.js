import Portfolio from '@/components/Portfolio';
import { getPortfolioData } from '@/lib/github';

export const revalidate = 3600;

export default async function Page() {
  const data = await getPortfolioData();
  return <Portfolio {...data} />;
}