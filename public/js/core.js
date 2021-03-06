String.prototype.contains = function (it) {
    return this.indexOf(it) != -1;
};
Array.prototype.isEmpty = function () {
    if (this.length === 0) {
        return true;
    } else {
        return false;
    }
};
function updateString(input, term) {
    return input.replace(new RegExp('(^|\)(' + term + ')(\|$)', 'ig'), '$1<strong>$2</strong>$3');
}
function dateToYear(y) {
    return y.substring(0, 4);
}
function shortenString(x) {
    if (x.length > 120 && x.charAt(119) != "?") {
        x = x.substring(0, 120);
        x += "..."
    }
    return x
}
function isInt(x) {
    return !isNaN(x) &&
        parseInt(Number(x)) == x && !isNaN(parseInt(x, 10));
}
function removeTags(x) {
    return x.replace(/<(?:.|\n)*?>/gm, '');
}
function escapeSquare(x) {
    x = x.replace(new RegExp('\\['), '\\[');
    x = x.replace(new RegExp('\\]'), '\\]');
    return x;
}
function isset(x) {
    return ((typeof x) != 'undefined');
}

/*
 *TODO Sanitise input
 *TODO CLEAN TODOS
 * //Random Question Function

 */


var data = {};
var results = [];
var user = [];
var filterOptions = [
    {text: '', value: ''},
    {text: 'Unit', value: 'ExamPaperUnit'},
    {text: 'Subject', value: 'SubjectTitle'},
    {text: 'Level', value: 'LevelTitle'},
    {text: 'Exam Board', value: 'ExamBoardName'}
];
var sortOptions = [
    {text: 'Number', value: 'QuestionNumber'},
    {text: 'Alphabet', value: 'QuestionText'},
    {text: 'Year', value: 'ExamPaperYear'},
    {text: 'Unit', value: 'ExamPaperUnit'}
];
var sortOrder = [
    {text: 'Ascending', value: 1},
    {text: 'Descending', value: -1}
];

var vm;
vm = new Vue({
    components: {
        alert: VueStrap.alert
    },
    
    el: '#wrapper',

    data: {
        //Search
        searchTerm: '',
        searchFlag: 0,
        sortBy: 'QuestionNumber',
        sortType: 1,
        sortOptions: sortOptions,
        sortOrder: sortOrder, //1 or -1
        //filter
        filterOptions: filterOptions,
        filterTermOptions: [],
        filterBy: '',
        filterTerm: '',
        filterFlag: false,
        //Result
        results: [],
        // Pagination
        noOfResults: 0,
        displayResults: 15,
        noOfPages: 1,
        // TODO Look into https://yuche.github.io/vue-strap/#modal
        // Error
        error: '',
    },

    route: {},

    ready: function () {

    },

    methods: {
        /************************
         *        Search            *
         ************************/
        search: function (q) {
            var x;
            if (q != undefined && q != '' && q != null && q != "") {
                x = q;
            }
            var filter;
            var page = location.pathname;
            if (page === '/' || page.contains('index') || page.contains('home')) {

            }
            else {
                window.location.href = '/';
            }
            //Sanitise searchTerm
            this.$set('error', '');
            this.$set('searchFlag', 2);
            if (this.searchTerm != '') {
                x = this.searchTerm;
            } else {
                x = q;
            }
            var errorFlag = false;
            if (this.searchFlag === 2) errorFlag = this.checkTerm(x);
            //filter = this.getFilter();
            if (errorFlag === false) {
                this.fetchResults(x, filter);
            } else {
                this.$set('searchFlag', 1);
            }
        },
        /************************
         *        Check        *
         ************************/
        checkTerm: function (x) {
            //TODO SPACE RETURNS ALL (KEEP FOR DEBUGGING)
            if (x === ''/*|| x === ' '*/) {
                this.$set('noOfResults', 0);
                this.$set('noOfPages', 1);
                this.$set('results', []);               //Purge results

                this.$set('error', '<span>Error: Empty Search Bar</span>');
                return true;
            }
            else return false;
        },
        /************************
         *        Fetch filter    *
         ************************/
        fetchFilter: function (x) {
            this.$set('filterTermOptions', []);
            var y;
            switch (x) {
                case '':
                    return;
                    break;
                case 'ExamPaperUnit':
                    y = '';
                    break;
                case 'SubjectTitle':
                    y = 'subject';
                    break;
                case 'LevelTitle':
                    y = 'level';
                    break;
                case 'ExamBoardName':
                    y = 'examboard';
                    break;
            }
            if (x != '') {
                this.$http.get('/api/filter/' + y)
                    .then(function (res) {
                        for (var i = 0; i < res.data.length; i++) {
                            this.$set('filterTermOptions[' + i + '].option', res.data[i][x]);
                        }
                    })
                    .catch(function (err) {
                        console.log("Error: " + err);
                        throw err;
                    });
            }
        },
        /************************
         *        Reset checkbox *
         ************************/
        resetCheck: function (x) {
            this.$set('filterFlag', false);
        },
        seeMore: function () {
            if (this.displayResults < this.noOfResults) {
                var x = this.noOfResults - this.displayResults;
                if (x < 5) {
                    this.$set("displayResults", this.displayResults + x);
                }
                else this.$set("displayResults", this.displayResults + 5);
            }
        },
        clearOptions: function () {
            this.$set("sortBy", "QuestionNumber");
            this.$set("sortType", 1);
            this.$set("filterFlag", false);
            this.$set("filterBy", "");
            this.$set("filterTerm", "");
        },
        /************************
         *        Fetch Results    *
         ************************/
        fetchResults: function (searchTerm) {
            this.$set('results', []);               //Purge results
            if (searchTerm.contains('[') || searchTerm.contains(']')) {
                searchTerm = escapeSquare(searchTerm);
                console.log(searchTerm);
            }
            this.$http.get('/api/search/' + searchTerm)
                .then(function (res) {
                    var i = 0;
                    var j = 0;
                    var results = [];
                    var noOfResults = res.data.length;
                    var noOfPages = noOfResults / 15;
                    this.$set('noOfResults', noOfResults);
                    this.$set('noOfPages', noOfPages);
                    for (i = 0; i < res.data.length; i++) {
                        var y = res.data[i].ExamPaperDate;
                        var x = res.data[i].QuestionText;
                        y = dateToYear(y);
                        x = removeTags(x);
                        x = updateString(x, searchTerm);
                        res.data[i].ExamPaperDate = y;
                        res.data[i].QuestionText = x;
                        this.$set('results[' + i + ']', res.data[i]);
                    }
                    this.$set('noOfResults', this.results.length);
                    this.$set('searchFlag', 1);
                })
                .catch(function (err) {
                    console.log("Error: " + err);
                    throw err;
                });
        }
    }
});
window.vue = vm;
Vue.config.debug = true;