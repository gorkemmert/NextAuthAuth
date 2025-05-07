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
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";

interface Product {
  productCode: string;
  name: string;
  imageUrl: string;
}

export default function CollectionEditPage() {
  const searchParams = useSearchParams();
  const collectionId = searchParams.get("id") || "72";

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [fixedItems, setFixedItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  

  // Ürünleri getir
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `https://maestro-api-dev.secil.biz/Collection/${collectionId}/GetProductsForConstants`,
        {
          additionalFilters: [],
          page,
          pageSize: 12,
        },
        // {
        //     headers: {
        //       Authorization: `Bearer ${session.accessToken}`, //buraya kolections daki gibi token eklenecek
        //     },
        //   }
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
        `https://maestro-api-dev.secil.biz/Collection/${collectionId}/GetFixedItems`
      );
      setFixedItems(res.data.data);
    } catch (err) {
      console.error("Sabitler çekilemedi:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    // fetchFixedItems();
  }, [page]);

  return (
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
        >
          Filtreler
        </Button>
      </Box>

      {/* İçerik */}
      <Grid container spacing={3}>
        {/* Koleksiyon Ürünleri */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" mb={1}>Koleksiyon Ürünleri</Typography>
          <Box sx={{ height: 500, overflowY: "auto", border: "1px solid #ccc", borderRadius: 2, p: 2, backgroundColor: "#fafafa" }}>
            {loading ? (
              <CircularProgress />
            ) : (
              <Grid container spacing={2}>
                {products.map((item) => (
                  <Grid item xs={4} key={item.productCode}>
                    <Card>
                      <CardMedia component="img" height="140" image={item.imageUrl} alt={item.name} />
                      <CardContent sx={{ textAlign: "center" }}>
                        <Typography>{item.name}</Typography>
                        <Typography fontSize={12}>{item.productCode}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Grid>

        {/* Sabitler */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" mb={1}>Sabitler</Typography>
          <Box sx={{ height: 500, overflowY: "auto", border: "1px solid #ccc", borderRadius: 2, p: 2, backgroundColor: "#fafafa" }}>
            <Grid container spacing={2}>
              {fixedItems.map((item, index) => (
                <Grid item xs={4} key={index}>
                  <Card sx={{ height: 180, display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <CardMedia component="img" image={item.imageUrl} alt={item.name} sx={{ width: 50 }} />
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Pagination count={totalPage} page={page} onChange={(_, val) => setPage(val)} />
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Alt Butonlar */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}>
        <Button variant="outlined">Vazgeç</Button>
        <Button
          variant="contained"
          onClick={() => {
            axios.post("https://maestro-api-dev.secil.biz/Collection/SaveFixedItems", {
              collectionId,
              productCodes: fixedItems.map((p) => p.productCode),
            });
          }}
        >
          Kaydet
        </Button>
      </Box>
    </Box>
  );
}

