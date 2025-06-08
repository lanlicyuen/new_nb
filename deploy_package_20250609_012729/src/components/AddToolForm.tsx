import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import type { AITool } from '../types';
import { calculateExpirationDate, generateId, cn } from '../utils';

interface AddToolFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tool: AITool) => void;
  editingTool?: AITool | null;
}

export const AddToolForm: React.FC<AddToolFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingTool
}) => {
  const [formData, setFormData] = useState({
    name: editingTool?.name || '',
    purchaseDate: editingTool?.purchaseDate || new Date().toISOString().split('T')[0],
    feeType: editingTool?.feeType || 'monthly' as 'monthly' | 'yearly',
    features: editingTool?.features || [''],
    cost: editingTool?.cost || 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = '請輸入工具名稱';
    }
    
    if (!formData.purchaseDate) {
      newErrors.purchaseDate = '請選擇購買日期';
    }
    
    const validFeatures = formData.features.filter(f => f.trim());
    if (validFeatures.length === 0) {
      newErrors.features = '請至少添加一個功能';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const validFeatures = formData.features.filter(f => f.trim());
    const expirationDate = calculateExpirationDate(formData.purchaseDate, formData.feeType);

    const tool: AITool = {
      id: editingTool?.id || generateId(),
      name: formData.name.trim(),
      purchaseDate: formData.purchaseDate,
      feeType: formData.feeType,
      expirationDate,
      features: validFeatures,
      cost: formData.cost || undefined
    };

    onSubmit(tool);
    
    // Reset form
    setFormData({
      name: '',
      purchaseDate: new Date().toISOString().split('T')[0],
      feeType: 'monthly',
      features: [''],
      cost: 0
    });
    setErrors({});
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((f, i) => i === index ? value : f)
    }));
  };

  const removeFeature = (index: number) => {
    if (formData.features.length > 1) {
      setFormData(prev => ({
        ...prev,
        features: prev.features.filter((_, i) => i !== index)
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md p-6 animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gradient">
            {editingTool ? '編輯工具' : '添加 AI 工具'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tool name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              工具名稱 *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={cn("cyber-input w-full", errors.name && "border-red-500")}
              placeholder="例如: ChatGPT Plus, Cursor..."
            />
            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Purchase date */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              購買日期 *
            </label>
            <input
              type="date"
              value={formData.purchaseDate}
              onChange={(e) => setFormData(prev => ({ ...prev, purchaseDate: e.target.value }))}
              className={cn("cyber-input w-full", errors.purchaseDate && "border-red-500")}
            />
            {errors.purchaseDate && <p className="text-red-400 text-sm mt-1">{errors.purchaseDate}</p>}
          </div>

          {/* Fee type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              費用類型 *
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="monthly"
                  checked={formData.feeType === 'monthly'}
                  onChange={(e) => setFormData(prev => ({ ...prev, feeType: e.target.value as 'monthly' | 'yearly' }))}
                  className="mr-2 accent-cyber-blue"
                />
                <span className="text-gray-300">月費</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="yearly"
                  checked={formData.feeType === 'yearly'}
                  onChange={(e) => setFormData(prev => ({ ...prev, feeType: e.target.value as 'monthly' | 'yearly' }))}
                  className="mr-2 accent-cyber-blue"
                />
                <span className="text-gray-300">年費</span>
              </label>
            </div>
          </div>

          {/* Cost (optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              費用 (可選)
            </label>
            <input
              type="number"
              value={formData.cost || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, cost: Number(e.target.value) }))}
              className="cyber-input w-full"
              placeholder="輸入費用金額..."
              min="0"
              step="0.01"
            />
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              功能描述 *
            </label>
            <div className="space-y-2">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    className="cyber-input flex-1"
                    placeholder="例如: 程式碼生成, 圖像創作..."
                  />
                  {formData.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="p-3 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors duration-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <button
              type="button"
              onClick={addFeature}
              className="mt-2 flex items-center text-cyber-blue hover:text-cyber-blue/80 transition-colors duration-200"
            >
              <Plus className="w-4 h-4 mr-1" />
              添加功能
            </button>
            
            {errors.features && <p className="text-red-400 text-sm mt-1">{errors.features}</p>}
          </div>

          {/* Submit buttons */}
          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-600/20 border border-gray-500/50 rounded-lg text-gray-300 font-medium hover:bg-gray-600/30 transition-all duration-300"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 cyber-button"
            >
              {editingTool ? '更新工具' : '添加工具'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
