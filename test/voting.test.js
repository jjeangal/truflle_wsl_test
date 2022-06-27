const { expect } = require('chai');
const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');

const Voting = artifacts.require("./Voting.sol");

contract("Voting", accounts => {
    const owner = accounts[0];
    const voter1 = accounts[1];
    const voter2 = accounts[2];

    describe("State Changes", function () {
        context('Correct tests', async function() {
            before(async function () {
                this.VotingInstance = await Voting.new({from: owner});
            });

            it('start proposal status change', async function() {
                let startProposal = await this.VotingInstance.startProposalsRegistering({from: owner});
                expectEvent(startProposal, 'WorkflowStatusChange');
            });

            it('end proposal status change', async function() {
                let endProposal = await this.VotingInstance.endProposalsRegistering({from: owner});
                expectEvent(endProposal, 'WorkflowStatusChange');
            })

            it('start voting status change', async function() {
                let startVoting = await this.VotingInstance.startVotingSession({from: owner});
                expectEvent(startVoting, 'WorkflowStatusChange');
            })

            it('end voting status change', async function() {
                let endVoting = await this.VotingInstance.endVotingSession({from: owner});
                expectEvent(endVoting, 'WorkflowStatusChange');
            });

            it('vote tally status change', async function() {
                let voteTally = await this. VotingInstance.tallyVotes({from: owner});
                expectEvent(voteTally, 'WorkflowStatusChange');
            });
        });

        context('Uncorrrect tests', async function() {
            before(async function () {
                this.VotingInstance = await Voting.new({from: owner});
            });

            it('wrong phase to end proposal registering', async function() {
                await expectRevert(this.VotingInstance.endProposalsRegistering({from: owner}), 
                    'Registering proposals havent started yet');
            });
    
            it('wrong phase to start voting session', async function() {
                await expectRevert(this.VotingInstance.startVotingSession({from: owner}), 
                    'Registering proposals phase is not finished');
            });
    
            it('wrong phase to end voting session', async function() {
                await expectRevert(this.VotingInstance.endVotingSession({from: owner}), 
                    'Voting session havent started yet');
            });
    
            it('wrong phase to start vote Tally', async function() {
                await expectRevert(this.VotingInstance.tallyVotes({from: owner}), 
                    'Current status is not voting session ended');
            });
        });
    });

    describe('Set & Get Voters', async function() {
        context('Set Voters', async function() {
            beforeEach(async function () {
                this.VotingInstance = await Voting.new({from: owner});
            });

            it('add a voter successfully', async function () {
                await this.VotingInstance.addVoter(voter1, {from: owner});
                let voterObj = await this.VotingInstance.getVoter.call(voter1, {from: voter1});
                expect(voterObj.isRegistered).to.be.true;
            });

            it('adding voter triggers event', async function() {
                let addVoterEvent = await this.VotingInstance.addVoter(voter1, {from: owner});
                expectEvent(addVoterEvent, 'VoterRegistered', {voterAddress: voter1});
            });
        
            it('only owner can add a voter', async function() {
                await expectRevert(this.VotingInstance.addVoter(voter2, {from: voter1}), 'caller is not the owner');
            });
        
            it('cannot add a voter if session does not allow it anymore', async function() {
                await this.VotingInstance.startProposalsRegistering({from: owner});
                await expectRevert(this.VotingInstance.addVoter(voter1, {from: owner}), 'Voters registration is not open yet');
            });
        
            it('voter is already registered', async function() {
                await this.VotingInstance.addVoter(voter1, {from: owner});
                await expectRevert(this.VotingInstance.addVoter(voter1, {from: owner}), 'Already registered');
            });
        });

        context('Get Voters', async function() {
            before(async function() {
                this.VotingInstance = await Voting.new({from: owner});
                await this.VotingInstance.addVoter(voter1, {from: owner});
                await this.VotingInstance.startProposalsRegistering({from: owner});
                let proposalId = 0;
                let desc = 'test';
                await this.VotingInstance.addProposal(desc, {from: voter1});
                await this.VotingInstance.endProposalsRegistering({from: owner});
                await this.VotingInstance.startVotingSession({from: owner});
                await this.VotingInstance.setVote(proposalId, {from: voter1});
            });

            it('retrieved voter is registered', async function() {
                let tempVoter = await this.VotingInstance.getVoter.call(voter1, {from: voter1});
                expect(tempVoter.isRegistered).to.be.true;
            });

            it('retrieved voter has voted', async function() {
                let tempVoter = await this.VotingInstance.getVoter.call(voter1, {from: voter1});
                expect(tempVoter.hasVoted).to.be.true;
            });

            it('retrieved non existing voter is not registered', async function() {
                let tempVoter = await this.VotingInstance.getVoter.call(voter2, {from: voter1});
                expect(tempVoter.isRegistered).to.be.false;
            });

            it('retrieved non existing voter has not voted', async function() {
                let tempVoter = await this.VotingInstance.getVoter.call(voter2, {from: voter1});
                expect(tempVoter.hasVoted).to.be.false;
            });

            it('retrieved voter voted for the first proposal proposal', async function() {
                let tempVoter = await this.VotingInstance.getVoter.call(voter1, {from: voter1});
                votedId = await tempVoter.votedProposalId;
                expect(votedId).to.be.bignumber.equal(new BN(0));
            });
        });
    });

    describe('Set & Get Proposals', async function() {
        beforeEach(async function() {
            this.VotingInstance = await Voting.new({from: owner});
            await this.VotingInstance.addVoter(voter1, {from: owner});
        })

        // ::::::::::::: addProposal ::::::::::::: //
        context('Set Proposals', async function() {        
            it('add a proposal succesfully', async function() {
                await this.VotingInstance.startProposalsRegistering({from: owner});
                let proposalId = 0;
                let desc = 'test';
                await this.VotingInstance.addProposal(desc, {from: voter1});
                let proposal = await this.VotingInstance.getOneProposal(proposalId, {from: voter1}); 
                expect(proposal.description).to.be.equal(desc);
            });
        
            it('only a voter can add a proposal ', async function () {
                await this.VotingInstance.startProposalsRegistering({from: owner});
                let desc = 'test';
                await expectRevert(this.VotingInstance.addProposal(desc, {from: voter2}), "You're not a voter");
            });
                
            it('cannot add proposals yet', async function() {
                let desc = 'test';
                await expectRevert(this.VotingInstance.addProposal(desc, {from: voter1}), "Proposals are not allowed yet");
            });
        
            it('cannot add an empty proposal', async function() {
                await this.VotingInstance.startProposalsRegistering({from: owner});
                await expectRevert(this.VotingInstance.addProposal('', {from: voter1}), "Vous ne pouvez pas ne rien proposer");
            });
        });

        context('Get Proposals', async function() {
            it('proposal does not exist', async function() {
                await this.VotingInstance.startProposalsRegistering({from: owner});
                let wrongProposalId = 3;
                let desc = 'test';
                await this.VotingInstance.addProposal(desc, {from: voter1});
                await expectRevert.unspecified(this.VotingInstance.getOneProposal(wrongProposalId, {from: voter2}));  
            });

            it('only voter can retrieve proposal', async function() {
                await this.VotingInstance.startProposalsRegistering({from: owner});
                let proposalId= 0;
                let desc = 'test';
                await this.VotingInstance.addProposal(desc, {from: voter1});
                await expectRevert(this.VotingInstance.getOneProposal(proposalId, {from: voter2}), "You're not a voter");
            });
        });
    });

    //setVote
    describe('Set & Get votes', function() {
        beforeEach(async function () {
            this.VotingInstance = await Voting.new({from: owner});
        });

        it('setup vote and retrieve correctly', async function() {
            await this.VotingInstance.addVoter(voter1, {from: owner});
            await this.VotingInstance.startProposalsRegistering({from: owner});
    
            let desc = 'test';
            let proposalId = 0;
    
            await this.VotingInstance.addProposal(desc, {from: voter1});
            await this.VotingInstance.endProposalsRegistering({from: owner});
            await this.VotingInstance.startVotingSession({from: owner});
    
            await this.VotingInstance.setVote(proposalId, {from: voter1});
        });

        it('', async function() {
            await this.VotingInstance.addVoter(voter1, {from: owner});
            await this.VotingInstance.startProposalsRegistering({from: owner});
    
            let desc = 'test';
            let proposalId = 0;
    
            await this.VotingInstance.addProposal(desc, {from: voter1});
            await this.VotingInstance.endProposalsRegistering({from: owner});
            await this.VotingInstance.startVotingSession({from: owner});
        });
    });

    describe('Get Winner', async function() {

    });
});