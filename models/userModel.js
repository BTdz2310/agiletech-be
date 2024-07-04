import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true
    }
  },
  {
    collection: 'Users'
  }
)

export default mongoose.model('users', userSchema)
