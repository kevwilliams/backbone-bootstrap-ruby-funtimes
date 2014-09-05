Backbone / Bootstrap / Ruby Funtimes
================================

## What is it
Just some fun stuff with Backbone/Bootstrap and Ruby..

After looking around the insider program some more I saw somewhere mention Backbone, and Ruby mentioned so I decided to make something with a bit more of a front end feel in a browser and extend on the [original idea](https://github.com/kevwilliams/defcon-by-zappos). 

## How it works

* srv/scraper.rb is the Ruby web scraper that uses Mechanize to find all the Product links on a given Zappos URL and create tidy Objects to create a JSON output file for all the slots. The outputted JSON is all products for every slot.
* js/app.js is where the Backbone models/views live. This is the meat of the application logic and provides the AJAX functionality.
* index.html has the markup and is responsible for displaying the app

## See a demo
* [http://www.kevvo.es](http://www.kevvo.es)

## Conclusion
Ruby is fun, Backbone is awesome and Bootstrap is solid as always. Lots of fun was had here. I'll probably tinker on this a fair bit.