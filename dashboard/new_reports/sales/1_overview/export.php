<?php
	$root = realpath($_SERVER["DOCUMENT_ROOT"]);
	include_once "$root/includes/db_connect_new.php";

	$emp_number = $_SESSION['atk_emp_number'];
	$time_1 = microtime(true);
	
	//Set Dates
	if(isset($_COOKIE['dashboard_start_date']) && isset($_COOKIE['dashboard_end_date'])){
		$begin = strtotime(date('m/d/Y', strtotime($_COOKIE['dashboard_start_date'])));
		$end = strtotime($_COOKIE['dashboard_end_date']);
		$ly_begin = strtotime($_COOKIE['dashboard_ly_start_date']);
		$ly_end = strtotime($_COOKIE['dashboard_ly_end_date']);
		
		$run_date = "run_date BETWEEN '$begin' AND '$end' AND";
		$ly_run_date = "run_date BETWEEN '$ly_begin' AND '$ly_end' AND";
	} else {
		$begin = $end = strtotime('-1 day', date('m/d/Y', time()));
	}

	$filename = "overview_$begin-$end.csv"; 
	
	//header("Content-Disposition: attachment; filename=\"$filename\""); 
	//header("Content-Type: application/vnd.ms-excel");

	//Set Locations
	if(isset($_COOKIE['dashboard_locations'])){
		$location = $_COOKIE['dashboard_locations'];
	} else {
		$location = $_COOKIE['atk_store_array'];
	}
	
	$same_store = $_COOKIE['dashboard_same_store_financial'];
	
	if($same_store == $location){
		$location_statement = "location IN ($location)";
	}else{
		$location_statement = statement($location,"location");
	}

	$same_store_array = explode(",",$same_store);
	foreach($same_store_array as $key){
		$new_same_store[] = "'$key'";
	}
	$same_store_array = implode(",",$new_same_store);
	
	$table = "data_location";
	
	//$table = "data_fineline";
	//$same_store_statement = statement($same_store,"location");
	$same_store_statement = "location IN ($same_store_array)";
	
	$query = "SELECT sum(net_sales) as c_net_sales, sum(gross_margin) as c_gross_margin, sum(net_sales_units) as c_sales_units FROM dashboard.$table WHERE run_date BETWEEN '$begin' AND '$end' AND $same_store_statement";
	//mailme($query);
	$start_time = microtime(true);
	$get_company_comp_ty = mysql_query($query);
	$end_time = microtime(true);
	////mailme($query,$end_time-$start_time);
	while($company_comp_ty_rows = mysql_fetch_array($get_company_comp_ty)){
		$company_comp_ty = $company_comp_ty_rows['c_net_sales'];
		$c_gross_margin_ty = $company_comp_ty_rows['c_gross_margin'];
		$c_sales_units_ty = $company_comp_ty_rows['c_sales_units'];
	}
	
	
	$get_company_comp_ly = mysql_query("SELECT sum(net_sales) as c_net_sales, sum(gross_margin) as c_gross_margin, sum(net_sales_units) as c_sales_units FROM dashboard.$table WHERE run_date BETWEEN '$ly_begin' AND '$ly_end' AND $same_store_statement ");
	while($company_comp_ly_rows = mysql_fetch_array($get_company_comp_ly)){
		$company_comp_ly = $company_comp_ly_rows['c_net_sales'];
		$c_gross_margin_ly = $company_comp_ly_rows['c_gross_margin'];
		$c_sales_units_ly = $company_comp_ly_rows['c_sales_units'];
	}
	
	$company_comp = $company_comp_ty / $company_comp_ly;
	
	
	$get_total = mysql_query("SELECT sum(net_sales) as t_net_sales FROM dashboard.$table WHERE run_date BETWEEN '$begin' AND '$end' AND location IN ($location)");
	while($total_rows = mysql_fetch_array($get_total)){
		$t_net_sales = $total_rows['t_net_sales'];
	}
	//$location_statement = "location IN ($location)";
	
	$query_string = "SELECT a.location, sum(a.net_sales) AS sales, sum(a.net_sales_units) AS sales_units, sum(a.gross_margin) AS gross_margin FROM dashboard.$table a WHERE $location_statement AND run_date BETWEEN '$begin' AND '$end' GROUP BY location";
	
	$start_time = microtime(true);
	$ty_query = mysql_query($query_string);
	$end_time = microtime(true);
	
	
	////mailme($query_string,$end_time-$start_time);
	
	while($ty_rows = mysql_fetch_array($ty_query)){
		$location = $ty_rows['location'];
		$ty_net_sales = round($ty_rows['sales']);
		$ty_sales_units = round($ty_rows['sales_units']);
		$ty_gross_margin = round($ty_rows['gross_margin']);
		
		
		if($volume == "")
			$volume = "NA";
		
		if($primary_dc == "")
			$primary_dc = 999;
		$query = "SELECT location, sum(net_sales) AS sales, sum(net_sales_units) AS sales_units, sum(gross_margin) AS gross_margin FROM dashboard.$table WHERE run_date BETWEEN '$ly_begin' AND '$ly_end' AND location = '$location'";
		$start_time = microtime(true);
		$ly_query = mysql_query($query);
		$end_time = microtime(true);
		//if($location == 1)
			//mailme($query);
		
		while($ly_rows = mysql_fetch_array($ly_query)){
			$ly_net_sales = round($ly_rows['sales']);
			$ly_sales_units = round($ly_rows['sales_units']);
			$ly_gross_margin = round($ly_rows['gross_margin']);
		}

		
		$get_location_name = mysql_query("SELECT name, region, volume, state, primary_dc FROM ldap.store_listing WHERE number = '$location'");
		while($location_name_rows = mysql_fetch_array($get_location_name)){
			$location_name = $location_name_rows['name'];
			$region = $location_name_rows['region'];
			$volume = $location_name_rows['volume'];
			$primary_dc = $location_name_rows['primary_dc'];
			$state = $location_name_rows['state'];
		}

		if(mysql_num_rows($get_location_name) == 0){
			$location_name = "NA";
			$region = "NA";
			$volume = "NA";
			$primary_dc = "NA";
			$state = "NA";
		}
		
		if($ly_net_sales > 0){
			$net_sales_percent_change = round((($ty_net_sales / $ly_net_sales) -1), 4);
			$gross_margin_percent_change = round((($ty_gross_margin / $ly_gross_margin) -1), 4);
			$sales_units_percent_change = round((($ty_sales_units / $ly_sales_units) -1), 4);
			$net_sales_dollar_change = ($ty_net_sales - $ly_net_sales);
			$gross_margin_dollar_change = ($ty_gross_margin - $ly_gross_margin);
			$sales_units_dollar_change = ($ty_sales_units - $ly_sales_units);
			$ty_gross_margin_percent=round($ty_gross_margin/$ty_net_sales,4);
			$ly_gross_margin_percent=round($ly_gross_margin/$ly_net_sales,4);
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
		    'location' => $location,
			'location_name' => $location_name,             
			

			'ty_net_sales' => $ty_net_sales,
			'ly_net_sales' => $ly_net_sales,
			'net_sales_dollar_change' => $net_sales_dollar_change,
			'net_sales_percent_change' => $net_sales_percent_change,
			'push_pull' => $push_pull,
			'percent_of_business' => number_format((($ty_net_sales / $t_net_sales) *100), 4),
			
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
			
			

			'Volume' => $volume,
			'State' => $state,
			'Region' => $region,
			'Primary DC' => $primary_dc,

		);
	}
	////mailme($query,$end_time-$start_time);
	/*
	$time_2 = microtime(true);
	$time_3 = $time_2 - $time_1;
	  if (!empty($_SERVER["HTTP_CLIENT_IP"])){
					$ip = $_SERVER["HTTP_CLIENT_IP"];
	} elseif (!empty($_SERVER["HTTP_X_FORWARDED_FOR"])){
					$ip = $_SERVER["HTTP_X_FORWARDED_FOR"];
	} else {
					$ip = $_SERVER["REMOTE_ADDR"];
	}
	$query_string = mysql_real_escape_string($query_string);
	$url = $_SERVER['PHP_SELF'];
	$http = explode('/',$url);
	$page = $http[count($http)-2] . "/" . $http[count($http)-1];
	$insert_data = mysql_query("INSERT INTO dashboard.query_data (time, query,emp_number,ip,url,page,time_1,time_2) VALUES('$time_3','$query_string','$emp_number','$ip','$url','$page','$time_1','$time_2')") or die(mysql_error());
	*/
	
	/*
	$myData = $result;
	
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
	
*/
	




	/**
 * PHPExcel
 *
 * Copyright (C) 2006 - 2014 PHPExcel
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
 *
 * @category   PHPExcel
 * @package    PHPExcel
 * @copyright  Copyright (c) 2006 - 2014 PHPExcel (http://www.codeplex.com/PHPExcel)
 * @license    http://www.gnu.org/licenses/old-licenses/lgpl-2.1.txt	LGPL
 * @version    1.8.0, 2014-03-02
 */

