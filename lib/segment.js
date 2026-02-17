export function computeSegment(interest, notes) {
  const normalizedInterest = (interest || '').trim().toLowerCase();
  const normalizedNotes = (notes || '').toLowerCase();
  if (normalizedInterest === 'order now' || normalizedNotes.includes('urgent')) {
    return 'hot';
  }
  return 'warm';
}
