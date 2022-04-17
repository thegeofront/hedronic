export const STANDARD_GRAPH =  {
  "nodes": {
    "7b71aee5-a6eb": {
      "hash": "7b71aee5-a6eb",
      "position": {
        "x": 10,
        "y": 8
      },
      "type": 0,
      "process": {
        "name": "and",
        "path": [
          "math",
          "logic",
          "and"
        ],
        "inCount": 2,
        "outCount": 1,
        "ins": [
          "any",
          "any"
        ],
        "outs": [
          "any"
        ]
      },
      "inputs": [
        {
          "node": "307eae14-d07c",
          "index": 1
        },
        {
          "node": "0080524e-b38a",
          "index": 1
        }
      ],
      "outputs": [
        [
          {
            "node": "971b78e9-2d58",
            "index": -1
          }
        ]
      ],
      "looping": false
    },
    "307eae14-d07c": {
      "hash": "307eae14-d07c",
      "position": {
        "x": 5,
        "y": 8
      },
      "type": 1,
      "process": {
        "name": "button",
        "state": false
      },
      "inputs": [],
      "outputs": [
        [
          {
            "node": "7b71aee5-a6eb",
            "index": -1
          }
        ]
      ],
      "looping": false
    },
    "0080524e-b38a": {
      "hash": "0080524e-b38a",
      "position": {
        "x": 5,
        "y": 9
      },
      "type": 1,
      "process": {
        "name": "button",
        "state": false
      },
      "inputs": [],
      "outputs": [
        [
          {
            "node": "7b71aee5-a6eb",
            "index": -2
          }
        ]
      ],
      "looping": false
    },
    "971b78e9-2d58": {
      "hash": "971b78e9-2d58",
      "position": {
        "x": 15,
        "y": 8
      },
      "type": 1,
      "process": {
        "name": "lamp",
        "state": false
      },
      "inputs": [
        {
          "node": "7b71aee5-a6eb",
          "index": 1
        }
      ],
      "outputs": [],
      "looping": false
    },
    "d01ed6c7-287e": {
      "hash": "d01ed6c7-287e",
      "position": {
        "x": 5,
        "y": 12
      },
      "type": 1,
      "process": {
        "name": "slider",
        "state": 7
      },
      "inputs": [],
      "outputs": [
        [
          {
            "node": "5a776b0d-f2b1",
            "index": -1
          }
        ]
      ],
      "looping": false
    },
    "da1c14da-07ef": {
      "hash": "da1c14da-07ef",
      "position": {
        "x": 5,
        "y": 13
      },
      "type": 1,
      "process": {
        "name": "slider",
        "state": 3
      },
      "inputs": [],
      "outputs": [
        [
          {
            "node": "5a776b0d-f2b1",
            "index": -2
          }
        ]
      ],
      "looping": false
    },
    "5a776b0d-f2b1": {
      "hash": "5a776b0d-f2b1",
      "position": {
        "x": 10,
        "y": 12
      },
      "type": 0,
      "process": {
        "name": "mul",
        "path": [
          "math",
          "basic",
          "mul"
        ],
        "inCount": 2,
        "outCount": 1,
        "ins": [
          "any",
          "any"
        ],
        "outs": [
          "any"
        ]
      },
      "inputs": [
        {
          "node": "d01ed6c7-287e",
          "index": 1
        },
        {
          "node": "da1c14da-07ef",
          "index": 1
        }
      ],
      "outputs": [
        [
          {
            "node": "2ab94cf1-2152",
            "index": -1
          }
        ]
      ],
      "looping": false
    },
    "2ab94cf1-2152": {
      "hash": "2ab94cf1-2152",
      "position": {
        "x": 15,
        "y": 12
      },
      "type": 1,
      "process": {
        "name": "console",
        "state": 21
      },
      "inputs": [
        {
          "node": "5a776b0d-f2b1",
          "index": 1
        }
      ],
      "outputs": [],
      "looping": false
    }
  }
};