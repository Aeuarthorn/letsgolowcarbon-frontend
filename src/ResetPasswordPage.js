import React, { useState } from "react";
import {
    Box, Button, TextField, Paper, Typography, Link, Snackbar, Alert
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import logo from "./component/logo/icon_new.png";

function ResetPasswordPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    const handleClose = () => setSnackbar((prev) => ({ ...prev, open: false }));

    const handleReset = async () => {
        try {
            const res = await axios.post("http://localhost:8080/reset-password", { email });
            if (res.status === 200) {
                setSnackbar({ open: true, message: t("ส่งลิงก์รีเซ็ตรหัสผ่านแล้ว"), severity: "success" });
            } else {
                setSnackbar({ open: true, message: t("reset_failed"), severity: "error" });
            }
        } catch (err) {
            setSnackbar({ open: true, message: t("network_error"), severity: "error" });
        }
    };

    return (
        <Box sx={{
            background: "linear-gradient(135deg, #a8e6cf 0%, #56ab2f 100%)",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 2
        }}>
            <Paper sx={{
                p: 4, width: "100%", maxWidth: 450, borderRadius: 4, backgroundColor: "#f1f8e9"
            }}>
                <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                    <img
                        src={logo} s
                        alt="Logo"
                        style={{
                            width: '380px',
                            filter: "drop-shadow(0 0 2px #2e7d32)",
                        }} />
                </Box>

                <TextField
                    fullWidth label={t("email")} margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <Button
                    fullWidth variant="contained" sx={{
                        mt: 3, backgroundColor: "#66bb6a", "&:hover": { backgroundColor: "#4caf50" }
                    }}
                    onClick={handleReset}
                >
                    {t("reset_password")}
                </Button>

                <Link
                    component="button"
                    variant="body2"
                    sx={{ display: "block", textAlign: "center", mt: 2 }}
                    onClick={() => navigate("/login")}
                >
                    {t("back_to_login")}
                </Link>
            </Paper>

            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={snackbar.severity} sx={{ width: "100%" }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default ResetPasswordPage;
