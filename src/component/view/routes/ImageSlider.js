import React, { useState } from "react";
import { Grid, Card, CardMedia, Button, Box, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { get_show_image } from "../../api/API";

const ImageSlider = ({ images, BASE_URL }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!images || images.length === 0) return null;

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
        <Grid item xs={12}>
            <Card sx={{ mb: 2, position: "relative" }}>
                <CardMedia
                    component="img"
                    // height="300"
                    // image={`${BASE_URL}/${images[currentIndex].path}`}
                    image={`${get_show_image}/${images[currentIndex].path}`}
                    alt={`ภาพที่ ${currentIndex + 1}`}
                />

                {/* ปุ่มย้อนกลับ (ซ้าย) */}
                <IconButton
                    onClick={handlePrev}
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: 8,
                        transform: "translateY(-50%)",
                        backgroundColor: "rgba(0,0,0,0.4)",
                        color: "white",
                        "&:hover": { backgroundColor: "rgba(0,0,0,0.6)" },
                    }}
                    aria-label="ก่อนหน้า"
                >
                    <ArrowBackIosNewIcon />
                </IconButton>

                {/* ปุ่มถัดไป (ขวา) */}
                <IconButton
                    onClick={handleNext}
                    sx={{
                        position: "absolute",
                        top: "50%",
                        right: 8,
                        transform: "translateY(-50%)",
                        backgroundColor: "rgba(0,0,0,0.4)",
                        color: "white",
                        "&:hover": { backgroundColor: "rgba(0,0,0,0.6)" },
                    }}
                    aria-label="ถัดไป"
                >
                    <ArrowForwardIosIcon />
                </IconButton>
            </Card>
        </Grid>
    );
};

export default ImageSlider;
