var currentSong;
var allTracks;
var globalPlayer;

var player = document.getElementById("player");


SC.initialize({
    client_id: '05c522bb9df1d54442ccda390e68d332'
});

document.onload = LoadTracks("Monstercat");

function LoadTracks(query) {
    SC.get('/tracks', {
        q: query
    }).then(function(tracks) {
        console.log(tracks);
        allTracks = tracks;
        currentSong = 0;
        SetInfo(allTracks[currentSong]);

        SC.stream('/tracks/' + tracks[0]['id']).then(function(player) {
            globalPlayer = player;
            player.play();
        });
    });
}

function NextSong() {
    currentSong++;
    if (currentSong >= allTracks.length) {
        console.log("out of songs")
    } else {
        SetInfo(allTracks[currentSong]);
        SC.stream('/tracks/' + allTracks[currentSong]['id']).then(function(player) {
            globalPlayer = player;
            player.play();
        });
    }
}

function PrevSong() {
    currentSong--;
    if (currentSong >= allTracks.length) {
        console.log("out of songs")
    } else {
        SetInfo(allTracks[currentSong]);
        SC.stream('/tracks/' + allTracks[currentSong]['id']).then(function(player) {
            globalPlayer = player;
            player.play();
        });
    }
}

function ToggleSong() {
    console.log(globalPlayer.isPaused());
    if (globalPlayer.isPaused()) {
        globalPlayer.play();
        document.getElementById("toggle").innerHTML = "Pause";
    } else if (!globalPlayer.isPaused()) {
        globalPlayer.pause();
        document.getElementById("toggle").innerHTML = "Play";
    }
}


function SetInfo(song) {
    if (song['artwork_url'] == null) {
        document.getElementById("cover").src = "http://placehold.it/400x400";
    } else {
        var art = song['artwork_url'].replace("large", "crop");
        document.getElementById("cover").src = art;
    }
    document.getElementById("title").innerHTML = song['title'];
    document.getElementById("user").innerHTML = "by " + song['user']['username'] + " (" + currentSong + "/" + allTracks.length + ")";
}

globalPlayer.on(finish, NextSong());
