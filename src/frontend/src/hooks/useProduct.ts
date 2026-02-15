import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Product } from '../backend';

export function useProduct(id: bigint | undefined) {
  const { actor, isFetching: isActorFetching } = useActor();

  return useQuery<Product>({
    queryKey: ['product', id?.toString()],
    queryFn: async () => {
      if (!actor || !id) throw new Error('Actor or ID not available');
      return actor.getProduct(id);
    },
    enabled: !!actor && !isActorFetching && id !== undefined,
  });
}
