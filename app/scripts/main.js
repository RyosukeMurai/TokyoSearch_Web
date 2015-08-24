$(function () {
// initialize function
    $.fn.extend({
        'render': function (url, data, async) {
            return $.when(
                $.ajax({
                    type: 'get',
                    url: url,
                    async: async || false,
                    success: $.proxy(function (value) {
                        $(this).append($.templates(value).render(data));
                    }, this)
                })
            );
        }
    });

    var urlManager = (function (env) {
        var _domain = document.domain.match(/localhost/i) ? env.domainOfDev : env.domainOfWeb;
        var _urlbuilder = function (command) {
            return env.protocol+'://'+_domain+'/'+command;
        };
        var _post = function (command, parameter, callback) {
            $.ajax({
                type: 'get',
                url: command,
                data: parameter,
                async: true,
                dataType: 'jsonp',
                success: callback,
                error: function (result) {
                    console.log(result);
                }
            });
        }
        return {
            'domain': _domain,
            'affiliate': {
                'amazonAffiliateFile': './external/amazon.html'
            },
            'getMixedPosts': function (parameter, callback) {
                _post(_urlbuilder('api/post/posts-by-location'), parameter, callback);
            },
            'getPlaces': function (parameter, callback) {
                _post(_urlbuilder('api/place'), parameter, callback);
            }
        };
    }({
        'domainOfWeb': 'tokyosearch.herokuapp.com',
        'domainOfDev': 'tokyosearch.vagrant',
        'protocol': 'http'
    }));

    $.extend(
        {
            'tokyo': {
                'config': {}
                , 'urlManeger': urlManager
                , 'initApps': function () {
                    $.tokyo.initMatelialize();
                    $.tokyo.addEventListeners();
                    $.tokyo.initGoogleMap();
                    $.tokyo.renderAffiliate();
                }
                , 'initMatelialize': function () {
                    $('.button-collapse').sideNav();
                    $('.parallax').parallax();
                }
                , 'addEventListeners': function () {
                    $('#start').on('click', function () {
                        $.tokyo.popupPlaces();
                    });
                }
                , 'renderAffiliate': function () {
                    $('.affiliate').render($.tokyo.urlManeger.affiliate.amazonAffiliateFile);
                }
                , 'initGoogleMap': function () {
                    //render
                    $.tokyo.getLocation(function(location) {
                        var map = new google.maps.Map($('.googlemap').get(0), {
                            center:new google.maps.LatLng(location.coords.latitude,location.coords.longitude),
                            zoom:10,
                            region:'jp'
                        });

                        google.maps.event.addListener(map, 'click', function(e) {
                            //$.tokyo.popupPlaces({latitude: e.latLng.lat(), longitude: e.latLng.lng()});
                            $.tokyo.renderPosts({latitude: e.latLng.lat(), longitude: e.latLng.lng()});
                        });

                        $.tokyo.map = map;
                    });

                }
                , 'getLocation': function (callback) {
                    navigator.geolocation.getCurrentPosition(
                        function (result) {
                            callback(result);
                        },
                        function () {
                        },
                        {
                            enableHighAccuracy: true,
                            timeout: 6000,
                            maximumAge: 600000
                        }
                    );
                }
                , 'renderPosts': function(coords){
                    $.tokyo.urlManeger.getMixedPosts(coords, function(json){
                        $('.content').children().remove();
                        $('.content').render('./templates/content.html', json);
                    });
                }
                , 'popupPlaces': function (coords) {
                    $('.modal_wrap').children().remove();
                    var popup = function(coords){
                        $.tokyo.urlManeger.getPlaces(coords, function(json){
                            $('.modal_wrap').render('./templates/modal.html', json);
                            $('.modal .collection-item').on('click', function () {
                                $.tokyo.renderPosts($(this).attr('data-id'));
                                $('.modal').closeModal();
                            });
                            $('.modal').openModal();
                        });
                    };
                    if(coords) return popup(coords);

                    $.tokyo.getLocation(function (result) {
                        popup(result.coords);
                    });
                }
            }
        });

    $.tokyo.initApps();
});
