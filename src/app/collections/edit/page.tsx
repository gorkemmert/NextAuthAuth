"use client";

import {
  Box,
  Button,
  Typography,
  TextField,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Pagination,
  CircularProgress,
  IconButton,
  Dialog,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import DeleteIcon from "@mui/icons-material/Delete";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { getSession } from "next-auth/react";
import tempImage from "@/assets/image/product-image/temp-image.png";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import GridViewIcon from '@mui/icons-material/GridView';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewStreamIcon from '@mui/icons-material/ViewStream';
import ViewComfyIcon from '@mui/icons-material/ViewComfy';
import { styled } from '@mui/material/styles';

interface Product {
  productCode: string;
  name: string;
  imageUrl: string;
  category?: string;
  brand?: string;
  price?: number;
}

type FixedItem = Product | Product[];

const DraggableProductCard = ({ item, isAdded }: { item: Product; isAdded: boolean }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "PRODUCT",
    item: item,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag as unknown as React.RefObject<HTMLDivElement>}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <Card sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="140"
          image={item.imageUrl}
          alt={item.name}
        />
        {isAdded && (
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              color: "white",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            Eklendi
          </Box>
        )}
        <CardContent sx={{ textAlign: "center" }}>
          <Typography>{item.name}</Typography>
          <Typography fontSize={12}>{item.productCode}</Typography>
        </CardContent>
      </Card>
    </div>
  );
};

const DroppableCard = ({
  index,
  onDrop,
  item,
  onDelete,
  gridType,
}: {
  index: number;
  onDrop: (item: Product, index: number) => void;
  item?: FixedItem;
  onDelete: (index: number) => void;
  gridType: '4x3' | '3x4' | 'single' | '2x6';
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "PRODUCT",
    drop: (droppedItem: Product) => onDrop(droppedItem, index),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop as unknown as React.RefObject<HTMLDivElement>}
      style={{
        backgroundColor: isOver ? "#f0f0f0" : "transparent",
        height: "100%",
      }}
    >
      <Card
        sx={{
          display: "flex",
          width: gridType === 'single' ? '100%' : '360px',
          height: gridType === 'single' ? 'auto' : '528px',
          justifyContent: "center",
          alignItems: "center",
          border: "1px solid #000000",
          flexDirection: "column",
          gap: 1,
          padding: 1,
          position: "relative",
        }}
      >
        {Array.isArray(item) && item.length > 0 ? (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 0.5,
              justifyContent: "center",
              width: "100%",
            }}
          >
            {item.map((product, idx) => (
              <Card 
                key={idx} 
                sx={{ 
                  position: "relative",
                  width: "100%",
                  "&:hover": {
                    "& .delete-icon": {
                      opacity: 1,
                    },
                    "& .product-image": {
                      filter: "blur(2px)",
                    }
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height={gridType === 'single' ? "auto" : "140"}
                  image={product.imageUrl || tempImage.src}
                  alt={product.name}
                  className="product-image"
                  sx={{
                    width: "100%",
                    objectFit: "contain",
                    padding: "8px"
                  }}
                />
                <IconButton
                  className="delete-icon"
                  onClick={() => onDelete(index)}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    opacity: 0,
                    transition: "opacity 0.2s",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                    }
                  }}
                >
                  <DeleteIcon />
                </IconButton>
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography>{product.name}</Typography>
                  <Typography fontSize={12}>{product.productCode}</Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
              opacity: 0.5,
            }}
          >
            <img
              src={tempImage.src}
              alt="placeholder"
              width={100}
              height={100}
              style={{ objectFit: "contain" }}
            />
            <Typography
              variant="caption"
              sx={{ mt: 1, color: "text.secondary" }}
            >
              Ürün sürükleyin
            </Typography>
          </Box>
        )}
      </Card>
    </div>
  );
};

