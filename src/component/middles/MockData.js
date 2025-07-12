import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';


export const fuelDataTable = [
    {
        route: "Khon Kaen International Airport - Blue Lagoon ภูผาม่าน",
        distance: 117.45,
        vehicles: [
            {
                type: "มอเตอร์ไซค์ (40km./1L)",
                fuels: [
                    { name: "แก๊สโซฮอล์ 91", price: 35.25, use: 2.94, co2: 6.67 },
                    { name: "แก๊สโซฮอล์ 95", price: 35.65, use: 2.94, co2: 6.67 },
                    { name: "แก๊สโซฮอล์ E20", price: 33.54, use: 2.94, co2: 6.67 },
                ],
            },
            {
                type: "รถยนต์ (15km./1L)",
                fuels: [
                    { name: "แก๊สโซฮอล์ 91", price: 35.25, use: 7.83, co2: 17.79 },
                    { name: "แก๊สโซฮอล์ 95", price: 35.65, use: 7.83, co2: 17.79 },
                    { name: "แก๊สโซฮอล์ E20", price: 33.54, use: 7.83, co2: 17.79 },
                ],
            },
            {
                type: "รถตู้ (10km./1L)",
                fuels: [
                    { name: "ดีเซล", price: 32.94, use: 11.75, co2: 32.19 },
                    { name: "ดีเซล B7", price: 32.94, use: 11.75, co2: 32.19 },
                    { name: "ดีเซล Premium", price: 44.94, use: 11.75, co2: 32.19 },
                ],
            },
        ],
    },
    {
        route: "Blue Lagoon ภูผาม่าน - Tham Khang Khao",
        distance: 14.14,
        vehicles: [
            {
                type: "มอเตอร์ไซค์ (40km./1L)",
                fuels: [
                    { name: "แก๊สโซฮอล์ 91", price: 35.25, use: 0.35, co2: 0.80 },
                    { name: "แก๊สโซฮอล์ 95", price: 35.65, use: 0.35, co2: 0.80 },
                    { name: "แก๊สโซฮอล์ E20", price: 33.54, use: 0.35, co2: 0.80 },
                ],
            },
            {
                type: "รถยนต์ (15km./1L)",
                fuels: [
                    { name: "แก๊สโซฮอล์ 91", price: 35.25, use: 0.94, co2: 2.14 },
                    { name: "แก๊สโซฮอล์ 95", price: 35.65, use: 0.94, co2: 2.14 },
                    { name: "แก๊สโซฮอล์ E20", price: 33.54, use: 0.94, co2: 2.14 },
                ],
            },
            {
                type: "รถตู้ (10km./1L)",
                fuels: [
                    { name: "ดีเซล", price: 32.94, use: 1.41, co2: 3.87 },
                    { name: "ดีเซล Premium", price: 44.94, use: 1.41, co2: 3.87 },
                ],
            },
        ],
    },
];



export const vehicleTypes = [
    {
        type: 'motorcycle',
        label: 'มอเตอร์ไซค์',
        icon: <TwoWheelerIcon fontSize="large" />,
        efficiency: 40, // km/L
        co2PerLiter: 0.24,
    },
    {
        type: 'car',
        label: 'รถยนต์',
        icon: <DirectionsCarIcon fontSize="large" />,
        efficiency: 15, // km/L
        co2PerLiter: 0.23,
    },
    {
        type: 'van',
        label: 'รถตู้',
        icon: <AirportShuttleIcon fontSize="large" />,
        efficiency: 10, // km/L
        co2PerLiter: 0.27,
    },
];
