<?php
$root = realpath($_SERVER["DOCUMENT_ROOT"]);
include_once "$root/includes/db_connect_new.php";
require_once("$root/includes/init_session.php");
$emp_number = $_SESSION['atk_emp_number'];
$time_1 = microtime(true);

//Set Dates
if (isset($_COOKIE['dashboard_start_date']) && isset($_COOKIE['dashboard_end_date'])) {
	$begin = strtotime(date('m/d/Y', strtotime($_COOKIE['dashboard_start_date'])));
	$end = strtotime($_COOKIE['dashboard_end_date']);
	$ly_begin = strtotime($_COOKIE['dashboard_ly_start_date']);
	$ly_end = strtotime($_COOKIE['dashboard_ly_end_date']);
	
	$run_date = "run_date BETWEEN '$begin' AND '$end' AND";
	$ly_run_date = "run_date BETWEEN '$ly_begin' AND '$ly_end' AND";
} else {
	$begin = $end = strtotime('-1 day', date('m/d/Y', time()));
}

$same_store = $_COOKIE['dashboard_same_store_financial'];
$get_company_comp_ty = mysql_query("SELECT sum(net_sales) as c_net_sales FROM dashboard.data_location WHERE run_date BETWEEN '$begin' AND '$end' AND location IN ($same_store)") or die(mysql_error());
while ($company_comp_ty_rows = mysql_fetch_array($get_company_comp_ty)) {
	$company_comp_ty = $company_comp_ty_rows['c_net_sales'];
}

$get_company_comp_ly = mysql_query("SELECT sum(net_sales) as c_net_sales FROM dashboard.data_location WHERE run_date BETWEEN '$ly_begin' AND '$ly_end' AND location IN ($same_store) ");
while ($company_comp_ly_rows = mysql_fetch_array($get_company_comp_ly)) {
	$company_comp_ly = $company_comp_ly_rows['c_net_sales'];
}

$company_comp = $company_comp_ty / $company_comp_ly;
$results[] = array(
	'company_comp_ty' => round($company_comp_ty),
	'company_comp_ly' => round($company_comp_ly),
	'company_comp' => $company_comp,
);

echo json_encode($results);