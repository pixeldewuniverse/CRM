export function computeSegment(notes) {
  const normalizedNotes = (notes || '').toLowerCase();
  if (normalizedNotes.includes('urgent')) {
    return 'hot';
  }
  return 'warm';
}
