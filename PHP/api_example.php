<?php
/**  
 * get unstructured data for employees 
 * reformat data
 * put into our system
 */
 
$new_server = "ABCD1234";
ini_set('soap.wsdl_cache_enabled', 0);
ini_set('soap.wsdl_cache_ttl', 900);
ini_set('default_socket_timeout', 15);

$params = array(
	"pServerName" => $new_server,
	"pDatabaseName" => "DatabaseName",
	"pEmployeeNumber" => "",
	"pPIN" => "123ABC",
	"pRole" => "Role",
	"pRecType" => 0,
	"pExportArray" => ""
);


$api_link = 'https://apilink';

$options = array(
	'uri' => 'http://tempuri.org/',
	'style' => SOAP_RPC,
	'use' => SOAP_ENCODED,
	'soap_version' => SOAP_1_2,
	'cache_wsdl' => CACHE_NONE,
	'connection_timeout' => 15,
	'trace' => true,
	'encoding' => 'UTF-8',
	'exceptions' => true,
);

try {
	$soap = new SoapClient($api_link, $options);
	$data = $soap->ExportData_Enhanced($params);
} catch (Exception $e) {
	fwrite(STDERR, $e->getMessage());
	exit(1);
}
$returned_array = $data->pExportArray->string;
echo "building array\n";
$unique_employees = get_unique_employees();
if(!is_array($returned_array)){
	var_dump($data);
	die;
}
foreach ($returned_array as $user_str) {
	$excludes = array("\"");
	$replace = array('');
	$user_str = str_replace($excludes, $replace, $user_str);
	$record_array = explode(',', $user_str);

	//API DOCS
	$employee_data = handle_data($record_array, $unique_employees);

	if (!empty($employee_data[5])) {
		$each_birth_date = explode("/", $employee_data[5]);
		$month = $each_birth_date[0];
		$day = $each_birth_date[1];
		$year = date('Y', time());

		//check_minor
		$eighteen = strtotime('-18 years', time());
		$unix_birthdate = strtotime($employee_data[5]);
		if ($unix_birthdate > $eighteen) {
			$enter_minor = mysql_query("INSERT IGNORE INTO ldap.minors (emp_number, birthdate) VALUES ('$employee_data[0]', '$unix_birthdate')", $dbh1);
		}
		$employee_data[5] = strtotime($month . '/' . $day . '/' . $year);
	} else {
		$employee_data[5] = "";
	}


	$id = base64_encode($employee_data[0]);
	$value_1 = base64_encode($employee_data[21]);
	$value_2 = base64_encode($employee_data[22]);

	$keys = mysql_query("INSERT INTO reviews.review_key (id, value_1, value_2) VALUES ('$id', '$value_1', '$value_2') ON DUPLICATE KEY UPDATE value_1 = '$value_1', value_2 = '$value_2'");

	$emp_array[$employee_data[0]] = "('$employee_data[0]', '$employee_data[1]', '$employee_data[2]', '$employee_data[3]', '$employee_data[4]', '$employee_data[5]', '$employee_data[6]', '$employee_data[7]', '$employee_data[8]', '$employee_data[9]', '$employee_data[10]', '$employee_data[11]', '$employee_data[12]', '$employee_data[13]', '$employee_data[14]', '$employee_data[15]', '$employee_data[16]', '$employee_data[17]', '$employee_data[18]', '$employee_data[19]', '$employee_data[20]'";
	$emp_num_arr[$employee_data[0]] = false;
	unset($record_array);
}

