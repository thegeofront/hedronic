export const STANDARD_GRAPH =  {
  "nodes": {
    "03f21a3e-b3be": {
      "hash": "03f21a3e-b3be",
      "position": {
        "x": 12,
        "y": 13
      },
      "type": 0,
      "process": {
        "name": "Range3 from radius",
        "path": [
          "std",
          "Math",
          "Range",
          "Range 3",
          "Range3 from radius"
        ],
        "inCount": 1,
        "outCount": 1,
        "ins": [
          "number"
        ],
        "outs": [
          "Object {}"
        ]
      },
      "inputs": [
        {
          "node": "3f05d5da-33b2",
          "index": 1
        }
      ],
      "outputs": [
        [
          {
            "node": "11c65996-071e",
            "index": -1
          }
        ]
      ],
      "looping": false
    },
    "76ddb65a-c329": {
      "hash": "76ddb65a-c329",
      "position": {
        "x": 12,
        "y": 16
      },
      "type": 0,
      "process": {
        "name": "newFromSeed",
        "path": [
          "std",
          "Math",
          "Random",
          "Random from seed"
        ],
        "inCount": 1,
        "outCount": 1,
        "ins": [
          "any"
        ],
        "outs": [
          "any"
        ]
      },
      "inputs": [
        {
          "node": "a3861169-ab7e",
          "index": 1
        }
      ],
      "outputs": [
        [
          {
            "node": "11c65996-071e",
            "index": -2
          }
        ]
      ],
      "looping": false
    },
    "a3861169-ab7e": {
      "hash": "a3861169-ab7e",
      "position": {
        "x": 7,
        "y": 16
      },
      "type": 1,
      "process": {
        "name": "slider",
        "state": 5
      },
      "inputs": [],
      "outputs": [
        [
          {
            "node": "76ddb65a-c329",
            "index": -1
          }
        ]
      ],
      "looping": false
    },
    "3f05d5da-33b2": {
      "hash": "3f05d5da-33b2",
      "position": {
        "x": 7,
        "y": 13
      },
      "type": 1,
      "process": {
        "name": "slider",
        "state": 5
      },
      "inputs": [],
      "outputs": [
        [
          {
            "node": "03f21a3e-b3be",
            "index": -1
          }
        ]
      ],
      "looping": false
    },
    "11c65996-071e": {
      "hash": "11c65996-071e",
      "position": {
        "x": 19,
        "y": 14
      },
      "type": 0,
      "process": {
        "name": "Spawn",
        "path": [
          "std",
          "Math",
          "Range",
          "Range 3",
          "Spawn"
        ],
        "inCount": 3,
        "outCount": 1,
        "ins": [
          "Object {}",
          "Object {}",
          "number"
        ],
        "outs": [
          "Object {}"
        ]
      },
      "inputs": [
        {
          "node": "03f21a3e-b3be",
          "index": 1
        },
        {
          "node": "76ddb65a-c329",
          "index": 1
        },
        {
          "node": "0b1667d0-fc1e",
          "index": 1
        }
      ],
      "outputs": [
        [
          {
            "node": "4183d1f2-e8a1",
            "index": -1
          }
        ]
      ],
      "looping": false
    },
    "0b1667d0-fc1e": {
      "hash": "0b1667d0-fc1e",
      "position": {
        "x": 12,
        "y": 20
      },
      "type": 1,
      "process": {
        "name": "slider",
        "state": 8
      },
      "inputs": [],
      "outputs": [
        [
          {
            "node": "11c65996-071e",
            "index": -3
          }
        ]
      ],
      "looping": false
    },
    "4183d1f2-e8a1": {
      "hash": "4183d1f2-e8a1",
      "position": {
        "x": 24,
        "y": 13
      },
      "type": 1,
      "process": {
        "name": "console",
        "state": [
          {},
          {},
          {},
          {},
          {},
          {},
          {},
          {}
        ]
      },
      "inputs": [
        {
          "node": "11c65996-071e",
          "index": 1
        }
      ],
      "outputs": [],
      "looping": false
    }
  }
};