const DroppableArea = ({
  onDrop,
  items,
  onDelete,
  gridType,
}: {
  onDrop: (item: Product, index: number) => void;
  items: FixedItem[];
  onDelete: (index: number) => void;
  gridType: '4x3' | '3x4' | 'single' | '2x6';
}) => {
  // Create slots based on grid type
  const slots = Array(gridType === 'single' ? items.length : 12).fill(null);

  return (
    <Grid container spacing={2}>
      {slots.map((_, index) => (
        <Grid 
          item 
          xs={gridType === 'single' ? 12 : gridType === '4x3' ? 3 : gridType === '2x6' ? 6 : 4} 
          key={index}
        >
          <DroppableCard 
            index={index} 
            onDrop={onDrop} 
            item={items[index]} 
            onDelete={onDelete}
            gridType={gridType}
          />
        </Grid>
      ))}
    </Grid>
  );
};

const CustomRedButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#E53935',
  color: '#fff',
  borderRadius: 8,
  minWidth: 160,
  fontWeight: 600,
  fontSize: 16,
  '&:hover': {
    backgroundColor: '#B71C1C',
  },
}));

const CustomGreenButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#2ECC9B',
  color: '#fff',
  borderRadius: 8,
  minWidth: 160,
  fontWeight: 600,
  fontSize: 16,
  '&:hover': {
    backgroundColor: '#27ae60',
  },
}));

