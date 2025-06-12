'use client';
import { useEffect, useState } from 'react';
import { TextInput, Button, Card, Title } from '@mantine/core';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function CollectionsPage() {
  const [collections, setCollections] = useState<any[]>([]);
  const [name, setName] = useState('');

  const fetchCollections = async () => {
    const { data, error } = await supabase
      .from('collections')
      .select('id, name, books(count)')
      .returns<any[]>();
    if (!error) setCollections(data);
  };

  const createCollection = async () => {
    if (!name.trim()) return;
    await supabase.from('collections').insert({ name });
    setName('');
    fetchCollections();
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <Title order={2}>Коллекции</Title>
      <TextInput
        placeholder="Название новой коллекции"
        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
      />
      <Button mt="md" onClick={createCollection}>Создать</Button>

      {collections.map((col) => (
        <Card key={col.id} shadow="sm" mt="lg">
          <Link href={`/collections/${col.id}`}>
            <strong>{col.name}</strong> ({col.books.length} книг)
          </Link>
        </Card>
      ))}
    </div>
  );
}