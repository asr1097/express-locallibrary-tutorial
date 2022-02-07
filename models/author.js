var mongoose = require('mongoose');
const { DateTime } = require('luxon');

var Schema = mongoose.Schema;

var AuthorSchema = new Schema(
  {
    first_name: {type: String, required: true, maxLength: 100},
    family_name: {type: String, required: true, maxLength: 100},
    date_of_birth: {type: Date},
    date_of_death: {type: Date},
  }
);

// Virtual for author's full name
AuthorSchema
.virtual('name')
.get(function () {
// To avoid errors in cases where an author does not have either a family name or first name
// We want to make sure we handle the exception by returning an empty string for that case
  var fullname = '';
  if (this.first_name && this.family_name) {
    fullname = this.family_name + ', ' + this.first_name
  }
  if (!this.first_name || !this.family_name) {
    fullname = '';
  }
  return fullname;
});

// Virtual for input date of birth

AuthorSchema.virtual("date_of_birth_input").get(function() {
  let dob_input = "";
  let date;
  let month;
  let year;
  if(this.date_of_birth) {
    date = this.date_of_birth.getDate();
    month = this.date_of_birth.getMonth();
    year = this.date_of_birth.getFullYear();
    return dob_input = `${year}-${month + 1 >= 10 ? month + 1 : `0${month + 1}`}-${date >= 10 ? date : `0${date}`}`
  } else {return ""};
});

// Virtual for input date of death

AuthorSchema.virtual("date_of_death_input").get(function() {
  let dod_input = "";
  let date;
  let month;
  let year;
  if(this.date_of_death) {
    date = this.date_of_death.getDate();
    month = this.date_of_death.getMonth();
    year = this.date_of_death.getFullYear();
    return dod_input = `${year}-${month + 1 >= 10 ? month + 1 : `0${month + 1}`}-${date >= 10 ? date : `0${date}`}`
  } else {return ""};
});

// Virtual for author's lifespan
AuthorSchema.virtual('lifespan').get(function() {
  var lifetime_string = '';
  if (this.date_of_birth) {
    lifetime_string = DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED);
  }
  lifetime_string += ' - ';
  if (this.date_of_death) {
    lifetime_string = lifetime_string + DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED);
  }
  return lifetime_string;
});

// Virtual for author's URL
AuthorSchema
.virtual('url')
.get(function () {
  return '/catalog/author/' + this._id;
});

//Export model
module.exports = mongoose.model('Author', AuthorSchema);