/** Error reporting */
error_reporting(E_ALL);
ini_set('display_errors', TRUE);
ini_set('display_startup_errors', TRUE);
date_default_timezone_set('Europe/London');

if (PHP_SAPI == 'cli')
	die('This example should only be run from a Web Browser');

/** Include PHPExcel */
require_once "$root/resources/phpExcel/Classes/PHPExcel.php";//echo "HI";


// Create new PHPExcel object
$objPHPExcel = new PHPExcel();

// Set document properties
$objPHPExcel->getProperties()->setCreator("Matthew Westerhof")
							 ->setLastModifiedBy("Matthew Westerhof")
							 ->setTitle("Overview")
							 ->setSubject("Office 2007 XLSX Overview Document")
							 ->setDescription("Overview document for Office 2007 XLSX, generated using PHP classes.")
							 ->setKeywords("office 2007 openxml php")
							 ->setCategory("Test result file");

//$sort_cookie = explode(",",$sort_cookie);
//$sort_by = $sort[0];

	function cmp(array $a, array $b) {
		if(isset($_COOKIE['dashboard_sortColumn'])){
			$sort = $_COOKIE['dashboard_sortColumn'];
		}
		if($sort){
			$sort = explode(",",$sort);
			$sort_by = $sort[0];

			if($sort[1] == 'ASC'){
			    if ($a[$sort_by] < $b[$sort_by]) {
			        return -1;
			    } else if ($a[$sort_by] > $b[$sort_by]) {
			        return 1;
			    } else {
			        return 0;
			    }
			}else{
				if ($a[$sort_by] > $b[$sort_by]) {
			        return -1;
			    } else if ($a[$sort_by] < $b[$sort_by]) {
			        return 1;
			    } else {
			        return 0;
			    }
			}
		}else
			return 0;
	}
