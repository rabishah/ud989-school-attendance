/* STUDENTS IGNORE THIS FUNCTION
 * All this does is create an initial
 * attendance record if one is not found
 * within localStorage.
 */
(function() {
    if (!localStorage.attendance) {
        console.log('Creating attendance records...');
        function getRandom() {
            return (Math.random() >= 0.5);
        }

        var nameColumns = $('tbody .name-col'),
            attendance = {};

        nameColumns.each(function() {
            var name = this.innerText;
            attendance[name] = [];

            for (var i = 0; i <= 11; i++) {
                attendance[name].push(getRandom());
            }
        });

        localStorage.attendance = JSON.stringify(attendance);
    }
}());


/* STUDENT APPLICATION */
$(function() {
  /* ==== Model ==== */
  var model = {
    init: function() {
      if (!localStorage.attendance) {
        localStorage.attendance = JSON.stringify([]);
      }
    },

    getAllStudents: function() {
      return JSON.parse(localStorage.attendance);
    }
  };


  var octopus = {
    init: function() {
      model.init();
      view.init();
    },

    update: function(student, data) {
      var id = data.id - 1;
      var newAttendance = model.getAllStudents();
      newAttendance[student][id] = !newAttendance[student][id]
      localStorage.attendance = JSON.stringify(newAttendance);
    },

    getAllStudents: function() {
      return model.getAllStudents();
    },

    getCount: function(student) {
      var tmp = model.getAllStudents()[student];
      return tmp.reduce(function (a, b) { if (a) { return a + b; } })
    },

    getNoOfDays: function() {
      return 12;
    },

    getTotalStudents: function() {
      return $.map(this.getAllStudents(), function(n, i) { return i;  }).length;
    }
  };


  var view = {
    init: function() {
      /* initialize table header */
      this.$thead = $('thead');
      this.$tbody = $('tbody');

      /* initialize table header view */
      var tr = $("<tr></tr>");
      tr.append("<th class='name-col'>Student Name</th>");

      var len = octopus.getNoOfDays();
      for (var i=1; i <= len ; i++) {
        tr.append("<th>" + i + "</th>");
      }
      tr.append("<th class='missed-col'>Days Missed-col</th>");
      this.$thead.append(tr);

      /* bind clicks on input */
      this.$tbody.on('click', '.ip', function(e) {
        var _parent = $(this).parents()[1];
        var student = _parent.children[0].textContent;

        octopus.update(student, $(this).data());
        view.render();
      });

      this.render();
    },

    render: function() {
      var $tbody = this.$tbody;

      /* remove previous dom */
      $tbody.html('');

      /* populate table view */
      $.each(octopus.getAllStudents(), function(student, attendance) {
        var $tr = $("<tr></tr>");
        $tr.append("<td class='name-col'>" + student + "</td>");

        $.each(attendance, function(p, v) {
          var $input = $('<input class="ip" data-id="' + (p + 1) + '" type="checkbox">');
          $input.prop('checked', v);

          var $td = $('<td class="attend-col"></td>');
          $td.append($input);
          $tr.append($td);
        });

        $tr.append("<td class='missed-col'>" + octopus.getCount(student) + "</td>");
        $tbody.append($tr);
      });
    }
  };

  octopus.init();
}());
