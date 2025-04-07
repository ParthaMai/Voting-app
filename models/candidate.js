const mongoose=require('mongoose');

// const bcrypt=require('bcrypt');

// Define the person Schema
const candidateSchema= new mongoose.Schema ({
    name: {
        type: String,
        require: true 
    },
    party: {
        type: String,
        require: true
    },
    age: {
        type: Number,
        require: true
    },
    votes: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user',
                require: true
            },
            votedAt: {
                type: Date,
                default: Date.now()
            }
        }
    ],
    voteCount: {
        type: Number,
        default: 0
    }
   

});


const candidate=mongoose.model('candidate',candidateSchema);
module.exports = candidate;