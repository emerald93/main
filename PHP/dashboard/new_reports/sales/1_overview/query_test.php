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

if (isset($_COOKIE['dashboard_locations'])) {
	$location = $location_array = $_COOKIE['dashboard_locations'];
} else {
	$location = $location_array = $_COOKIE['atk_store_array'];
}

if (isset($_COOKIE['dashboard_class']) && $_COOKIE['dashboard_class'] != "") {
	$class = $_COOKIE['dashboard_class'];
} else {
	$class = "349";
}

$location_statement = statement($location, "location");

echo "<table>";

$query = "SELECT sum(net_sales) AS sales, sum(net_sales_units) AS sales_units, sum(gross_margin) AS gross_margin, fineline_code FROM dashboard.data_fineline WHERE location IN ($location) AND run_date BETWEEN '1420092000' AND '1432098000' AND class_code = '$class' group by fineline_code";
$start_time = microtime(true);
$class_group_query = mysql_query($query);
$end_time = microtime(true);
echo "<tr><td>$query</td></tr>";
while ($rows = mysql_fetch_array($class_group_query)) {
	$fineline_code = $rows['fineline_code'];
	$ty_net_sales = round($rows['sales']);
	$ty_sales_units = round($rows['sales_units']);
	$ty_gross_margin = round($rows['gross_margin']);
	echo "<tr><td>$fineline_code<td>$ty_net_sales</td><td>$ty_sales_units</td><td>$ty_gross_margin</td></tr>";
}

$time1 = $end_time - $start_time;
echo "<tr><td>$time1</td></tr>";


$start_time = microtime(true);

$get_finelines = mysql_query("SELECT DISTINCT fineline_code FROM dashboard.dcf WHERE class_code = '$class'");

while ($fineline_rows = mysql_fetch_array($get_finelines)) {
	$fineline_codes[] = $fineline_rows['fineline_code'];
	$fineline_code = $fineline_rows['fineline_code'];
	if ($statement == "")
		$statement = "AND (fineline_code = '$fineline_code'";
	else
		$statement .= "OR fineline_code = '$fineline_code'";
}

//$fineline_codes= implode(",",$fineline_codes);
$fineline_statement = statement($fineline_codes, "fineline_code");


$query = "SELECT sum(net_sales) AS sales, sum(net_sales_units) AS sales_units, sum(gross_margin) AS gross_margin, fineline_code FROM dashboard.data_fineline WHERE location IN ($location) AND run_date BETWEEN '1420092000' AND '1432098000' AND $fineline_statement group by fineline_code";

//003498,003491,003492,003493,003496,003497,003498
//

$group_query = mysql_query($query);
echo "<tr><td>$query</td></tr>";
while ($rows = mysql_fetch_array($group_query)) {
	$fineline_code = $rows['fineline_code'];
	$ty_net_sales = round($rows['sales']);
	$ty_sales_units = round($rows['sales_units']);
	$ty_gross_margin = round($rows['gross_margin']);
	echo "<tr><td>$fineline_code<td>$ty_net_sales</td><td>$ty_sales_units</td><td>$ty_gross_margin</td></tr>";
}


$end_time = microtime(true);
$time1 = $end_time - $start_time;
echo "<tr><td>$time1</td></tr>";
//mailme($query,$end_time-$start_time);
$total_start = microtime(true);
$get_finelines = mysql_query("SELECT DISTINCT fineline_code FROM dashboard.dcf WHERE class_code = '$class'");

while ($fineline_rows = mysql_fetch_array($get_finelines)) {
	$fineline_code = $fineline_rows['fineline_code'];
	$query = "SELECT sum(net_sales) AS sales, sum(net_sales_units) AS sales_units, sum(gross_margin) AS gross_margin FROM dashboard.data_fineline WHERE location IN ($location) AND run_date BETWEEN '1420092000' AND '1432098000' AND fineline_code = '$fineline_code'";
	$start_time = microtime(true);
	$individual_queries = mysql_query($query);
	echo "<tr><td>$query</td></tr>";
	while ($rows = mysql_fetch_array($individual_queries)) {
		$ty_net_sales = round($rows['sales']);
		$ty_sales_units = round($rows['sales_units']);
		$ty_gross_margin = round($rows['gross_margin']);
		echo "<tr><td>$fineline_code<td>$ty_net_sales</td><td>$ty_sales_units</td><td>$ty_gross_margin</td></tr>";
	}
	$end_time = microtime(true);
	$total_time += ($end_time - $start_time);
	//mailme($query,$end_time-$start_time);
}
$total_end = microtime(true);
$total_time = $total_end - $total_start;
echo "<tr><td>$total_time</td></tr>";
$total_time = 0;
$total_start = microtime(true);
$get_finelines = mysql_query("SELECT DISTINCT fineline_code FROM dashboard.dcf WHERE class_code = '$class'");
while ($fineline_rows = mysql_fetch_array($get_finelines)) {
	$fineline_code = $fineline_rows['fineline_code'];
	$query = "SELECT sum(net_sales) AS sales, sum(net_sales_units) AS sales_units, sum(gross_margin) AS gross_margin FROM dashboard.data_fineline WHERE $location_statement AND run_date BETWEEN '1420092000' AND '1432098000' AND fineline_code = '$fineline_code'";
	$start_time = microtime(true);
	$individual_queries = mysql_query($query);
	echo "<tr><td>$query</td></tr>";
	while ($rows = mysql_fetch_array($individual_queries)) {
		$ty_net_sales = round($rows['sales']);
		$ty_sales_units = round($rows['sales_units']);
		$ty_gross_margin = round($rows['gross_margin']);
		echo "<tr><td>$fineline_code<td>$ty_net_sales</td><td>$ty_sales_units</td><td>$ty_gross_margin</td></tr>";
	}
	$end_time = microtime(true);
	//mailme($query,$end_time-$start_time);
}
$total_end = microtime(true);
$total_time = $total_end - $total_start;
echo "<tr><td>$total_time</td></tr>";
echo "</table><br>";
	
	