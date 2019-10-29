Template.WAISSMain.helpers({
    isLoggedIn: function() {
        return Meteor.userId();
    },
    redirectToExplorePage: function() {
        FlowRouter.go('/waiss/explore');
    },
    farms: function() {
        return Farm.find({
            'userId': Meteor.userId()
        }).fetch();
    },
    farmInfo: function() {
        return Farm.findOne({
            _id: Session.get('farmId')
        });
    },
    displayTip: function() {
        var returnObject = [];

        var tips = WaterManagementTips.find().fetch();
        returnObject.push(tips[Math.floor(Math.random() * ((tips.length-1) + 1))]);

        return returnObject;
    },
    chartData: function() {
        var farm = Farm.findOne({
            _id: Session.get('farmId')
        });

        var mad = CropData.findOne({
            'name': farm.crop.toLowerCase()
        }).mad;

        var dataSource = WeatherStations.findOne({
            'id': farm.weatherStation
        });

        var categoriesArray = [];
        var madArray = [];
        var dataArray = [];
        var rainfallArray = [];

        var months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sept',
            'Oct',
            'Nov',
            'Dec'
        ];

        for(var i = 0; i < farm.data.waterDeficit.length; i++) {
            var waterDeficit = farm.data.waterDeficit[i];
            categoriesArray.push(months[waterDeficit.dateUTC.getMonth()] + ' ' + waterDeficit.dateUTC.getDate());
            dataArray.push(-waterDeficit.data);
            madArray.push(mad);
            rainfallArray.push(farm.data.rainfall[i].data);
        }

        return {
            title: {
                text: 'Water Deficit',
                x: -20 //center
            },
            subtitle: {
                text: 'Weather data collected from ' + dataSource.label,
                x: -20
            },
            xAxis: {
                categories: categoriesArray
            },
            yAxis: {
                title: {
                    text: 'Water, mm'
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            plotOptions: {
                series: {
                    marker: {
                        enabled: false
                    }
                }
            },
            series: [{
                name: 'Rainfall',
                data: rainfallArray,
                type: 'column',
                tooltip: {
                    valueSuffix: 'mm'
                }
            },{
                name: 'Management Allowable Depletion',
                data: madArray,
                color: 'red',
                tooltip: {
                    valueSuffix: 'mm'
                }
            },{
                name: 'Water Deficit',
                data: dataArray,
                tooltip: {
                    valueSuffix: 'mm'
                }
            }]
        };
    }
});

Template.WAISSMain.events({
    'click .list-farm-item': function(e) {
        var currentFarm = $(e.target).attr('farmId');
        var farmInfo = Farm.findOne({
            _id: currentFarm
        });
        Session.set('farmId', currentFarm);
        //Meteor.call('computeWaterDeficit', farmInfo, 22.6, 28.5, 0.248, 192, new Date(2015, 11, 17));
    },
    'click #createFarm': function(e) {
        e.preventDefault();

        FlowRouter.go('/waiss/create-farm');
    },
    'click #addIrrigation': function(e) {
        var dialog = document.querySelector('#addIrrigationDialog');
        dialog.showModal();
    },
    'click #deleteFarm': function(e) {
        var currentFarm = Session.get('farmId');
        // var farmInfo = Farm.remove({
        //     _id: currentFarm
        // });
        Meteor.call('deleteFarm', currentFarm, function(error, result) {
            if(error) {
                console.error(error);
                return;
            }

            alert(result.message);
            Session.set('farmId', null);
        })
    }
});
