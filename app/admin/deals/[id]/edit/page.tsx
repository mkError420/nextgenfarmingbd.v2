'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

export default function EditDeal() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    title_en: '',
    description: '',
    description_en: '',
    discountType: 'percentage' as 'percentage' | 'fixed' | 'buy_x_get_y',
    discountValue: '',
    products: '',
    categories: '',
    startDate: '',
    endDate: '',
    minOrderValue: '',
    maxUses: '',
    code: '',
    isActive: true,
  });

  useEffect(() => {
    fetchDeal();
  }, [params.id]);

  const fetchDeal = async () => {
    try {
      const res = await fetch(`/api/deals`);
      const data = await res.json();
      const deal = data.deals?.find((d: any) => d._id === params.id);
      if (deal) {
        setFormData({
          title: deal.title || '',
          title_en: deal.title_en || '',
          description: deal.description || '',
          description_en: deal.description_en || '',
          discountType: deal.discountType || 'percentage',
          discountValue: deal.discountValue?.toString() || '',
          products: deal.products?.join(', ') || '',
          categories: deal.categories?.join(', ') || '',
          startDate: deal.startDate ? new Date(deal.startDate).toISOString().split('T')[0] : '',
          endDate: deal.endDate ? new Date(deal.endDate).toISOString().split('T')[0] : '',
          minOrderValue: deal.minOrderValue?.toString() || '',
          maxUses: deal.maxUses?.toString() || '',
          code: deal.code || '',
          isActive: deal.isActive ?? true,
        });
      }
    } catch (error) {
      console.error('Error fetching deal:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/deals/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          discountValue: parseFloat(formData.discountValue),
          products: formData.products ? formData.products.split(',').map(p => p.trim()) : [],
          categories: formData.categories ? formData.categories.split(',').map(c => c.trim()) : [],
          startDate: new Date(formData.startDate),
          endDate: new Date(formData.endDate),
          minOrderValue: formData.minOrderValue ? parseFloat(formData.minOrderValue) : undefined,
          maxUses: formData.maxUses ? parseInt(formData.maxUses) : undefined,
        }),
      });

      if (res.ok) {
        router.push('/admin/deals');
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to update deal');
      }
    } catch (error) {
      console.error('Error updating deal:', error);
      alert('Failed to update deal');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/deals"
          className="flex items-center text-green-600 hover:text-green-700"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Deals
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Deal</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title (Bangla) *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title (English)
              </label>
              <input
                type="text"
                value={formData.title_en}
                onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Type *
              </label>
              <select
                required
                value={formData.discountType}
                onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
                <option value="buy_x_get_y">Buy X Get Y</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Value *
              </label>
              <input
                type="number"
                required
                step="0.01"
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={formData.discountType === 'percentage' ? 'e.g., 20 for 20%' : 'e.g., 100 for ৳100'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date *
              </label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Order Value (৳)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.minOrderValue}
                onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Uses
              </label>
              <input
                type="number"
                value={formData.maxUses}
                onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deal Code
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., SUMMER20"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product IDs (comma-separated)
              </label>
              <input
                type="text"
                value={formData.products}
                onChange={(e) => setFormData({ ...formData, products: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="id1, id2, id3"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categories (comma-separated)
              </label>
              <input
                type="text"
                value={formData.categories}
                onChange={(e) => setFormData({ ...formData, categories: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Vegetables, Fruits, Dairy"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Bangla) *
            </label>
            <textarea
              rows={4}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (English)
            </label>
            <textarea
              rows={4}
              value={formData.description_en}
              onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
              Active
            </label>
          </div>

          <div className="flex justify-end space-x-4">
            <Link
              href="/admin/deals"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-5 h-5 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
