"use client";

import {
  Box,
  Button,
  Container,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import SelectAllIcon from "@mui/icons-material/SelectAll";
import IconButton from "@mui/material/IconButton";
import { useEffect, useState } from "react";
import { useSession, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface Product {
  productCode: string;
  colorCode: string;
  name: string;
  outOfStock: boolean;
  isSaleB2B: boolean;
  imageUrl: string;
}


export default function CollectionsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true); // Yüklenme durumu

  const pageSize = 36;

  useEffect(() => {
    if (status === "loading") return;

    async function fetchProducts() {
      setIsLoading(true); // Yüklenme durumunu başlat
      const session = await getSession();
      if (!session?.accessToken) {
        router.push("/login");
        return;
      }

      try {
        const res = await axios.post(
          "https://maestro-api-dev.secil.biz/Collection/72/GetProductsForConstants",
          {
            additionalFilters: [],
            page,
            pageSize,
          },
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );

        const result = res.data.data;
        setProducts(result.data);
        setTotalPage(Math.ceil(result.meta.totalProduct / pageSize));
      } catch (error) {
        console.error("Ürünleri çekerken hata:", error);
      } finally {
        setIsLoading(false); // Yüklenme durumunu bitir
      }
    }

    fetchProducts();
  }, [status, page, router]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6" color="text.secondary">
          Yükleniyor...
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth={false} disableGutters sx={{ mt: 4, paddingLeft: 3 }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Başlık</strong></TableCell>
              <TableCell><strong>Ürün Koşulları</strong></TableCell>
              <TableCell><strong>Satış Kanalı</strong></TableCell>
              <TableCell><strong>İşlemler</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product, index) => (
              <TableRow key={index}>
                <TableCell>{`Koleksiyon - ${index + 1 + (page - 1) * pageSize}`}</TableCell>
                <TableCell>
                  Ürün Renk bilgisi Şuna Eşit: {product.colorCode}
                  <br />
                  Ürün Adı: {product.name}
                </TableCell>
                <TableCell>
                  {product.isSaleB2B ? "Satış Kanalı - 1" : "Satış Kanalı - 2"}
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => router.push(`/collections/edit?id=${product.productCode}`)}
                    size="small"
                    color="primary"
                  >
                    <SelectAllIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Pagination
          count={totalPage}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      </Box>
    </Container>
  );
}

