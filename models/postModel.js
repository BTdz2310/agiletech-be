import mongoose from 'mongoose'

const postSchema = new mongoose.Schema(
  {
    title: {
        required: true,
        trim: true,
        type: String
    },
    description: {
        required: true,
        trim: true,
        type: String
    },
    tags: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'tags',
        default: []
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }
  },
  {
    collection: 'Posts'
  }
)

export default mongoose.model('posts', postSchema)