if(isset($_COOKIE['dashboard_sortColumn']) && $_COOKIE['dashboard_sortColumn'] != ''){
	$sort_cookie = $_COOKIE['dashboard_sortColumn'];
	
	if(array_key_exists($sort_cookie[0],$result)){
		usort($result, 'cmp');
	}
}	
//if($sort_cookie){
	//if($result[$sort[0]]){
		
	//}
//}

// Add some data			 
$i=1;
foreach($result as $key => $value){
	$l = "A";
	if($i==1){
		foreach($value as $key2 => $value2){
			$columns[$key2] = $l;
			$objPHPExcel->setActiveSheetIndex(0)
	            ->setCellValue("$l$i", "$key2");
			$l++;
		}

		$i++;
		$l = "A";
	}

	foreach($value as $value2){
		$objPHPExcel->setActiveSheetIndex(0)
            ->setCellValue("$l$i", "$value2");
       	$l++;
	}
	$i++;
}

//AutoFilter
//$objPHPExcel->getActiveSheet()->setAutoFilter($objPHPExcel->getActiveSheet()->calculateWorksheetDimension());

$x = $i-1;
//Sales
$objPHPExcel->getActiveSheet()->setCellValue("{$columns['ty_net_sales']}$i", "=SUM({$columns['ty_net_sales']}2:{$columns['ty_net_sales']}$x)");
$objPHPExcel->getActiveSheet()->setCellValue("{$columns['ly_net_sales']}$i", "=SUM({$columns['ly_net_sales']}2:{$columns['ly_net_sales']}$x)");
$objPHPExcel->getActiveSheet()->setCellValue("{$columns['net_sales_dollar_change']}$i", "={$columns['ty_net_sales']}$i - {$columns['ly_net_sales']}$i");
$objPHPExcel->getActiveSheet()->setCellValue("{$columns['net_sales_percent_change']}$i", "=({$columns['ty_net_sales']}$i / {$columns['ly_net_sales']}$i) - 1");
//GM
$objPHPExcel->getActiveSheet()->setCellValue("{$columns['ty_gross_margin']}$i", "=SUM({$columns['ty_gross_margin']}2:{$columns['ty_gross_margin']}$x)");
$objPHPExcel->getActiveSheet()->setCellValue("{$columns['ly_gross_margin']}$i", "=SUM({$columns['ly_gross_margin']}2:{$columns['ly_gross_margin']}$x)");
$objPHPExcel->getActiveSheet()->setCellValue("{$columns['gross_margin_dollar_change']}$i", "={$columns['ty_gross_margin']}$i - {$columns['ly_gross_margin']}$i");
$objPHPExcel->getActiveSheet()->setCellValue("{$columns['gross_margin_percent_change']}$i", "=({$columns['ty_gross_margin']}$i / {$columns['ly_gross_margin']}$i) - 1");

