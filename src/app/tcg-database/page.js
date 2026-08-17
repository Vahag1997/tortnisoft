export const metadata = {
  title: 'TCG Global Database Explorer',
  description: 'A massive explorer for the entire Pokémon TCG ecosystem with pricing and multiple languages.',
};

import DatabaseClient from './DatabaseClient';

export default function GlobalDatabasePage() {
  return <DatabaseClient />;
}
