angular.module("app", ["ngRoute"]);

angular.module("app").run(function () {
});

angular.module("app").config(function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'game.html',
        controller: 'GameController',
        controllerAs: 'gameCtrl',
    });
})

angular.module("app").controller("GameController", function ($interval) {
    var self = this;

    var intvl;

    function _setupGrid(width, height) {
        self.grid = [];
        for (var y = 0 ; y < height ; ++y) {
            self.grid.push([]);
            for (var x = 0 ; x < width ; ++x) {
                self.grid[y].push({
                    active: Math.random() < 0.7 ? false : true,
                });
            }
        }
        console.log(self.grid);
    }

    function _start() {
        intvl = $interval(_move, 300);
    }

    self.step = 0;

    function _move() {
        self.step++;
        for (var y = 0 ; y < self.grid.length ; ++y) {
            for (var x = 0 ; x < self.grid[y].length ; ++x) {
                var cnt = countNeighbors(x, y);
                if (self.grid[y][x].active) {
                    if (cnt >= 3 && cnt <= 4) {
                        self.grid[y][x].next = true;
                    } else {
                        self.grid[y][x].next = false;
                    }
                } else {
                    if (cnt == 3) {
                        self.grid[y][x].next = true;
                    } else {
                        self.grid[y][x].next = false;
                    }
                }
            }
        }
        var hasActive = false;
        for (var y = 0 ; y < self.grid.length ; ++y) {
            for (var x = 0 ; x < self.grid[y].length ; ++x) {
                self.grid[y][x].active = self.grid[y][x].next;
                hasActive |= self.grid[y][x].active;
            }
        }
        if (!hasActive) {
            $interval.cancel(intvl);
        }
    }

    function countNeighbors(x, y) {
        var cnt = 0;
        var checkX = [x];
        var checkY = [y];
        if (x > 0) {
            checkX.unshift(x - 1);
        }
        if (x + 1 < self.grid[0].length) {
            checkX.push(x + 1);
        }
        if (y > 0) {
            checkY.unshift(y - 1);
        }
        if (y + 1 < self.grid.length) {
            checkY.push(y + 1);
        }

        angular.forEach(checkY, function (yy) {
            angular.forEach(checkX, function (xx) {
                if (!(yy == y && xx == x) && self.grid[yy][xx].active) {
                    cnt++;
                }
            });
        });

        return cnt;
    }

    _setupGrid(30, 30);

    _start();

});