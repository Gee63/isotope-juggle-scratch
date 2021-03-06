(function ($, window, document, undefined) {

  'use strict';

  $(function () {
    // FireShell


    console.log('ready');

    var $ = jQuery,
    /*change this var to number of solved puzzle pieces*/
      solved = 10,
    /*don't edit this var*/
      juggle = 0,
      scratch,
      progress = 100;


    // initialize Isotope --Start
    var $container = $('.isotope').isotope({
      itemSelector: '.element-item',
      layoutMode: 'fitRows',
      getSortData: {
        number: '.number parseInt'
      }
    });

    // bind sort button click. this is hidden - used for testing
    $('#sorts').on('click', 'button', function () {
      var sortByValue = $(this).attr('data-sort-by');
      $container.isotope({sortBy: sortByValue});
    });

    // change is-checked class on buttons. this is hidden - used for testing
    $('.button-group').each(function (i, buttonGroup) {
      var $buttonGroup = $(buttonGroup);
      $buttonGroup.on('click', 'button', function () {
        $buttonGroup.find('.is-checked').removeClass('is-checked');
        $(this).addClass('is-checked');
      });
    });

    /*apply progress to progress bar*/
    $('.main-container .progress-container p').html(progress + '%');
    /*change the color of the text when progress is over 90 because colors are clashing*/
    if (progress >= 90) {
      $('.main-container .progress-container p').css('color', '#f6efbb');
    }

    function Progress() {
      $('.main-container .progress-container .full .inner').css('height', progress + '%');

      /*add the shine class to the progess lights when 100% is reached*/
      if (progress === 100) {
        $('.main-container .progress-container .full .inner').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
          $('.main-container .progress-container .shine').css('display', 'block');

          /*set scratch to true -- this enables the scratch popup to open when a block is clicked*/
          scratch = true;
        });
      }
      else {
        /*block scratch popup from opening*/
        scratch = false;
      }
    }

    /*applies the order of the pieces*/
    function ApplyNumbers() {
      /*sorts the solved pieces into correct order*/
      for (var i = 1; i <= solved; i++) {
        $('.isotope :nth-child(' + i + ') .number').html(i);
      }

      /*increase solved by 1 so that nth child values start at 1 and not 0*/
      solved = solved + 1;

      /* attaches a class of random to any puzzle item that has not been solved*/
      $('.isotope :nth-child(n+' + solved + '):nth-child(-n+24) .number').addClass('random');

      /*applies a random number to any item that has the random class and has yet to be solved*/
      if ($('.number').hasClass('random')) {
        /*minus 1 from solved so that random number is generated between the solved amount and 10 000 - we dont want duplicate sorted entries */
        solved = solved - 1;
        $('.random').each(function () {
          /*generate the random number for each block with .random class*/
          var randomNumber = Math.floor((Math.random() * 10000) + solved);
          /*add the random number to the element*/
          $(this).html(randomNumber);
        });
      }
    }

    /*sorts the items in order of their number*/
    function Sort() {
      /*console.log('apply Sort');*/
      var sortByValue = 'number';
      $container.isotope({sortBy: sortByValue});
      new Progress();
    }

    /*this functions shuffles the items*/
    function Shuffle() {
      /*shuffle blocks*/
      $container.isotope('shuffle');
      /*add 1 to solved because we are targetting nth children and dont want a 0 being passed*/
      solved = solved + 1;
      $('.isotope :nth-child(n+' + solved + '):nth-child(-n+24)').addClass('blocked');

      /*reset solved before looping again  -- this code gets called for every shuffle*/
      solved = solved - 1;
      juggle++;

      /*edit the condition number to increase / decrease the number of times a shuffle happens before sorting*/
      if (juggle >= 3) {
        /*this reload method reloads isotope once DOM manipulation has occurred ie: once numbers and random numbers have been injected*/
        $container.isotope('reloadItems');

        /*apply the Sort method*/
        window.setTimeout(Sort, 500);
        return;
      }

      /*shuffle every 0,5 seconds*/
      window.setTimeout(Shuffle, 500);

    }

  /*call methods*/
    new Shuffle();
    new ApplyNumbers();

    /*open the scratch card when blocked item is clicked and scratch is true*/
    $('.isotope').on('click', '.blocked', function () {
      if (scratch) {
        $('.scratch-container').fadeIn();
        $('.scratch-container .outer .inner').css('opacity', '1');
      }
      else {
        /*do nothing*/
      }
    });

  });

  // initialize Isotope --End


//initialize scratch card --Start
  /*scratch card vars*/
  /*edit level var to display current level*/
  var level = '1',

  /*don't edit*/
    prize = ['1', '2', '3', '4', '5', '6',],
    randomItem = prize[Math.floor(Math.random() * prize.length)];


  /*initialize scratch pad*/
  $('#scratchpad').wScratchPad({
    bg: 'assets/img/prize-' + randomItem + '.png',
    fg: 'assets/img/scratch-' + level + '.jpg',
    size: 20,

    scratchMove: function (e, percent) {
      /*clear scratch area after 50% has been scratched and show prize*/
      if (percent > 50) {
        this.clear();
        $('.prize-detail').fadeIn();
      }
    }
  });
  //initialize scratch card --End


  /*apply active color to current prize status*/
  switch (level) {
    case '1':
      $('.main-container .prize-status-container .status.silver').addClass('active');
      break;
    case '2':
      $('.main-container .prize-status-container .status.gold').addClass('active');
      break;
    case '3':
      $('.main-container .prize-status-container .status.diamond').addClass('active');
      break;
  }


  /*more info popup*/
  $('.info-popup-btn').click(function () {
    $('.info-popup').fadeIn();
  });

  $('.close-info').click(function () {
    $('.info-popup').fadeOut();
  });


})(jQuery, window, document);




