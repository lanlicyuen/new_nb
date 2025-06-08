// 共享工具函数

/**
 * 计算AI工具的到期日期
 */
export function calculateExpirationDate(purchaseDate: string, feeType: 'monthly' | 'yearly'): string {
  const date = new Date(purchaseDate);
  if (feeType === 'yearly') {
    date.setFullYear(date.getFullYear() + 1);
  } else {
    date.setMonth(date.getMonth() + 1);
  }
  return date.toISOString().split('T')[0];
}

/**
 * 计算距离到期还剩的天数
 */
export function calculateDaysLeft(expirationDate: string): number {
  const today = new Date();
  const expDate = new Date(expirationDate);
  const diffTime = expDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * 格式化日期为本地字符串
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('zh-CN');
}
