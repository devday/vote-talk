$(function () {
    function TalksViewModel() {
        var self = this;

        self.talks = ko.observableArray();
        self.startingTimes = ko.observableArray();
        self.confirmButtonVisible = ko.observable(false);
        self.confirmButtonEnable = ko.observable(true);

        self.addTalk = function (data) {
            self.talks.push(new Talk(data));
            self.updateStartingTimes();
        };

        self.talksByStartingTime = function (startingTime) {
            var groups = self.talks.groupBy(function (t) { return t.StartingAt(); });
            return groups[startingTime];
        };

        self.updateStartingTimes = function () {
            var groups = self.talks.groupBy(function (t) { return t.StartingAt(); });
            var keys = _.keys(groups);

            self.startingTimes.removeAll();
            var i = 0;
            _.each(keys, function (key) {
                i = i + 1;
                self.startingTimes.push(new StartingTime(key, i));
            });
        };

        self.allVotesHaveBeenSent = function () {
            ko.utils.arrayForEach(this.talks(), function (talk) {
                if (talk.Voted() && talk.VoteSent() == false) {
                    talk.VoteSent(true);
                }
            });
        };

        self.populate = function () {
            self.confirmButtonEnable(false);
            $.get('Talk/GetTalks', function (data) {
                self.confirmButtonEnable(true);
                _.each(data, function (d) {
                    self.addTalk(d);
                });
            });
        };

        self.sendVotes = function () {
            self.confirmButtonEnable(false);

            var votedTalks = self.talks.groupBy(function (talk) { return talk.Voted() == true; });
            if (votedTalks[true] == 'undefined') {
                self.confirmButtonVisible(false);
                self.confirmButtonEnable(true);
                return;
            }

            var votes = new Array();

            _.each(votedTalks[true], function (talk) {
                if (talk.VoteSent() == false) {
                    votes.push(({ ID: talk.Vote().ID(), Score: talk.Vote().Score() }));
                }
            });

            if (votes.length === 0) {
                self.confirmButtonVisible(false);
                self.confirmButtonEnable(true);
                return;
            }

            $.ajax({
                url: '/Talk/Vote',
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify(votes),
                async: false,
                success: function (data) {
                    if (data.result == false) {
                        return;
                    }

                    self.allVotesHaveBeenSent();
                    self.confirmButtonVisible(false);
                    self.confirmButtonEnable(true);
                },
                error: function (xhr, textStatus, exceptionThrown) {
                    alert(JSON.parse(xhr.responseText));
                    self.confirmButtonEnable(true);
                }
            });
        };
    }

    function StartingTime(value, id) {
        var self = this;

        self.ID = ko.observable(id);
        self.Value = ko.observable(value);
    }

    function Vote(score, id) {
        var self = this;

        self.ID = ko.observable(id);
        self.Score = ko.observable(score);
    }

    function Talk(data) {
        var self = this;

        self.ID = ko.observable(data.ID);
        self.Title = ko.observable(data.Title);
        self.Speaker = ko.observable(data.Speaker);
        self.Description = ko.observable(data.Description);
        self.VoteQuantity = ko.observable(data.VoteQuantity);
        self.VoteSum = ko.observable(data.VoteSu);
        self.StartingAt = ko.observable(data.StartingAt);
        self.DurationInMin = ko.observable(data.DurationInMin);
        self.Room = ko.observable(data.Room);

        self.Vote = ko.observable();
        self.Voted = ko.observable(false);
        self.VoteSent = ko.observable(false);

        self.DescriptionVisible = ko.observable(false);

        self.toggleDescriptionText = ko.computed(function () {
            if (self.DescriptionVisible()) {
                return '-';
            }
            return '+';
        }, this);

        self.toggleDescription = function () {
            if (self.DescriptionVisible()) {
                self.DescriptionVisible(false);
            } else {
                self.DescriptionVisible(true);
            }
        };

        self.getTitle = ko.computed(function () {
            if (self.VoteSent()) {
                return self.Title() + ' ✓';
            }
            return self.Title();
        }, this);

        self.getHeader = ko.computed(function () {
            return '(' + self.Speaker() + ', ' + self.DurationInMin() + ' min, ' + self.Room() + ')';
        }, this);

        self.getNumber = ko.computed(function () {
            return 'number-' + self.ID();
        }, this);

        self.setVote = function (score) {
            self.Vote(new Vote(score, self.ID()));
            self.Voted(true);
        };
    }

    $(document).ready(function () {
        window.vm = new TalksViewModel();
        ko.applyBindings(window.vm);

        window.vm.populate();
    });
});