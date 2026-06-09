export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

export const MEMBERSHIP_PLANS = [
  {
    id: 'premium_standard',
    name: 'プレミアム会員',
    price: 9800,
    currency: 'JPY',
    interval: 'month',
    stripePriceId: 'price_1PremiumStandardMonth',
    features: [
      '補助金 AI アシスタントへの無制限の質問',
      '公募前アラートの早期受信（予測配信）',
      '専門家相談ネットワークのご利用（初回30分無料）',
      'ウォッチリスト無制限追加 & 優先通知',
    ],
  }
];

export const DEFAULT_PLAN = MEMBERSHIP_PLANS[0];

/**
 * Checks if the given role and subscription status grant premium access.
 * Admins always have full permissions (including premium features).
 * Users must have active subscription.
 *
 * @param {string} role
 * @param {object|boolean|string} subscription
 * @returns {boolean}
 */
export function isPremiumUser(role, subscription) {
  if (role === ROLES.ADMIN) return true;
  if (!subscription) return false;
  if (subscription === 'premium' || subscription === 'active') return true;
  if (typeof subscription === 'object' && subscription.status === 'active') return true;
  return false;
}
