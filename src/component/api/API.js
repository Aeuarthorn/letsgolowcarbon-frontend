
// DEV 
// const letsgolowcarbons = process.env.DEV;
// PRODUCTION
const letsgolowcarbons = process.env.PRODUCTION;

// ------------------------ สำหรับ guest --------------------------- //
// POST
export const register = `${letsgolowcarbons}/register` // POST
export const login = `${letsgolowcarbons}/login` // POST
export const reset_password = `${letsgolowcarbons}/reset-password` // POST
export const media_upload = `${letsgolowcarbons}/api/v1/media/upload` // POST

//GET 
export const district_guest = `${letsgolowcarbons}/district_guest` // GET
export const travel_guest = `${letsgolowcarbons}/travel_guest` // POST
export const travel_types_guest = `${letsgolowcarbons}/travel_types_guest` // GET

export const vehicle_with_routes_guest = `${letsgolowcarbons}/vehicle_with_routes_guest` // POST
export const travel_route_guest = `${letsgolowcarbons}/travel_route_guest` // POST
export const travel_route_details_guest = `${letsgolowcarbons}/travel_route_details_guest` // POST

export const get_places_tourist_attraction_details_guest = `${letsgolowcarbons}/get_places_tourist_attraction_details_guest` // POST
export const get_places_tourist_attraction_guest = `${letsgolowcarbons}/get_places_tourist_attraction_guest` // POST


// add group trip
export const add_trip_group = `${letsgolowcarbons}/add_trip_group` // POST
export const get_trip_group_all = `${letsgolowcarbons}/get_trip_group_all` // POST
export const close_trip_group = `${letsgolowcarbons}/close_trip_group` // POST

// upload image
export const upload_qrcode = `${letsgolowcarbons}/upload_qrcode` // POST


// ------------------------ สำหรับ guest --------------------------- //

// ------------------------ สำหรับ admin ------------------------ //
// add Data for Admin
export const create_district_admin = `${letsgolowcarbons}/admin/create_district` // GET
export const create_travel_types_admin = `${letsgolowcarbons}/admin/create_travel_types` // POST
export const create_travel_admin = `${letsgolowcarbons}/admin/create_travel` // POST
export const district_admin = `${letsgolowcarbons}/admin/district` // GET
export const travel_types_admin = `${letsgolowcarbons}/admin/travel_types` // GET
export const travel_admin = `${letsgolowcarbons}/admin/travel` // GET
export const get_dashboard_admin = `${letsgolowcarbons}/admin/get_dashboard` // GET

export const languages = `${letsgolowcarbons}/admin/language` // GET
export const create_travel_route = `${letsgolowcarbons}/admin/create_travel_route` // POST
export const travel_route = `${letsgolowcarbons}/admin/travel_route` // POST
export const create_places = `${letsgolowcarbons}/admin/create_places` // POST
export const create_travel_timeline = `${letsgolowcarbons}/admin/create_travel_timeline` // POST
export const create_language = `${letsgolowcarbons}/admin/create_language` // POST
export const create_travel = `${letsgolowcarbons}/admin/create_travel` // POST
export const create_route_vehicles = `${letsgolowcarbons}/admin/create_route_vehicles` // POST

export const get_places_tourist_attraction = `${letsgolowcarbons}/admin/get_places_tourist_attraction` // POST
export const get_places_tourist_attraction_details = `${letsgolowcarbons}/admin/get_places_tourist_attraction_details` // POST

export const map_search = `${letsgolowcarbons}/admin/map_search` // GET

export const update_img_route_banner = `${letsgolowcarbons}/admin/update_img_route_banner` // POST 

export const fuelsed = `${letsgolowcarbons}/admin/fuels` // GET
export const vehicle_with_fuels = `${letsgolowcarbons}/admin/vehicle_with_fuels` // GET
export const vehicle_with_routes = `${letsgolowcarbons}/admin/vehicle_with_routes` // GET
export const create_fuels = `${letsgolowcarbons}/admin/create_fuels` // POST
export const edit_fuels = `${letsgolowcarbons}/admin/edit_fuels` // PUT
export const delete_fuels = `${letsgolowcarbons}/admin/delete_fuels` // LEDETE




// upload image and VDO
export const upload_image_admin = `${letsgolowcarbons}/admin/media/upload_image_admin` // POST
export const upload_image_banner_admin = `${letsgolowcarbons}/admin/media/upload_image_banner_admin` // POST
export const upload_image_route_admin = `${letsgolowcarbons}/admin/media/upload_image_route_admin` // POST


// ------------------------ สำหรับ admin ------------------------ //

export const get_show_image = `https://storage.googleapis.com/letsgolowcarbons` //GET
export const upload_image_all = `${letsgolowcarbons}/admin/media/upload` //POST


