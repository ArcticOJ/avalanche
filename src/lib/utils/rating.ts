import {lowerBound} from 'lib/utils/binary';
import {ratingDistribution} from 'lib/constants/rating';

export function resolveRatingColor(rating: number): string {
  const rank = lowerBound(ratingDistribution, rating, (x, y) => x.begin - y);
  if (rank === null) return ratingDistribution[0].color;
  return rank.color;
}