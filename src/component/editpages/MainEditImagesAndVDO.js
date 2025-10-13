import React, { useState } from 'react';
import {
    Button,
    Box,
    Typography,
    Paper,
    Stack,
    styled,
    LinearProgress,
    IconButton,
    Grid,
    Select,
    InputLabel,
    FormControl,
    MenuItem
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import VideocamIcon from '@mui/icons-material/Videocam'; // ใช้ไอคอนสำหรับวิดีโอ

// สร้าง input component ที่ซ่อนอยู่
const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});
// ข้อมูลอำเภอจำลอง
const districts = [
    { value: '1001', label: 'เมือง' },
    { value: '1002', label: 'บางใหญ่' },
    { value: '1003', label: 'สามพราน' },
    { value: '1004', label: 'ลำลูกกา' },
    { value: '1005', label: 'หาดใหญ่' },
];

function MainEditImagesAndVDO() {
    // image
    const [imageFile, setImageFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [selectedDistrictImg, setSelectedDistrictImg] = useState(''); // State เลือกอำเภอสำหรับรูปภาพ

    // vdo
    const [videoFile, setVideoFile] = useState(null);
    const [fileNamevdo, setFileNamevdo] = useState('');
    const [uploadingvdo, setUploadingvdo] = useState(false);
    const [progressvdo, setProgressvdo] = useState(0);
    const [selectedDistrictVdo, setSelectedDistrictVdo] = useState(''); // State เลือกอำเภอสำหรับวิดีโอ


    // ----------------- IMG ------------------ //
    const handleFileChangeImg = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageFile(file);
            setFileName(file.name);
            // รีเซ็ตสถานะการอัปโหลด
            setProgress(0);
            setUploading(false);
        }
    };

    const handleUploadImg = () => {
        if (!imageFile) return;

        setUploading(true);
        // จำลองการอัปโหลดไฟล์
        const interval = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress === 100) {
                    clearInterval(interval);
                    setUploading(false);
                    return 100;
                }
                const diff = Math.random() * 15;
                return Math.min(oldProgress + diff, 100);
            });
        }, 500);
    };

    const handleRemoveImg = () => {
        setImageFile(null);
        setFileName('');
        setProgress(0);
        setUploading(false);
    };
    // Handler สำหรับ Image
    const handleDistrictChangeImg = (event) => {
        setSelectedDistrictImg(event.target.value);
    };


    // ----------------- VDO ------------------ //
    const handleFileChangeVdo = (event) => {
        const file = event.target.files[0];
        if (file) {
            setVideoFile(file);
            setFileName(file.name);
            setProgress(0);
            setUploading(false);
        }
    };

    const handleUploadVdo = () => {
        if (!videoFile) return;

        setUploading(true);
        // จำลองการอัปโหลดไฟล์วิดีโอ
        const interval = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress === 100) {
                    clearInterval(interval);
                    setUploading(false);
                    return 100;
                }
                const diff = Math.random() * 10; // อาจจะให้ progress ช้ากว่ารูปภาพเล็กน้อย
                return Math.min(oldProgress + diff, 100);
            });
        }, 800);
    };

    const handleRemoveVdo = () => {
        setVideoFile(null);
        setFileName('');
        setProgress(0);
        setUploading(false);
    };
    // Handler สำหรับ Video
    const handleDistrictChangeVdo = (event) => {
        setSelectedDistrictVdo(event.target.value);
    };


    return (
        <Box
            sx={{
                p: { xs: 2, sm: 4, md: 6 }, // เพิ่ม padding ด้านข้างสำหรับจอใหญ่
                // backgroundColor: 'background.default', // ใช้สีพื้นหลังจาก Theme
                minHeight: "100vh",
            }}
        >
            <Grid container spacing={4} justifyContent="center" alignItems="flex-start">

                {/* -------------------- ส่วนแก้ไขรูปภาพ -------------------- */}
                <Grid item xs={12} md={6}> {/* xs=12 เต็มจอ, md=6 ครึ่งจอ */}
                    {/* แก้ไขรูปภาพ */}
                    <Paper
                        elevation={3}
                        sx={{
                            p: 4,
                            maxWidth: 500,
                            width: '100%',
                            borderRadius: 2
                        }}
                    >
                        <Typography
                            variant="h5"
                            component="h1"
                            gutterBottom
                            align="center"
                            color="primary" // ใช้สีเขียวจาก theme
                            sx={{ fontWeight: 'bold' }}
                        >
                            แก้ไขรูปภาพแบรนเนอร์อำเภอ 📸
                        </Typography>

                        <Stack spacing={2} mt={3}>
                            {/* Select เลือกอำเภอสำหรับรูปภาพ */}
                            <FormControl fullWidth disabled={uploading}>
                                <InputLabel id="district-select-img-label">เลือกอำเภอ</InputLabel>
                                <Select
                                    labelId="district-select-img-label"
                                    id="district-select-img"
                                    value={selectedDistrictImg}
                                    label="เลือกอำเภอ"
                                    onChange={handleDistrictChangeImg}
                                    color="primary" // ใช้สีเขียวจาก theme
                                >
                                    {districts.map((district) => (
                                        <MenuItem key={district.value} value={district.value}>
                                            {district.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {/* ปุ่มอัปโหลดไฟล์ */}
                            <Button
                                component="label"
                                role={undefined}
                                variant="contained"
                                tabIndex={-1}
                                startIcon={<PhotoCamera />}
                                color="secondary" // ใช้สีน้ำเงิน หรือเปลี่ยนเป็นสีเขียวอ่อนๆ ก็ได้
                                sx={{
                                    height: 56,
                                    backgroundColor: '#81C784', // สีเขียวอ่อนสำหรับปุ่มอัปโหลด
                                    '&:hover': { backgroundColor: '#66BB6A' }
                                }}
                                disabled={uploading}
                            >
                                อัปโหลดรูปภาพใหม่
                                <VisuallyHiddenInput type="file" accept="image/*" onChange={handleFileChangeImg} />
                            </Button>

                            {/* แสดงชื่อไฟล์และปุ่มลบ */}
                            {fileName && (
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                    <Typography variant="body1" sx={{ flexGrow: 1, color: 'text.secondary' }}>
                                        ไฟล์ที่เลือก: **{fileName}**
                                    </Typography>
                                    <IconButton
                                        aria-label="delete"
                                        onClick={handleRemoveImg}
                                        disabled={uploading}
                                        color="error"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            )}

                            {/* Progress Bar ขณะอัปโหลด */}
                            {uploading && (
                                <Box sx={{ width: '100%', mt: 2 }}>
                                    <LinearProgress
                                        variant="determinate"
                                        value={progress}
                                        color="primary" // ใช้สีเขียวจาก theme
                                    />
                                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                                        กำลังอัปโหลด... {Math.round(progress)}%
                                    </Typography>
                                </Box>
                            )}

                            <Box sx={{ pt: 2, display: 'flex', gap: 2, justifyContent: 'center' }}>
                                {/* ปุ่มยกเลิก - ใช้สีรองหรือสีเทา */}
                                <Button
                                    variant="outlined"
                                    onClick={handleRemoveImg}
                                    sx={{ width: '50%' }}
                                    disabled={uploading}
                                >
                                    ยกเลิก
                                </Button>
                                {/* ปุ่มบันทึก - ใช้สีหลัก (เขียว) */}
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleUploadImg}
                                    sx={{ width: '50%' }}
                                    disabled={!imageFile || uploading}
                                >
                                    {uploading ? 'กำลังบันทึก...' : 'บันทึก'}
                                </Button>
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>
                {/* <Grid item xs={12} md={6}> 
                    <Paper
                        elevation={3}
                        sx={{
                            p: 4,
                            maxWidth: 500,
                            width: '100%',
                            borderRadius: 2
                        }}
                    >
                        <Typography
                            variant="h5"
                            component="h1"
                            gutterBottom
                            align="center"
                            color="primary"
                            sx={{ fontWeight: 'bold' }}
                        >
                            แก้ไขวิดีโอ 🎥
                        </Typography>

                        <Stack spacing={2} mt={3}>
                            <FormControl fullWidth disabled={uploadingvdo}>
                                <InputLabel id="district-select-vdo-label">เลือกอำเภอ</InputLabel>
                                <Select
                                    labelId="district-select-vdo-label"
                                    id="district-select-vdo"
                                    value={selectedDistrictVdo}
                                    label="เลือกอำเภอ"
                                    onChange={handleDistrictChangeVdo}
                                    color="primary"
                                >
                                    {districts.map((district) => (
                                        <MenuItem key={district.value} value={district.value}>
                                            {district.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Button
                                component="label"
                                role={undefined}
                                variant="contained"
                                tabIndex={-1}
                                startIcon={<VideocamIcon />}
                                color="secondary"
                                sx={{
                                    height: 56,
                                    backgroundColor: '#81C784',
                                    '&:hover': { backgroundColor: '#66BB6A' }
                                }}
                                disabled={uploadingvdo}
                            >
                                อัปโหลดไฟล์วิดีโอ
                                <VisuallyHiddenInput
                                    type="file"
                                    accept="video/*" // กำหนดให้รับเฉพาะไฟล์วิดีโอ
                                    onChange={handleFileChangeVdo}
                                />
                            </Button>

                            {fileNamevdo && (
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                    <Typography variant="body1" sx={{ flexGrow: 1, color: 'text.secondary' }}>
                                        ไฟล์ที่เลือก: **{fileNamevdo}**
                                    </Typography>
                                    <IconButton
                                        aria-label="delete"
                                        onClick={handleRemoveVdo}
                                        disabled={uploadingvdo}
                                        color="error"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            )}

                            {uploadingvdo && (
                                <Box sx={{ width: '100%', mt: 2 }}>
                                    <LinearProgress
                                        variant="determinate"
                                        value={progressvdo}
                                        color="primary"
                                    />
                                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                                        กำลังอัปโหลด... {Math.round(progressvdo)}%
                                    </Typography>
                                </Box>
                            )}

                            <Box sx={{ pt: 2, display: 'flex', gap: 2, justifyContent: 'center' }}>
                                <Button
                                    variant="outlined"
                                    onClick={handleRemoveVdo}
                                    sx={{ width: '50%' }}
                                    disabled={uploadingvdo}
                                >
                                    ยกเลิก
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleUploadVdo}
                                    sx={{ width: '50%' }}
                                    disabled={!videoFile || uploadingvdo}
                                >
                                    {uploadingvdo ? 'กำลังบันทึก...' : 'บันทึก'}
                                </Button>
                            </Box>
                        </Stack>
                    </Paper>

                </Grid> */}
            </Grid>
        </Box>
    )
}

export default MainEditImagesAndVDO