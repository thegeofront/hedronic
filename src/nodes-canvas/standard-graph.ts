export const STANDARD_GRAPH =  {
  "nodes": {
    "16b52962-e0e5": {
      "hash": "16b52962-e0e5",
      "position": {
        "x": 13,
        "y": 6
      },
      "type": 0,
      "process": {
        "name": "and",
        "path": [
          "std",
          "Math",
          "Logic",
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
          "node": "1492470d-22e8",
          "index": 1
        },
        {
          "node": "579ff8d5-46d5",
          "index": 1
        }
      ],
      "outputs": [
        [
          {
            "node": "4fff0162-0b9f",
            "index": -1
          }
        ]
      ],
      "looping": false
    },
    "1492470d-22e8": {
      "hash": "1492470d-22e8",
      "position": {
        "x": 8,
        "y": 5
      },
      "type": 1,
      "process": {
        "name": "button",
        "state": true
      },
      "inputs": [],
      "outputs": [
        [
          {
            "node": "16b52962-e0e5",
            "index": -1
          }
        ]
      ],
      "looping": false
    },
    "579ff8d5-46d5": {
      "hash": "579ff8d5-46d5",
      "position": {
        "x": 8,
        "y": 8
      },
      "type": 1,
      "process": {
        "name": "button",
        "state": true
      },
      "inputs": [],
      "outputs": [
        [
          {
            "node": "16b52962-e0e5",
            "index": -2
          }
        ]
      ],
      "looping": false
    },
    "4fff0162-0b9f": {
      "hash": "4fff0162-0b9f",
      "position": {
        "x": 18,
        "y": 5
      },
      "type": 1,
      "process": {
        "name": "lamp",
        "state": true
      },
      "inputs": [
        {
          "node": "16b52962-e0e5",
          "index": 1
        }
      ],
      "outputs": [],
      "looping": false
    }
  }
};