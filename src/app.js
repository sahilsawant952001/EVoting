App = {
    loading: false,
    contracts: {},
  
    load: async () => {
      await App.loadWeb3()
      await App.loadAccount()
      await App.loadContract()
      await App.render()
    },
  
    // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
    loadWeb3: async () => {
      if (typeof web3 !== 'undefined') {
        App.web3Provider = web3.currentProvider
        web3 = new Web3(web3.currentProvider)
      } else {
        window.alert("Please connect to Metamask.")
      }
      // Modern dapp browsers...
      if (window.ethereum) {
        window.web3 = new Web3(ethereum)
        try {
          // Request account access if needed
          await ethereum.enable()
          // Acccounts now exposed
          web3.eth.sendTransaction({/* ... */})
        } catch (error) {
          // User denied account access...
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        App.web3Provider = web3.currentProvider
        window.web3 = new Web3(web3.currentProvider)
        // Acccounts always exposed
        web3.eth.sendTransaction({/* ... */})
      }
      // Non-dapp browsers...
      else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
      }
    },
  
    loadAccount: async () => {
      // Set the current blockchain account
      App.account = web3.eth.accounts[0]
    },
  
    loadContract: async () => {
      // Create a JavaScript version of the smart contract
      const election = await $.getJSON('Election.json')
      App.contracts.Election = TruffleContract(election)
      App.contracts.Election.setProvider(App.web3Provider)
  
      // Hydrate the smart contract with values from the blockchain
      App.election = await App.contracts.Election.deployed()
    },
  
    render: async () => {
      // Prevent double render
      if (App.loading) {
        return
      }
  
      // Update app loading state
      App.setLoading(true)
  
      // Render Account
      $('#account').html(App.account)
  
      // Render Tasks
      await App.renderCandidates()
  
      // Update loading state
      App.setLoading(false)
    },
  
    renderCandidates: async () => {
      // Load the total task count from the blockchain
      const candidateCount = await App.election.candidateCount()
      const hasVoted = await App.election.voters(App.account);
      console.log("Has Voted : ",hasVoted);
      const $c_details = $('.c_details');
      const $opt = $('.opt');

      // Render out each task with a new task template
      for (var i = 1; i <= candidateCount; i++) {
        // Fetch the task data from the blockchain
        const candidate = await App.election.candidates(i)
        const candidateId = candidate[0].toNumber()
        const candidateName = candidate[1]
        const candidateParty = candidate[2]
        const candidateVotes = candidate[3].toNumber()
        const symbol = candidate[4]
  
        // Create the html for the task
        const $newCandidate = $c_details.clone()
        $newCandidate.find(".c_id").html(candidateId)
        $newCandidate.find(".c_party").html(candidateName)
        $newCandidate.find(".c_name").html(candidateParty)
        $newCandidate.find(".c_votes").html(candidateVotes)

        const newsymbol = `<img height='50px' src=${symbol} alt=${candidateId}/>`
        $newCandidate.find(".c_symbol").append(newsymbol);

        const $newOption = $opt.clone();
        $newOption.prop("value",candidateId);
        const t = candidateName+" ("+candidateParty+")";
        $newOption.html(t);
  
        $('.c_list').append($newCandidate)
        $("#option_list").append($newOption)

        // Show the task
        $newCandidate.show()
      }

      if(hasVoted===true)
      {
          $('#votingBtn').attr('disabled' , true)
      }
    },

    castVote: async () => {
      App.setLoading(true)
      var candidateId = $('#option_list').val();
      await App.election.vote(candidateId);
      window.location.reload()
    },
  
    setLoading: (boolean) => {
      App.loading = boolean
      const loader = $('#loader')
      const content = $('#content')
      if (boolean) {
        loader.show()
        content.hide()
      } else {
        loader.hide()
        content.show()
      }
    }
  }
  
  $(() => {
    $(window).load(() => {
      App.load()
    })
  })