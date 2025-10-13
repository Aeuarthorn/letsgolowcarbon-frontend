import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
  Typography,
  Grid,
} from "@mui/material";
import axios from "axios";
import { create_travel_types_admin } from "../api/API";

function MaiAddFormOfTravel() {
  const [name, setName] = useState("");
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loading, setLoading] = useState(false);
  const handleClose = () => setSnack((s) => ({ ...s, open: false }));
  const token = localStorage.getItem("token");

  const handleReset = () => {
    setName("");
    console.log("Form reset.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      return setSnack({
        open: true,
        message: "กรุณากรอกชื่อประเภทการเดินทาง",
        severity: "error",
      });
    }

    setLoading(true);

    try {
      const res = await axios.post(
        create_travel_types_admin,
        { name }, // ← send { name: "..." }
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 201) {
        setSnack({ open: true, message: "บันทึกสำเร็จ", severity: "success" });
        setName("");
      } else {
        setSnack({
          open: true,
          message: "บันทึกไม่สำเร็จ: " + res.statusText,
          severity: "error",
        });
      }
    } catch (err) {
      console.error(err);
      setSnack({
        open: true,
        message: "เกิดข้อผิดพลาดระหว่างเชื่อมต่อ",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        // backgroundColor: "#e6f4ea",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          backgroundColor: "#e6f4ea",
          color: "white",
          borderRadius: 4,
          p: 4,
          width: "100%",
          maxWidth: 500,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{ mb: 3, fontWeight: "bold", letterSpacing: 1, color: "#1b5e20" }}
        >
          เพิ่มรูปแบบ
        </Typography>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} textAlign="left">
            <Typography fontWeight="bold" sx={{ color: "#1b5e20" }}>
              ชื่อ:
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="กรอกชื่อรูปแบบ"
              sx={{
                backgroundColor: "white",
                borderRadius: 2,
                "& .MuiInputLabel-root": { color: "#2e7d32" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#a5d6a7" },
                  "&:hover fieldset": { borderColor: "#66bb6a" },
                  "&.Mui-focused fieldset": { borderColor: "#388e3c" },
                },
              }}
            />
          </Grid>

          <Grid item xs={6}>
            <Button
              fullWidth
              variant="outlined"
              color="warning"
              onClick={handleReset}
              sx={{ fontWeight: "bold", borderRadius: 2 }}
            >
              รีเซตค่า
            </Button>
          </Grid>

          <Grid item xs={6}>
            <Button
              fullWidth
              variant="contained"
              color="success"
              onClick={handleSubmit}
              sx={{ fontWeight: "bold", borderRadius: 2 }}
            >
              {loading ? "กำลังบันทึก..." : "ยืนยันการเพิ่ม"}
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity={snack.severity}
          sx={{ width: "100%" }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default MaiAddFormOfTravel;
