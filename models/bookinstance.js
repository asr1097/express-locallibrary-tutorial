var mongoose = require('mongoose');
const { DateTime } = require('luxon');

var Schema = mongoose.Schema;

var BookInstanceSchema = new Schema(
  {
    book: { type: Schema.Types.ObjectId, ref: 'Book', required: true }, //reference to the associated book
    imprint: {type: String, required: true},
    status: {type: String, required: true, enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'], default: 'Maintenance'},
    due_back: {type: Date, default: Date.now}
  }
);

// Virtual for bookinstance's URL
BookInstanceSchema
.virtual('url')
.get(function () {
  return '/catalog/bookinstance/' + this._id;
});

BookInstanceSchema
  .virtual("due_back_input")
  .get(function() {
    let due_input = "";
    let date;
    let month;
    let year;
    if(this.due_back) {
      date = this.due_back.getDate();
      month = this.due_back.getMonth();
      year = this.due_back.getFullYear();
      return due_input = `${year}-${month + 1 >= 10 ? month + 1 : `0${month + 1}`}-${date >= 10 ? date : `0${date}`}`
    } else {return ""};
  })

BookInstanceSchema
.virtual('due_back_formatted')
.get(function () {
  return DateTime.fromJSDate(this.due_back).toLocaleString(DateTime.DATE_MED);
});

//Export model
module.exports = mongoose.model('BookInstance', BookInstanceSchema);