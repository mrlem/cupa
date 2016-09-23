# Cupa

*A super-easy to use tool to build web-pages that your users can customize themselves.*

If you know how to write a webpage in HTML5 / CSS, this should be enough to use Cupa: no knowledge about Javascript, PHP, or MySQL is required.

## Installation

* change the password in api/login.php ($adm_pw) to your liking (default is 'secret')
* just drop all files from the repo somewhere in the doc root of your PHP enabled web-server
* go to: http://**your_server**/**your_path**/sample.html

## Usage

### For the web-page developer:

* create your web-page
* include the cupa CSS in your headers:

```<link rel="stylesheet" href="styles/cupa.css" type="text/css" />```

* include the jquery library in your headers:

```<script src="js/lib/jquery-min.js"></script>```

* include the cupa library just before the end of your body:

```<script src="js/cupa.js"></script>```

* to make a text or an image editable, make sure the element has an id, and add

```<... class="cupa-editable" ...>```

* to make elements visible only when the user is authenticated, add

```<... class="cupa-connected" ...>```

* to make elements visible only when the user is not authenticated, add

```<... class="cupa-notconnected" ...>```

### For the user: editing the content:

* click "Connect" at the bottom right corner of the sample page
* enter the default user credentials:
    * user: admin
    * password: **your_password**

## FAQ

* What does Cupa stand for?

    -- **CU**stomizable **PA**ge

* Could you please add feature XXX to Cupa?

    -- Probably not, but contributions are welcome :o)

* I use Microsoft Internet Explorer / Edge, and something doesn't work, could you fix it?

    -- No (I don't have any Windows computer), but contributions are welcome :o)

## TODO

* Better pitch to show who can use it: Cupa -> [HTML5/CSS developer] -> web-page -> [User] -> can edit the page

