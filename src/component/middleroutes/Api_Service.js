const DEV = process.env.DEV

console.log("DEV", DEV);


export const create_district = `${DEV}/create_district`;                    // POST สร้างจังหวัด
export const create_travel_types = `${DEV}/create_travel_types`;            // POST สร้างประเภทการท่องเที่ยว
export const create_travel = `${DEV}/create_travel`;                        // POST สร้างเส้นทาง
export const create_places = `${DEV}/create_places`;                        // POST สร้างสถานที่ สภานที่ท่องเที่ยว, ที่พัก , ร้านอาหาร , ร้านของที่ระลึก , ผลิตภัณฑ์ชุมชน
export const create_travel_route = `${DEV}/create_travel_route`;            // POST สร้างเส้นทางใน google map
export const create_travel_timeline = `${DEV}/create_travel_timeline`;      // POST สร้างข้อมูลของแต่ละเส้นทาง (route)
export const create_language = `${DEV}/create_language`;                    // POST สร้างภาษา
export const create_route_vehicles = `${DEV}/create_route_vehicles`;        // POST สร้างเส้นทางสำหรับตารางน้ำมัน


export const map_search = `${DEV}/map_search`;                  // GET ค้นหาพื้นที่ google Map
export const district = `${DEV}/district`;                      // GET ดึงข้อมูลจังหวัด
export const travel_types = `${DEV}/map_search`;                // GET ดึงข้อมูลประเภทการท่องเที่ยว
export const travel = `${DEV}/travel`;                          // GET ดึงข้อมูลเส้นทาง
export const travel_route = `${DEV}/travel_route`;              // GET ดึงข้อมูลเส้นทางสถานที่
export const language = `${DEV}/language`;                      // GET ดึงข้อมูลภาษา
export const get_dashboard = `${DEV}/get_dashboard`;            // GET ดึงข้อมูลทั้งหมดทุกตาราง 	// Dash Board

