
// ------------------------ สำหรับ guest --------------------------- //
// POST
export const register = `http://localhost:8080/register` // POST
export const login = `http://localhost:8080/login` // POST
export const reset_password = `http://localhost:8080/reset-password` // POST
export const media_upload = `http://localhost:8080/api/v1/media/upload` // POST

//GET
export const district_guest = `http://localhost:8080/district_guest` // GET
export const travel_guest = `http://localhost:8080/travel_guest` // POST
export const travel_types_guest = `http://localhost:8080/travel_types_guest` // GET

export const vehicle_with_routes_guest = `http://localhost:8080/vehicle_with_routes_guest` // POST
export const travel_route_guest = `http://localhost:8080/travel_route_guest` // POST
export const travel_route_details_guest = `http://localhost:8080/travel_route_details_guest` // POST

export const get_places_tourist_attraction_details_guest = `http://localhost:8080/get_places_tourist_attraction_details_guest` // POST
export const get_places_tourist_attraction_guest = `http://localhost:8080/get_places_tourist_attraction_guest` // POST


// add group trip
export const add_trip_group = `http://localhost:8080/add_trip_group` // POST
export const get_trip_group_all = `http://localhost:8080/get_trip_group_all` // POST
export const close_trip_group = `http://localhost:8080/close_trip_group` // POST

// upload image
export const upload_qrcode = `http://localhost:8080/upload_qrcode` // POST


// ------------------------ สำหรับ guest --------------------------- //

// ------------------------ สำหรับ admin ------------------------ //
// add Data for Admin
export const create_district_admin = `http://localhost:8080/admin/create_district` // GET
export const create_travel_types_admin = `http://localhost:8080/admin/create_travel_types` // POST
export const create_travel_admin = `http://localhost:8080/admin/create_travel` // POST
export const district_admin = `http://localhost:8080/admin/district` // GET
export const travel_types_admin = `http://localhost:8080/admin/travel_types` // GET
export const travel_admin = `http://localhost:8080/admin/travel` // GET
export const get_dashboard_admin = `http://localhost:8080/admin/get_dashboard` // GET

export const languages = `http://localhost:8080/admin/language` // GET
export const create_travel_route = `http://localhost:8080/admin/create_travel_route` // POST
export const travel_route = `http://localhost:8080/admin/travel_route` // POST
export const create_places = `http://localhost:8080/admin/create_places` // POST
export const create_travel_timeline = `http://localhost:8080/admin/create_travel_timeline` // POST
export const create_language = `http://localhost:8080/admin/create_language` // POST
export const create_travel = `http://localhost:8080/admin/create_travel` // POST
export const create_route_vehicles = `http://localhost:8080/admin/create_route_vehicles` // POST

export const get_places_tourist_attraction = `http://localhost:8080/admin/get_places_tourist_attraction` // POST
export const get_places_tourist_attraction_details = `http://localhost:8080/admin/get_places_tourist_attraction_details` // POST

export const map_search = `http://localhost:8080/admin/map_search` // GET

export const update_img_route_banner = `http://localhost:8080/admin/update_img_route_banner` // POST 

export const fuelsed = `http://localhost:8080/admin/fuels` // GET
export const vehicle_with_fuels = `http://localhost:8080/admin/vehicle_with_fuels` // GET
export const vehicle_with_routes = `http://localhost:8080/admin/vehicle_with_routes` // GET
export const create_fuels = `http://localhost:8080/admin/create_fuels` // POST
export const edit_fuels = `http://localhost:8080/admin/edit_fuels` // PUT
export const delete_fuels = `http://localhost:8080/admin/delete_fuels` // LEDETE




// upload image and VDO
export const upload_image_admin = `http://localhost:8080/admin/media/upload_image_admin` // POST
export const upload_image_banner_admin = `http://localhost:8080/admin/media/upload_image_banner_admin` // POST
export const upload_image_route_admin = `http://localhost:8080/admin/media/upload_image_route_admin` // POST


// ------------------------ สำหรับ admin ------------------------ //

export const get_show_image = `https://storage.googleapis.com/letsgolowcarbons` //GET
export const upload_image_all = `http://localhost:8080/admin/media/upload` //POST


