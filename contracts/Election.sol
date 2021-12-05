pragma solidity ^0.5.0;

contract Election {
    // Model a Candidate
    struct Candidate {
        uint id;
        string name;
        string party;
        uint voteCount;
        string symbol;
    }

    // Store accounts that have voted
    mapping(address => bool) public voters;

    // Store Candidates
    // Fetch Candidate
    mapping(uint => Candidate) public candidates;

    // Store Candidates Count
    uint public candidateCount;

    // voted event
    event votedEvent (
        uint indexed _candidateId
    );

    constructor () public {
        addCandidate("Sanjay Mukund Kelkar","Bharatiya Janata Party","https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Lotos_flower_symbol.svg/100px-Lotos_flower_symbol.svg.png");
        addCandidate("Narayan Shankar Pawar","Indian National Congress","https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Hand_INC.svg/150px-Hand_INC.svg.png");
        addCandidate("Sadanand Ravindra Phatak","Shivsena","https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Indian_Election_Symbol_Bow_And_Arrow.png/120px-Indian_Election_Symbol_Bow_And_Arrow.png");
        addCandidate("Niranjan Vasant Davkhare","Nationalist Congress Party","https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Clock_symbol_of_NCP.png/140px-Clock_symbol_of_NCP.png");
        addCandidate("Nilesh Harishchandra Chavan","Maharashtra Navnirman Sena","https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Indian_Election_Symbol_Railway_Engine.png/150px-Indian_Election_Symbol_Railway_Engine.png");
        addCandidate("NOTA","None of the above","https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/NOTA_Option_Logo.png/220px-NOTA_Option_Logo.png");
    }

    function addCandidate (string memory name,string memory party,string memory symbol) private {
        candidateCount ++;
        candidates[candidateCount] = Candidate(candidateCount, name,party, 0,symbol);
    }

    function vote (uint _candidateId) public {
        // require that they haven't voted before
        require(!voters[msg.sender]);

        // require a valid candidate
        require(_candidateId > 0 && _candidateId <= candidateCount);

        // record that voter has voted
        voters[msg.sender] = true;

        // update candidate vote Count
        candidates[_candidateId].voteCount ++;

        // trigger voted event
        emit votedEvent(_candidateId);
    }
}