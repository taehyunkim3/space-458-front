export type ExhibitionStatus = 'UPCOMING' | 'CURRENT' | 'PAST';

export function getExhibitionStatus(startDate: Date, endDate: Date): ExhibitionStatus {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

  if (today < start) {
    return 'UPCOMING';
  } else if (today >= start && today <= end) {
    return 'CURRENT';
  } else {
    return 'PAST';
  }
}

export function getStatusLabel(status: ExhibitionStatus): string {
  switch (status) {
    case 'UPCOMING':
      return '예정';
    case 'CURRENT':
      return '진행중';
    case 'PAST':
      return '과거';
    default:
      return '';
  }
}

export function getStatusColor(status: ExhibitionStatus): string {
  switch (status) {
    case 'UPCOMING':
      return 'bg-blue-100 text-blue-800';
    case 'CURRENT':
      return 'bg-green-100 text-green-800';
    case 'PAST':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}