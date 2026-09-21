const express = require('express');

const router = express.Router();

const candidate = require('./../models/candidate');

const User = require('./../models/user');


const {jwtAuthentication} = require('./../jwt');
// const candidate = require('./../models/candidate');
// const candidate = require('./../models/candidate');

const checkAdmin = async (userId) => {
    try {
        const userS = await User.findById(userId);

        if (!userS) {
            return false;
        }

        if (userS.role === "admin") {
            return true;
        }

        return false;
    }
    catch (err) {
        console.log(err);
        return false;
    }
};

router.post('/',jwtAuthentication, async(req,res)=>{
    try{
        if(!await checkAdmin(req.user.id))
            return res.status(403).json({message : "not an admin"});
        
        const data = req.body;
        const newCandidate = new candidate(data);

        const response = await newCandidate.save();
        console.log("Data Saved");

        res.status(200).json({message : "Candidate added successfully"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error : "Internal server error"});
    }
});

router.put('/:candidateId',jwtAuthentication,async (req,res,next)=>{
    try{
        if(!await checkAdmin(req.user.id))
            return res.status(403).json({message : "not an admin"});

        const candidateId = req.params.candidateId;
        const upadatedCandidate = req.body;

        const response = await candidate.findByIdAndUpdate(candidateId,upadatedCandidate,{
            new : true
        })

        if(!response)
            return res.status(401).json({error : "Candidate not found"});
        console.log("candidate upadated");
        res.status(200).json({message : "candidate updated Successfully"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error : "Internal server Error"});
    }
});

router.delete('/:candidateId',jwtAuthentication,async (req,res,next)=>{
    try{
        if(!await checkAdmin(req.user.id))
            return res.status(403).json({message : "not an admin"});

        const candidateId = req.params.candidateId;
        const deleteCandidate = req.body;

        const response = await candidate.findByIdAndDelete(candidateId);

        if(!response)
            return res.status(404).json({error : "Candidate not found"});
        console.log("candidate delete");
        res.status(200).json({message : "candidate deleted Successfully"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error : "Internal server Error"});
    }
});

router.post('/vote/:candidateId', jwtAuthentication, async (req, res) => {
    try {

        const candidateId = req.params.candidateId;
        const userId = req.user.id;

        // 1. Find candidate
        const candidateData = await candidate.findById(candidateId);

        if (!candidateData) {
            return res.status(404).json({
                message: "No candidate found"
            });
        }

        // 2. Find user
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // 3. Check if already voted
        if (user.isVoted) {
            return res.status(401).json({
                message: "User has already voted"
            });
        }

        // 4. Admin cannot vote
        if (user.role === "admin") {
            return res.status(403).json({
                message: "Admin can't vote"
            });
        }

        // 5. Add user to candidate's votes
        candidateData.votes.push({
            user: user._id
        });

        // 6. Increase vote count
        candidateData.voteCount++;

        // 7. Save candidate
        await candidateData.save();

        // 8. Mark user as voted
        user.isVoted = true;

        // 9. Save user
        await user.save();

        return res.status(200).json({
            message: "Voted successfully"
        });

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            error: "Internal server Error"
        });
    }
});
router.get('/vote/count',async (req,res)=>{
    try{
        const candidateI = await candidate.find().sort({voteCount: 'desc'});
        const record = candidateI.map((data)=>{
            return {
                party : data.party,
                count : data.voteCount
            }
        })
        return res.status(200).json(record);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error : "Internal server Error"})
    }
})

module.exports = router;