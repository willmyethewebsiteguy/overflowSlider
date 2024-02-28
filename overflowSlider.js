/* ==========
 * Overflow Slider 1.1
 * Slider For Squarespace 7.1 / 7.0
 * This Code is licensed by Will-Myers.com 
========== */
function OverflowSlider($id, count, drag, disableClick){
  thisObj = this;
  thisObj.id = $id;
  thisObj.idSelector = '#' + $(thisObj.id).attr('id');
  thisObj.slides = $($id).find('.summary-item-list');
  thisObj.count = count;
  thisObj.drag = drag;
  thisObj.disableClick = disableClick == "true" ? true : false;
  thisObj.data = JSON.parse($($id).attr('data-block-json'));
  
  function getSizing(){
    thisObj.margin = (thisObj.data.gutter) + 'px';
    thisObj.width = $(thisObj.id).find('.summary-item:nth-of-type(2)').css('width') || '34px';
    thisObj.widthVal = $(thisObj.id).find('.summary-item:nth-of-type(2)').css('width')?.replace("px", "")  ||  '34';
    thisObj.marginVal = parseInt($(thisObj.id).find('.summary-item:first-of-type').css('margin-right')) / 2  || '34px' ;
  }    
  
  getSizing();

  let fluidBlock = document.querySelector(thisObj.idSelector).closest('.fe-block');
  if (fluidBlock && (window.top !== window.self)) {
    
    function watchForEditMode(instance) {
      let elemToObserve = document.querySelector("body");
      let prevClassState = elemToObserve.classList.contains("sqs-edit-mode-active");
      let observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          if (mutation.attributeName == "class") {
            let currentClassState = mutation.target.classList.contains("sqs-edit-mode-active");
            if (prevClassState !== currentClassState) {
              prevClassState = currentClassState;
              if (currentClassState) {
                let styles = `<style>
                body.sqs-edit-mode-active ${$id} .summary-item:not(:first-of-type){
                    display:none !important;
                  }
                </style>`;
                document.head.insertAdjacentHTML('afterbegin', styles);
              }
            }
          }
        });
      });
      observer.observe(elemToObserve, { attributes: true });
    }
    watchForEditMode();
  }

  /*Setup CSS*/
  $(thisObj.id).addClass('wm-overflow-slider');
  $(thisObj.id).addClass('wm-overflow-' + count);

  /*Adjust Left Side*/
  function checkLeft(){
    let offset = 17;
    if (fluidBlock) {
      offset = 0;
    }
    let leftOffSet = $($id).offset().left + offset + 'px';
    $($id)[0].style.setProperty('--leftOffSet', leftOffSet);
  } 
  
  if (thisObj.disableClick){
    $(thisObj.id).find('.summary-item a').each(function(){
      $(this).attr('href', 'javascript:void(0)');
      $(this).css('cursor', 'grab')
    });
  }

  /*Setup Buttons*/
  //$('<div></div>').insertAfter($(thisObj.id));
  $(thisObj.id).append('<div class="carousel-buttons"><div class="carousel-btn left"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" aria-labelledby="title" aria-describedby="desc" role="img" xmlns:xlink="http://www.w3.org/1999/xlink"> <title>Angle Left</title><path data-name="layer1" fill="none" stroke="#202020" stroke-miterlimit="10" stroke-width="2" d="M39 20.006L25 32l14 12.006" stroke-linejoin="round" stroke-linecap="round"></path> </svg></div><div class="carousel-btn right"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" aria-labelledby="title" aria-describedby="desc" role="img" xmlns:xlink="http://www.w3.org/1999/xlink"><title>Angle Right</title><path data-name="layer1" fill="none" stroke="#202020" stroke-miterlimit="10" stroke-width="2" d="M26 20.006L40 32 26 44.006" stroke-linejoin="round" stroke-linecap="round"></path></svg></div></div>');

  /**/
  $(thisObj.id).css('--item-margin', thisObj.margin);
  $(thisObj.id).css('--item-width', thisObj.width);

  /*Get Each left Offset*/
  function findOffset(){
    $(thisObj.slides).find('.summary-item').each(function(){
      let offsetLeft = $(this).offset().left;
      $(this).attr('data-pos', offsetLeft);
    })
  }

  /*When Slider Stops, Get Position*/
  thisObj.slides.on('scroll', function (){
    clearTimeout( isScrolling );
    isScrolling = setTimeout(function() {
    }, 66);
  });

  /*Click & Drag Events*/
  const slider = document.querySelector(thisObj.idSelector + ' .summary-item-list');
  const rightBtn = document.querySelector(thisObj.idSelector + ' .carousel-btn.right');
  const leftBtn = document.querySelector(thisObj.idSelector + ' .carousel-btn.left');
  let isDown = false;
  let startX;
  let scrollLeft;
  let scrollLeftPos = 0,
      isScrolling;

  if (thisObj.drag !== 'false'){
    slider.addEventListener('mousedown', (e) => {
      isDown = true;
      slider.classList.add('active');
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
      slider.classList.remove('disable-click');
    });

    slider.addEventListener('mouseleave', () => {
      isDown = false;
      slider.classList.remove('active');
      slider.classList.remove('disable-click');
    });

    slider.addEventListener('mouseup', () => {
      isDown = false;
      slider.classList.remove('active');
      slider.classList.remove('disable-click');
    });

    slider.addEventListener('mousemove', (e) => {
      if (!isDown) return;  // stop the fn from running
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX);
      slider.scrollLeft = scrollLeft - walk;
      slider.classList.add('disable-click');
    });
  }

  /*Move Right*/
  rightBtn.addEventListener('click', (e) => {
    scrollLeft = slider.scrollLeft;
    
    slider.scrollLeft = scrollLeft + (parseInt(thisObj.widthVal) + (parseInt(thisObj.marginVal) * 2));
  })
  /*Move Left*/
  leftBtn.addEventListener('click', (e) => {
    getSizing();
    scrollLeft = slider.scrollLeft;
    slider.scrollLeft = scrollLeft - (parseInt(thisObj.widthVal) - (parseInt(thisObj.marginVal) * 2));
  })

  $(window).on('resize', function(){
    checkLeft();
    findOffset();
    getSizing();
  });

  checkLeft();
  findOffset();
  $(thisObj.id).addClass('carousel-loaded');

  function loadPluginImages() {
    var images = document.querySelectorAll('.wm-overflow-slider img[data-src]' );
    for (var i = 0; i < images.length; i++) {
      ImageLoader.load(images[i], {load: true});
      let focalAttr = images[i].getAttribute('data-image-focal-point').split(',');
      let position = '';
      focalAttr.forEach(item => position += ' ' + ((item * 100) + '%'));
      images[i].style.objectPosition = position;
    }
  }
  loadPluginImages();
  window.setTimeout(function(){
    $($id).find('.summary-item-list')[0].scrollLeft = 0;
  }, 200)
}

