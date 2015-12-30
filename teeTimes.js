var times_loaded

$.ajax({
url:"http://www.kimonolabs.com/api/4ujite74?apikey=REK0Ffj1XIg1BhGMU3wDHLBv9kQbB2ur",
crossDomain: true,
dataType: "jsonp",
success: function (response) {
  //Do something with the response
  //console.log(response.results.collection1);
  times_loaded = response.results.collection1;
},
error: function (xhr, status) {
  //handle errors
}
});

function teeTimes(times) {
    this.times = times;
    this.cleanTimes = [];
    this.searchCourseTimes = [];
}

teeTimes.prototype.loadTable = function () {
    var tr = []
    for (var i = 0; i < this.searchCourseTimes.length; i++) {
        tr.push('<tr>');
        tr.push("<td>" + this.searchCourseTimes[i].time + "</td>")
        tr.push("<td>" + this.searchCourseTimes[i].rate + "</td>")
        tr.push("<td>" + this.searchCourseTimes[i].num_players + "</td>")
        tr.push("<td>" + this.searchCourseTimes[i].course + "</td>")
        tr.push("<td>" + this.searchCourseTimes[i].date + "</td>")
        tr.push("<td><button type='button' class='btn btn-default' id='book-time'>Book</button></td>")
        tr.push('</tr>');
    };
    $('#output').append((tr.join('')));
}

teeTimes.prototype.removeDuplicates = function () {
    for (var i = 0; i < this.times.length; i++) {
        if(this.cleanTimes.length === 0) {
            this.cleanTimes.push(this.times[i])
        } else if (this.cleanTimes[this.cleanTimes.length-1]['time'] !== this.times[i]['time']) {
            this.cleanTimes.push(this.times[i])
        } else if (this.cleanTimes[this.cleanTimes.length-1]['time'] === this.times[i]['time']) {
            if (this.cleanTimes[this.cleanTimes.length-1]['rate'] >= this.times[i]['rate']) {}
            else if (this.cleanTimes[this.cleanTimes.length-1]['rate'] < this.times[i]['rate']) {
                this.cleanTimes[this.cleanTimes.length-1] = this.times[i];
            }
        }
    };
}

teeTimes.prototype.numPlayers = function () {
    for (var i = 0; i < this.cleanTimes.length; i++) {
        for (var j = 0; j < this.cleanTimes[i]['players'].length; j++) {
            if(this.cleanTimes[i]['players'][j]['class'].indexOf('blue') !== -1) {
                this.cleanTimes[i]['num_players'] = j + 1;
           }
        };
    };
}

teeTimes.prototype.courseDateOut = function () {
    for (var i = 0; i < this.cleanTimes.length; i++) {
        this.cleanTimes[i]['course'] = this.cleanTimes[i]['url'].slice(this.cleanTimes[i]['url'].indexOf('/at/')+4,this.cleanTimes[i]['url'].indexOf('/on/'));
        this.cleanTimes[i]['date'] = this.cleanTimes[i]['url'].slice(this.cleanTimes[i]['url'].indexOf('/on/')+4,this.cleanTimes[i]['url'].length);
    }
}

teeTimes.prototype.courseName = function () {
    for (var i = 0; i < this.cleanTimes.length; i++) {
        this.cleanTimes[i]['course'] = courseKey[this.cleanTimes[i]['course']];
    }
}

teeTimes.prototype.filterCourse = function () {
    var desiredCourse = $('#num-input').val()
    for (var i = 0; i < this.cleanTimes.length; i++) {
        var toCheck = this.cleanTimes[i]['course'];
        if(toCheck == desiredCourse) {
            this.searchCourseTimes.push(this.cleanTimes[i]);
        } else if (desiredCourse == '') {
            this.searchCourseTimes.push(this.cleanTimes[i]);
        }
    };
    //should keep focus if name entered is not a valid course
}

teeTimes.prototype.cleaning = function () {
    this.removeDuplicates();
    this.numPlayers();
    this.courseDateOut();
    this.courseName();
    this.filterCourse();
}

/* **** Event Listeners/Handlers ****  */


$(document).ready(function () {
    $('#load-times').on('click', function () {
        var timesObject = new teeTimes(times_loaded);
        timesObject.cleaning();
        timesObject.loadTable();   
    });
    $('#load-times').keypress(function(e) {
        if(e.which == 13) {
            var timesObject = new teeTimes(times_loaded);
            timesObject.cleaning();
            timesObject.loadTable(); 
        }
    });

    $('#num-input').on('keyup', function () {
        var searchCourse = $(this).val();
        if(COURSES[searchCourse] === undefined) {
            $('#load-times').text('Enter a course');
        } else {
            $('#load-times').text('Load Times for ' + searchCourse);
        }
    })
});

var COURSES = {
    'NY Country Club' : 'new-york-country-club-new-york',
    'Galloping Hill' : 'galloping-hill-golf-course-new-jersey',
    'Richter Park' : 'richter-park-golf-course-connecticut',
    'Sterling Farms' : 'sterling-farms-golf-course-connecticut',
    'Hudson Hills' : 'hudson-hills-golf-course-new-york',
    'Middle Bay' : 'south-bay-country-club-new-york',
    'Tallgrass' : 'tallgrass-golf-club-new-york',
    'Patriot Hills' : 'patriot-hills-golf-club-new-york',
    'River Vale' : 'river-vale-country-club-new-jersey',
    'Lido' : 'lido-golf-club-new-york',
    'Berkshire Valley' : 'berkshire-valley-golf-course-new-jersey',
    'Wind Watch' : 'wind-watch-golf-course-new-york',
}  

var courseKey = {
    'new-york-country-club-new-york' : 'NY Country Club',
    'galloping-hill-golf-course-new-jersey' : 'Galloping Hill',
    'richter-park-golf-course-connecticut' : 'Richter Park',
    'sterling-farms-golf-course-connecticut' : 'Sterling Farms',
    'hudson-hills-golf-course-new-york' : 'Hudson Hills',
    'south-bay-country-club-new-york' : 'Middle Bay',
    'tallgrass-golf-club-new-york' : 'Tallgrass',
    'patriot-hills-golf-club-new-york' : 'Patriot Hills', 
    'river-vale-country-club-new-jersey' : 'River Vale',
    'lido-golf-club-new-york' : 'Lido',
    'berkshire-valley-golf-course-new-jersey' : 'Berkshire Valley',
    'wind-watch-golf-course-new-york' : 'Wind Watch',
}