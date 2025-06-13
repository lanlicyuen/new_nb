// PostgreSQL API 服务类
export interface AITool {
  id: number;
  name: string;
  purchase_date: string;
  fee_type: 'monthly' | 'yearly' | 'one-time';
  fee_amount: number;
  features: string[];
  created_at?: string;
  updated_at?: string;
}

export interface MDNote {
  id: number;
  title: string;
  content: string;
  folder: string;
  tags: string[];
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

class PostgreSQLAPIService {
  private baseURL: string;

  constructor() {
    // 根据环境自动检测 API 地址
    this.baseURL = this.detectAPIBaseURL();
  }

  private detectAPIBaseURL(): string {
    // 生产环境
    if (window.location.hostname === '1.1.1.12') {
      return 'http://1.1.1.12:5000/api';
    }
    
    // 开发环境
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:5001/api';
    }
    
    // 默认使用当前域名的 5001 端口
    return `http://${window.location.hostname}:5001/api`;
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || `HTTP error! status: ${response.status}` };
      }

      return { data };
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      return { error: error instanceof Error ? error.message : 'Unknown error occurred' };
    }
  }

  // AI Tools API 方法
  async getAITools(): Promise<ApiResponse<AITool[]>> {
    return this.makeRequest<AITool[]>('/ai-tools');
  }

  async createAITool(tool: Omit<AITool, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<AITool>> {
    return this.makeRequest<AITool>('/ai-tools', {
      method: 'POST',
      body: JSON.stringify(tool),
    });
  }

  async updateAITool(id: number, tool: Partial<Omit<AITool, 'id' | 'created_at' | 'updated_at'>>): Promise<ApiResponse<AITool>> {
    return this.makeRequest<AITool>(`/ai-tools/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tool),
    });
  }

  async deleteAITool(id: number): Promise<ApiResponse<{ message: string }>> {
    return this.makeRequest<{ message: string }>(`/ai-tools/${id}`, {
      method: 'DELETE',
    });
  }

  // MD Notes API 方法
  async getMDNotes(): Promise<ApiResponse<MDNote[]>> {
    return this.makeRequest<MDNote[]>('/md-notes');
  }

  async createMDNote(note: Omit<MDNote, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<MDNote>> {
    return this.makeRequest<MDNote>('/md-notes', {
      method: 'POST',
      body: JSON.stringify(note),
    });
  }

  async updateMDNote(id: number, note: Partial<Omit<MDNote, 'id' | 'created_at' | 'updated_at'>>): Promise<ApiResponse<MDNote>> {
    return this.makeRequest<MDNote>(`/md-notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(note),
    });
  }

  async deleteMDNote(id: number): Promise<ApiResponse<{ message: string }>> {
    return this.makeRequest<{ message: string }>(`/md-notes/${id}`, {
      method: 'DELETE',
    });
  }

  // 数据迁移方法
  async migrateFromLocalStorage(): Promise<ApiResponse<{ message: string }>> {
    try {
      // 从 localStorage 获取现有数据
      const localAITools = localStorage.getItem('aiTools');
      const localMDNotes = localStorage.getItem('md-notes');

      const migrationData: {
        ai_tools?: any[];
        md_notes?: any[];
      } = {};

      if (localAITools) {
        try {
          migrationData.ai_tools = JSON.parse(localAITools);
        } catch (e) {
          console.warn('Failed to parse AI tools from localStorage:', e);
        }
      }

      if (localMDNotes) {
        try {
          migrationData.md_notes = JSON.parse(localMDNotes);
        } catch (e) {
          console.warn('Failed to parse MD notes from localStorage:', e);
        }
      }

      // 如果没有数据需要迁移
      if (!migrationData.ai_tools && !migrationData.md_notes) {
        return { data: { message: 'No data found in localStorage to migrate' } };
      }

      // 发送迁移请求
      const response = await this.makeRequest<{ message: string }>('/migrate-data', {
        method: 'POST',
        body: JSON.stringify(migrationData),
      });

      if (response.data) {
        // 迁移成功后，清除 localStorage（可选）
        console.log('Migration successful, localStorage data:', {
          ai_tools: migrationData.ai_tools?.length || 0,
          md_notes: migrationData.md_notes?.length || 0
        });
      }

      return response;
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Migration failed' };
    }
  }

  // 健康检查
  async healthCheck(): Promise<ApiResponse<{ status: string; database: string; timestamp: string }>> {
    return this.makeRequest<{ status: string; database: string; timestamp: string }>('/health');
  }

  // 获取统计信息
  async getStats(): Promise<ApiResponse<{
    ai_tools_count: number;
    md_notes_count: number;
    total_costs: {
      monthly: number;
      yearly: number;
      one_time: number;
    };
  }>> {
    return this.makeRequest('/stats');
  }

  // 连接测试方法
  async testConnection(): Promise<boolean> {
    try {
      const health = await this.healthCheck();
      return health.data?.status === 'healthy';
    } catch {
      return false;
    }
  }
}

// 创建单例实例
export const postgresAPI = new PostgreSQLAPIService();

// 导出类型
export type { ApiResponse };
export default PostgreSQLAPIService;