const wmVersion = Static.SQUARESPACE_CONTEXT.templateVersion;
if (wmVersion === "7"){
  if ($('[wm-plugin="overflow-slider"]').length){
    $('head').prepend('<link href="https://cdn.jsdelivr.net/gh/willmyethewebsiteguy/overflowSlider@1/overflowSlider.min.css" rel="stylesheet">');
    window.Squarespace.onInitialize(Y, function(){
      /*Constructor*/
      $('[wm-plugin="overflow-slider"]').each(function(i){
        let $id = $(this).closest('.sqs-block').prev(),
            count = i + 1,
            drag = $(this).attr('data-drag'),
            clickable = $(this).attr('data-disable-click') || false;
        new OverflowSlider($id, count, drag, clickable);
      });
    });
  }  
} else if (wmVersion === "7.1") {
  if ($('[wm-plugin="overflow-slider"]').length){
    $('head').prepend('<link href="https://cdn.jsdelivr.net/gh/willmyethewebsiteguy/overflowSlider@1/overflowSlider.min.css" rel="stylesheet">');
    $(function(){
      /*Constructor*/
      $('[wm-plugin="overflow-slider"]').each(function(i){
        let $id,
            count = i + 1,
            drag = $(this).attr('data-drag'),
            clickable = $(this).attr('data-disable-click') || false;
        if ($(this)[0].hasAttribute("data-block")) {
          $id = $(this)[0].getAttribute("data-block");
        } else {
          $id = $(this).closest('.sqs-block').prev();
        }
        try {
          new OverflowSlider($id, count, drag, clickable);
        } catch (err) {
          console.log('Error with loading the Overflow Plugin: ', err)
        }
      });
    });
  }  
} 
