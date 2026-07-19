// Полностью автономный клиент, чтобы сайт не падал без ключей базы данных
const getLocalStorageData = (key: string) => {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
};

const mockStorage = {
  stickers: getLocalStorageData('larp_stickers'),
  messages: getLocalStorageData('larp_messages'),
};

export const supabase = {
  from: (table: string) => ({
    select: () => ({
      order: () => Promise.resolve({ 
        data: table === 'stickers' ? mockStorage.stickers : mockStorage.messages.filter((m: any) => m.approved), 
        error: null 
      })
    }),
    insert: (data: any) => {
      const newRecord = { id: Date.now(), ...data, created_at: new Date().toISOString() };
      if (table === 'stickers') {
        mockStorage.stickers.push({ ...newRecord, approved: true });
        localStorage.setItem('larp_stickers', JSON.stringify(mockStorage.stickers));
      } else {
        mockStorage.messages.push({ ...newRecord, approved: false });
        localStorage.setItem('larp_messages', JSON.stringify(mockStorage.messages));
      }
      return Promise.resolve({ data: [newRecord], error: null });
    },
    on: () => ({ subscribe: () => {} })
  }),
  auth: {
    signInWithPassword: () => Promise.resolve({ data: { user: {} }, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
  }
};