export default function CollectionEditPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const collectionId = searchParams.get("id") || "72";

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [fixedItems, setFixedItems] = useState<FixedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [categoryId, setCategoryId] = useState<number>(72);
  const [addedProducts, setAddedProducts] = useState<Set<string>>(new Set());
  const [gridType, setGridType] = useState<'4x3' | '3x4' | 'single' | '2x6'>('3x4');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
  });
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);

  // Ürünleri getir
  const fetchProducts = async () => {
    const session = await getSession();
    setLoading(true);

    if (!session?.accessToken) {
      router.push("/login");
      return;
    }

    try {
      const res = await axios.post(
        `https://maestro-api-dev.secil.biz/Collection/${categoryId}/GetProductsForConstants`,
        {
          additionalFilters: [
            ...(filters.category ? [{ field: 'category', value: filters.category }] : []),
            ...(filters.brand ? [{ field: 'brand', value: filters.brand }] : []),
            ...(filters.minPrice ? [{ field: 'minPrice', value: filters.minPrice }] : []),
            ...(filters.maxPrice ? [{ field: 'maxPrice', value: filters.maxPrice }] : []),
          ],
          page,
          pageSize: 12,
        },
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );
      setProducts(res.data.data.data);
      setTotalPage(Math.ceil(res.data.data.meta.totalProduct / 12));
    } catch (err) {
      console.error("Ürünler çekilemedi:", err);
    }
    setLoading(false);
  };

  // Sabitleri getir
  const fetchFixedItems = async () => {
    try {
      const res = await axios.get(
        `https://maestro-api-dev.secil.biz/Collection/${categoryId}/GetFixedItems`
      );

      // 12 elemanlı boş bir array oluştur
      const emptyArray = Array(12).fill([]);

      // API'den gelen veriyi boş array'e yerleştir
      const formattedItems = emptyArray.map((_, index) => {
        const item = res.data.data[index];
        if (Array.isArray(item)) {
          return item;
        } else if (item) {
          return [item];
        }
        return [];
      });

      setFixedItems(formattedItems);
    } catch (err) {
      console.error("Sabitler çekilemedi:", err);
      // Hata durumunda boş array'ler oluştur
      setFixedItems(Array(12).fill([]));
    }
  };

  // Fetch categories and brands when component mounts
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const session = await getSession();
        if (!session?.accessToken) return;

        const res = await axios.get(
          `https://maestro-api-dev.secil.biz/Collection/${categoryId}/GetFilterOptions`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );
        
        setAvailableCategories(res.data.data.categories || []);
        setAvailableBrands(res.data.data.brands || []);
      } catch (err) {
        console.error("Filter options could not be fetched:", err);
      }
    };

    fetchFilterOptions();
  }, [categoryId]);

  const handleFilterChange = (field: string) => (event: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleFilterApply = () => {
    // Apply filters to the product list
    fetchProducts();
    setFilterDialogOpen(false);
  };

  const handleFilterReset = () => {
    setFilters({
      category: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
    });
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  useEffect(() => {
    fetchFixedItems();
  }, []);

  const handleDrop = (item: Product, index: number) => {
    setFixedItems((prevItems) => {
      const newItems = [...prevItems];

      // Önce eski konumdan ürünü bul ve kaldır
      for (let i = 0; i < newItems.length; i++) {
        if (Array.isArray(newItems[i])) {
          const itemIndex = (newItems[i] as Product[]).findIndex(
            (p: Product) => p.productCode === item.productCode
          );
          if (itemIndex !== -1) {
            // Ürünü bulduk, array'den kaldır
            newItems[i] = (newItems[i] as Product[]).filter(
              (_, idx: number) => idx !== itemIndex
            );
            break;
          }
        }
      }

      // Yeni konuma ekle
      if (!Array.isArray(newItems[index]) || newItems[index].length === 0) {
        newItems[index] = [item];
      } else {
        newItems[index] = [...(newItems[index] as Product[]), item];
      }

      // Eklenen ürünü addedProducts setine ekle
      setAddedProducts(prev => new Set([...prev, item.productCode]));

      return newItems;
    });
  };

  const handleDelete = (index: number) => {
    setDeleteIndex(index);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      setFixedItems((prevItems) => {
        const newItems = [...prevItems];
        const deletedProduct = Array.isArray(newItems[deleteIndex]) ? newItems[deleteIndex][0] : null;
        if (deletedProduct) {
          setAddedProducts(prev => {
            const newSet = new Set(prev);
            newSet.delete(deletedProduct.productCode);
            return newSet;
          });
        }
        newItems[deleteIndex] = [];
        return newItems;
      });
      setDeleteModalOpen(false);
      setSuccessModalOpen(true);
    }
  };

  const handleCloseModals = () => {
    setDeleteModalOpen(false);
    setSuccessModalOpen(false);
    setDeleteIndex(null);
  };

  // Kaydetme işlemi için yardımcı fonksiyon
  const getProductCodes = (items: FixedItem[]): string[] => {
    return items.reduce<string[]>((acc, item) => {
      if (Array.isArray(item)) {
        return [...acc, ...item.map((p) => p.productCode)];
      }
      return acc;
    }, []);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ p: 3 }}>
        {/* Arama ve Filtre */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Ürün ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            variant="outlined"
            size="small"
          />
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            sx={{ ml: 2, minWidth: 120 }}
            onClick={() => setFilterDialogOpen(true)}
          >
            Filtreler
          </Button>
        </Box>

        <Box>
          <Box sx={{ display: 'flex', gap: 2, mb: 3, justifyContent: 'flex-end' }}>
            <Button
              variant={gridType === '4x3' ? 'contained' : 'outlined'}
              onClick={() => setGridType('4x3')}
            >
              <GridViewIcon />
            </Button>
            <Button
              variant={gridType === '3x4' ? 'contained' : 'outlined'}
              onClick={() => setGridType('3x4')}
            >
              <ViewModuleIcon />
            </Button>
            <Button
              variant={gridType === '2x6' ? 'contained' : 'outlined'}
              onClick={() => setGridType('2x6')}
            >
              <ViewComfyIcon />
            </Button>
            <Button
              variant={gridType === 'single' ? 'contained' : 'outlined'}
              onClick={() => setGridType('single')}
            >
              <ViewStreamIcon />
            </Button>
          </Box>
        </Box>

        {/* İçerik */}
        <Grid container spacing={3}>
          {/* Koleksiyon Ürünleri */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" mb={1}>
              Koleksiyon Ürünleri
            </Typography>
            <Box
              sx={{
                height: "70vh",
                overflowY: "auto",
                border: "1px solid #ccc",
                borderRadius: 2,
                p: 2,
                backgroundColor: "#fafafa",
              }}
            >
              {loading ? (
                <CircularProgress />
              ) : (
                <Grid container spacing={2}>
                  {products.map((item, index) => (
                    <Grid item xs={4} key={index}>
                      <DraggableProductCard 
                        item={item} 
                        isAdded={addedProducts.has(item.productCode)}
                      />
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Pagination
                count={totalPage}
                page={page}
                onChange={(_, val) => setPage(val)}
              />
            </Box>
          </Grid>

          {/* Sabitler */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" mb={1}>
              Sabitler
            </Typography>
            <Box
              sx={{
                height: "70vh",
                overflowY: "auto",
                border: "1px solid #ccc",
                borderRadius: 2,
                p: 2,
                backgroundColor: "#fafafa",
              }}
            >
              <DroppableArea 
                onDrop={handleDrop} 
                items={fixedItems} 
                onDelete={handleDelete} 
                gridType={gridType}
              />
            </Box>
          </Grid>
        </Grid>

        {/* Alt Butonlar */}
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}
        >
          <Button 
            variant="outlined" 
            onClick={() => {
              setFixedItems(Array(12).fill([]));
              setAddedProducts(new Set());
            }}
          >
            Vazgeç
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              axios.post(
                "https://maestro-api-dev.secil.biz/Collection/SaveFixedItems",
                {
                  collectionId,
                  productCodes: getProductCodes(fixedItems),
                }
              );
            }}
          >
            Kaydet
          </Button>
        </Box>

        {/* Delete Confirmation Dialog */}
        <Dialog 
          open={deleteModalOpen} 
          onClose={handleCloseModals}
          PaperProps={{
            sx: {
              width: '480px',
              padding: '40px 32px 32px 32px',
              textAlign: 'center',
              borderRadius: '12px',
              position: 'relative',
            }
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
            Uyarı!
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            {/* Red octagon with exclamation SVG */}
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <polygon points="24,4 40,4 60,24 60,40 40,60 24,60 4,40 4,24" stroke="#E53935" strokeWidth="3" fill="none"/>
              <text x="32" y="40" textAnchor="middle" fontSize="32" fill="#E53935" fontWeight="bold">!</text>
            </svg>
          </Box>
          <Typography sx={{ fontSize: 20, mb: 5 }}>
            Sabitlerden Çıkarılacaktır Emin Misiniz?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
            <CustomRedButton onClick={handleCloseModals}>
              Vazgeç
            </CustomRedButton>
            <CustomGreenButton onClick={confirmDelete}>
              Onayla
            </CustomGreenButton>
          </Box>
        </Dialog>

        {/* Success Dialog */}
        <Dialog 
          open={successModalOpen} 
          onClose={handleCloseModals}
          PaperProps={{
            sx: {
              width: '480px',
              padding: '40px 32px 32px 32px',
              textAlign: 'center',
              borderRadius: '12px',
              position: 'relative',
            }
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
            Başarılı
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            {/* Green badge with check SVG */}
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <path d="M32 6 L39 10 L48 10 L52 17 L58 24 L54 32 L58 40 L52 47 L48 54 L39 54 L32 58 L25 54 L16 54 L12 47 L6 40 L10 32 L6 24 L12 17 L16 10 L25 10 Z" stroke="#2ECC9B" strokeWidth="2.5" fill="none"/>
              <polyline points="22,34 30,42 44,26" stroke="#2ECC9B" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Box>
          <Typography sx={{ fontSize: 20, mb: 5 }}>
            Sabitler İçerisinden Çıkarıldı.
          </Typography>
          <CustomGreenButton onClick={handleCloseModals}>
            TAMAM
          </CustomGreenButton>
        </Dialog>

        {/* Filter Dialog */}
        <Dialog
          open={filterDialogOpen}
          onClose={() => setFilterDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Filtreler
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Kategori</InputLabel>
                  <Select
                    value={filters.category}
                    onChange={handleFilterChange('category')}
                    label="Kategori"
                  >
                    <MenuItem value="">Tümü</MenuItem>
                    {availableCategories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Marka</InputLabel>
                  <Select
                    value={filters.brand}
                    onChange={handleFilterChange('brand')}
                    label="Marka"
                  >
                    <MenuItem value="">Tümü</MenuItem>
                    {availableBrands.map((brand) => (
                      <MenuItem key={brand} value={brand}>
                        {brand}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Min. Fiyat"
                  type="number"
                  value={filters.minPrice}
                  onChange={handleFilterChange('minPrice')}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Max. Fiyat"
                  type="number"
                  value={filters.maxPrice}
                  onChange={handleFilterChange('maxPrice')}
                />
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
              <Button onClick={handleFilterReset}>
                Sıfırla
              </Button>
              <Button variant="contained" onClick={handleFilterApply}>
                Uygula
              </Button>
            </Box>
          </Box>
        </Dialog>
      </Box>
    </DndProvider>
  );
}
