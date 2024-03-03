const { Schema } = require('mongoose');

const MountainSchema = new Schema(
  {
    mountainName: {
      type: String,
      required: true,
    },
    mountainLevel: {
      type: String,
      required: true,
    },
    mountainAddress: {
      type: String,
      required: true,
    },
    mountainImgURL: {
      type: String,
      required: true,
    },
  },
  {
    collection: 'mountain',
    timestamps: true,
  }
);

module.exports = MountainSchema;
