/**
 * Smoothload - Prototype plugin for smooth loading images
 *
 * Copyright (c) 2013 Ludovic Drin from humansix
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://open.humansix.com/projects/Smoothload
 *
 * Version:  0.1
 *
 */
 
var Smoothload = Class.create();

Smoothload.prototype = {

	initialize: function(options) {
    this.settings = {     
        element      : 'img',
        threshold    : 0,
        failurelimit : 0,
        event        : 'scroll',
        effect       : 'appear',
        effectspeed  : 1,    
        delayed      : false,  
        container    : window
    };
            
    if(options) {
      Object.extend(this.settings, options);
    }
                                  
    var delay = 0;  
    var smooth = this;              
    if ("scroll" == this.settings.event) {
      Event.observe(this.settings.container, 'scroll', function(event) {
        smooth.displayVisible();
      });
    }                         
    var count = 1;
    $$(this.settings.element).each(function(e, i) {
      var self = e;       
      self.loaded = false;
      Event.observe(self, 'element:appear', function() {
        if (!self.loaded) { 
          self.hide();
          self.src = self.getAttribute('data-original');
          switch(smooth.settings.effect) {
            case 'appear' :
              smooth.settings.delayed ? self.appear({duration: smooth.settings.effectspeed, queue: {position: 'end', scope: 'smoothload'}}) : self.appear({duration: smooth.settings.effectspeed});
              break;                           
            case 'blindDown' :
              smooth.settings.delayed ? new Effect.BlindDown(self, {duration: smooth.settings.effectspeed, queue: {position: 'end', scope: 'smoothload'}}) : new Effect.BlindDown(self); 
              break;                          
            case 'slideDown' :
              var slidename = self.readAttribute('id') ? self.readAttribute('id') + '-slidedown' : 'smoothload-slidedown-' + count.toString();
              self.replace('<div id="' + slidename + '"><div>' + self.innerHTML + '</div></div>');
              smooth.settings.delayed ? new Effect.SlideDown(slidename, {duration: smooth.settings.effectspeed, queue: {position: 'end', scope: 'smoothload'}}) : new Effect.SlideDown(slidename); 
              break;                          
            case 'grow' :
              smooth.settings.delayed ? new Effect.Grow(self, {duration: smooth.settings.effectspeed, queue: {position: 'end', scope: 'smoothload'}}) : new Effect.Grow(self); 
              break;
            default :
              smooth.settings.delayed ? self.appear({duration: smooth.settings.effectspeed, queue: {position: 'end', scope: 'smoothload'}}) : self.appear({duration: smooth.settings.effectspeed});
              break;
          }              
          count++;
          self.loaded = true;
        }
      });   
      if ("scroll" != smooth.settings.event) {
        Event.observe(e, smooth.settings.event, function(event) {
            if (!self.loaded) {
              self.fire("element:appear");
            }
        });
      }  
    });    
    
    if (this.settings.event == 'scroll') {
      this.displayVisible();
    }
  },
  
  displayVisible: function () {   
    var smooth = this;          
    $$(this.settings.element).each(function(e, i) {
      if (smooth.aboveTheTop(e) || smooth.leftOfBegin(e)) {
        // nothing
      } else if (!smooth.belowTheFold(e) && !smooth.rightOfFold(e)) {     
          e.fire("element:appear");     
      } else {              
        if (counter++ > smooth.settings.failurelimit) {
          return false;
        }
      }
    });
  },
  
  belowTheFold: function(element) {       
    if (this.settings.container === undefined || this.settings.container === window) {
      var fold = document.viewport.getHeight() + document.viewport.getScrollOffsets().top;  
    } else {
      var fold = this.settings.container.offset().top + this.settings.container.getHeight();       
    }
    return fold <= element.cumulativeOffset().top - this.settings.threshold;
  },
  
  rightOfFold: function(element) {
    if (this.settings.container === undefined || this.settings.container === window) {
      var fold = document.viewport.getWidth() + document.viewport.getScrollOffsets().left;
    } else {
      var fold = this.settings.container.offset().left + this.settings.container.getWidth();
    }
    return fold <= element.cumulativeOffset().left - this.settings.threshold;
  },
  
  aboveTheTop: function(element) {
    if (this.settings.container === undefined || this.settings.container === window) {
      var fold = document.viewport.getScrollOffsets().top;
    } else {
      var fold = this.settings.container.offset().top;
    }
    return fold >= element.cumulativeOffset().top + this.settings.threshold  + element.getHeight();
  },
  
  leftOfBegin: function(element) {
    if (this.settings.container === undefined || this.settings.container === window) {
      var fold = document.viewport.getScrollOffsets().left;
    } else {
      var fold = this.settings.container.offset().left;
    }
    return fold >= element.cumulativeOffset().left + this.settings.threshold + element.getWidth();
  }
    
};