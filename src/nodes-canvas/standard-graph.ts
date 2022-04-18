export const STANDARD_GRAPH =  {
  "nodes": {
    "76ddb65a-c329": {
      "hash": "76ddb65a-c329",
      "position": {
        "x": 12,
        "y": 16
      },
      "type": 0,
      "process": {
        "name": "Random from seed",
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
        "y": 14
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
            "node": "c9a238b6-5914",
            "index": -3
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
          "node": "c9a238b6-5914",
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
            "node": "1dfc7764-22e7",
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
        "state": 1000
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
    "c9a238b6-5914": {
      "hash": "c9a238b6-5914",
      "position": {
        "x": 12,
        "y": 12
      },
      "type": 0,
      "process": {
        "name": "Range3 from radii",
        "path": [
          "std",
          "Math",
          "Range",
          "Range 3",
          "Range3 from radii"
        ],
        "inCount": 3,
        "outCount": 1,
        "ins": [
          "number",
          "number",
          "number"
        ],
        "outs": [
          "Object {}"
        ]
      },
      "inputs": [
        {
          "node": "d1d284e2-24bc",
          "index": 1
        },
        {
          "node": "800c3410-5424",
          "index": 1
        },
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
    "800c3410-5424": {
      "hash": "800c3410-5424",
      "position": {
        "x": 7,
        "y": 13
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
            "node": "c9a238b6-5914",
            "index": -2
          }
        ]
      ],
      "looping": false
    },
    "d1d284e2-24bc": {
      "hash": "d1d284e2-24bc",
      "position": {
        "x": 7,
        "y": 12
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
            "node": "c9a238b6-5914",
            "index": -1
          }
        ]
      ],
      "looping": false
    },
    "1dfc7764-22e7": {
      "hash": "1dfc7764-22e7",
      "position": {
        "x": 19,
        "y": 18
      },
      "type": 0,
      "process": {
        "name": "MultiPoint",
        "path": [
          "std",
          "Multi",
          "Multi Point",
          "MultiPoint"
        ],
        "inCount": 1,
        "outCount": 1,
        "ins": [
          "List<>"
        ],
        "outs": [
          "Object {}"
        ]
      },
      "inputs": [
        {
          "node": "11c65996-071e",
          "index": 1
        }
      ],
      "outputs": [
        [
          {
            "node": "2a280810-f1a6",
            "index": -1
          }
        ]
      ],
      "looping": false
    },
    "2a280810-f1a6": {
      "hash": "2a280810-f1a6",
      "position": {
        "x": 19,
        "y": 21
      },
      "type": 0,
      "process": {
        "name": "Delaunay",
        "path": [
          "std",
          "3D",
          "Mesh",
          "Delaunay"
        ],
        "inCount": 1,
        "outCount": 1,
        "ins": [
          "List<>"
        ],
        "outs": [
          "Object {}"
        ]
      },
      "inputs": [
        {
          "node": "1dfc7764-22e7",
          "index": 1
        }
      ],
      "outputs": [
        []
      ],
      "looping": false
    }
  }
};