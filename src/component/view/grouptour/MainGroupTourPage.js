import React, { useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    CardActions,
    Typography,
    Modal,
    List,
    ListItem,
    ListItemText,
    TextField,
    IconButton,
    Divider,
    Avatar,
    Stack,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const districts = [
    { id: 1, name: "อำเภอเมือง" },
    { id: 2, name: "อำเภอภูผาม่าน" },
    { id: 3, name: "อำเภออุบลรัตน์" },
];

const places = {
    1: ["วัดพระแก้ว", "ถนนคนเดิน", "สวนสาธารณะ"],
    2: ["น้ำตกผาเอียง", "ภูผาม่านแคมป์", "จุดชมวิวเขื่อน"],
    3: ["อ่างเก็บน้ำห้วยตึงเฒ่า", "ถ้ำผาหล่ม", "พิพิธภัณฑ์อุบลรัตน์"],
};

const membersData = {
    1: ["สมชาย", "สุนทร", "ปานใจ"],
    2: ["วิทยา", "สุดา", "อุไร"],
    3: ["ชาญชัย", "มาลี", "กิตติ"],
};

function MainGroupTourPage() {
    const [joinedGroups, setJoinedGroups] = useState({}); // { districtId: true }
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedPlace, setSelectedPlace] = useState("");
    const [chatMessages, setChatMessages] = useState({
        1: [],
        2: [],
        3: [],
    });
    const [chatInput, setChatInput] = useState("");

    const handleJoinClick = (districtId) => {
        setSelectedDistrict(districtId);
        setSelectedPlace("");
        setModalOpen(true);
    };

    const handleConfirmJoin = () => {
        setJoinedGroups((prev) => ({ ...prev, [selectedDistrict]: true }));
        setModalOpen(false);
        setChatInput("");
    };

    const handleSendMessage = () => {
        if (!chatInput.trim()) return;
        setChatMessages((prev) => ({
            ...prev,
            [selectedDistrict]: [...prev[selectedDistrict], chatInput.trim()],
        }));
        setChatInput("");
    };

    return (
        <Box sx={{ p: 3, maxWidth: 900, height: '100vh', mx: "auto" }}>
            <Typography variant="h4" gutterBottom>
                กลุ่มท่องเที่ยว
            </Typography>

            <Stack spacing={3}>
                {districts.map(({ id, name }) => (
                    <Card key={id} variant="outlined">
                        <CardContent>
                            <Typography variant="h6">{name}</Typography>

                            {joinedGroups[id] ? (
                                <>
                                    <Typography sx={{ mt: 1, fontWeight: "bold" }}>
                                        สมาชิกในกลุ่ม:
                                    </Typography>
                                    <List dense>
                                        {membersData[id].map((member, idx) => (
                                            <ListItem key={idx}>
                                                <Avatar sx={{ mr: 1 }}>{member[0]}</Avatar>
                                                <ListItemText primary={member} />
                                            </ListItem>
                                        ))}
                                    </List>

                                    <Divider sx={{ my: 2 }} />

                                    <Typography variant="subtitle1">แชทกลุ่ม</Typography>
                                    <Box
                                        sx={{
                                            border: "1px solid #ccc",
                                            borderRadius: 1,
                                            p: 1,
                                            height: 150,
                                            overflowY: "auto",
                                            mb: 1,
                                        }}
                                    >
                                        {chatMessages[id].length === 0 ? (
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{ fontStyle: "italic" }}
                                            >
                                                ยังไม่มีข้อความ
                                            </Typography>
                                        ) : (
                                            chatMessages[id].map((msg, idx) => (
                                                <Typography key={idx} variant="body2" sx={{ mb: 0.5 }}>
                                                    • {msg}
                                                </Typography>
                                            ))
                                        )}
                                    </Box>

                                    <Box sx={{ display: "flex", gap: 1 }}>
                                        <TextField
                                            size="small"
                                            variant="outlined"
                                            placeholder="พิมพ์ข้อความ..."
                                            fullWidth
                                            value={chatInput}
                                            onChange={(e) => setChatInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    handleSendMessage();
                                                }
                                            }}
                                        />
                                        <IconButton
                                            color="primary"
                                            onClick={handleSendMessage}
                                            disabled={!chatInput.trim()}
                                        >
                                            <SendIcon />
                                        </IconButton>
                                    </Box>
                                </>
                            ) : (
                                <>
                                    <Typography sx={{ mt: 1, mb: 2, fontStyle: "italic" }}>
                                        ยังไม่ได้เข้าร่วมกลุ่ม
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        onClick={() => handleJoinClick(id)}
                                    >
                                        เข้าร่วมกลุ่ม
                                    </Button>
                                </>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </Stack>

            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                aria-labelledby="select-place-modal-title"
                aria-describedby="select-place-modal-description"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 300,
                        bgcolor: "background.paper",
                        borderRadius: 1,
                        boxShadow: 24,
                        p: 3,
                    }}
                >
                    <Typography id="select-place-modal-title" variant="h6" mb={2}>
                        เลือกสถานที่ท่องเที่ยวใน {districts.find(d => d.id === selectedDistrict)?.name}
                    </Typography>
                    {places[selectedDistrict]?.map((place, idx) => (
                        <Button
                            key={idx}
                            variant={selectedPlace === place ? "contained" : "outlined"}
                            sx={{ mr: 1, mb: 1 }}
                            onClick={() => setSelectedPlace(place)}
                        >
                            {place}
                        </Button>
                    ))}

                    <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 1 }}>
                        <Button onClick={() => setModalOpen(false)}>ยกเลิก</Button>
                        <Button
                            variant="contained"
                            disabled={!selectedPlace}
                            onClick={handleConfirmJoin}
                        >
                            ยืนยัน
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
}

export default MainGroupTourPage