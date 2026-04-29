import { isDemoMode, getDemoData, saveDemoData } from './demoData';

// A minimal mock of Supabase query builder for demo mode
class DemoQueryBuilder {
  private table: string;
  private filters: any[] = [];
  private _order: { column: string; ascending: boolean } | null = null;
  private _limit: number | null = null;
  private _select: string = '*';

  constructor(table: string) {
    this.table = table;
  }

  select(columns: string = '*') {
    this._select = columns;
    return this;
  }

  eq(column: string, value: any) {
    this.filters.push({ type: 'eq', column, value });
    return this;
  }

  in(column: string, values: any[]) {
    this.filters.push({ type: 'in', column, values });
    return this;
  }

  neq(column: string, value: any) {
    this.filters.push({ type: 'neq', column, value });
    return this;
  }

  is(column: string, value: any) {
    this.filters.push({ type: 'is', column, value });
    return this;
  }

  not(column: string, operator: string, value: any) {
    this.filters.push({ type: 'not', column, operator, value });
    return this;
  }

  lte(column: string, value: any) {
    this.filters.push({ type: 'lte', column, value });
    return this;
  }

  gte(column: string, value: any) {
    this.filters.push({ type: 'gte', column, value });
    return this;
  }

  order(column: string, { ascending = true } = {}) {
    this._order = { column, ascending };
    return this;
  }

  limit(n: number) {
    this._limit = n;
    return this;
  }

  single() {
    return this._execute().then((result: any) => {
      const item = result.data?.[0] || null;
      if (!item) return { data: null, error: { message: 'Not found' } };
      return { data: item, error: null };
    });
  }

  then(onfulfilled?: any, onrejected?: any) {
    return this._execute().then(onfulfilled, onrejected);
  }

  private _execute() {
    const data = getDemoData();
    let items = (data as any)[this.table] || [];

    // Apply filters
    for (const f of this.filters) {
      if (f.type === 'eq') {
        items = items.filter((item: any) => item[f.column] === f.value);
      } else if (f.type === 'in') {
        items = items.filter((item: any) => f.values.includes(item[f.column]));
      } else if (f.type === 'neq') {
        items = items.filter((item: any) => item[f.column] !== f.value);
      } else if (f.type === 'is') {
        if (f.value === null) {
          items = items.filter((item: any) => item[f.column] === null || item[f.column] === undefined);
        } else {
          items = items.filter((item: any) => item[f.column] === f.value);
        }
      } else if (f.type === 'not') {
        if (f.operator === 'is') {
          items = items.filter((item: any) => item[f.column] !== null && item[f.column] !== undefined);
        }
      } else if (f.type === 'lte') {
        items = items.filter((item: any) => item[f.column] <= f.value);
      } else if (f.type === 'gte') {
        items = items.filter((item: any) => item[f.column] >= f.value);
      }
    }

    // Order
    if (this._order) {
      items = [...items].sort((a: any, b: any) => {
        const av = a[this._order!.column];
        const bv = b[this._order!.column];
        if (av === null || av === undefined) return 1;
        if (bv === null || bv === undefined) return -1;
        if (av < bv) return this._order!.ascending ? -1 : 1;
        if (av > bv) return this._order!.ascending ? 1 : -1;
        return 0;
      });
    }

    // Limit
    if (this._limit) {
      items = items.slice(0, this._limit);
    }

    // Attach relations for select with *
    if (this._select === '*' || this._select.includes('customers')) {
      items = items.map((item: any) => {
        const enriched = { ...item };
        if (item.customer_id && data.customers) {
          enriched.customers = data.customers.find((c: any) => c.id === item.customer_id) || null;
        }
        if (item.employee_id && data.profiles) {
          enriched.profiles = data.profiles.find((p: any) => p.id === item.employee_id) || null;
        }
        if (item.job_id && data.jobs) {
          enriched.jobs = data.jobs.find((j: any) => j.id === item.job_id) || null;
        }
        if (item.supplier_id && data.suppliers) {
          enriched.suppliers = data.suppliers.find((s: any) => s.id === item.supplier_id) || null;
        }
        if (item.quote_id && data.quotes) {
          enriched.quotes = data.quotes.find((q: any) => q.id === item.quote_id) || null;
        }
        return enriched;
      });
    }

    return Promise.resolve({ data: items, error: null, count: items.length });
  }

  // INSERT
  insert(values: any | any[]) {
    const data = getDemoData();
    const arr = Array.isArray(values) ? values : [values];
    const tableData = (data as any)[this.table] || [];
    const newItems = arr.map((item: any) => ({
      ...item,
      id: item.id || ('demo-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7)),
      created_at: item.created_at || new Date().toISOString(),
    }));
    (data as any)[this.table] = [...tableData, ...newItems];
    saveDemoData(data);
    return Promise.resolve({ data: Array.isArray(values) ? newItems : newItems[0], error: null });
  }

  // UPDATE
  update(values: any) {
    const data = getDemoData();
    let tableData = (data as any)[this.table] || [];
    for (const f of this.filters) {
      if (f.type === 'eq') {
        tableData = tableData.map((item: any) =>
          item[f.column] === f.value ? { ...item, ...values } : item
        );
      }
    }
    (data as any)[this.table] = tableData;
    saveDemoData(data);
    return Promise.resolve({ data: null, error: null });
  }

  // DELETE
  delete() {
    const data = getDemoData();
    let tableData = (data as any)[this.table] || [];
    for (const f of this.filters) {
      if (f.type === 'eq') {
        tableData = tableData.filter((item: any) => item[f.column] !== f.value);
      }
    }
    (data as any)[this.table] = tableData;
    saveDemoData(data);
    return Promise.resolve({ data: null, error: null });
  }

  // count
  count(_head?: string) {
    return this._execute().then((result: any) => ({
      count: result.data?.length || 0,
      error: null,
    }));
  }
}

export const demoSupabase = {
  from: (table: string) => new DemoQueryBuilder(table),
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Demo mode' } }),
    signUp: () => Promise.resolve({ data: null, error: { message: 'Demo mode' } }),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  channel: () => ({
    on: () => ({ subscribe: () => ({}) }),
  }),
  removeChannel: () => {},
  storage: {
    from: () => ({
      upload: () => Promise.resolve({ data: null, error: null }),
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
    }),
  },
};

// Export the right client
export function getDb() {
  return isDemoMode() ? demoSupabase : null;
}
