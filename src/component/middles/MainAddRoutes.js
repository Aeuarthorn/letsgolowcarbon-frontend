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
import { create_travel, district_admin, district_get, languages, travel_admin, travel_types_admin, upload_image_all } from "../api/API";

function MainAddRoutes() {
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");
  const [district, setDistrict] = useState([]);
  const [language, setLanguage] = useState([]);
  const [travelType, setTravelType] = useState([]);

  const [initialLoading, setInitialLoading] = useState(true);
  const [isDataReady, setIsDataReady] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // "success" | "error" | "warning" | "info"
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    language: "",
    brandImage: "",
    infographicImage: "",
    did: "",
    ttid: "",
  });
  const [errorSnackbar, setErrorSnackbar] = useState({
    open: false,
    message: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      setInitialLoading(true);
      try {
        const [resDistrict, , resLanguage, resTravelType] = await Promise.all([
          axios.get(district_admin, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(travel_admin, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(languages, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(travel_types_admin, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setDistrict(resDistrict.data);
        setLanguage(resLanguage.data);
        setTravelType(resTravelType.data);
        setIsDataReady(true);
      } catch (err) {
        setErrorSnackbar({
          open: true,
          message: "โหลดข้อมูลล้มเหลว",
        });
      } finally {
        setInitialLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
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
    setImages([]);
  };

  const handleImageUpload = (e, type) => {
    console.log("e", e);

    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newImages = files.map((file) => ({
        type,
        file,
        name: file.name,
        preview: URL.createObjectURL(file),
      }));

      const otherImages = images.filter((img) => img.type !== type);
      setImages([...otherImages, ...newImages]);
    }
  };

  const handleRemoveImage = (type, indexToRemove) => {
    // ลบเฉพาะภาพในกลุ่ม type นั้น ๆ
    const updatedImages = images?.filter((img, index) => {
      if (img.type !== type) return true; // เก็บไว้ถ้าคนละ type
      // ถ้า type เดียวกัน ให้ลบเฉพาะตัวที่ตรง index ของกลุ่มนั้น
      const sameTypeImages = images?.filter((i) => i.type === type);
      const targetImage = sameTypeImages[indexToRemove];
      return img !== targetImage;
    });

    setImages(updatedImages);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };


  const handleSubmit = async () => {
    if (!formData.name || !formData.language || !formData.did || !formData.ttid) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    if (!token || !name) {
      alert("ไม่พบ token หรือ name");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const uid = decoded?.uid || decoded?.user_id || null;

      const payload = {
        ...formData,
        uid,
        img_main: '',
        img_infographic: '',
      };

      console.log("Payload:", payload);

      // ส่ง payload (comment ไว้เพราะยังไม่ใช้งาน)
      const res = await axios.post(create_travel, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("res.data", res.data);

      if (res.status === 200 && res.data?.id) {
        // Upload image
        // const newRouteId = 1;
        setSnackbarMessage("✅ ข้อมูลถูกบันทึกเรียบร้อยแล้ว!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true); // <<== ต้องมี!
        setFormData({
          name: "",
          language: "",
          brandImage: "",
          infographicImage: "",
          ttid: "",
        });
        const newRouteId = res.data.id;
        const types = [...new Set(images.map((img) => img.type))];

        // 🌀 วนแต่ละ type แล้วอัปโหลด
        for (const type of types) {
          // เลือกรูปเฉพาะกลุ่มนั้น
          const imagesOfType = images.filter((img) => img.type === type);
          if (imagesOfType.length === 0) continue;

          const formDataUpload = new FormData();

          // เพิ่มไฟล์ทั้งหมดในกลุ่มนั้น
          imagesOfType.forEach((img) => {
            formDataUpload.append("files", img.file);
          });

          // ค่าอื่น ๆ ใส่แค่ครั้งเดียว
          formDataUpload.append("media_type", "image");
          formDataUpload.append("type", type); // ✅ ใช้ type ที่กำลังอัปโหลด
          formDataUpload.append("place_type", "route");
          formDataUpload.append("ref_id", newRouteId);
          formDataUpload.append("ref_name", "route");

          console.log("Uploading images for type:", type, imagesOfType);

          const uploadRes = await axios.post(upload_image_all, formDataUpload, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          });
          console.log("uploadRes:", uploadRes.data);

          // ✅ ตรวจ 200 หรือ 201
          if (uploadRes.status === 200 || uploadRes.status === 201) {
            console.log("✅ Upload success for type:", type);
          } else {
            console.warn("⚠️ Upload failed for type:", type);
          }
        }
        // ✅ แสดงข้อความสำเร็จครั้งเดียวหลังอัปโหลดครบทุกประเภท
        setSnackbarMessage("✅ ข้อมูลและรูปภาพถูกบันทึกเรียบร้อยแล้ว!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setImages([]);
        setFormData({
          name: "",
          language: "",
          brandImage: "",
          infographicImage: "",
          ttid: "",
        });
      } else {
        setSnackbarMessage("❌ เกิดข้อผิดพลาดในการบันทึก");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (err) {
      console.error("Error:", err);
      setSnackbarMessage("❌ เกิดข้อผิดพลาดในการบันทึก");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

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
                    {/* Banner Place (1 รูป) */}
                    <Grid item xs={12} sm={6}>
                      <Button variant="contained" component="label" color="success" fullWidth>
                        เลือกรูปแบรนเนอร์เส้นทาง
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          hidden
                          onChange={(e) => handleImageUpload(e, "banner_route")}
                        />
                      </Button>
                      <Box mt={2}>
                        {images
                          .filter((img) => img.type === "banner_route")
                          .map((img, index) => (
                            <Box key={index} sx={{ mt: 1 }}>
                              <img
                                src={img.preview}
                                alt={`preview-${index}`}
                                style={{ width: "100%", maxHeight: 150, objectFit: "cover", borderRadius: 8 }}
                              />
                              <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="body2">{img.name}</Typography>
                                <IconButton
                                  size="small"
                                  onClick={() => handleRemoveImage(img.type, index)} // ✅ ส่ง type ด้วย
                                  sx={{ color: "red" }}
                                >
                                  <Close />
                                </IconButton>
                              </Box>
                            </Box>
                          ))}
                      </Box>
                    </Grid>

                    {/* อัปโหลดรูปภาพ (type = info_route) */}
                    <Grid item xs={12} sm={6}>
                      <Button variant="contained" component="label" color="success" fullWidth>
                        เลือกรูปอินโฟกราฟฟิก
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          hidden
                          onChange={(e) => handleImageUpload(e, "info_route")}
                        />
                      </Button>

                      <Box mt={2}>
                        {images
                          .filter((img) => img.type === "info_route")
                          .map((img, index) => (
                            <Box key={index} sx={{ mt: 1 }}>
                              <img
                                src={img.preview}
                                alt={`preview-${index}`}
                                style={{ width: "100%", maxHeight: 150, objectFit: "cover", borderRadius: 8 }}
                              />
                              <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="body2">{img.name}</Typography>
                                <IconButton
                                  size="small"
                                  onClick={() => handleRemoveImage(img.type, index)} // ✅ ส่ง type ด้วย
                                  sx={{ color: "red" }}
                                >
                                  <Close />
                                </IconButton>
                              </Box>
                            </Box>
                          ))}
                      </Box>
                    </Grid>

                    {/* <Grid item xs={12} sm={6}>
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
                    </Grid> */}
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
                          disabled={initialLoading}
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
                          {travelType.length > 0 &&
                            travelType?.map((d) => (
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
          {/* <Box
            component="img"
            src="https://res.cloudinary.com/letsgolowcarbon/image/upload/v1752860348/infographic/tid_1_infographic.jpg"
            alt="Infographic"
            sx={{
              width: "100%",
              maxWidth: 400,
              borderRadius: 2,
            }}
          /> */}

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
          {/* Loading Overlay */}
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={initialLoading}
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
