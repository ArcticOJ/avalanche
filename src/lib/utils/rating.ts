import {lowerBound} from 'lib/utils/binary';
import {ratingDistribution} from 'lib/constants/rating';

export function resolveRating(rating: number) {
  const rank = lowerBound(ratingDistribution, rating, (x, y) => x.begin - y);
  if (rank === null) return ratingDistribution[0];
  return rank;
}