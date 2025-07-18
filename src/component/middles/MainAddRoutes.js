import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  IconButton,
  Divider,
  Backdrop,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import { UploadFile, Close } from "@mui/icons-material";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function MainAddRoutes() {
  const [formData, setFormData] = useState({
    name: "",
    language: "",
    brandImage: "",
    infographicImage: "",
    did: "",
    ttid: "",
  });
  const [images, setImages] = useState({
    brandImage: null,
    infographicImage: null,
  });
  const [district, setDistrict] = useState([]);
  const [travelRoute, setTravelRoute] = useState([]); // รูปแบบเส้นทาง
  const [language, setLanguage] = useState([]); // ภาษ
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorSnackbar, setErrorSnackbar] = useState({
    open: false,
    message: "",
  });
  const [isDataReady, setIsDataReady] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const [resDistrict, resTravel, resLanguage] = await Promise.all([
          axios.get("http://localhost:8080/district", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get("http://localhost:8080/travel", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get("http://localhost:8080/language", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);
        console.log("resDistrict", resDistrict.data);
        console.log("resTravel", resTravel.data);

        setDistrict(resDistrict.data);
        setTravelRoute(resTravel.data);
        setLanguage(resLanguage.data);
        setIsDataReady(true);
      } catch (err) {
        setErrorSnackbar({
          open: true,
          message: "โหลดข้อมูลล้มเหลว",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  console.log("district", district);
  console.log("travelRoute", travelRoute);
  console.log("language", language);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRemoveFile = (fieldName) => {
    setImages((prev) => ({
      ...prev,
      [fieldName]: null,
    }));
  };

  const handleReset = () => {
    setFormData({
      name: "",
      language: "",
      brandImage: null,
      infographicImage: null,
      district: "",
      routeType: "",
    });
  };

  function UploadBox({ label, name, onChange, file, onRemove }) {
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
      if (file && file.type && file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
      } else {
        setPreviewUrl(null);
      }
    }, [file]);

    return (
      <Box
        component="label"
        sx={{
          border: "2px dashed green",
          borderRadius: 2,
          textAlign: "center",
          p: 3,
          cursor: "pointer",
          color: "green",
          backgroundColor: "#f1fdf3",
          "&:hover": {
            backgroundColor: "#e0f7ea",
          },
          width: "250px",
          position: "relative",
        }}
      >
        <UploadFile sx={{ fontSize: 40, mb: 1 }} />
        <Typography variant="body1">{label}</Typography>
        <Typography variant="caption" color="text.secondary">
          คลิกเพื่อเลือกไฟล์
        </Typography>

        <input
          hidden
          type="file"
          accept="image/*"
          name={name}
          onChange={onChange}
        />

        {previewUrl && (
          <Box mt={2} sx={{ position: "relative" }}>
            <img
              src={previewUrl}
              alt="preview"
              style={{
                width: "100%",
                maxHeight: "200px",
                borderRadius: "8px",
                objectFit: "cover",
              }}
            />
            {/* ปุ่มลบรูป */}
            <IconButton
              aria-label="delete"
              size="small"
              onClick={(e) => {
                e.stopPropagation(); // ป้องกันให้คลิกไม่เปิด file dialog
                onRemove();
              }}
              sx={{
                position: "absolute",
                top: 4,
                right: 4,
                backgroundColor: "rgba(255,255,255,0.7)",
                "&:hover": { backgroundColor: "rgba(255,255,255,1)" },
              }}
            >
              <Close fontSize="small" />
            </IconButton>
          </Box>
        )}

        {!previewUrl && file && (
          <Typography mt={2} fontSize={14}>
            📁 {file.name}
            <IconButton
              aria-label="delete"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              sx={{ ml: 1, color: "red" }}
            >
              <Close fontSize="small" />
            </IconButton>
          </Typography>
        )}
      </Box>
    );
  }

  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.language ||
      !formData.did ||
      !formData.ttid
    ) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    if (!token || !name) {
      alert("ไม่พบ token หรือ name");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      console.log("Token decoded:", decoded);

      const uid = decoded?.uid || decoded?.user_id || null;

      const payload = {
        ...formData,
        uid,
        // name, // ✅ ใช้ค่าจาก localStorage
      };

      console.log(" Payload พร้อมส่ง:", payload);

      const response = await axios.post(
        "http://localhost:8080/create_travel",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setOpenSnackbar(true);
      } else {
        alert("เกิดข้อผิดพลาด: " + response.statusText);
      }
    } catch (err) {
      console.error("❌ Invalid token:", err);
      alert("Token ไม่ถูกต้อง");
    }
  };

  // upload IMAGE
  // เก็บไฟล์จริงไว้ใน state
  const handleFileInputChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setImages((prev) => ({
        ...prev,
        [field]: file,
      }));
    }
  };
  // ส่งไฟล์ด้วย FormData
  const handleUpload = async () => {
    const formData = new FormData();
    if (images.brandImage) {
      formData.append("brandImage", images.brandImage);
    }
    if (images.infographicImage) {
      formData.append("infographicImage", images.infographicImage);
    }
    formData.append("tid", 1);

    try {
      const res = await axios.post(
        "http://localhost:8080/upload_image",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Uploaded URLs:", res.data.data);
    } catch (error) {
      console.error("Upload error:", error.response?.data || error.message);
    }
  };

  const imageUrl =
    "https://res.cloudinary.com/letgolowcarbon/image/upload/q_auto/f_auto/tid_1_infographic.jpg";

  return (
    <Box
      sx={{
        p: 4,
        // backgroundColor: "#f0fdf4",
        minHeight: "100vh",
      }}
    >
      {!isDataReady ? (
        <Box textAlign="center" mt={5}>
          <CircularProgress />
          <Typography mt={2}>กำลังโหลดข้อมูล...</Typography>
        </Box>
      ) : (
        <>
          <Card
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
            <CardContent>
              <Typography
                variant="h5"
                fontWeight="bold"
                color="green"
                gutterBottom
              >
                🛣️ เพิ่มเส้นทาง (Add Route)
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="ชื่อเส้นทาง"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                    sx={{
                      bgcolor: "white",
                      borderRadius: 1,
                    }}
                  />
                </Grid>
                {/* รอเรียกจากฐานข้อมูล */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>ใช้สำหรับภาษา</InputLabel>
                    <Select
                      name="language"
                      value={formData.language}
                      onChange={handleChange}
                      label="ใช้สำหรับภาษา"
                      sx={{
                        bgcolor: "white",
                        borderRadius: 1,
                      }}
                    >
                      <MenuItem value="">
                        <em>-- เลือกภาษา --</em>
                      </MenuItem>
                      {language?.length > 0 &&
                        language?.map((d) => (
                          <MenuItem key={d.lid} value={d.lid}>
                            {d.local}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* รูปภาพแบรนด์ & อินโฟกราฟฟิก (แถวเดียว) */}
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box
                        display="flex"
                        flexDirection={{ xs: "column" }}
                        justifyContent="center"
                        alignItems="center"
                        height="100%"
                      >
                        (รูปภาพ 1 รูป ควรเป็นรูปสี่เหลี่ยมด้านเท่า)
                        <UploadBox
                          label="อัปโหลดรูปภาพแบรนด์"
                          name="brandImage"
                          file={images.brandImage}
                          onChange={(e) =>
                            handleFileInputChange(e, "brandImage")
                          }
                          onRemove={() => handleRemoveFile("brandImage")}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        height="100%"
                      >
                        <UploadBox
                          label="อัปโหลดอินโฟกราฟฟิก"
                          name="infographicImage"
                          file={images.infographicImage}
                          onChange={(e) =>
                            handleFileInputChange(e, "infographicImage")
                          }
                          onRemove={() => handleRemoveFile("infographicImage")}
                          // onChange={(file) =>
                          //   handleChangeUpload("infographicImage", file)
                          // } // <- ส่งชื่อและไฟล์
                          // onRemove={() => handleRemoveFile("infographicImage")}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={handleUpload}
                        sx={{
                          backgroundColor: "green",
                          color: "#fff",
                          "&:hover": {
                            backgroundColor: "#2e7d32",
                          },
                        }}
                      >
                        image
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
                {/* รอดึงข้อมูลตาม อำเภอในฐานข้อมูล */}
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>อำเภอ</InputLabel>
                        <Select
                          name="did"
                          value={formData.did}
                          onChange={handleChange}
                          label="อำเภอ"
                          disabled={loading}
                          sx={{
                            bgcolor: "white",
                            borderRadius: 1,
                          }}
                        >
                          <MenuItem value="">
                            <em>-- เลือกอำเภอ --</em>
                          </MenuItem>
                          {district?.length > 0 &&
                            district?.map((d) => (
                              <MenuItem key={d.did} value={d.did}>
                                {d.name}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>รูปแบบเส้นทาง</InputLabel>
                        <Select
                          name="ttid"
                          value={formData.ttid}
                          onChange={handleChange}
                          label="รูปแบบเส้นทาง"
                          sx={{
                            bgcolor: "white",
                            borderRadius: 1,
                          }}
                        >
                          <MenuItem value="">
                            <em>-- เลือกเส้นทาง --</em>
                          </MenuItem>
                          {travelRoute.length > 0 &&
                            travelRoute?.map((d) => (
                              <MenuItem key={d.ttid} value={d.ttid}>
                                {d.name}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>

                {/* เส้นคั่น */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} /> {/* เพิ่ม margin Y = 3 */}
                </Grid>
                {/* ปุ่ม รีเซต + บันทึก (แถวเดียว) */}
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={handleReset}
                        sx={{
                          borderColor: "gray",
                          color: "gray",
                          "&:hover": { backgroundColor: "#e8f5e9" },
                        }}
                      >
                        รีเซต
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={handleSubmit}
                        sx={{
                          backgroundColor: "green",
                          color: "#fff",
                          "&:hover": {
                            backgroundColor: "#2e7d32",
                          },
                        }}
                      >
                        บันทึกข้อมูล
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* SHOW IMAGE */}
          <Box
            component="img"
            src="https://res.cloudinary.com/letsgolowcarbon/image/upload/v1752860348/infographic/tid_1_infographic.jpg"
            alt="Infographic"
            sx={{
              width: "100%",
              maxWidth: 400,
              borderRadius: 2,
            }}
          />

          {/* // JSX ส่วนแสดง error Snackbar */}
          <Snackbar
            open={errorSnackbar.open}
            autoHideDuration={3000}
            onClose={() => setErrorSnackbar({ open: false, message: "" })}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              severity="error"
              variant="filled"
              sx={{ fontWeight: "bold" }}
            >
              {errorSnackbar.message}
            </Alert>
          </Snackbar>
          {/* Snackbar Success */}
          <Snackbar
            open={openSnackbar}
            autoHideDuration={1500}
            onClose={() => setOpenSnackbar(false)}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Alert
              onClose={() => setOpenSnackbar(false)}
              severity="success"
              variant="filled"
              sx={{
                width: "100%",
                backgroundColor: "#c8e6c9", // ✅ เขียวจาง (Green[100])
                color: "#2e7d32", // ✅ สีข้อความเขียวเข้ม
                fontWeight: "bold",
              }}
            >
              บันทึกสำเร็จ
            </Alert>
          </Snackbar>
          {/* Loading Overlay */}
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          {/* ฟอร์มหลักของคุณ */}
        </>
      )}
    </Box>
  );
}

export default MainAddRoutes;
