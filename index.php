<?php
    require_once 'src/EntityClasses/php/User.php';

    if ( isset($_REQUEST['page']) ) {
        if ( User::isLoggedIn() ) {
            switch ( $_REQUEST['page'] ) {
                
                case 'crm':
                    break;
                
                default:
                    header('Location: ?page=crm');
                    break;
            }
        }
        else {
            switch ( $_REQUEST['page'] ) {
                
                case 'register':
                    break;
                
                default:
                    header('Location: ?page=register');
                    break;
            }
        }
    }
    else {
        header('Location: ?page=register');
    }
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Bootstrap, from Twitter</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">

    <!-- Le styles -->
    <link href="src/bootstrap/css/bootstrap.min.css" rel="stylesheet">
    <link href="src/UI/font-awesome/css/font-awesome.min.css" rel="stylesheet">
    <link href="src/UI/alertify.js-shim-0.3.8/themes/alertify.core.css" rel="stylesheet">
    <link href="src/UI/alertify.js-shim-0.3.8/themes/alertify.bootstrap.css" rel="stylesheet">
    <link href="src/UI/jquery.formulate/src/select2-release-3.2/select2.css" rel="stylesheet">
    <link href="src/UI/bootstrap-editable/css/bootstrap-editable.css" rel="stylesheet">
    <link href="src/custom.css" rel="stylesheet">
    <style type="text/css">
      body {
        padding-top: 60px;
      }

      @media (max-width: 980px) {
        /* Enable use of floated navbar text */
        .navbar-text.pull-right {
          float: none;
          padding-left: 5px;
          padding-right: 5px;
        }
      }
    </style>
    <link href="src/bootstrap/css/bootstrap-responsive.min.css" rel="stylesheet">

    <!-- HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
      <script src="../assets/js/html5shiv.js"></script>
    <![endif]-->

    <!-- Fav and touch icons -->
    <link rel="apple-touch-icon-precomposed" sizes="144x144" href="../assets/ico/apple-touch-icon-144-precomposed.png">
    <link rel="apple-touch-icon-precomposed" sizes="114x114" href="../assets/ico/apple-touch-icon-114-precomposed.png">
      <link rel="apple-touch-icon-precomposed" sizes="72x72" href="../assets/ico/apple-touch-icon-72-precomposed.png">
                    <link rel="apple-touch-icon-precomposed" href="../assets/ico/apple-touch-icon-57-precomposed.png">
                                   <link rel="shortcut icon" href="../assets/ico/favicon.png">
  </head>

  <body>
    <script type="text/javascript">
        var MODULE                   = '<?php echo $_REQUEST['page']; ?>';
        var USER_ID                  = <?php echo isset($_SESSION['User_id']) ? $_SESSION['User_id'] : 0; ?>;
        var ORGANIZATION_ID          = <?php echo isset($_SESSION['Organization_id']) ? $_SESSION['Organization_id'] : 0; ?>;
        var ORGANIZATION_ACCOUNTID   = <?php echo isset($_SESSION['Organization_AccountId']) ? $_SESSION['Organization_AccountId'] : 0; ?>;
        var ORGANIZATION_ACCOUNTNAME = '<?php echo isset($_SESSION['Organization_AccountName']) ? $_SESSION['Organization_AccountName'] : ''; ?>';
        var USER_CONTACTID           = <?php echo isset($_SESSION['User_ContactId']) ? $_SESSION['User_ContactId'] : 0; ?>;
        var USER_CONTACTNAME         = '<?php echo isset($_SESSION['User_ContactName']) ? $_SESSION['User_ContactName'] : ''; ?>';
    </script>
    <script data-main="src/main" src="src/loaders/require.js"></script>
  </body>
</html>