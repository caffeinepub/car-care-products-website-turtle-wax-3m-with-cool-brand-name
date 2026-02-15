import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useProducts } from '../hooks/useProducts';
import { useProductMutations } from '../hooks/useProductMutations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Pencil, Trash2, Plus, Loader2, Image as ImageIcon } from 'lucide-react';
import { formatINR } from '@/lib/pricing';
import { UPLOADED_PRODUCT_IMAGES } from '@/lib/uploadedProductImages';
import type { Product } from '../backend';
import { toast } from 'sonner';

type ProductFormData = {
  brand: string;
  name: string;
  shortDescription: string;
  imgPath: string;
  originalMrp: string;
  discountedPrice: string;
  tags: string;
};

const emptyForm: ProductFormData = {
  brand: '',
  name: '',
  shortDescription: '',
  imgPath: '',
  originalMrp: '',
  discountedPrice: '',
  tags: '',
};

export default function MyProductsPage() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const { data: products, isLoading: productsLoading } = useProducts();
  const { createProduct, updateProduct, deleteProduct } = useProductMutations();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(emptyForm);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [useCustomPath, setUseCustomPath] = useState(false);

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData(emptyForm);
    setUseCustomPath(false);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    const isUploadedImage = UPLOADED_PRODUCT_IMAGES.some(img => img.path === product.imgPath);
    setUseCustomPath(!isUploadedImage && product.imgPath !== '');
    setFormData({
      brand: product.brand,
      name: product.name,
      shortDescription: product.shortDescription,
      imgPath: product.imgPath,
      originalMrp: product.originalMrp.toString(),
      discountedPrice: product.discountedPrice.toString(),
      tags: product.tags?.join(', ') || '',
    });
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
    setFormData(emptyForm);
    setUseCustomPath(false);
  };

  const handleOpenDelete = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleCloseDelete = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const validateForm = (): string | null => {
    if (!formData.brand.trim()) return 'Brand is required';
    if (!formData.name.trim()) return 'Name is required';
    if (!formData.shortDescription.trim()) return 'Short description is required';
    if (!formData.imgPath.trim()) return 'Image path is required';
    
    const mrp = parseFloat(formData.originalMrp);
    const discounted = parseFloat(formData.discountedPrice);
    
    if (isNaN(mrp) || mrp <= 0) return 'MRP must be a positive number';
    if (isNaN(discounted) || discounted <= 0) return 'Discounted price must be a positive number';
    if (discounted >= mrp) return 'Discounted price must be lower than MRP';
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }

    const tags = formData.tags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const productData = {
      brand: formData.brand.trim(),
      name: formData.name.trim(),
      shortDescription: formData.shortDescription.trim(),
      imgPath: formData.imgPath.trim(),
      originalMrp: BigInt(Math.round(parseFloat(formData.originalMrp))),
      discountedPrice: BigInt(Math.round(parseFloat(formData.discountedPrice))),
      tags: tags.length > 0 ? tags : null,
    };

    try {
      if (editingProduct) {
        await updateProduct.mutateAsync({
          id: editingProduct.id,
          ...productData,
        });
        toast.success('Product updated successfully');
      } else {
        await createProduct.mutateAsync(productData);
        toast.success('Product created successfully');
      }
      handleCloseForm();
    } catch (err: any) {
      const errorMessage = err?.message || 'An error occurred';
      toast.error(errorMessage);
    }
  };

  const handleDelete = async () => {
    if (!productToDelete) return;

    try {
      await deleteProduct.mutateAsync(productToDelete.id);
      toast.success('Product deleted successfully');
      handleCloseDelete();
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to delete product';
      toast.error(errorMessage);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center space-y-6">
          <h1 className="text-3xl font-bold">My Products</h1>
          <p className="text-muted-foreground">
            Please log in to manage your products.
          </p>
          <Button onClick={login} disabled={isLoggingIn} size="lg">
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            My Products
          </h1>
          <Button onClick={handleOpenCreate}>
            <Plus className="h-5 w-5 mr-2" />
            Add Product
          </Button>
        </div>

        {productsLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !products || products.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <p className="text-muted-foreground">No products yet. Create your first product!</p>
            <Button onClick={handleOpenCreate}>
              <Plus className="h-5 w-5 mr-2" />
              Add Product
            </Button>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Brand</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>MRP</TableHead>
                  <TableHead>Selling Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id.toString()}>
                    <TableCell className="font-medium">{product.brand}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {product.shortDescription}
                    </TableCell>
                    <TableCell>{formatINR(product.originalMrp)}</TableCell>
                    <TableCell className="font-semibold text-primary">
                      {formatINR(product.discountedPrice)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(product)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDelete(product)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={isFormOpen} onOpenChange={handleCloseForm}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Edit Product' : 'Create New Product'}
              </DialogTitle>
              <DialogDescription>
                {editingProduct
                  ? 'Update the product details below.'
                  : 'Fill in the details to create a new product.'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand *</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="e.g., Turtle Wax"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Ceramic Car Wash"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDescription">Short Description *</Label>
                <Textarea
                  id="shortDescription"
                  value={formData.shortDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, shortDescription: e.target.value })
                  }
                  placeholder="Brief description of the product"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Product Image *</Label>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant={!useCustomPath ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setUseCustomPath(false);
                        if (UPLOADED_PRODUCT_IMAGES.length > 0) {
                          setFormData({ ...formData, imgPath: UPLOADED_PRODUCT_IMAGES[0].path });
                        }
                      }}
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Choose from Gallery
                    </Button>
                    <Button
                      type="button"
                      variant={useCustomPath ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setUseCustomPath(true)}
                    >
                      Custom Path
                    </Button>
                  </div>

                  {!useCustomPath ? (
                    <Select
                      value={formData.imgPath}
                      onValueChange={(value) => setFormData({ ...formData, imgPath: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an uploaded image" />
                      </SelectTrigger>
                      <SelectContent>
                        {UPLOADED_PRODUCT_IMAGES.map((img) => (
                          <SelectItem key={img.path} value={img.path}>
                            {img.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id="imgPath"
                      value={formData.imgPath}
                      onChange={(e) => setFormData({ ...formData, imgPath: e.target.value })}
                      placeholder="/assets/generated/your-image.png"
                      required
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="originalMrp">MRP (₹) *</Label>
                  <Input
                    id="originalMrp"
                    type="number"
                    step="0.01"
                    value={formData.originalMrp}
                    onChange={(e) =>
                      setFormData({ ...formData, originalMrp: e.target.value })
                    }
                    placeholder="e.g., 599"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discountedPrice">Selling Price (₹) *</Label>
                  <Input
                    id="discountedPrice"
                    type="number"
                    step="0.01"
                    value={formData.discountedPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, discountedPrice: e.target.value })
                    }
                    placeholder="e.g., 499"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="e.g., Ceramic, Wash, Premium"
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseForm}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createProduct.isPending || updateProduct.isPending}
                >
                  {(createProduct.isPending || updateProduct.isPending) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={handleCloseDelete}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete "{productToDelete?.name}". This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={deleteProduct.isPending}
              >
                {deleteProduct.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
