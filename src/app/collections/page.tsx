"use client";

import { useEffect, useState } from "react";
import { useSession, getSession } from "next-auth/react"; // ✅ getSession ekledik
import { useRouter } from "next/navigation";
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";
import axios from "axios";

interface Collection {
  id: string;
  name: string;
  description: string;
}

export default function CollectionsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [collections, setCollections] = useState<Collection[]>([]);
  
  useEffect(() => {
    if (status === "loading") return;

    async function checkSession() {
      const updatedSession = await getSession(); // ✅ Güncellenmiş oturumu al
      console.log(!updatedSession?.accessToken);
      
      if (!updatedSession?.accessToken) {
        console.log("Token yok, login sayfasına yönlendiriliyor...");
        router.push("/login"); // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
        return;
      }

      // Koleksiyonları API'den çek
      axios
        .get("https://maestro-api-dev.secil.biz/Collection/72/GetProductsForConstants", {
          headers: { Authorization: `Bearer ${updatedSession.accessToken}` }, // ✅ Güncellenmiş token ile API çağrısı
        })
        .then((res) => setCollections(res.data))
        .catch((err) => console.error("Koleksiyonları çekerken hata oluştu:", err));
    }

    checkSession();
  }, [status, router]);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Koleksiyonlar
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Ad</strong></TableCell>
              <TableCell><strong>Açıklama</strong></TableCell>
              <TableCell align="right"><strong>İşlemler</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {collections.map((collection) => (
              <TableRow key={collection.id}>
                <TableCell>{collection.id}</TableCell>
                <TableCell>{collection.name}</TableCell>
                <TableCell>{collection.description}</TableCell>
                <TableCell align="right">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => router.push(`/collections/edit?id=${collection.id}`)}
                  >
                    Sabitleri Düzenle
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
