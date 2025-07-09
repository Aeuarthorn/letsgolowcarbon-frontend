import React from 'react';
import { useParams } from 'react-router-dom';
import Mueang_district from './districts/Mueang_district';
import Phu_Pha_Man_district from './districts/Phu_Pha_Man_district';
import Ubonrat_district from './districts/Ubonrat_district';
import Nam_Phong_district from './districts/Nam_Phong_district';
import Si_Chomphu_district from './districts/Si_Chomphu_district';
import Phu_Wiang_district from './districts/Phu_Wiang_district';

function DistrictPage({ screenWidth, defaultTheme }) {
    const { id } = useParams();

    switch (id) {
        case 'mueang':
            return <Mueang_district screenWidth={screenWidth} defaultTheme={defaultTheme} id={'mueang'} />;
        case 'phu_pha_man':
            return <Phu_Pha_Man_district screenWidth={screenWidth} defaultTheme={defaultTheme} id={'phu_pha_man'} />;
        case 'ubonrat':
            return <Ubonrat_district screenWidth={screenWidth} defaultTheme={defaultTheme} id={'ubonrat'} />;
        case 'phu_wiang':
            return <Phu_Wiang_district screenWidth={screenWidth} defaultTheme={defaultTheme} id={'phu_wiang'} />;
        case 'nam_phong':
            return <Nam_Phong_district screenWidth={screenWidth} defaultTheme={defaultTheme} id={'nam_phong'} />;
        case 'si_chomphu':
            return <Si_Chomphu_district screenWidth={screenWidth} defaultTheme={defaultTheme} id={'si_chomphu'} />;
        default:
            return <div>404: District not found</div>;
    }
}

export default DistrictPage