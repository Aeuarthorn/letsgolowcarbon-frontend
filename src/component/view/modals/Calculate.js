import * as React from 'react';
import {
    Box,
    Button,
    Typography,
    Modal,
    IconButton,
    Stepper,
    Step,
    StepLabel,
    Container,
    useMediaQuery,
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
import { TourTypeForm } from './calculates/TourTypeForm';
import { ActivityForm } from './calculates/ActivityForm';
import { GHGForm } from './calculates/GHGForm';
import { SummaryForm } from './calculates/SummaryForm';

const steps = ['การท่องเที่ยว', 'ประเภทกิจกรรม', 'ค่าการปล่อย GHG', 'สรุปการปล่อย'];

function Calculate({ open, close }) {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        const canProceed = currentStepCallback?.(); // เรียก callback ของหน้า current
        if (canProceed) {
            if (activeStep === steps.length - 1) {
                // ลบ localStorage ที่ต้องการ
                localStorage.removeItem('activity');
                localStorage.removeItem('ghg_totals');
                handleClose(); // <-- ปิด modal เมื่อถึงขั้นสุดท้าย
            } else {
                setActiveStep((prev) => prev + 1);
            }
        }
    };
    const handleBack = () => setActiveStep((prev) => prev - 1);

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <TourTypeForm
                        registerStepCallback={(cb) => setCurrentStepCallback(() => cb)}
                    />
                );
            case 1:
                return (
                    <ActivityForm
                        registerStepCallback={(cb) => setCurrentStepCallback(() => cb)}
                    />
                );
            case 2:
                return (
                    <GHGForm
                        registerStepCallback={(cb) => setCurrentStepCallback(() => cb)}
                    />
                );
            case 3:
                return (
                    <SummaryForm
                        registerStepCallback={(cb) => setCurrentStepCallback(() => cb)}
                    />
                );
            default:
                return null;
        }
    };

    // ตัวแปรสำหรับเก็บ callback ของ Step
    const [currentStepCallback, setCurrentStepCallback] = React.useState(() => () => true);


    const handleClose = () => {
        close(false)
    };
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: { xs: '95vw', sm: '90vw', md: 800 },
                    height: { xs: '95vh', sm: '90vh' },
                    bgcolor: 'background.paper',
                    borderRadius: 3,
                    boxShadow: 24,
                    display: 'flex',
                    flexDirection: 'column',
                    p: { xs: 2, sm: 4 },
                }}
            >
                {/* ปุ่มปิด */}
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        color: 'red',
                        position: 'absolute',
                        right: 8,
                        top: 8,
                    }}
                >
                    <CloseIcon />
                </IconButton>

                {/* ส่วนหลัก */}
                <Container
                    maxWidth={false}
                    disableGutters
                    sx={{
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        pt: 5,
                    }}
                >
                    <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 2 }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    {/* Scrollable content */}
                    <Box
                        sx={{
                            flexGrow: 1,
                            overflowY: 'auto',
                            px: 1,
                            pb: 2,
                        }}
                    >
                        {renderStepContent(activeStep)}
                    </Box>

                    {/* ปุ่ม */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            mt: 2,
                            flexShrink: 0,
                        }}
                    >
                        <Button disabled={activeStep === 0} onClick={handleBack} variant="contained" color="primary">
                            ย้อนกลับ
                        </Button>
                        <Button onClick={handleNext} variant="contained" color="primary">
                            {activeStep === steps.length - 1 ? 'เสร็จสิ้น' : 'ต่อไป'}
                        </Button>
                    </Box>
                </Container>
            </Box>
        </Modal>
    )
}

export default Calculate