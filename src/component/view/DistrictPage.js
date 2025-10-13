import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Mian_District from './districts/Mian_District';
import axios from 'axios';
import { Box } from '@mui/material';
import { district_guest } from '../api/API';

function DistrictPage({ screenWidth, defaultTheme }) {
    const { id } = useParams();
    const [districtData, setDistrictData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("token")


    const districtMap = {
        'mueang': 1,
        'phu_pha_man': 2,
        'ubonrat': 3,
        'phu_wiang': 4,
        'nam_phong': 5,
        'si_chomphu': 6,
        'suankwang': 7,
        'ban_phai': 8,
        'phon': 9,
    };

    useEffect(() => {
        const fetchDistrictData = async () => {
            try {
                setLoading(true);
                setError(null);
                // 🔧 ตัวอย่าง API — เปลี่ยนให้ตรงกับของคุณ
                const resDistrict = await axios.get(district_guest, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log("resDistrict.data", resDistrict.data);
                setDistrictData(resDistrict.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchDistrictData();
    }, []);

    return (
        <Mian_District
            screenWidth={screenWidth}
            defaultTheme={defaultTheme}
            id={id}
            did={districtMap[id]}
            data={districtData} // 👈 ส่งข้อมูลอำเภอที่โหลดมา
        />
        // switch (id) {
        //     case 'mueang':
        //         return <Mueang_district screenWidth={screenWidth} defaultTheme={defaultTheme} id={'mueang'} />;
        //     case 'phu_pha_man':
        //         return <Phu_Pha_Man_district screenWidth={screenWidth} defaultTheme={defaultTheme} id={'phu_pha_man'} />;
        //     case 'ubonrat':
        //         return <Ubonrat_district screenWidth={screenWidth} defaultTheme={defaultTheme} id={'ubonrat'} />;
        //     case 'phu_wiang':
        //         return <Phu_Wiang_district screenWidth={screenWidth} defaultTheme={defaultTheme} id={'phu_wiang'} />;
        //     case 'nam_phong':
        //         return <Nam_Phong_district screenWidth={screenWidth} defaultTheme={defaultTheme} id={'nam_phong'} />;
        //     case 'si_chomphu':
        //         return <Si_Chomphu_district screenWidth={screenWidth} defaultTheme={defaultTheme} id={'si_chomphu'} />;
        //     default:
        //         return <div>404: District not found</div>;
        // }
    )
}

export default DistrictPage