$(function(){
    // initialize function
    $.fn.extend( {
        'render':function(url, data, async){
            return $.when(
                $.ajax({
                    type:'get',
                    url:url,
                    async:async || false,
                    success:$.proxy(function(value) {
                        $(this).append($.templates(value).render(data));
                    }, this)
                })
            );
        },
        'content':function(location_id){
            $.ajax({
                type:'get',
                url:'http://localhost:8081/api/default/posts',
                data:{location_id:location_id},
                async:true,
                dataType:'jsonp',
                success: $.proxy(function(json){
                    //$(this).empty();
                    $(this).render('./templates/content.tmpl', json);
                },this),
                error: $.proxy(function(result){
                    console.log(result);
                },this)
            });
        },
        'locations':function(position) {
            $.ajax({
                type: 'get',
                url: 'http://localhost:8081/api/default/locations',
                data: position,
                async: true,
                dataType: 'jsonp',
                success: $.proxy(function (json) {
                    $('.modal-content .collection').empty();
                    var tag = '<a href="#!" class="collection-item" data-id="{{:id}}">{{:name}}</a>';
                    $.each(json.data, function () {
                        $('.modal-content .collection').prepend($.templates(tag).render(this));
                    });
                    $(this).openModal();
                }, this),
                error: $.proxy(function (result) {
                    console.log(result);
                }, this)
            });
        },
        'twitter':function(position){
            $.ajax({
                type:'get',
                url:'http://localhost:8081/api/default/twitter',
                data:{position:position},
                async:true,
                dataType:'jsonp',
                success: $.proxy(function(json){
                    $(this).render('./templates/twitter.tmpl', json);
                },this),
                error: $.proxy(function(result){
                    console.log(result);
                },this)
            });
        }
    });

    $.extend({
        'config':{
            'baseUrl':'https://tokyosearch.herokuapp.com/',
            'baseUrlOfDev':'http://localhost:8081/',
            'commands':{
                'getMixedPosts':'api/posts' //GET POSTS FROM Twitter, Instagram and another
            },
            'affiliate':{
                'amazonAffiliateFile':'./external/amazon.html'
            }
        },
        'initApps':function(){
            $('.button-collapse').sideNav();
            $('.parallax').parallax();

            $(document).on('click', '.collection-item', function(){
                $('.content').content($(this).attr('data-id'));
                $('.modal').closeModal();
            });

            $('#start').on('click', function(){
                $.getLocation();
            });

            $.renderAffiliate();
        },
        'renderAffiliate':function(){
            $('.affiliate').render($.config.affiliate.amazonAffiliateFile);
        },
        'getLocation' :function(callback){
            navigator.geolocation.getCurrentPosition(
                function(result){
                    callback(result);
                },
                function(){
                },
                {
                    enableHighAccuracy:true,
                    timeout:6000,
                    maximumAge:600000
                }
            );
        },
        'accessApi' :function(target, parameter, callback) {
            $.ajax({
                type:'get',
                url:'http://localhost:8081/api/default/twitter',
                data:{position:position},
                async:true,
                dataType:'jsonp',
                success: $.proxy(function(json){
                    $(this).render('./templates/twitter.tmpl', json);
                },this),
                error: $.proxy(function(result){
                    console.log(result);
                },this)
            });
        }
    });
    $.initApps();
});
