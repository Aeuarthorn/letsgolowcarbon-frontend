import React, { useState } from "react";
import {
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    Box,
} from "@mui/material";

function MaiAddFormOfTravel() {
    const [name, setName] = useState("");

    const handleReset = () => {
        setName("");
        console.log("Form reset.");
    };

    const handleSubmit = () => {
        if (name.trim() === "") {
            console.log("ชื่อห้ามเว้นว่าง");
            return;
        }

        console.log("ยืนยันการเพิ่ม:", name);
        // ทำการส่งข้อมูลต่อจากตรงนี้ เข้าตาราง รูปแบบ เช่น 2 วัน 1 คืน, 3 วัน 2 คืน, 1 วัน เป็นต้น
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
                        <Typography fontWeight="bold" sx={{ color: "#1b5e20"}}>ชื่อ:</Typography>
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
                            ยืนยันการเพิ่ม
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
}

export default MaiAddFormOfTravel