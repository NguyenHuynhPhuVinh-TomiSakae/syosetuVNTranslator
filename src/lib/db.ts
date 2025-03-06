import { openDB, DBSchema } from 'idb';

// Định nghĩa các kiểu dữ liệu
export interface Novel {
  id?: number;
  title: string;
  author: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Chapter {
  id?: number;
  novelId: number;
  title: string;
  sourceText: string;
  translatedText: string;
  createdAt: Date;
  updatedAt: Date;
  order: number;
}

// Định nghĩa schema cho database
interface NovelDBSchema extends DBSchema {
  novels: {
    key: number;
    value: Novel;
    indexes: { 'by-title': string };
  };
  chapters: {
    key: number;
    value: Chapter;
    indexes: { 'by-novel': number };
  };
}

// Kiểm tra xem code có đang chạy ở phía client không
const isClient = typeof window !== 'undefined';

// Khởi tạo database chỉ khi ở phía client
export const dbPromise = isClient 
  ? openDB<NovelDBSchema>('syosetuVNTranslator-db', 1, {
      upgrade(db) {
        // Tạo object store cho novels
        const novelStore = db.createObjectStore('novels', { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        novelStore.createIndex('by-title', 'title');

        // Tạo object store cho chapters
        const chapterStore = db.createObjectStore('chapters', { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        chapterStore.createIndex('by-novel', 'novelId');
      },
    })
  : null;

// Các hàm thao tác với novels
export async function getAllNovels(): Promise<Novel[]> {
  if (!isClient) return [];
  const db = await dbPromise;
  return db!.getAll('novels');
}

export async function getNovel(id: number): Promise<Novel | undefined> {
  if (!isClient) return undefined;
  const db = await dbPromise;
  return db!.get('novels', id);
}

export async function addNovel(novel: Novel): Promise<number> {
  if (!isClient) return -1;
  const db = await dbPromise;
  return db!.add('novels', {
    ...novel,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

export async function updateNovel(novel: Novel): Promise<number> {
  if (!isClient) return -1;
  const db = await dbPromise;
  return db!.put('novels', {
    ...novel,
    updatedAt: new Date(),
  });
}

export async function deleteNovel(id: number): Promise<void> {
  if (!isClient) return;
  const db = await dbPromise;
  
  // Xóa tất cả các chương của truyện
  const tx = db!.transaction(['chapters'], 'readwrite');
  const chapterStore = tx.objectStore('chapters');
  const chapterIndex = chapterStore.index('by-novel');
  const chapters = await chapterIndex.getAll(id);
  
  for (const chapter of chapters) {
    await chapterStore.delete(chapter.id!);
  }
  
  await tx.done;
  
  // Xóa truyện
  await db!.delete('novels', id);
}

// Các hàm thao tác với chapters
export async function getChaptersForNovel(novelId: number): Promise<Chapter[]> {
  if (!isClient) return [];
  const db = await dbPromise;
  const tx = db!.transaction('chapters');
  const index = tx.store.index('by-novel');
  return index.getAll(novelId);
}

export async function getChapter(id: number): Promise<Chapter | undefined> {
  if (!isClient) return undefined;
  const db = await dbPromise;
  return db!.get('chapters', id);
}

export async function addChapter(chapter: Chapter): Promise<number> {
  if (!isClient) return -1;
  const db = await dbPromise;
  return db!.add('chapters', {
    ...chapter,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

export async function updateChapter(chapter: Chapter): Promise<number> {
  if (!isClient) return -1;
  const db = await dbPromise;
  return db!.put('chapters', {
    ...chapter,
    updatedAt: new Date(),
  });
}

export async function deleteChapter(id: number): Promise<void> {
  if (!isClient) return;
  const db = await dbPromise;
  await db!.delete('chapters', id);
} 