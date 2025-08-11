import { Box, Card, Grid } from "@mui/material";

const MainVDO = (did) => {
    console.log("did", did);

    const vdos = {
        1: [
            { title: 'เส้นทาง 1', videoSrc: '/vdo/เส้นทางที่1อำเภอเมือง.mp4' },
            { title: 'เส้นทาง 2', videoSrc: '/vdo/เส้นทางที่2อำเภอเมือง_.mp4' },
            { title: 'เส้นทาง 3', videoSrc: '/vdo/เส้นทางที่3อำเภอเมือง_.mp4' },
        ],
        2: [
            { title: 'เส้นทางที่ 1 ภูผาม่าน', videoSrc: '/vdo/ภูผาม่าน.mp4' },
        ],
        3: [
            { title: 'เส้นทางที่ 1 อุบลรัตน์', videoSrc: '/vdo/อุบลรัตน์.mp4' },
        ],
        4: [
            { title: 'เส้นทางที่ 1 ภูเวียง', videoSrc: '/vdo/ภูเวียง.mp4' },
        ],
        5: [
            { title: 'เส้นทางที่ 1 น้ำพอง', videoSrc: '/vdo/น้ำพอง.mp4' },
        ],
        6: [
            { title: 'เส้นทางที่ 1 สีชมพู', videoSrc: '/vdo/สีชมพู.mp4' },
        ],
    };
    return vdos[did] || [];
};

export default MainVDO;