$time = time();
if (!$con = new db_pdo($dsn, $uid, $pwd)) {
	// Infor down
	echo time() - $time;
	foreach ($emp_array as $key => $value) {
		$emp_array[$key] .= ", original_hire_date, calc_pay_group)";
	}
	$infor_d_k_u = "original_hire_date = original_hire_date, calc_pay_group = calc_pay_group";
} else {
	// Infor up
	$sql = "SELECT CALCGRP_ID, CONVERT(VARCHAR(19),EMP_HIRE_DATE, 120) AS hire_date, EMP_NAME FROM WFMPROD.dbo.EMPLOYEE";
	$stmt = $con->query($sql);
	while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
		$calc_pay_group = $row['CALCGRP_ID'];
		$original_hire_date = strtotime($row['hire_date']);
		$emp_number = $row['EMP_NAME'];

		if ($original_hire_date == '') {
			$original_hire_date = 0;
		}
		if (isset($emp_array[$emp_number])) {
			$emp_array[$emp_number] .= ", '$original_hire_date', '$calc_pay_group')";
			$emp_num_arr[$emp_number] = true;
		}
	}

	$infor_d_k_u = "original_hire_date = VALUES(original_hire_date), calc_pay_group = VALUES(calc_pay_group)";

	foreach ($emp_num_arr as $key => $value) {
		if (!$value) {
			$emp_array[$key] .= ", NULL, NULL)";
		}
	}
}

//inserting into atk;
update_associates($emp_array,$infor_d_k_u,$dbh1);
if (isProd()) {
	echo "inserting into avena\n";
	$u2 = "username";
	$p2 = 'password';
	$s2 = "110.10.10";
	$d2 = "database";
	$dbh_avena = mysql_connect($s2, $u2, $p2);
	$choose_db_2 = mysql_select_db($d2, $dbh_avena);
	update_associates($emp_array, $infor_d_k_u, $dbh_avena);
}


/**
 * @param array $emp_array
 * @param $infor_d_k_u
 * @param string $dbh
 */
function update_associates($emp_array = array(), $infor_d_k_u, $dbh = ''){
	$insert = mysql_query("INSERT INTO ldap.new_associate_listing (emp_number, last_name, first_name, middle_name, password, birth_date, hire_date, termination_date, location_type, location, job_code, status, type, supervisor, department_code, address_1, address_2, city, state, zip, home_phone, original_hire_date, calc_pay_group) VALUES " . implode(", ", $emp_array) . " ON DUPLICATE KEY UPDATE last_name = VALUES(last_name), first_name = VALUES(first_name), middle_name = VALUES(middle_name), `password` = VALUES(`password`), birth_date = VALUES(birth_date), hire_date = VALUES(hire_date), termination_date = VALUES(termination_date), location_type = VALUES(location_type), location = VALUES(location), job_code = VALUES(job_code), `status` = VALUES(`status`), type = VALUES(type), supervisor = VALUES(supervisor), department_code = VALUES(department_code), address_1 = VALUES(address_1), address_2 = VALUES(address_2), city = VALUES(city), state = VALUES(state), zip = VALUES(zip), home_phone = VALUES(home_phone), $infor_d_k_u", $dbh) or fwrite(STDERR,mysql_error($dbh)) . exit(1);
}

/**
 * @return array
 */
function get_unique_employees()
{
	$unique_employees = ['1234'];
	return $unique_employees;
}

/**
 * @param array $record_array
 * @return array
 */
function handle_unique_employee($record_array = array())
{
	$record = [];
	switch ($record_array[3]) {
		case 1234:
			$record = handle_offset_1($record_array);
			break;
		case 4567:
			$record = handle_normal_data($record_array);
			break;
	}

	return $record;
}

/**
 * @param array $record_array
 * @param array $unique_employees
 * @return array|mixed
 */
function handle_data($record_array = array(), $unique_employees = array())
{
	if (in_array($record_array[3], $unique_employees)) {
		$record = handle_unique_employee($record_array);
	} else {
		switch (count($record_array)) {
			case 42:
				$record = handle_42_columns($record_array);
				break;
			default:
				$record = handle_normal_data($record_array);
				break;
		}
	}
	$record[9] = convert_mangrove_location($record[9]);
	return $record;
}

/**
 * @param array $record_array
 * @return mixed
 * information about employee such as employee id, first name, last name, etc.
 */
