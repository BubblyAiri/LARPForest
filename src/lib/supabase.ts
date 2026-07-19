const mockStorage = {
  stickers: JSON.parse(localStorage.getItem('larp_stickers') || '[]'),
  messages: JSON.parse(localStorage.getItem('larp_messages') || '[]'),
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
      if (table === 'stickers') {
        mockStorage.stickers.push({ id: Date.now(), ...data, approved: true });
        localStorage.setItem('larp_stickers', JSON.stringify(mockStorage.stickers));
      } else {
        mockStorage.messages.push({ id: Date.now(), ...data, approved: false });
        localStorage.setItem('larp_messages', JSON.stringify(mockStorage.messages));
      }
      return Promise.resolve({ data, error: null });
    }
  })
};
