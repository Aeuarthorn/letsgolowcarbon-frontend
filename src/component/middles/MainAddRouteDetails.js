import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
  Paper,
  Grid,
  InputLabel,
  FormControl,
  Alert,
  Snackbar,
} from "@mui/material";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { create_travel_timeline, travel_admin } from "../api/API";

function MainAddRouteDetails() {
  const [route, setRoute] = useState("");
  const [dates, setDates] = useState("");
  const [sections, setSections] = useState({
    morningDetails: "",
    middayDetails: "",
    afternoonDetails: "",
    eveningDetails: "",
  });
  const [loading, setLoading] = useState(false);
  const [travelses, setTravelses] = useState([]); // 👉 ลิสต์ข้อมูลจาก API
  const token = localStorage.getItem("token");
  const hasFetched = useRef(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // "success" | "error" | "warning" | "info"

  const loadTravelses = async () => {
    try {
      const response = await axios.get(travel_admin, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("response", response?.data);

      setTravelses(response.data || []); // ตรวจสอบรูปแบบ data ด้วย (array?)
      console.log("✅ ดึงข้อมูลอำเภอสำเร็จ:", response.data);
    } catch (error) {
      console.error("❌ ดึงข้อมูลอำเภอล้มเหลว:", error);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    if (!hasFetched.current && token) {
      loadTravelses();
      hasFetched.current = true;
    }
  }, []);

  const handleChange = (field) => (event) => {
    setSections((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleReset = () => {
    setRoute("");
    setDates("");
    setSections({
      morningDetails: "",
      middayDetails: "",
      afternoonDetails: "",
      eveningDetails: "",
    });
    console.log("Form reset");
  };

  console.log("route", route);
  console.log("dates", dates);


  const handleSubmit = async () => {
    const payload = {
      route,
      dates,
      ...sections,
    };
    console.log("Submitted Data:", payload);
    setLoading(true); // 🔄 เริ่มโหลด

    try {
      const decoded = jwtDecode(token);
      console.log("Token decoded:", decoded);

      const uid = decoded?.uid || decoded?.user_id || null;

      const payload = {
        ...sections,
        uid: parseInt(uid),
        tid: route,
        title: dates
        // name, // ✅ ใช้ค่าจาก localStorage
      };

      console.log(" Payload พร้อมส่ง:", payload);

      const response = await axios.post(
        create_travel_timeline,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setSnackbarMessage("✅ ข้อมูลถูกบันทึกเรียบร้อยแล้ว!");
        setSnackbarSeverity("success");
        // เคลียร์ค่าฟอร์ม
        // setRoute("");
        setDates("");
        setSections({
          morningDetails: "",
          middayDetails: "",
          afternoonDetails: "",
          eveningDetails: "",
        });
      } else {
        setSnackbarMessage("❌ ไม่สามารถบันทึกข้อมูลได้");
        setSnackbarSeverity("error");
      }
    } catch (error) {
      console.error("❗ Error ส่งข้อมูล:", error);
      setSnackbarMessage("⚠️ เกิดข้อผิดพลาดขณะส่งข้อมูล");
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
      setLoading(false); // 🔚 หยุดโหลด
    }
  };

  return (
    <Paper
      elevation={6}
      sx={{
        p: 4,
        maxWidth: 1000,
        mx: "auto",
        mt: 4,
        background: "#e6f4ea", // เขียวอ่อนสบายตา
        color: "#2e7d32", // เขียวเข้มสำหรับตัวหนังสือ
        borderRadius: 3,
        boxShadow: "0 4px 12px rgba(46, 125, 50, 0.3)", // เงานุ่ม ๆ สีเขียว
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          mb: 4,
          textAlign: "center",
          color: "#1b5e20", // เขียวเข้มขึ้นอีกนิด
          letterSpacing: 1.5,
          textShadow: "1px 1px 3px rgba(0,0,0,0.1)", // เงานุ่ม ๆ ให้หัวข้อเด่น
        }}
      >
        เพิ่มรายละเอียดเส้นทาง
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <Select
              value={route}
              onChange={(e) => setRoute(e.target.value)}
              displayEmpty
              sx={{
                backgroundColor: "white",
                borderRadius: 2,
                "& .MuiSelect-select": { padding: "12px 14px" },
              }}
            >
              <MenuItem value="">
                <em>-- เลือกเส้นทาง --</em>
              </MenuItem>
              {travelses?.map((d) => (
                <MenuItem key={d.tid} value={d.tid}>
                  {d.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="หัวข้อ"
            placeholder="วันที่ 1, วันที่ 2,..."
            fullWidth
            value={dates}
            onChange={(e) => setDates(e.target.value)}
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

        {[
          { label: "เช้า", key: "morningDetails" },
          { label: "กลางวัน", key: "middayDetails" },
          { label: "บ่าย", key: "afternoonDetails" },
          { label: "เย็น", key: "eveningDetails" },
        ].map(({ label, key }) => (
          <Grid item xs={12} key={key}>
            <Typography
              sx={{
                mb: 1,
                fontWeight: "600",
                color: "#2e7d32",
                fontSize: "1.1rem",
              }}
            >
              {label}:
            </Typography>
            <TextField
              multiline
              rows={3}
              placeholder="รายละเอียด..."
              value={sections[key]}
              onChange={handleChange(key)}
              fullWidth
              sx={{
                backgroundColor: "white",
                borderRadius: 2,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#a5d6a7" },
                  "&:hover fieldset": { borderColor: "#66bb6a" },
                  "&.Mui-focused fieldset": { borderColor: "#388e3c" },
                },
              }}
            />
          </Grid>
        ))}

        <Grid item xs={6}>
          <Button
            variant="outlined"
            color="success"
            onClick={handleReset}
            sx={{
              borderColor: "#66bb6a",
              color: "#388e3c",
              "&:hover": {
                backgroundColor: "#a5d6a7",
                borderColor: "#388e3c",
                color: "white",
              },
            }}
          >
            รีเซตค่า
          </Button>
        </Grid>

        <Grid item xs={6} textAlign="right">
          <Button
            variant="contained"
            color="success"
            onClick={handleSubmit}
            sx={{
              backgroundColor: "#2e7d32",
              "&:hover": { backgroundColor: "#1b5e20" },
            }}
          >
            ยืนยันการเพิ่ม
          </Button>
        </Grid>
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
}

export default MainAddRouteDetails;
