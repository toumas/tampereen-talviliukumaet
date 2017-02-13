<!DOCTYPE html>
<html lang="fi">
<head>
	<title>Tampereen Talviliukumäet</title>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
    <script src="https://code.jquery.com/jquery-3.1.1.min.js"
      integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8="
      crossorigin="anonymous"></script>
    <script type="text/javascript" src="./myscript.js"></script>
    <link rel="stylesheet" type="text/css" href="main.css">
    <link async defer href="https://fonts.googleapis.com/css?family=Crimson+Text|Julius+Sans+One" rel="stylesheet"> 
</head>
<body>
    <header></header>
    <main>
        <div class="container">
            <h1>Tampereen talviliukumäet</h1>
            <div id="map"></div>
                <?php
                    $url = 'http://www.tampere.fi/kulttuuri-ja-vapaa-aika/liikunta/liikuntapaikat/ulkoliikuntapaikat/jaamaet.html';
                    $content = file_get_contents($url);
                    $first_step = explode('<div class="korostuslaatikko">' , $content);
                    $second_step = explode("</div>" , $first_step[1]);
                    if($second_step[0] != "") {
                        print '<div id="response" class="warning"><h2>Huomio!</h2><button type="button" class="close">×</button>';
                        print $second_step[0];
                        print '</div>';
                    }
                ?>
            <div id="flex-container"></div>
        </div>
    </main>
    <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAdQOamyy5oRrfP-YZEDqTZPcf7kVB2p7A&callback=initMap"></script>
</body>
</html>