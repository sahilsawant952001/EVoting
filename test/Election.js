const { assert } = require("chai");

var Election = artifacts.require("./Election.sol");

contract("Election", function(accounts) 
{
  var electionInstance;

  //Test for registering candidates
  it("it initializes the candidates with the correct values", function() 
  {
    return Election.deployed().then(function(instance) 
    {
      electionInstance = instance;
      return electionInstance.candidates(1);
    })
    .then(function(candidate) 
    {
      assert.equal(candidate[0], 1, "contains the correct id");
      assert.equal(candidate[1], "Sanjay Mukund Kelkar", "contains the correct name");
      assert.equal(candidate[2], "Bharatiya Janata Party", "contains the correct party");
      assert.equal(candidate[3], 0, "contains the correct votes count");
      assert.equal(candidate[4],"https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Lotos_flower_symbol.svg/100px-Lotos_flower_symbol.svg.png","contains the correct symbol url");
      return electionInstance.candidates(2);
    })
    .then(function(candidate) 
    {
      assert.equal(candidate[0], 2, "contains the correct id");
      assert.equal(candidate[1], "Narayan Shankar Pawar", "contains the correct name");
      assert.equal(candidate[2], "Indian National Congress", "contains the correct party");
      assert.equal(candidate[3], 0, "contains the correct votes count");
      assert.equal(candidate[4],"https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Hand_INC.svg/150px-Hand_INC.svg.png","contains the correct symbol url");
      return electionInstance.candidates(3);
    })
    .then(function(candidate) 
    {
      assert.equal(candidate[0], 3, "contains the correct id");
      assert.equal(candidate[1], "Sadanand Ravindra Phatak", "contains the correct name");
      assert.equal(candidate[2], "Shivsena", "contains the correct party");
      assert.equal(candidate[3], 0, "contains the correct votes count");
      assert.equal(candidate[4],"https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Indian_Election_Symbol_Bow_And_Arrow.png/120px-Indian_Election_Symbol_Bow_And_Arrow.png","contains the correct symbol url");
      return electionInstance.candidates(4);
    })
    .then(function(candidate) 
    {
      assert.equal(candidate[0], 4, "contains the correct id");
      assert.equal(candidate[1], "Niranjan Vasant Davkhare", "contains the correct name");
      assert.equal(candidate[2], "Nationalist Congress Party", "contains the correct party");
      assert.equal(candidate[3], 0, "contains the correct votes count");
      assert.equal(candidate[4],"https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Clock_symbol_of_NCP.png/140px-Clock_symbol_of_NCP.png","contains the correct symbol url");
      return electionInstance.candidates(5);
    })
    .then(function(candidate) 
    {
      assert.equal(candidate[0], 5, "contains the correct id");
      assert.equal(candidate[1], "Nilesh Harishchandra Chavan", "contains the correct name");
      assert.equal(candidate[2], "Maharashtra Navnirman Sena", "contains the correct party");
      assert.equal(candidate[3], 0, "contains the correct votes count");
      assert.equal(candidate[4],"https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Indian_Election_Symbol_Railway_Engine.png/150px-Indian_Election_Symbol_Railway_Engine.png","contains the correct symbol url");
      return electionInstance.candidates(6);
    })
    .then(function(candidate) 
    {
      assert.equal(candidate[0], 6, "contains the correct id");
      assert.equal(candidate[1], "NOTA", "contains the correct name");
      assert.equal(candidate[2], "None of the above", "contains the correct party");
      assert.equal(candidate[3], 0, "contains the correct votes count");
      assert.equal(candidate[4],"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/NOTA_Option_Logo.png/220px-NOTA_Option_Logo.png");
    });
  });

  //Test for candidate count
  it("initializes with 6 candidates along with the parties", function() 
  {
    return Election.deployed().then(function(instance) 
    {
      return instance.candidateCount();
    })
    .then(function(count) 
    {
      assert.equal(count.toNumber(),6);
    });
  });

  //Test for voting
  it("allows a voter to cast a vote", function() 
  {
    return Election.deployed().then(function(instance) 
    {
      electionInstance = instance;
      candidateId = 1;
      return electionInstance.vote(candidateId, { from: accounts[0] });
    })
    .then(function(receipt) 
    {
      assert.equal(receipt.logs.length, 1, "an event was triggered");
      assert.equal(receipt.logs[0].event, "votedEvent", "the event type is correct");
      assert.equal(receipt.logs[0].args._candidateId.toNumber(), candidateId, "the candidate id is correct");
      return electionInstance.voters(accounts[0]);
    })
    .then(function(voted) 
    {
      assert(voted, "the voter was marked as voted");
      return electionInstance.candidates(candidateId);
    })
    .then(function(candidate) 
    {
      var voteCount = candidate[3];
      assert.equal(voteCount,1, "increments the candidate's vote count");
    })
  });

  //Test for invalid candidate voting
  it("throws an exception for invalid candiates", function() 
  {
    return Election.deployed().then(function(instance) 
    {
      electionInstance = instance;
      return electionInstance.vote(99, { from: accounts[1] })
    })
    .then(assert.fail).catch(function(error) 
    {
      assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
      return electionInstance.candidates(1);
    })
    .then(function(candidate1) 
    {
      var voteCount = candidate1[3];
      assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
      return electionInstance.candidates(2);
    })
    .then(function(candidate2) 
    {
        var voteCount = candidate2[3];
        assert.equal(voteCount, 0, "candidate 2 did not receive any votes");
        return electionInstance.candidates(3);
    })
    .then(function(candidate3)
    {
        var voteCount = candidate3[3];
        assert.equal(voteCount, 0, "candidate 3 did not receive any votes");
        return electionInstance.candidates(4);
    })
    .then(function(candidate4)
    {
        var voteCount = candidate4[3];
        assert.equal(voteCount, 0, "candidate 4 did not receive any votes");
        return electionInstance.candidates(5);
    })
    .then(function(candidate5)
    {
        var voteCount = candidate5[3];
        assert.equal(voteCount, 0, "candidate 5 did not receive any votes");
        return electionInstance.candidates(6);
    })
    .then(function(candidate6)
    {
        var voteCount = candidate6[3];
        assert.equal(voteCount, 0, "candidate 6 did not receive any votes");
    })
  });

  //Test for double voting
  it("throws an exception for double voting", function() 
  {
    return Election.deployed().then(function(instance) 
    {
      electionInstance = instance;
      candidateId = 2;
      electionInstance.vote(candidateId, { from: accounts[1] });
      return electionInstance.candidates(candidateId);
    })
    .then(function(candidate) 
    {
      var voteCount = candidate[3];
      assert.equal(voteCount, 1, "accepts first vote");
      // Try to vote again
      return electionInstance.vote(candidateId, { from: accounts[1] });
    })
    .then(assert.fail).catch(function(error) 
    {
      assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
      return electionInstance.candidates(1);
    })
    .then(function(candidate1) 
    {
      var voteCount = candidate1[3];
      assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
      return electionInstance.candidates(2);
    })
    .then(function(candidate2) 
    {
        var voteCount = candidate2[3];
        assert.equal(voteCount, 1, "candidate 2 did not receive any votes");
        return electionInstance.candidates(3);
    })
    .then(function(candidate3)
    {
        var voteCount = candidate3[3];
        assert.equal(voteCount, 0, "candidate 3 did not receive any votes");
        return electionInstance.candidates(4);
    })
    .then(function(candidate4)
    {
        var voteCount = candidate4[3];
        assert.equal(voteCount, 0, "candidate 4 did not receive any votes");
        return electionInstance.candidates(5);
    })
    .then(function(candidate5)
    {
        var voteCount = candidate5[3];
        assert.equal(voteCount, 0, "candidate 5 did not receive any votes");
        return electionInstance.candidates(6);
    })
    .then(function(candidate6)
    {
        var voteCount = candidate6[3];
        assert.equal(voteCount, 0, "candidate 6 did not receive any votes");
    })
  });
});