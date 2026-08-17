import { getTcgPocketData } from '../utils/cardsLoader';
import DashboardClient from './DashboardClient';

export const metadata = {
  title: 'TCG Pocket Explorer | All Languages',
  description: 'A comprehensive explorer for Pokémon TCG Pocket cards by language and set.',
};

export default async function TcgPocketPage() {
  // Load the data Server-Side
  const pocketData = await getTcgPocketData();

  return <DashboardClient initialData={pocketData} />;
}
