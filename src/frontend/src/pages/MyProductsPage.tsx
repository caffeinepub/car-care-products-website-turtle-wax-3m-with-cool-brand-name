import { useState, useRef } from 'react';
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
import { Pencil, Trash2, Plus, Loader2, Image as ImageIcon, Upload } from 'lucide-react';
import { formatINR } from '@/lib/pricing';
import { UPLOADED_PRODUCT_IMAGES, isUploadedProductImage } from '@/lib/uploadedProductImages';
import { getFallbackImage } from '@/lib/resolveProductImage';
import { ChangeRequestPanel } from '../components/ChangeRequestPanel';
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

type ImageMode = 'gallery' | 'upload' | 'custom';

const emptyForm: ProductFormData = {
  brand: '',
  name: '',
  shortDescription: '',
  imgPath: UPLOADED_PRODUCT_IMAGES.length > 0 ? UPLOADED_PRODUCT_IMAGES[0].path : '',
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
  const [imageMode, setImageMode] = useState<ImageMode>('gallery');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData(emptyForm);
    setImageMode('gallery');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setIsFormOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    
    // Determine image mode based on current imgPath
    let mode: ImageMode = 'gallery';
    if (product.imgPath.startsWith('data:')) {
      mode = 'upload';
    } else if (isUploadedProductImage(product.imgPath)) {
      mode = 'gallery';
    } else if (product.imgPath !== '') {
      mode = 'custom';
    }
    
    setImageMode(mode);
    setFormData({
      brand: product.brand,
      name: product.name,
      shortDescription: product.shortDescription,
      imgPath: product.imgPath,
      originalMrp: product.originalMrp.toString(),
      discountedPrice: product.discountedPrice.toString(),
      tags: product.tags?.join(', ') || '',
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
    setFormData(emptyForm);
    setImageMode('gallery');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleOpenDelete = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleCloseDelete = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleImageModeChange = (mode: ImageMode) => {
    setImageMode(mode);
    
    // Update imgPath based on mode with proper mutual exclusivity
    if (mode === 'gallery') {
      // Gallery mode: set to first gallery image
      if (UPLOADED_PRODUCT_IMAGES.length > 0) {
        setFormData({ ...formData, imgPath: UPLOADED_PRODUCT_IMAGES[0].path });
      }
    } else if (mode === 'upload') {
      // Upload mode: clear non-data-url values
      if (!formData.imgPath.startsWith('data:')) {
        setFormData({ ...formData, imgPath: '' });
      }
      // Clear file input to allow re-selection
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } else if (mode === 'custom') {
      // Custom mode: clear gallery paths and data URLs
      if (isUploadedProductImage(formData.imgPath) || formData.imgPath.startsWith('data:')) {
        setFormData({ ...formData, imgPath: '' });
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Read file as data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setFormData({ ...formData, imgPath: dataUrl });
    };
    reader.onerror = () => {
      toast.error('Failed to read image file');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  const validateForm = (): string | null => {
    if (!formData.brand.trim()) return 'Brand is required';
    if (!formData.name.trim()) return 'Name is required';
    if (!formData.shortDescription.trim()) return 'Short description is required';
    if (!formData.imgPath.trim()) return 'Image is required';
    
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

  const getPreviewImage = (): string => {
    const trimmedPath = formData.imgPath.trim();
    if (trimmedPath) {
      return trimmedPath;
    }
    return getFallbackImage();
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
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            My Products
          </h1>
          <div className="flex items-center gap-3">
            <ChangeRequestPanel />
            <Button onClick={handleOpenCreate}>
              <Plus className="h-5 w-5 mr-2" />
              Add Product
            </Button>
          </div>
        </div>

        {productsLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !products || products.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <p className="text-muted-foreground">You haven't created any products yet.</p>
            <Button onClick={handleOpenCreate}>
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Product
            </Button>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Brand</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>MRP</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id.toString()}>
                    <TableCell className="font-medium">{product.brand}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{formatINR(product.originalMrp)}</TableCell>
                    <TableCell>{formatINR(product.discountedPrice)}</TableCell>
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
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </DialogTitle>
              <DialogDescription>
                Fill in the product details below. All fields are required.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="e.g., Turtle Wax"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Ice Spray Wax"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Short Description</Label>
                <Textarea
                  id="description"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Brief description of the product"
                  rows={3}
                />
              </div>

              {/* Image Selection */}
              <div className="space-y-4">
                <Label>Product Image</Label>
                
                {/* Image Mode Selector */}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={imageMode === 'gallery' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleImageModeChange('gallery')}
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Gallery
                  </Button>
                  <Button
                    type="button"
                    variant={imageMode === 'upload' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleImageModeChange('upload')}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                  <Button
                    type="button"
                    variant={imageMode === 'custom' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleImageModeChange('custom')}
                  >
                    Custom Path
                  </Button>
                </div>

                {/* Gallery Mode */}
                {imageMode === 'gallery' && (
                  <div className="space-y-2">
                    <Label htmlFor="gallery-select">Select from Gallery</Label>
                    <Select
                      value={formData.imgPath}
                      onValueChange={(value) => setFormData({ ...formData, imgPath: value })}
                    >
                      <SelectTrigger id="gallery-select">
                        <SelectValue placeholder="Choose an image" />
                      </SelectTrigger>
                      <SelectContent>
                        {UPLOADED_PRODUCT_IMAGES.map((img) => (
                          <SelectItem key={img.path} value={img.path}>
                            {img.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Upload Mode */}
                {imageMode === 'upload' && (
                  <div className="space-y-2">
                    <Label htmlFor="file-upload">Upload Image (max 5MB)</Label>
                    <Input
                      id="file-upload"
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                    />
                    <p className="text-xs text-muted-foreground">
                      Supported formats: JPG, PNG, GIF, WebP
                    </p>
                  </div>
                )}

                {/* Custom Path Mode */}
                {imageMode === 'custom' && (
                  <div className="space-y-2">
                    <Label htmlFor="custom-path">Image URL or Path</Label>
                    <Input
                      id="custom-path"
                      value={formData.imgPath}
                      onChange={(e) => setFormData({ ...formData, imgPath: e.target.value })}
                      placeholder="/assets/my-image.png or https://..."
                    />
                  </div>
                )}

                {/* Image Preview */}
                <div className="space-y-2">
                  <Label>Preview</Label>
                  <div className="w-full aspect-square max-w-xs rounded-lg overflow-hidden border border-border bg-muted/50">
                    <img
                      src={getPreviewImage()}
                      alt="Preview"
                      onError={(e) => {
                        e.currentTarget.src = getFallbackImage();
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mrp">Original MRP (₹)</Label>
                  <Input
                    id="mrp"
                    type="number"
                    step="0.01"
                    value={formData.originalMrp}
                    onChange={(e) => setFormData({ ...formData, originalMrp: e.target.value })}
                    placeholder="999"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Discounted Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.discountedPrice}
                    onChange={(e) => setFormData({ ...formData, discountedPrice: e.target.value })}
                    placeholder="799"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="wax, polish, shine"
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
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete "{productToDelete?.name}". This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCloseDelete}>Cancel</AlertDialogCancel>
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
