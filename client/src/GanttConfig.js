/**
 * Application configuration
 */

const ganttConfig = {
    columns    : [
        { type : 'name', field : 'name', width : 250 }
    ],
    viewPreset : 'weekAndDayLetter',
    barMargin  : 10,

    project : {
        transport : {
            load : {
                url : 'data/gantt-data.json'
            }
        },
        autoLoad  : true
    }
};

export { ganttConfig };
