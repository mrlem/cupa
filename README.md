# Cupa

*A super-easy to use tool to build web-pages that your users can customize themselves.*

If you know how to write a webpage in HTML5 / CSS, this should be enough to use Cupa: no knowledge about Javascript, PHP, or MySQL is required.

## Installation

* change the password in api/login.php ($adm_pw) to your liking (default is 'secret')
* just drop all files from the repo somewhere in the doc root of your PHP enabled web-server (make sure that you web server has write access to the data directory)
* go to: http://**your_server**/**your_path**/sample.html

## Usage

Check sample.html for a working example. Here's a brief explanation:

### For the user: editing the content:

* click "Connect" at the bottom left corner of the sample page
* enter the default user credentials:
    * user: admin
    * password: **your_password**

### For the web-page developer:

* create your web-page
* include the cupa CSS in your headers:

```html
<link rel="stylesheet" href="styles/cupa.css" type="text/css" />
```

* include the jquery library in your headers:

```html
<script src="js/lib/jquery-min.js"></script>
```

* include the cupa library just before the end of your body:

```html
<script src="js/cupa.js"></script>
```

* to make a text or an image editable, make sure the element (and img, div, p, ...) has an id, and add:

```html
<element id="my-id" class="cupa-editable">
```

* to make elements visible only when the user is authenticated, add:

```html
<element class="cupa-connected">
```

* to make elements visible only when the user is not authenticated, add:

```html
<element class="cupa-notconnected">
```

* to prompt the user for authentication, add:

```html
<element onclick="cupa.askConnect(); return false;">
```

* to enable to user to disconnect, add:

```html
<element onclick="cupa.disconnect(); return false;">
```

## FAQ

* *What does Cupa stand for?*

    -- **CU**stomizable **PA**ge

* *Could you please add feature XXX to Cupa?*

    -- Probably not, but contributions are welcome :o)

* *I use Microsoft Internet Explorer / Edge, and something doesn't work, could you fix it?*

    -- No (I don't have any Windows computer), but contributions are welcome :o)

* *How secure is Cupa authentication?*

    -- Decent for a personal usage, but not very much nevertheless: credentials are just sent over the network. To avoid interception, deploy Cupa on an HTTPS server.
    
* *What if the page users use big pictures? won't the page become heavy?*

    -- Cupa resizes pictures based on width/height attributes specified in the HTML for the image.
    
* *Are there any requirements for Cupa to run?*

    -- Yes, your hosting should support PHP, with GD module (which allows Cupa to resize images).
