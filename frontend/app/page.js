'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 1 });
  const [filters, setFilters] = useState({ name: '', category: '', sort: 'created_at', order: 'desc' });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const fetchItems = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      });

      const res = await fetch(`http://localhost:5000/api/items?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
        return;
      }

      const data = await res.json();
      setItems(data.items);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters, router]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
    fetchItems();
  }, [fetchItems]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const categories = ['All', 'Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Sports', 'Beauty', 'Toys', 'Automotive', 'Garden', 'Industrial'];

  return (
    <div>
      <nav className="navbar">
        <div className="nav-logo">API CHECK</div>
        <div className="nav-user">
          {user && <span style={{ color: 'var(--text-muted)' }}>Hello, <b>{user.name}</b></span>}
          <button onClick={handleLogout} className="btn" style={{ width: 'auto', background: 'var(--glass)', border: '1px solid var(--border)', fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
            Logout
          </button>
        </div>
      </nav>

      <main className="main-content">
        <header className="section-header">
          <div className="section-title">
            <h2>Inventory Dashboard</h2>
            <p>Managing {pagination.total} production items across multiple categories</p>
          </div>
        </header>

        <section className="filter-bar">
          <div className="filter-group">
            <label>Search Products</label>
            <input
              type="text"
              placeholder="Filter by name..."
              value={filters.name}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            />
          </div>
          <div className="filter-group">
            <label>Category</label>
            <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value === 'All' ? '' : e.target.value })}>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <label>Sort By</label>
            <select value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })}>
              <option value="created_at">Date Added</option>
              <option value="price">Price</option>
              <option value="stock">Stock Level</option>
              <option value="name">Product Name</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Order</label>
            <select value={filters.order} onChange={(e) => setFilters({ ...filters, order: e.target.value })}>
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </section>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            <div className="loading-spinner"></div>
            Loading inventory...
          </div>
        ) : (
          <>
            <div className="items-grid">
              {items.map((item) => (
                <article className="item-card" key={item.id}>
                  <div className="item-badge">{item.category}</div>
                  <h3 className="item-name">{item.name}</h3>
                  <p className="item-desc">{item.description}</p>
                  <div className="item-footer">
                    <div className="item-price">${item.price}</div>
                    <div className="item-stock">Stock: <span>{item.stock}</span></div>
                  </div>
                </article>
              ))}
            </div>

            {items.length === 0 && !loading && (
              <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--surface)', borderRadius: '24px', border: '1px dashed var(--border)' }}>
                <h3>No items found</h3>
                <p style={{ color: 'var(--text-muted)' }}>Try adjusting your filters or search terms.</p>
              </div>
            )}

            <div className="pagination">
              <button
                className="page-btn"
                disabled={pagination.page <= 1}
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
              >
                Previous
              </button>
              <span style={{ color: 'var(--text-muted)' }}>Page {pagination.page} of {pagination.totalPages}</span>
              <button
                className="page-btn"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
              >
                Next
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
