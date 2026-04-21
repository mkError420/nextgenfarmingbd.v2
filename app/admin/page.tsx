'use client';

import { useEffect, useState } from 'react';
import { Package, ShoppingCart, FileText, Tag, ImageIcon, FolderTree, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    blogs: 0,
    deals: 0,
    banners: 0
  });

  useEffect(() => {
    // Fetch stats from APIs
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [productsRes, categoriesRes, ordersRes, blogsRes, dealsRes, bannersRes] = await Promise.all([
        fetch('/api/products?limit=1'),
        fetch('/api/categories'),
        fetch('/api/orders?limit=1'),
        fetch('/api/blogs?limit=1'),
        fetch('/api/deals?limit=1'),
        fetch('/api/banners?limit=1')
      ]);

      const productsData = await productsRes.json();
      const categoriesData = await categoriesRes.json();
      const ordersData = await ordersRes.json();
      const blogsData = await blogsRes.json();
      const dealsData = await dealsRes.json();
      const bannersData = await bannersRes.json();

      setStats({
        products: productsData.total || 0,
        categories: categoriesData.categories?.length || 0,
        orders: ordersData.total || 0,
        blogs: blogsData.total || 0,
        deals: dealsData.total || 0,
        banners: bannersData.total || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const statCards = [
    { name: 'Products', value: stats.products, icon: Package, color: 'bg-blue-500', href: '/admin/products' },
    { name: 'Categories', value: stats.categories, icon: FolderTree, color: 'bg-purple-500', href: '/admin/categories' },
    { name: 'Orders', value: stats.orders, icon: ShoppingCart, color: 'bg-green-500', href: '/admin/orders' },
    { name: 'Blogs', value: stats.blogs, icon: FileText, color: 'bg-orange-500', href: '/admin/blogs' },
    { name: 'Deals', value: stats.deals, icon: Tag, color: 'bg-red-500', href: '/admin/deals' },
    { name: 'Banners', value: stats.banners, icon: ImageIcon, color: 'bg-indigo-500', href: '/admin/banners' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <a
            key={stat.name}
            href={stat.href}
            className="relative overflow-hidden bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className={`flex-shrink-0 p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <a
            href="/admin/products/new"
            className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Add New Product
          </a>
          <a
            href="/admin/categories/new"
            className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add New Category
          </a>
          <a
            href="/admin/blogs/new"
            className="flex items-center justify-center px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Write New Blog
          </a>
        </div>
      </div>
    </div>
  );
}
