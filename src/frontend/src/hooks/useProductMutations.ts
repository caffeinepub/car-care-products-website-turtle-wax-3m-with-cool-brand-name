import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

type CreateProductInput = {
  brand: string;
  name: string;
  shortDescription: string;
  imgPath: string;
  originalMrp: bigint;
  discountedPrice: bigint;
  tags: string[] | null;
};

type UpdateProductInput = {
  id: bigint;
  brand: string;
  name: string;
  shortDescription: string;
  imgPath: string;
  originalMrp: bigint;
  discountedPrice: bigint;
  tags: string[] | null;
};

export function useProductMutations() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const createProduct = useMutation({
    mutationFn: async (input: CreateProductInput) => {
      if (!actor) throw new Error('Actor not available');

      // Generate a unique ID based on timestamp and random number
      const id = BigInt(Date.now() * 1000 + Math.floor(Math.random() * 1000));

      await actor.addProduct(
        id,
        input.brand,
        input.name,
        input.shortDescription,
        input.imgPath,
        input.originalMrp,
        input.discountedPrice,
        input.tags
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error: any) => {
      // Extract meaningful error message from backend trap
      const message = error?.message || error?.toString() || 'Failed to create product';
      throw new Error(message);
    },
  });

  const updateProduct = useMutation({
    mutationFn: async (input: UpdateProductInput) => {
      if (!actor) throw new Error('Actor not available');

      await actor.updateProduct(
        input.id,
        input.brand,
        input.name,
        input.shortDescription,
        input.imgPath,
        input.originalMrp,
        input.discountedPrice,
        input.tags
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error: any) => {
      const message = error?.message || error?.toString() || 'Failed to update product';
      throw new Error(message);
    },
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deleteProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error: any) => {
      const message = error?.message || error?.toString() || 'Failed to delete product';
      throw new Error(message);
    },
  });

  return {
    createProduct,
    updateProduct,
    deleteProduct,
  };
}
