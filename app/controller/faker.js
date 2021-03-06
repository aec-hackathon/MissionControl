/**
 * Created by konrad.sobon on 2018-09-13.
 */
var mongoose = require('mongoose');
Project = mongoose.model('Project');
Configuration = mongoose.model('Configuration');
Views = mongoose.model('Views');
var faker = require('faker');
var luxon = require('luxon');
var DateTime = luxon.DateTime

module.exports = {
  /**
   *
   * @param req
   * @param res
   */
  add: function (req, res) {
    // Project.deleteMany({});
    // Configuration.deleteMany({});
    // Views.deleteMany({});

    for(let q = 0; q < 5; q++){
      const configArr = [];
      const fakeFiles = []
      for(let e = 0; e < 5; e++){
        const fakeFile = faker.fake("BIM360//somepath/{{random.words}}.rvt");
        const blah = createViews(fakeFile)

        fakeFiles.push(fakeFile);
      }

      Promise.all(fakeFiles.map(val=>{
        return createConfiguration(val);
    }))
    .then(result=>{
      const arr = result.map(val=>val._id);
        createProject(arr);
      console.log("RESULT", arr);
    })

      // res.status(200).json(configArr);
    }
  }
};

function createConfiguration(path){
  const newConfigurations = Configuration.create({
    name: faker.random.words(),
    files: [{centralPath: path}], //revit projects
    sheetDatabase: '', //sheet database
    sharedParamMonitor: {
      monitorId: '',
      monitorName: '',
      description: '',
      addInName: '',
      filePath: '',
      isMonitorOn: false
    }, // shared param file path monitor
    updaters: []
  });
  return newConfigurations;
}
function createViews(path){

  const viewStats = [];

  for(let i = 0; i < Math.floor(Math.random() * 200); i++){
    const totalViews = Math.floor(Math.random() * 2000);
    const viewsOnSheet = totalViews - Math.floor(Math.random() * totalViews);
    viewStats.push({
      totalViews:totalViews,
      totalSheets: 0,
      totalSchedules: 0,
      viewsOnSheet: viewsOnSheet,
      viewsOnSheetWithTemplate: 0,
      schedulesOnSheet: 0,
      unclippedViews: 0,
      createdOn: DateTime.local().minus({hours: 8 * i})
    })
  }



  const newViews = Views.create({
    centralPath: path,
    viewStats: viewStats
  })
}
function createProject(configArr){
  const newProj = Project.create({
    number: faker.random.number(),
    name: faker.random.words(),
    office: 'Atlanta',
    address:{
      formattedAddress: faker.address.streetAddress(),
      street1: '',
      street2: '',
      city: faker.address.city(),
      state: faker.address.stateAbbr(),
      country: faker.address.country(),
      zipCode: faker.address.zipCode(),
      placeId: '' //google place ID
    },
    geoLocation: null, //type point
    geoPolygon: null, //type MultiPolygon
    configurations: configArr,
    triggerRecords: [],
    sheets: [],
    modelStats: [],
    linkStats: [],
    styleStats: [],
    familyStats: [],
    worksetStats: [],
    viewStats: [],
    groupStats: []
  });
}