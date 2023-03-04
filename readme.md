# DRAWINGFLY API

## INTRODUCTION
<hr>

There are a lot of situations in which we have to create an system which we can use to draw. Like if we have to make an app which needs to store the the signature of the user which he has to draw, or we need to the user to draw a image for the image editing app, or we are working on a project to enable user to type by drawing letters, in all this we need a drawing system. For creating advances drawing system, it takes many days. So you can use this API which enables you to implement an advanced drawing system in your application.


## Basic Structure
<hr>

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>title</title>
    <script src="https://flytsapp.github.io/drawingfly/drawingflyapi.js"></script><!-- Or relative path to drawingfly where downloaded -->
</head>
<body>
    <canvas id="cnv"></canvas>
    <script>
        const canvas = document.getElementById("cnv");
        const surface = new FlySurface(canvas, 0, 0, 0, 1, 1);
    </script>
</body>
</html>
```

## Getting Started
You can get the drawingflyapi.js file [here](https://flytsapp.github.io/drawingfly/drawingflyapi.js)

To start, first import this javascript file in head of document
```html
<html>
<script src="https://flytsapp.github.io/drawingfly/drawingflyapi.js"></script><!-- Or relative path to drawingfly where downloaded -->
</html>
```

For docs visit [flytsapp docs](https://flytsapp.github.io/drawingflyapi)
