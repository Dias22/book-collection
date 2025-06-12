'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { TextInput, Button, Title, Card } from '@mantine/core';

export default function CollectionPage() {
  const { id } = useParams();
  const [collection, setCollection] = useState<any>(null);
  const [books, setBooks] = useState<any[]>([]);
  const [bookTitle, setBookTitle] = useState('');

  const fetchData = async () => {
    const { data: collectionData } = await supabase
      .from('collections')
      .select()
      .eq('id', id)
      .single();

    const { data: booksData } = await supabase
      .from('books')
      .select()
      .eq('collection_id', id);

    setCollection(collectionData);
    setBooks(booksData || []);
  };

  const addBook = async () => {
    if (!bookTitle.trim()) return;
    await supabase.from('books').insert({ title: bookTitle, collection_id: id });
    setBookTitle('');
    fetchData();
  };

  const deleteBook = async (bookId: string) => {
    await supabase.from('books').delete().eq('id', bookId);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!collection) return <p>Загрузка...</p>;

  return (
    <div style={{ padding: 20 }}>
      <Title order={2}>{collection.name}</Title>

      <TextInput
        placeholder="Название книги"
        value={bookTitle}
        onChange={(e) => setBookTitle(e.currentTarget.value)}
      />
      <Button mt="md" onClick={addBook}>Добавить книгу</Button>

      {books.map((book) => (
        <Card key={book.id} shadow="sm" mt="lg">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{book.title}</span>
            <Button variant="subtle" color="red" onClick={() => deleteBook(book.id)}>
              Удалить
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}