//GM %
$objPHPExcel->getActiveSheet()->setCellValue("{$columns['ty_gross_margin_percent']}$i", "={$columns['ty_gross_margin']}$i / {$columns['ty_net_sales']}$i");
$objPHPExcel->getActiveSheet()->setCellValue("{$columns['ly_gross_margin_percent']}$i", "={$columns['ly_gross_margin']}$i / {$columns['ly_net_sales']}$i");
$objPHPExcel->getActiveSheet()->setCellValue("{$columns['gross_margin_percent_var']}$i", "={$columns['ty_gross_margin_percent']}$i - {$columns['ly_gross_margin_percent']}$i");

//Units
$objPHPExcel->getActiveSheet()->setCellValue("{$columns['ty_sales_units']}$i", "=SUM({$columns['ty_sales_units']}2:{$columns['ty_sales_units']}$x)");
$objPHPExcel->getActiveSheet()->setCellValue("{$columns['ly_sales_units']}$i", "=SUM({$columns['ly_sales_units']}2:{$columns['ly_sales_units']}$x)");
$objPHPExcel->getActiveSheet()->setCellValue("{$columns['sales_units_number_change']}$i", "={$columns['ty_sales_units']}$i - {$columns['ly_sales_units']}$i");
$objPHPExcel->getActiveSheet()->setCellValue("{$columns['sales_units_percent_change']}$i", "=({$columns['ty_sales_units']}$i / {$columns['ly_sales_units']}$i) - 1");

// Rename worksheet
$objPHPExcel->getActiveSheet()->setTitle('Sales Overview');

//STYLE
$objPHPExcel->getActiveSheet()->getStyle("A$i:$l$i")->getFont()->setBold(true); //Bold
for($j = "A"; $j < $l; $j++){
	$objPHPExcel->getActiveSheet()
	    ->getColumnDimension("$j")
	    ->setAutoSize(true);
}

// Currency
$objPHPExcel->getActiveSheet()->getStyle("{$columns['ty_net_sales']}1:{$columns['net_sales_dollar_change']}$i")->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_CURRENCY_USD_SIMPLE);
$objPHPExcel->getActiveSheet()->getStyle("{$columns['ty_gross_margin']}1:{$columns['gross_margin_dollar_change']}$i")->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_CURRENCY_USD_SIMPLE);
$objPHPExcel->getActiveSheet()->getStyle("{$columns['push_pull']}1:{$columns['push_pull']}$i")->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_CURRENCY_USD_SIMPLE);
// %
$objPHPExcel->getActiveSheet()->getStyle("{$columns['net_sales_percent_change']}1:{$columns['net_sales_percent_change']}$i")->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_PERCENTAGE_00);
$objPHPExcel->getActiveSheet()->getStyle("{$columns['gross_margin_percent_change']}1:{$columns['gross_margin_percent_change']}$i")->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_PERCENTAGE_00);
$objPHPExcel->getActiveSheet()->getStyle("{$columns['ty_gross_margin_percent']}1:{$columns['gross_margin_percent_var']}$i")->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_PERCENTAGE_00);
$objPHPExcel->getActiveSheet()->getStyle("{$columns['sales_units_percent_change']}1:{$columns['sales_units_percent_change']}$i")->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_PERCENTAGE_00);
$objPHPExcel->getActiveSheet()->getStyle("{$columns['percent_of_business']}1:{$columns['percent_of_business']}$i")->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_PERCENTAGE_00);


/*
$objConditional2 = new PHPExcel_Style_Conditional();
$objConditional2->setConditionType(PHPExcel_Style_Conditional::CONDITION_CELLIS)
                ->setOperatorType(PHPExcel_Style_Conditional::OPERATOR_LESSTHAN)
                ->addCondition('0');
$objConditional2->getStyle()->getFont()->getColor()->setARGB(PHPExcel_Style_Color::COLOR_RED);

$objPHPExcel->getActiveSheet()->getStyle("E1")->setConditionalStyles($objConditional2);
$objPHPExcel->getActiveSheet()->duplicateConditionalStyle(
				$objPHPExcel->getActiveSheet()->getStyle("E1")->getConditionalStyles(),
				"E2:$l$i"
			  );
*/



// Set active sheet index to the first sheet, so Excel opens this as the first sheet
$objPHPExcel->setActiveSheetIndex(0);

$now = date('m_d_Y',time());

// Redirect output to a clientâs web browser (Excel2007)
header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
header("Content-Disposition: attachment;filename=Overview_Sales_{$now}.xlsx");
header('Cache-Control: max-age=0');
// If you're serving to IE 9, then the following may be needed
header('Cache-Control: max-age=1');

// If you're serving to IE over SSL, then the following may be needed
header ('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past
header ('Last-Modified: '.gmdate('D, d M Y H:i:s').' GMT'); // always modified
header ('Cache-Control: cache, must-revalidate'); // HTTP/1.1
header ('Pragma: public'); // HTTP/1.0

$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
$objWriter->save('php://output');
exit;

