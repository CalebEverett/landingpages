<?php $hsformid = array("'545c7910-b015-4811-8d20-f84323b7012e'","'9687166b-9eab-4e85-9157-dffd6a8208f0'");?>

<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="author" content="Career College of California">
  <meta name="description" content="Forms test">
  <link id="favicon" rel="shortcut icon" href="images/favicon.png" />
  <title>Forms test</title>
  <meta id="meta" name="viewport" content="width=device-width initial-scale=1.0" />
  <!--[if lte IE 8]>
     <script charset="utf-8" type="text/javascript" src="//js.hsforms.net/forms/v2-legacy.js"></script>
  <![endif]-->
  <script charset="utf-8" type="text/javascript" src="//js.hsforms.net/forms/v2.js"></script>
</head>
<body>
  <div id="form1" style="display: block;margin: 10px">
      <script>
        hbspt.forms.create({ 
          css: '',
          portalId: '164638',
          formId: <?php echo $hsformid[0]; ?>
        });
      </script> 
  </div>
  <div id="form2" style="display: block;margin: 10px">
      <script>
        hbspt.forms.create({ 
          css: '',
          portalId: '164638',
          formId: <?php echo $hsformid[1]; ?>
        });
      </script> 
  </div>
</body>