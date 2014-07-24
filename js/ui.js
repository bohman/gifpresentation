(function($) {


  //
  // Setup
  //
  window.gif = {
    ref: {}
  };


  //
  // Settings
  //
  // Feel free to manipulate values below
  //
  gif.settings = {

    // Time between pictures (approximate - we start loading after this time,
    // so on slow connections it's this time + loading time. Not an issue after the image is saved in local cache.)
    delay: 7000
  };


  //
  // Init
  // 
  gif.init = {

    // References
    references: function() {
      gif.ref.url_base =  window.location.protocol + '//' + window.location.hostname + window.location.pathname;
      gif.ref.files_promise = gif.fn.get_data();
    },

    // Loading stuff
    start_loading: function() {
      gif.ref.files_promise.success(function(data){

        // Save references from promise
        gif.ref.files = data.files;
        gif.ref.url_directory = data.file_directory;
        gif.ref.count = data.count;

        // Build links that load images
        var gif_links = [];
        for(i = 0; i < gif.ref.files.length; i++) {
          var gif_link = '<a href="#" data-index="'+ i +'">'+ i +'</a>';
          gif_links.push(gif_link);
        }
        $('.select-picture').html(gif_links.join(''));

        // Make links actually load images
        $('.select-picture a').click(function(e){
          var image_index = $(this).data('index');
          gif.fn.load_image(gif.ref.files[image_index], image_index);
          e.preventDefault();
        })

        // Set amount of picture counter
        $('.amount-of-pictures').text(gif.ref.count);

        // Start loading
        var first_image_name = gif.ref.files[0];
        gif.fn.load_image(first_image_name, 0);
      });
    }
  };


  //
  // Functions
  // 
  gif.fn = {

    // Load image
    load_image: function(image_name, image_index) {

      // Clearing timeout in case we have one
      clearTimeout(gif.ref.image_timeout);

      // Determining where to place the image
      var insert_into = '.first-image';
      if($('body').hasClass('show-first-image')) {
        insert_into = '.second-image';
      }

      // Indicate we are loading an image
      if(!$('body').hasClass('show-no-image')) {
        $('body').addClass('loading');
      }

      // Loading the image
      var image_url = gif.ref.url_base + gif.ref.url_directory + '/' + image_name;
      $(insert_into).load(function(){

        // Updating counter
        $('.current-picture').text(image_index + 1);

        // Updating link active classes
        $('.select-picture a').not('[data-index="'+ image_index +'"]').removeClass('active');
        $('.select-picture a[data-index="'+ image_index +'"]').addClass('active');

        // Showing and hiding the two img elements
        $('body').removeClass('show-no-image').removeClass('loading');
        if(insert_into == '.first-image') {
          $('body').removeClass('show-second-image').addClass('show-first-image');
        } else {
          $('body').removeClass('show-first-image').addClass('show-second-image');
        }

        // Setting up for next load
        gif.ref.image_timeout = setTimeout(function(){
          var next_index = image_index + 1;
          if(!gif.ref.files.hasOwnProperty(next_index)) {
            next_index = 0;
          }
          gif.fn.load_image(gif.ref.files[next_index], next_index);
        }, gif.settings.delay);

        // Unbind
        $(this).unbind('load');
      }).attr('src', image_url);
    },

    // Used to get data from api
    get_data: function() {
      var endpoint = gif.ref.url_base + '/api.php';
      return $.ajax({
        url: endpoint,
        dataType: 'json',
        beforeSend: function() {
          //console.log('before');
        },
        complete: function() {
          //console.log('complete');
        },
        error: function(jqXHR, textStatus, errorThrown) {
          //console.log(errorThrown);
        },
        success: function(data) {
          if(status === 'success') {
            return data;
          }
        }
      });
    }
  };


  //
  // Go go go!
  //
  jQuery(document).ready(function() {

    // Run all setup functions
    for (var fn in gif.init) {
      if (gif.init.hasOwnProperty(fn)) {
        gif.init[fn]();
      }
    }
  });


}(jQuery));