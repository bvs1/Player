// duration
function readableDuration(seconds) {
    var sec = Math.floor(seconds),
        min = Math.floor(sec / 60);
    
        min = min >= 10 ? min : '0' + min;
        sec = Math.floor(sec % 60);
        sec = sec >= 10 ? sec : '0' + sec;
    return min + ':' + sec;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// player functionality 

//initalizing 
$.fn.playerInit = function(json) {
    if (json.tracks === undefined || json.tracks.length < 1) {
        console.log("Player error: json tracks undefined");
        return 1;
    }
    $(this).data('json', json);
    $(this).data('controls', {
        shuffle: false,
        repeat: false,
        nextTrack: 1
    });

    // for play/pause button
    $(this).on('click', '.play', function(e) {
        $(e.target).closest('.widget').find('audio')[0].play();
        $(e.target).removeClass('play');
        $(e.target).addClass('pause');
    });
    $(this).on('click', '.pause', function(e) {
        $(e.target).closest('.widget').find('audio')[0].pause();
        $(e.target).removeClass('pause');
        $(e.target).addClass('play');
    });

    // for volume control bar
    $(this).on('click', '.volume_control_bar', function(e) {
        var x = e.pageX - $(e.target).offset().left;
        $(e.target).closest('.widget').find('audio')[0].volume = x / $(e.target).width();
        $(e.target).closest('.widget').find('.volume_changer').css('left', x + 60);
    });

    //change background image
    var audio = $(this).find('audio')[0];
		$(this).find('.widget_body').css('background', 'url(' + json.tracks[0].img + ')');
		audio.src = json.tracks[0].src;

        
    audio.onended = function(e) {
        var controls = $(e.target).closest('.widget').data('controls');
        var jsonn = $(e.target).closest('.widget').data('json');
        if (controls.shuffle == true) {
            controls.nextTrack == getRandomInt(0, jsonn.tracks.length - 1);
        }
        if (controls.nextTrack >= jsonn.tracks.length && controls.repeat == true) {
            controls.nextTrack = 0;
        } else if (controls.nextTrack >= jsonn.tracks.length && controls.repeat == false) {
            return 1;
        }

        e.target.src = jsonn.tracks[controls.nextTrack].src;
				$(e.target).closest('widget').find('tittle p').html(jsonn.tracks[controls.nextTrack].artist + ' - ' + jsonn.tracks[controls.nextTrack].name);
				$(e.target).closest('.widget_body').css('background', 'url(' + json.tracks[controls.nextTrack].img + ')');
        controls.nextTrack++;
				e.target.play();

        $(e.target).closest('.widget').data('controls', controls);
        $(e.target).closest('.widget').trigger('trackchange');
    };


    audio.canplay = function(e) {
        var duration = readableDuration(e.target.duration);
        $(e.target).closest('.widget').find('.time p').html(duration);
    };

    audio.timeupdate = function(e) {
		$(e.target).closest('.widget').find('.progress_control').css('left', (e.target.currentTime / e.target.duration) * $(e.target).closest('.widget').find('.progress_bar').width());
	};

    // rewind button
    $(this).on('click', '.rewind', function(e) {
        var controls = $(e.target).closest('.widget').data('controls');
        var jsonn = $(e.target).closest('.widget').data('json')
        if (controls.shuffle) {
            controls.nextTrack = getRandomInt(0, jsonn.tracks.length - 1);
        } else {
            controls.nextTrack -= 2;
            if (controls.nextTrack < 0) {
                controls.nextTrack = jsonn.tracks.length - 1;
            }
        }

        $(e.target).closest('.widget').find('audio')[0].src = jsonn.tracks[controls.nextTrack].src;
				$(e.target).closest('widget').find('tittle p').html(jsonn.tracks[controls.nextTrack].artist + ' - ' + jsonn.tracks[controls.nextTrack].name);
				$(e.target).closest('.widget_body').css('background', 'url(' + json.tracks[controls.nextTrack].img + ')');
        controls.nextTrack++;
				$(e.target).closest('.widget').find('audio')[0].play();

        $(e.target).closest('.widget').data('controls', controls);
        $(e.target).closest('.widget').trigger('trackchange');
    });

    // forward button
    $(this).on('click', '.forward', function(e) {
        var controls = $(e.target).closest('.widget').data('controls');
        var jsonn = $(e.target).closest('.widget').data('json');
        if (controls.shuffle == true) {
            controls.nextTrack == getRandomInt(0, jsonn.tracks.length - 1);
        }
        if (controls.nextTrack >= jsonn.tracks.length && controls.repeat == true) {
            controls.nextTrack = 0;
        } else if (controls.nextTrack >= jsonn.tracks.length && controls.repeat == false) {
            return 1;
        }

        $(e.target).closest('.widget').find('audio')[0].src = jsonn.tracks[controls.nextTrack].src;
				$(e.target).closest('widget').find('tittle p').html(jsonn.tracks[controls.nextTrack].artist + ' - ' + jsonn.tracks[controls.nextTrack].name);
				$(e.target).closest('.widget_body').css('background', 'url(' + json.tracks[controls.nextTrack].img + ')');
				$(e.target).closest('.widget').find('audio')[0].play();
        controls.nextTrack++;

        $(e.target).closest('.widget').data('controls', controls);
        $(e.target).closest('.widget').trigger('trackchange');
    });

    // shuffle button
    $(this).on('click', '.shuffle', function(e) {
        var controls = $(e.target).closest('.widget').data('controls');
        if (controls.snuffle) {
            $(e.target).removeClass('active');
            controls.snuffle = false;
        } else {
            $(e.target).addClass('active');
            controls.snuffle = true;
        }

        $(e.target).closest('.widget').data('controls', controls);
    });

    // repeat button
    $(this).on('click', '.repeat', function(e) {
        var controls = $(e.target).closest('.widget').data('controls');
        if (controls.repeat) {
            $(e.target).removeClass('active');
            controls.repeat = false;
        } else {
            $(e.target).addClass('active');
            controls.repeat = true;
        }

        $(e.target).closest('.widget').data('controls', controls);
    });

    // progress bar
    $(this).on('click', '.progress_bar', function(e) {
			var x = e.pageX - $(e.target).offset().left;
			$(e.target).closest('.widget').find('audio')[0].currentTime = parseInt( $(e.target).closest('.widget').find('audio')[0].duration * (x / $(e.target).width()));
			$(e.target).closest('.widget').find('.progress_control').css('left', x);
		});

    // volume button
    $(this).on('click', '.volume', function(e) {
        if ($(e.target).is('.active')) {
            $(e.target).removeClass('active');
            $(e.target).closest('.widget').find('.volume_control').hide();
        } else {
            $(e.target).addClass('active');
            $(e.target).closest('.widget').find('.volume_control').show();
        }
    });
    
    $(this).trigger('playerinit');
};
