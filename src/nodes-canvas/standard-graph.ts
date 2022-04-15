export const STANDARD_GRAPH =  {
  "nodes": {
    "0ac2f2ec-9c23": {
      "hash": "0ac2f2ec-9c23",
      "position": {
        "x": 3,
        "y": 19
      },
      "type": 1,
      "process": {
        "name": "slider",
        "state": 2
      },
      "inputs": [],
      "outputs": [
        [
          {
            "node": "4a456e6f-7b73",
            "index": -1
          }
        ]
      ],
      "looping": false
    },
    "4a456e6f-7b73": {
      "hash": "4a456e6f-7b73",
      "position": {
        "x": 8,
        "y": 19
      },
      "type": 0,
      "process": {
        "name": "remap",
        "path": [
          "functions"
        ],
        "inCount": 3,
        "outCount": 1,
        "ins": [
          "number",
          "Ref->range-1",
          "Ref->range-1"
        ],
        "outs": [
          "number"
        ]
      },
      "inputs": [
        {
          "node": "0ac2f2ec-9c23",
          "index": 1
        },
        {
          "node": "5ce22199-8135",
          "index": 1
        },
        {
          "node": "11e3c5bc-6fc1",
          "index": 1
        }
      ],
      "outputs": [
        [
          {
            "node": "5c53c681-286d",
            "index": -1
          }
        ]
      ],
      "looping": false
    },
    "5ce22199-8135": {
      "hash": "5ce22199-8135",
      "position": {
        "x": 3,
        "y": 21
      },
      "type": 0,
      "process": {
        "name": "new range",
        "path": [
          "functions"
        ],
        "inCount": 2,
        "outCount": 1,
        "ins": [
          "number",
          "number"
        ],
        "outs": [
          "Ref->range-1"
        ]
      },
      "inputs": [
        {
          "node": "cd8f5372-195d",
          "index": 1
        },
        {
          "node": "ea9ad8f9-ebfa",
          "index": 1
        }
      ],
      "outputs": [
        [
          {
            "node": "4a456e6f-7b73",
            "index": -2
          }
        ]
      ],
      "looping": false
    },
    "cd8f5372-195d": {
      "hash": "cd8f5372-195d",
      "position": {
        "x": -2,
        "y": 21
      },
      "type": 1,
      "process": {
        "name": "slider",
        "state": 0
      },
      "inputs": [],
      "outputs": [
        [
          {
            "node": "5ce22199-8135",
            "index": -1
          },
          {
            "node": "11e3c5bc-6fc1",
            "index": -1
          }
        ]
      ],
      "looping": false
    },
    "ea9ad8f9-ebfa": {
      "hash": "ea9ad8f9-ebfa",
      "position": {
        "x": -2,
        "y": 22
      },
      "type": 1,
      "process": {
        "name": "slider",
        "state": 10
      },
      "inputs": [],
      "outputs": [
        [
          {
            "node": "5ce22199-8135",
            "index": -2
          }
        ]
      ],
      "looping": false
    },
    "11e3c5bc-6fc1": {
      "hash": "11e3c5bc-6fc1",
      "position": {
        "x": 3,
        "y": 24
      },
      "type": 0,
      "process": {
        "name": "new range",
        "path": [
          "functions"
        ],
        "inCount": 2,
        "outCount": 1,
        "ins": [
          "number",
          "number"
        ],
        "outs": [
          "Ref->range-1"
        ]
      },
      "inputs": [
        {
          "node": "cd8f5372-195d",
          "index": 1
        },
        {
          "node": "042d0b37-394e",
          "index": 1
        }
      ],
      "outputs": [
        [
          {
            "node": "4a456e6f-7b73",
            "index": -3
          }
        ]
      ],
      "looping": false
    },
    "042d0b37-394e": {
      "hash": "042d0b37-394e",
      "position": {
        "x": -2,
        "y": 25
      },
      "type": 1,
      "process": {
        "name": "slider",
        "state": 1
      },
      "inputs": [],
      "outputs": [
        [
          {
            "node": "11e3c5bc-6fc1",
            "index": -2
          }
        ]
      ],
      "looping": false
    },
    "5c53c681-286d": {
      "hash": "5c53c681-286d",
      "position": {
        "x": 5,
        "y": 27
      },
      "type": 1,
      "process": {
        "name": "console",
        "state": 0.2
      },
      "inputs": [
        {
          "node": "4a456e6f-7b73",
          "index": 1
        }
      ],
      "outputs": [],
      "looping": false
    }
  }
};