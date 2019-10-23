
<?php
$root = realpath($_SERVER["DOCUMENT_ROOT"]);
include "$root/includes/db_connect_new.php";


$get_reports = mysql_query("SELECT title, description FROM dashboard.report_types") or die(mysql_error());

while($rows = mysql_fetch_array($get_reports)){
	$description = $rows['description'];
	$title = $rows['title'];
	$sql = $rows['sql'];
	$type = $rows['type'];
	
	$results[] = array(
		'description' =>$description,
		'title' => $title,
		'sql' => $sql,
		'type' => $type,
		);
}
echo json_encode($results);
?>
