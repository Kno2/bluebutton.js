/*
 * Parser for the C32 document
 */

var Core = require('../core');
var AllergiesParser = require('./c32/allergies');
var DemographicsParser = require('./c32/demographics');
var DocumentParser = require('./c32/document');
var EncountersParser = require('./c32/encounters');
var ImmunizationsParser = require('./c32/immunizations');
var MedicationsParser = require('./c32/medications');
var ProblemsParser = require('./c32/problems');
var ProceduresParser = require('./c32/procedures');
var ResultsParser = require('./c32/results');
var VitalsParser = require('./c32/vitals');
var ParseGenericInfo = require('./generic');

module.exports = function(doc) {
  var self = this;

  self.doc = doc;
  self.allergiesParser = new AllergiesParser(self.doc);
  self.demographicsParser = new DemographicsParser(self.doc);
  self.demographicsParser = new DocumentParser(self.doc);
  self.encountersParser = new EncountersParser(self.doc);
  self.immunizationsParser = new ImmunizationsParser(self.doc);
  self.medicationsParser = new MedicationsParser(self.doc);
  self.problemsParser = new ProblemsParser(self.doc);
  self.proceduresParser = new ProceduresParser(self.doc);
  self.resultsParser = new ResultsParser(self.doc);
  self.vitalsParser = new VitalsParser(self.doc);

  self.run = function (c32) {
    var data = {};
    
    data.document              = self.demographicsParser.parse(c32);
    data.allergies             = self.allergiesParser.parse(c32);
    data.demographics          = self.demographicsParser.parse(c32);
    data.encounters            = self.encountersParser.parse(c32);
    var parsedImmunizations    = self.immunizationsParser.parse(c32);
    data.immunizations         = parsedImmunizations.administered;
    data.immunization_declines = parsedImmunizations.declined;
    data.results               = self.resultsParser.parse(c32);
    data.medications           = self.medicationsParser.parse(c32);
    data.problems              = self.problemsParser.parse(c32);
    data.procedures            = self.proceduresParser.parse(c32);
    data.vitals                = self.vitalsParser.parse(c32);
    
    data.json                       = Core.json;
    data.document.json              = Core.json;
    data.allergies.json             = Core.json;
    data.demographics.json          = Core.json;
    data.encounters.json            = Core.json;
    data.immunizations.json         = Core.json;
    data.immunization_declines.json = Core.json;
    data.results.json               = Core.json;
    data.medications.json           = Core.json;
    data.problems.json              = Core.json;
    data.procedures.json            = Core.json;
    data.vitals.json                = Core.json;
  
    // Sections that are in CCDA but not C32... we want to keep the API
    // consistent, even if the entries are always null
    data.smoking_status = {
      date: null,
      name: null,
      code: null,
      code_system: null,
      code_system_name: null
    };
    data.smoking_status.json = Core.json;
    
    data.chief_complaint = {
      text: null
    };
    data.chief_complaint.json = Core.json;
  
    data.care_plan = [];
    data.care_plan.json = Core.json;
  
    data.instructions = [];
    data.instructions.json = Core.json;
  
    data.functional_statuses = [];
    data.functional_statuses.json = Core.json;
  
    // Decorate each section with Title, templateId and text and adds missing sections
    ParseGenericInfo(c32, data);
  
    return data;
  };
};