function handle_normal_data($record_array = array())
{
	$record[0] = $record_array[3]; 
	$record[1] = mysql_real_escape_string(strip_tags($record_array[0])); 
	$record[2] = mysql_real_escape_string($record_array[1]); 
	$record[3] = mysql_real_escape_string($record_array[2]); 
	$record[4] = md5(substr($record_array[4], 5)); 
	$record[5] = $record_array[13]; 
	$record[6] = strtotime($record_array[14]); 
	$record[7] = strtotime($record_array[15]); 
	$record[8] = $record_array[20]; 
	$record[9] = $record_array[17]; 
	$record[10] = $record_array[39];
	$record[11] = $record_array[21]; 
	$record[12] = $record_array[22]; 
	$record[13] = $record_array[38]; 
	$record[14] = $record_array[18]; 
	$record[15] = mysql_real_escape_string($record_array[6]); 
	$record[16] = mysql_real_escape_string($record_array[7]); 
	$record[17] = mysql_real_escape_string($record_array[8]); 
	$record[18] = $record_array[9]; 
	$record[19] = $record_array[10];
	$record[20] = mysql_real_escape_string($record_array[11]); 
	$record[21] = $record_array[27];
	$record[22] = $record_array[28];

	return $record;
}

/**
 * @param array $record_array
 * @return mixed
 */
function handle_42_columns($record_array = array())
{
	$record[0] = $record_array[3]; 
	$record[1] = mysql_real_escape_string(strip_tags($record_array[0]));
	$record[2] = mysql_real_escape_string($record_array[1]); 
	$record[3] = mysql_real_escape_string($record_array[2]); 
	$record[4] = md5(substr($record_array[4], 5)); 
	$record[5] = $record_array[14]; 
	$record[6] = strtotime($record_array[15]); 
	$record[7] = strtotime($record_array[16]); 
	$record[8] = $record_array[21]; 
	$record[9] = $record_array[18]; 
	$record[10] = $record_array[40];
	$record[11] = $record_array[22];
	$record[12] = $record_array[23];
	$record[13] = $record_array[39];
	$record[14] = $record_array[19];
	$record[15] = mysql_real_escape_string($record_array[6]);
	$record[16] = mysql_real_escape_string($record_array[7]);
	$record[17] = mysql_real_escape_string($record_array[9]);
	$record[18] = $record_array[10];
	$record[19] = $record_array[11];
	$record[20] = mysql_real_escape_string($record_array[12]);
	$record[21] = $record_array[28];
	$record[22] = $record_array[29];

	return $record;
}

/**
 * @param array $record_array
 * @return mixed
 */
function handle_offset_1($record_array = array())
{
	$record[0] = $record_array[3];
	$record[1] = mysql_real_escape_string(strip_tags($record_array[0]));
	$record[2] = mysql_real_escape_string($record_array[1]);
	$record[3] = mysql_real_escape_string($record_array[2]);
	$record[4] = md5(substr($record_array[4], 5));
	$record[5] = $record_array[15];
	$record[6] = strtotime($record_array[16]);
	$record[7] = strtotime($record_array[17]); 
	$record[8] = $record_array[22];
	$record[9] = $record_array[19]; 
	$record[10] = $record_array[41]; 
	$record[11] = $record_array[23]; 
	$record[12] = $record_array[24]; 
	$record[13] = $record_array[40]; 
	$record[14] = $record_array[20];
	$record[15] = mysql_real_escape_string($record_array[6]); 
	$record[16] = mysql_real_escape_string($record_array[7]); 
	$record[17] = mysql_real_escape_string($record_array[10]);
	$record[18] = $record_array[11]; 
	$record[19] = $record_array[12];
	$record[20] = mysql_real_escape_string($record_array[13]);
	$record[21] = $record_array[27];
	$record[22] = $record_array[28];

	return $record;
}


/**
 * @param $location
 * @return string
 */
function convert_mangrove_location($location)
{
  switch ($location) {
    case '997':
      $location = '897';
      break;
    case '999':
      $location = '899';
      break;
    default:
      break;
  }
  return $location;
}
