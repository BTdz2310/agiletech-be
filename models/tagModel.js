import mongoose from 'mongoose'

const tagSchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: true,
        trim: true
    }
  },
  {
    collection: 'Tags'
  }
)

export default mongoose.model('tags', tagSchema)
