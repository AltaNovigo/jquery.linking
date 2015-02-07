/*!
 * jquery.linking v0.0.1 (http://alta-novigo.com/jquery-linking)
 * A jQuery plugin to link graphically elements in a simple way
 * Copyright 2015-2015 Alta Novigo
 * License: MIT
 */
(function($){

	$.fn.link = function(options){
		
		/* \/ SETTINGS \/ */
		options = options || {};
		var defaults = {
			typology:"fully-connected",
			style:"linear",
			class_element:"link-element",
			draggable_element:false,
			dyn_clear:true,
			box_sizing:"border-box",
			z_index:"0",
			cursor:"pointer",
			link_color:"black",
			link_width:"2",
			link_cap:"round",
			link_join:"round",
			link_shadow_blur:"0",
			link_shadow_offset_x:"0",
			link_shadow_offset_y:"0",
			link_shadow_color:"black"
		};
		var _settings = $.extend(defaults, options);
		/* /\ SETTINGS /\ */
		
		return this.each(function(){
		
			/* \/ VARIABLES \/ */
			var $container = $(this);
			var points_abs = [];
			var isobarycenter_default = { 'x': 0, 'y': 0 };
			var $support = $('<canvas>Your browser does not support the HTML5 canvas tag.</canvas>').appendTo(this);
			var ctx = $support.get(0).getContext("2d");
			var isDragging = false;
			/* /\ VARIABLES /\ */
			
			/* \/ FUNCTIONS \/ */
			function getIsobarycenter(){
				var sum_x = 0, sum_y = 0;
				for(var i=0; i < points_abs.length; i++){
					sum_x += points_abs[i].x;
					sum_y += points_abs[i].y;
				}
				if(points_abs.length === 0)
					return isobarycenter_default;
				else	
					return {
						'x': sum_x / points_abs.length,
						'y': sum_y / points_abs.length
					};
			}
			
			function drawNetwork(){
				if (points_abs.length > 1){
					if(_settings.dyn_clear)
						ctx.clearRect(0, 0, $support.width(), $support.height());
					ctx.beginPath();
					
					ctx.lineWidth = _settings.link_width;
					ctx.shadowBlur = _settings.link_shadow_blur;
					
					ctx.shadowOffsetX = _settings.link_shadow_offset_x;
					ctx.shadowOffsetY = _settings.link_shadow_offset_y;
					ctx.shadowColor = _settings.link_shadow_color;
					ctx.strokeStyle = _settings.link_color;
					ctx.lineCap = _settings.link_cap;
					ctx.lineJoin = _settings.link_join;
					
					for(var i=0; i < points_abs.length; i++){
						for(var j = i + 1; j < points_abs.length; j++){
							ctx.moveTo(points_abs[i].x, points_abs[i].y);
							if(_settings.style == "quadratic-isobarycentric"){
								var isobarycenter = getIsobarycenter();
								ctx.quadraticCurveTo(isobarycenter.x,isobarycenter.y,points_abs[j].x,points_abs[j].y);
							}else{
								ctx.lineTo(points_abs[j].x, points_abs[j].y);
							}
						}
					}
					ctx.stroke();
				}
			}
			
			function refreshNetwork(){
				points_abs = [];
				$container.find('.' + _settings.class_element).each(function(){
					points_abs.push({
						'x': $(this).offset().left + ($(this).outerWidth() / 2) - $container.offset().left - $container.css('border-left-width').replace('px',''),
						'y': $(this).offset().top + ($(this).outerHeight() / 2) - $container.offset().top - $container.css('border-top-width').replace('px','')
					});
				});
				drawNetwork();
			}
			
			function initCanvas($canvas){
				$canvas.attr("height", $container.height())
					.attr("width", $container.width())
					.css({
						"position" : "absolute",
						"left" : 0,
						"top" : 0,
						"overflow" : "none",
						"margin" : 0,
						"padding" : 0,
						"z-index" : _settings.z_index
					});
				refreshNetwork();
			}
			
			function initDraggableElements(){
				if(_settings.draggable_element){
					$container.find('.' + _settings.class_element).each(function(){
						$(this).css('position', 'absolute').css('cursor', _settings.cursor).draggable({
							drag : function(e,ui){
								if(ui.position.left < 1)
									ui.position.left = 0;
								if(ui.position.top < 1)
									ui.position.top = 0;
								if(ui.position.left > ($container.width() - $(this).outerWidth() - 1))
									ui.position.left = ($container.width() - $(this).outerWidth());
								if(ui.position.top > ($container.height() - $(this).outerHeight() - 1))
									ui.position.top = ($container.height() - $(this).outerHeight());
								}
						});
					});

					/* \/ EVENTS \/ */
					$(document).on('mousedown', function(e){
						isDragging = true;
					});
					$(document).on('mouseup', function (e) {
						isDragging = false;
					});
					$(document).on('mousemove', function(e){
						if(isDragging){
							refreshNetwork();
						}
					});
					/* /\ EVENTS /\ */
				}
			}
			
			function init($canvas){
				initCanvas($canvas);
				initDraggableElements();
			}
			/* /\ FUNCTIONS /\ */
			
			/* \/ LAUNCHING \/ */
			init($support);
			/* /\ LAUNCHING /\ */
			
		});
		
	};
}(jQuery));