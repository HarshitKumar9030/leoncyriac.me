'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Plus } from 'lucide-react';
import { addGalleryItem } from '@/app/actions/gallery';
import { useRouter } from 'next/navigation';

export default function AddGalleryItem() {
  const [newItem, setNewItem] = useState({ title: '', description: '', imageUrl: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      await addGalleryItem(JSON.stringify(newItem));
      router.push('/gallery');
    } catch (error) {
      setError('Failed to add item. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-neutral-800 dark:text-neutral-200">Add Gallery Item</h2>

      {error && (
        <Alert className="mb-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleAddItem} className="space-y-4">
        <Input
          type="text"
          placeholder="Title"
          value={newItem.title}
          onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
          required
          className="bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600"
        />
        <Textarea
          placeholder="Description"
          value={newItem.description}
          onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
          required
          className="bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600"
        />
        <Input
          type="url"
          placeholder="Image URL"
          value={newItem.imageUrl}
          onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })}
          required
          className="bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600"
        />
        <Button
          type="submit"
          disabled={isAdding}
          className="w-full bg-neutral-800 hover:bg-neutral-900 dark:bg-neutral-200 dark:hover:bg-neutral-100 text-white dark:text-neutral-800"
        >
          {isAdding ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </>
          )}
        </Button>
      </form>
    </div>
  );
}

