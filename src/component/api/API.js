
const API_BASE = 'https://letsgolowcarbon-backend-50862541475.asia-southeast1.run.app';
// const API_BASE = 'http://localhost:8080';

// ------------------------ สำหรับ guest --------------------------- //
// POST
export const register = `${API_BASE}/register` // POST
export const login = `${API_BASE}/login` // POST
export const reset_password = `${API_BASE}/reset-password` // POST
export const media_upload = `${API_BASE}/api/v1/media/upload` // POST

//GET 
export const district_guest = `${API_BASE}/district_guest` // GET
export const travel_guest = `${API_BASE}/travel_guest` // POST
export const travel_types_guest = `${API_BASE}/travel_types_guest`; // GET

export const vehicle_with_routes_guest = `${API_BASE}/vehicle_with_routes_guest` // POST
export const travel_route_guest = `${API_BASE}/travel_route_guest` // POST
export const travel_route_details_guest = `${API_BASE}/travel_route_details_guest` // POST

export const get_places_tourist_attraction_details_guest = `${API_BASE}/get_places_tourist_attraction_details_guest` // POST
export const get_places_tourist_attraction_guest = `${API_BASE}/get_places_tourist_attraction_guest` // POST


// add group trip
export const add_trip_group = `${API_BASE}/add_trip_group` // POST
export const get_trip_group_all = `${API_BASE}/get_trip_group_all` // POST
export const close_trip_group = `${API_BASE}/close_trip_group` // POST

// upload image
export const upload_qrcode = `${API_BASE}/upload_qrcode` // POST


// ------------------------ สำหรับ guest --------------------------- //

// ------------------------ สำหรับ admin ------------------------ //
// add Data for Admin
export const create_district_admin = `${API_BASE}/admin/create_district` // GET
export const create_travel_types_admin = `${API_BASE}/admin/create_travel_types` // POST
export const create_travel_admin = `${API_BASE}/admin/create_travel` // POST
export const district_admin = `${API_BASE}/admin/district` // GET
export const travel_types_admin = `${API_BASE}/admin/travel_types` // GET
export const travel_admin = `${API_BASE}/admin/travel` // GET
export const get_dashboard_admin = `${API_BASE}/admin/get_dashboard` // GET

export const languages = `${API_BASE}/admin/language` // GET
export const create_travel_route = `${API_BASE}/admin/create_travel_route` // POST
export const travel_route = `${API_BASE}/admin/travel_route` // POST
export const create_places = `${API_BASE}/admin/create_places` // POST
export const create_travel_timeline = `${API_BASE}/admin/create_travel_timeline` // POST
export const create_language = `${API_BASE}/admin/create_language` // POST
export const create_travel = `${API_BASE}/admin/create_travel` // POST
export const create_route_vehicles = `${API_BASE}/admin/create_route_vehicles` // POST

export const get_places_tourist_attraction = `${API_BASE}/admin/get_places_tourist_attraction` // POST
export const get_places_tourist_attraction_details = `${API_BASE}/admin/get_places_tourist_attraction_details` // POST

export const map_search = `${API_BASE}/admin/map_search` // GET

export const update_img_route_banner = `${API_BASE}/admin/update_img_route_banner` // POST 

export const fuelsed = `${API_BASE}/admin/fuels` // GET
export const vehicle_with_fuels = `${API_BASE}/admin/vehicle_with_fuels` // GET
export const vehicle_with_routes = `${API_BASE}/admin/vehicle_with_routes` // GET
export const create_fuels = `${API_BASE}/admin/create_fuels` // POST
export const edit_fuels = `${API_BASE}/admin/edit_fuels` // PUT
export const delete_fuels = `${API_BASE}/admin/delete_fuels` // LEDETE




// upload image and VDO
export const upload_image_admin = `${API_BASE}/admin/media/upload_image_admin` // POST
export const upload_image_banner_admin = `${API_BASE}/admin/media/upload_image_banner_admin` // POST
export const upload_image_route_admin = `${API_BASE}/admin/media/upload_image_route_admin` // POST


// ------------------------ สำหรับ admin ------------------------ //

export const get_show_image = `https://storage.googleapis.com/letsgolowcarbons` //GET
export const upload_image_all = `${API_BASE}/admin/media/upload` //POST


