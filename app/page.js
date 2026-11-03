import Portfolio from '@/components/Portfolio';
import { getProjects } from '@/lib/github';

export const revalidate = 3600;

export default async function Page() {
  const { projects, source } = await getProjects();
  return <Portfolio projects={projects} source={source} />;
}