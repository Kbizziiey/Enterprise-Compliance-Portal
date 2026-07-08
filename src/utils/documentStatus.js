const MS_PER_DAY = 1000 * 60 * 60 * 24

/**
 * Computes document status from its expiry date at read time, rather than
 * relying on a stored status field that could drift out of sync.
 */
export function getDocumentStatus(expiryDate, referenceDate = new Date()) {
  const expiry = new Date(expiryDate)
  const diffDays = Math.floor((expiry - referenceDate) / MS_PER_DAY)

  if (diffDays < 0) return 'expired'
  if (diffDays <= 30) return 'expiring-soon'
  return 'active'
}

export function statusColor(status) {
  switch (status) {
    case 'expired':
      return 'bg-red-100 text-red-700'
    case 'expiring-soon':
      return 'bg-amber-100 text-amber-700'
    default:
      return 'bg-green-100 text-green-700'
  }
}
