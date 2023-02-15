App = {
  loading: false,
  contracts: {},

  load: async () => {
    await App.loadWeb3()
    await App.loadAccount()
    await App.loadContract()
    await App.render()
  },

  loadWeb3: async () => {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      window.alert("Please connect your Metamask!")
    }

    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        await ethereum.enable()
        await window.ethereum.enable()
        web3.eth.sendTransaction({/* ... */})
      } catch (error) {
 
      }
    }

    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      web3.eth.sendTransaction({/* ... */})
    }

    else {
      console.log('No Metamask detected! Please install metamask')
    }
  },

  loadAccount: async () => {
    web3.eth.defaultAccount = web3.eth.accounts[0]
    //personal.unlockAccount(web3.eth.defaultAccount)
    App.account = web3.eth.accounts[0]
    App.account = web3.eth.defaultAccount
  },

  loadContract: async () => {

    abiArray = [
      {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "content",
            "type": "string"
          }
        ],
        "name": "StudentCreated",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "_content",
            "type": "string"
          }
        ],
        "name": "createStudent",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "studentCount",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "students",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "content",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ]

    contractAddress = 0xF452F1ADA88cB8788415241b838ad05fa5D0b00c

    const roster = await $.getJSON('Roster.json')
    App.contracts.Roster = TruffleContract(roster)
    var rosterABI = web3.eth.contract(abiArray)
    var rosterCode = rosterABI.at(contractAddress);
    App.contracts.Roster.setProvider(App.web3Provider)
    App.roster = await App.contracts.Roster.deployed()
    //App.roster = rosterCode
  },

  render: async () => {
    if (App.loading) {
      return
    }

    App.setLoading(true)

    $('#account').html(App.account)

    await App.renderRoster()

    App.setLoading(false)
  },

  renderRoster: async () => {
    const studentCount = await App.roster.studentCount()
    const $studentTemplate = $('.studentTemplate')

    for (var i = 1; i <= studentCount; i++) {
      const student = await App.roster.students(i)
      const studentId = student[0].toNumber()
      const studentContent = student[1]


      const $newStudentTemplate = $studentTemplate.clone()
      $newStudentTemplate.find('.content').html(studentContent)
      $newStudentTemplate.find('input')
                      .prop('name', studentId)

                      
      $('#studentList').append($newStudentTemplate)

      $newStudentTemplate.show()
    }
  },

  createStudent: async () => {
    App.setLoading(true)
    const content = $('#newName').val()
    await App.roster.createStudent(content)
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
