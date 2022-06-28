# Voting System
## Project 2 Test

https://github.com/jjeangal/truflle_wsl_test
This project offers a solution to the testing Challenge n°2 proposed by Alyra.

## Functions


The voting contract to test is made of the following functions:

- getVoter(address _addr)
- getOneProposal(uint _id)
- addVoter(address _addr)
- addProposal(string memory _desc)
- setVote( uint _id)
- startProposalsRegistering() 
- endProposalsRegistering()
- startVotingSession()
- endVotingSession()
- tallyVotes()

## Test Methods Structure

The tests were organized in the following categories: 

- State Changes
    - Correct state changes
        * Start proposal status change 
        * End proposal status change
        * Start voting status change
        * End voting status change
        * Vote tally status change
    - Uncorrect state changes
        * Wrong phase to end proposal registering
        * Wrong phase to start voting session
        * Wrong phase to end voting session
        * Wrong phase to start vote Tally
- Set & Get Voters
    - Set Voters
        * Add a voter successfully
        * Adding voter triggers event
        * Only owner can add a voter
        * Cannot add a voter if session does not allow it anymore
        * Voter is already registered
    - Get Voters
        * Retrieved voter is registered
        * Retrieved voter has voted 
        * Retrieved non existing voter is not registered
        * Retrieved non existing voter has not voted
        * Retrieved voter voted for the first proposal proposal
        * Only voter can retrieve voter
- Set & Get Proposals
    - Set Proposals
        * Add a proposal succesfully
        * Only a voter can add a proposal
        * Cannot add proposals yet
        * Cannot add an empty proposal
        * Adding proposal throws event
    - Get Proposals
        * Proposal does not exist
        * Only voter can retrieve proposal
- Set & Get Votes
    - Set Votes
        * Only a voter can vote
        * Vote for non existing proposal
        * Setup vote correctly
        * Setup vote triggers event
        * Cannot vote twice
        * Not the right status to vote
    - Get Votes
        * Get vote description
        * Get vote count

With the installed dependencies and libraries, theses tests are verified in terms of gas consumption, time of execution and are included in the coverage check.

## Coverage

File         |  % Stmts | % Branch |  % Funcs |  % Lines |
-------------|----------|----------|----------|----------|
  Voting.sol |      100 |   96.43  |      100 |      100 |

## Plugins, Frameworks, Packages

In order to run the project, you need to install the following plugins.
The official npm pages are linked below.

| Plugin | Links |
| ------ | ------ |
| eth-gas-reporter | https://www.npmjs.com/package/eth-gas-reporter |
| soidity-coverage | https://www.npmjs.com/package/solidity-coverage |
| truffle/hdwallet-provider | https://www.npmjs.com/package/@truffle/hdwallet-provider |
| mocha | https://www.npmjs.com/package/mocha |
| chai | https://www.npmjs.com/package/ch |

## Run the tests

Ran the tests with the following parameters

> truffle:           v5.5.17
> ganache-core:      v2.13.2
> solidity-coverage: v0.7.16

Now, open your Terminal and run these commands.

First Tab:

```sh
ganache
```

Second Tab:

```sh
truffle test test/voting.test.js
```

(optional) Third:

```sh
truffle run coverage
```