<?php
	$root = realpath($_SERVER['DOCUMENT_ROOT']);
	include_once "$root/includes/db_connect_new.php";
	error_reporting(0);
	$emp_number = $_SESSION['emp_num'];
	$time_1 = microtime(true);

	$today = strtotime('-1 year');

	/*
	 * Purpose is to report sales data by location comparing this year's sales and last year's sales
	 */
	
	//Set Dates
	if(isset($_COOKIE['dashboard_start_date']) && isset($_COOKIE['dashboard_end_date'])){
		$begin = strtotime(date('m/d/Y', strtotime($_COOKIE['dashboard_start_date'])));
		$end = strtotime($_COOKIE['dashboard_end_date']);
		$ly_begin = strtotime($_COOKIE['dashboard_ly_start_date']);
		$ly_end = strtotime($_COOKIE['dashboard_ly_end_date']);
		
		$run_date = "run_date BETWEEN '$begin' AND '$end' AND";
		$ly_run_date = "run_date BETWEEN '$ly_begin' AND '$ly_end' AND";
	} else {
		$begin = $end = strtotime('-1 day', date('m/d/Y'));
	}

	//Set Locations
	if(isset($_COOKIE['dashboard_locations'])){
		$location = $_COOKIE['dashboard_locations'];
	} else {
		$location = $_COOKIE['atk_store_array'];
	}
	
	$same_store = $_COOKIE['dashboard_same_store_financial'];
	if(isset($_COOKIE['sister_store'])){
		$sister_store = $_COOKIE['sister_store'];
	}
	
	$location_statement = statement($location,"location");
	

	$same_store_array = explode(',',$same_store);
	foreach($same_store_array as $key){
		$new_same_store[] = "'$key'";
	}
	$same_store_array = implode(',',$new_same_store);

	$same_store_statement = "location IN ($same_store_array)";


	//COMPARE TO
	if(isset($_COOKIE['dashboard_compare'])){
		$compare = $_COOKIE['dashboard_compare'];
	}else{
		$compare = 'SS(F)';
	}

	
	$get_total = mysql_query("SELECT sum(net_sales) as t_net_sales FROM dashboard.data_location WHERE run_date BETWEEN '$begin' AND '$end' AND location IN ($location)");
	while($total_rows = mysql_fetch_array($get_total)){
		$t_net_sales = $total_rows['t_net_sales'];
	}


	//PRIMARY QUERY FOR TY SALES
	$query_string = "SELECT a.location, sum(a.net_sales) AS sales, sum(a.net_sales_units) AS sales_units, sum(a.gross_margin) AS gross_margin FROM dashboard.data_location a WHERE $location_statement AND run_date BETWEEN '$begin' AND '$end' GROUP BY location";

	$start_time = microtime(true);
	$ty_query = mysql_query($query_string) or die(mysql_error());
	$end_time = microtime(true);
	
	while($ty_rows = mysql_fetch_array($ty_query)){
		$location = $ty_rows['location'];
		$ty_net_sales = round($ty_rows['sales']);
		$ty_sales_units = round($ty_rows['sales_units']);
		$ty_gross_margin = round($ty_rows['gross_margin']);

		$get_location_name = mysql_query("SELECT name, region, volume, state, primary_dc,open_date, zone FROM ldap.store_listing WHERE number = '$location'") or die(mysql_error());
		while($location_name_rows = mysql_fetch_array($get_location_name)){
			$location_name = $location_name_rows['name'];
			$region = $location_name_rows['region'];
			$volume = $location_name_rows['volume'];
			$primary_dc = $location_name_rows['primary_dc'];
			$state = $location_name_rows['state'];
			$open_date = $location_name_rows['open_date'];
			$zone = $location_name_rows['zone'];
		}

		$sister = $location;

		if($open_date > $ly_begin){
			$query = "SELECT sister FROM ldap.sister_stores WHERE location='$location'";
			$get_sisters = mysql_query($query);
			while($sister_rows=mysql_fetch_array($get_sisters)){
				if($sister_store==1) {
					$sister = $sister_rows['sister'];
				}
			}
		}

		//PRIMARY QUERY FOR LAST YEAR SALES
		$query = "SELECT location, sum(net_sales) AS sales, sum(net_sales_units) AS sales_units, sum(gross_margin) AS gross_margin FROM dashboard.data_location WHERE run_date BETWEEN '$ly_begin' AND '$ly_end' AND location = '$sister'";

		$start_time = microtime(true);
		$ly_query = mysql_query($query);
		$end_time = microtime(true);
		
		while($ly_rows = mysql_fetch_array($ly_query)){
			$ly_net_sales = round($ly_rows['sales']);
			$ly_sales_units = round($ly_rows['sales_units']);
			$ly_gross_margin = round($ly_rows['gross_margin']);
		}

		$same_store_actual = "AND open_date <= $today";
		switch($compare){
			case 'District':
				$compare_statement = "AND District = '$District'";
			break;
			case 'State':
				$compare_statement = "AND state = '$state'";
			break;
			case 'Volume':
				$compare_statement = "AND volume = '$volume'";
			break;
			case 'All Stores':
				$compare_statement = '';
				$same_store_actual = '';
			break;
			case 'SS(A)':
				$compare_statement = '';
			break;
			case 'Selection':
				$compare_statement = 'AND ' . $location_statement;
			break;
			case 'SS(F) - Internet':
				$compare_statement = "AND store_dc IN ('store','internet') AND comp = 1";
			break;
			case 'SS(F)':
				$compare_statement = "AND store_dc IN ('store') AND comp = 1";
			break;
			default:
				$compare_statement = "AND store_dc IN ('store') AND comp = 1";
			break;
		}

		if($compare){
			$query = "SELECT sum(net_sales) as c_net_sales FROM dashboard.data_location d, ldap.store_listing l WHERE run_date BETWEEN '$begin' AND '$end' AND l.number = d.location $compare_statement $same_store_actual";
			$get_company_comp_ty = mysql_query($query) or die(mysql_error());
			while($company_comp_ty_rows = mysql_fetch_array($get_company_comp_ty)){
				$compare_comp_ty = $company_comp_ty_rows['c_net_sales'];
			}
			
			$get_company_comp_ly = mysql_query("SELECT sum(net_sales) as c_net_sales FROM dashboard.data_location d, ldap.store_listing l WHERE run_date BETWEEN '$ly_begin' AND '$ly_end' AND l.number = d.location  $compare_statement $same_store_actual");
			while($company_comp_ly_rows = mysql_fetch_array($get_company_comp_ly)){
				$compare_comp_ly = $company_comp_ly_rows['c_net_sales'];
			}
			
			$company_comp = $compare_comp_ty / $compare_comp_ly;
		}

		if(mysql_num_rows($get_location_name) == 0){
			$location_name = 'NA';
			$District = 'NA';
			$volume = 'NA';
			$primary_dc = 'NA';
			$state = 'NA';
		}
		
		if($ly_net_sales > 0){
			$net_sales_percent_change = round((($ty_net_sales / $ly_net_sales) -1) * 100, 2);
			$gross_margin_percent_change = round((($ty_gross_margin / $ly_gross_margin) -1) * 100, 2);
			$sales_units_percent_change = round((($ty_sales_units / $ly_sales_units) -1) * 100, 2);
			$net_sales_dollar_change = ($ty_net_sales - $ly_net_sales);
			$gross_margin_dollar_change = ($ty_gross_margin - $ly_gross_margin);
			$sales_units_dollar_change = ($ty_sales_units - $ly_sales_units);
			$ty_gross_margin_percent=round($ty_gross_margin/$ty_net_sales*100,2);
			$ly_gross_margin_percent=round($ly_gross_margin/$ly_net_sales*100,2);
			$gross_margin_percent_var=$ty_gross_margin_percent - $ly_gross_margin_percent;

			$push_pull = round($ty_net_sales - ($ly_net_sales * $company_comp));
		} else {
			$net_sales_percent_change = '0';
			$net_sales_dollar_change = '0';
			$gross_margin_percent_change = '0';
			$gross_margin_dollar_change = '0';
			$sales_units_percent_change = '0';
			$sales_units_dollar_change = '0';
			$gross_margin_percent_var = 0;
			$ly_gross_margin_percent = 0;
			$push_pull = 0;
		}
		
		
		
		$result[] = array(
			'Volume' => $volume,
			'State' => $state,
			'Zone' => $zone,
			'location' => $location,
			'location_name' => $location_name,
			'District' => $region,
			'ty_net_sales' => $ty_net_sales,
			'ly_net_sales' => $ly_net_sales,
			'net_sales_dollar_change' => $net_sales_dollar_change,
			'net_sales_percent_change' => $net_sales_percent_change,
			
			'ty_gross_margin' => $ty_gross_margin,
			'ly_gross_margin' => $ly_gross_margin,
			'gross_margin_dollar_change' => $gross_margin_dollar_change,
			'gross_margin_percent_change' => $gross_margin_percent_change,
			
			'ty_gross_margin_percent'=>$ty_gross_margin_percent,
			'ly_gross_margin_percent'=>$ly_gross_margin_percent,
			'gross_margin_percent_var'=>$gross_margin_percent_var,
			
			'ty_sales_units' => $ty_sales_units,
			'ly_sales_units' => $ly_sales_units,
			'sales_units_number_change' => $sales_units_dollar_change,
			'sales_units_percent_change' => $sales_units_percent_change,
			
			'push_pull' => $push_pull,
			'percent_of_business' => number_format((($ty_net_sales / $t_net_sales) *100), 2),
			'Primary DC' => $primary_dc,

			'cost_sales' => 						$ty_net_sales - $ty_gross_margin,
			'ly_cost_sales' => 						$ly_net_sales - $ly_gross_margin,
			'cost_sales_change' => 					((($ty_net_sales - $ty_gross_margin) / ($ly_net_sales - $ly_gross_margin)) - 1) * 100,

		);
	}
	
	$myData = $result;
	$query = "SELECT sum(net_sales) as c_net_sales, sum(gross_margin) as c_gross_margin, sum(net_sales_units) as c_sales_units FROM dashboard.data_location WHERE run_date BETWEEN '$begin' AND '$end' AND $same_store_statement";

	$start_time = microtime(true);
	$get_company_comp_ty = mysql_query($query) or die(mysql_error());
	$end_time = microtime(true);

	while($company_comp_ty_rows = mysql_fetch_array($get_company_comp_ty)){
		$company_comp_ty = $company_comp_ty_rows['c_net_sales'];
		$c_gross_margin_ty = $company_comp_ty_rows['c_gross_margin'];
		$c_sales_units_ty = $company_comp_ty_rows['c_sales_units'];
	}
	
	
	$get_company_comp_ly = mysql_query("SELECT sum(net_sales) as c_net_sales, sum(gross_margin) as c_gross_margin, sum(net_sales_units) as c_sales_units FROM dashboard.data_location WHERE run_date BETWEEN '$ly_begin' AND '$ly_end' AND $same_store_statement ");
	while($company_comp_ly_rows = mysql_fetch_array($get_company_comp_ly)){
		$company_comp_ly = $company_comp_ly_rows['c_net_sales'];
		$c_gross_margin_ly = $company_comp_ly_rows['c_gross_margin'];
		$c_sales_units_ly = $company_comp_ly_rows['c_sales_units'];
	}
	
	$company_comp = $company_comp_ty / $company_comp_ly;
	
	$company_comp_dollar_change = ($company_comp_ty - $company_comp_ly);
	$company_comp_percent_change = round((($company_comp_ty / $company_comp_ly) -1) * 100, 2);
	$push_pull = round($company_comp_ty - ($company_comp_ly * $company_comp));
	$gross_margin_dollar_change = ($c_gross_margin_ty - $c_gross_margin_ly);
	$gross_margin_percent_change = round((($c_gross_margin_ty / $c_gross_margin_ly) -1) * 100, 2);
	$sales_units_dollar_change = ($c_sales_units_ty - $c_sales_units_ly);
	$sales_units_percent_change = round((($c_sales_units_ty / $c_sales_units_ly) -1) * 100, 2);
	$c_ty_gross_margin_percent=round($c_gross_margin_ty/$company_comp_ty*100,2);
	$c_ly_gross_margin_percent=round($c_gross_margin_ly/$company_comp_ly*100,2);
	$c_gross_margin_percent_var=$c_ty_gross_margin_percent - $c_ly_gross_margin_percent;

	$summary[] = array(
		'location' => 							'',
		'location_name' => 						'Same Stores (Financial)',
		'company_comp_ty' => 					round($company_comp_ty),
		'company_comp_ly' => 					round($company_comp_ly),
		'company_comp_dollar_change' =>			round($company_comp_dollar_change),
		'company_comp_percent_change' => 		$company_comp_percent_change,
		//'push_pull' => 							$push_pull,
		//'percent_of_business' => 				number_format((($company_comp_ty / $t_net_sales) *100), 2),
		
		'ty_gross_margin' =>					round($c_gross_margin_ty),
		'ly_gross_margin' => 					round($c_gross_margin_ly),
		'gross_margin_dollar_change' => 		round($gross_margin_dollar_change),
		'gross_margin_percent_change' => 		$gross_margin_percent_change,
		
		'ty_gross_margin_percent'=>				$c_ty_gross_margin_percent,
		'ly_gross_margin_percent'=>				$c_ly_gross_margin_percent,
		'gross_margin_percent_var'=>			$c_gross_margin_percent_var,
		
		'ty_sales_units' => 					round($c_sales_units_ty),
		'ly_sales_units' => 					round($c_sales_units_ly),
		'sales_units_number_change' => 			round($sales_units_dollar_change),
		'sales_units_percent_change' => 		$sales_units_percent_change,

		
	);

	echo json_encode(['data' => $myData, 'summaryData' => $summary]);
