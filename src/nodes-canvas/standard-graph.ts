export const STANDARD_GRAPH =  {
  "meta": {
    "name": "default script",
    "date": "-",
  },
  "dependencies": {
    "geofront": {
      "fullname": "Geofront Standard Library",
      "version": "",
      "url": "./wasm-modules/geofront",
      "__backup__url_online": "https://cdn.jsdelivr.net/npm/geofront"
    },
    "gfp-startin": {
      "url": "./wasm-modules/startin"
    },
  },
  "graph": {
    "76ddb65a-c329": {
      "hash": "76ddb65a-c329",
      "position": {
        "x": 6,
        "y": 12
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
        "x": 1,
        "y": 12
      },
      "type": 1,
      "process": {
        "name": "slider",
        "state": 9
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
        "x": 1,
        "y": 10
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
        "x": 14,
        "y": 8
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
        "x": 7,
        "y": 16
      },
      "type": 1,
      "process": {
        "name": "slider",
        "state": 10000
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
        "x": 6,
        "y": 8
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
        "x": 1,
        "y": 9
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
            "index": -2
          }
        ]
      ],
      "looping": false
    },
    "d1d284e2-24bc": {
      "hash": "d1d284e2-24bc",
      "position": {
        "x": 1,
        "y": 8
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
        "x": 14,
        "y": 12
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
        "x": 14,
        "y": 15
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
        [
          {
            "node": "ea1b0552-d74e",
            "index": -1
          }
        ]
      ],
      "looping": false
    },
    "ea1b0552-d74e": {
      "hash": "ea1b0552-d74e",
      "position": {
        "x": 21,
        "y": 8
      },
      "type": 1,
      "process": {
        "name": "get",
        "state": {
          "keys": [
            "verts",
            "faces"
          ],
          "types": [
            7,
            5
          ]
        }
      },
      "inputs": [
        {
          "node": "2a280810-f1a6",
          "index": 1
        }
      ],
      "outputs": [
        [
          {
            "node": "20824799-e446",
            "index": -1
          }
        ],
        [
          {
            "node": "598b049f-c6d2",
            "index": -2
          }
        ]
      ],
      "looping": false
    },
    "b7c2ce9f-37fe": {
      "hash": "b7c2ce9f-37fe",
      "position": {
        "x": 21,
        "y": 14
      },
      "type": 1,
      "process": {
        "name": "get",
        "state": {
          "keys": [
            "x",
            "y",
            "z"
          ],
          "types": [
            3,
            3,
            3
          ]
        }
      },
      "inputs": [
        {
          "node": "20824799-e446",
          "index": 1
        }
      ],
      "outputs": [
        [
          {
            "node": "657a09b4-b59d",
            "index": -1
          }
        ],
        [
          {
            "node": "657a09b4-b59d",
            "index": -2
          }
        ],
        []
      ],
      "looping": true
    },
    "20824799-e446": {
      "hash": "20824799-e446",
      "position": {
        "x": 21,
        "y": 11
      },
      "type": 0,
      "process": {
        "name": "iterate",
        "path": [
          "std",
          "Multi",
          "Multi Point",
          "iterate"
        ],
        "inCount": 1,
        "outCount": 1,
        "ins": [
          "Object {}"
        ],
        "outs": [
          "List<>"
        ]
      },
      "inputs": [
        {
          "node": "ea1b0552-d74e",
          "index": 1
        }
      ],
      "outputs": [
        [
          {
            "node": "b7c2ce9f-37fe",
            "index": -1
          },
          {
            "node": "6b51d652-a511",
            "index": -2
          }
        ]
      ],
      "looping": false
    },
    "2587d4d7-a555": {
      "hash": "2587d4d7-a555",
      "position": {
        "x": 21,
        "y": 19
      },
      "type": 0,
      "process": {
        "name": "noise",
        "path": [
          "std",
          "Math",
          "Noise",
          "noise"
        ],
        "inCount": 5,
        "outCount": 1,
        "ins": [
          "number",
          "number",
          "number",
          "number",
          "number"
        ],
        "outs": [
          "number"
        ]
      },
      "inputs": [
        {
          "node": "575d6ba1-1ffd",
          "index": 1
        },
        {
          "node": "1dfcbeeb-0f8f",
          "index": 1
        },
        {
          "node": "ca2df10e-ec6c",
          "index": 1
        },
        {
          "node": "ef6409fc-5a1a",
          "index": 1
        },
        {
          "node": "ca4657a4-cc34",
          "index": 1
        }
      ],
      "outputs": [
        [
          {
            "node": "6b51d652-a511",
            "index": -1
          }
        ]
      ],
      "looping": false
    },
    "6b51d652-a511": {
      "hash": "6b51d652-a511",
      "position": {
        "x": 26,
        "y": 18
      },
      "type": 0,
      "process": {
        "name": "octave",
        "path": [
          "std",
          "Math",
          "Noise",
          "octave"
        ],
        "inCount": 2,
        "outCount": 1,
        "ins": [
          "Object {undefined}",
          "Object {undefined}"
        ],
        "outs": [
          "number"
        ]
      },
      "inputs": [
        {
          "node": "2587d4d7-a555",
          "index": 1
        },
        {
          "node": "20824799-e446",
          "index": 1
        }
      ],
      "outputs": [
        [
          {
            "node": "8c111aa8-a244",
            "index": -1
          }
        ]
      ],
      "looping": true
    },
    "657a09b4-b59d": {
      "hash": "657a09b4-b59d",
      "position": {
        "x": 31,
        "y": 14
      },
      "type": 0,
      "process": {
        "name": "Point",
        "path": [
          "std",
          "0D",
          "Point",
          "Point"
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
          "node": "b7c2ce9f-37fe",
          "index": 1
        },
        {
          "node": "b7c2ce9f-37fe",
          "index": 2
        },
        {
          "node": "8c111aa8-a244",
          "index": 1
        }
      ],
      "outputs": [
        [
          {
            "node": "3d0eef34-60ae",
            "index": -1
          }
        ]
      ],
      "looping": true
    },
    "598b049f-c6d2": {
      "hash": "598b049f-c6d2",
      "position": {
        "x": 31,
        "y": 8
      },
      "type": 0,
      "process": {
        "name": "Mesh",
        "path": [
          "std",
          "3D",
          "Mesh",
          "Mesh"
        ],
        "inCount": 2,
        "outCount": 1,
        "ins": [
          "Object {}",
          "List<>"
        ],
        "outs": [
          "Object {}"
        ]
      },
      "inputs": [
        {
          "node": "3d0eef34-60ae",
          "index": 1
        },
        {
          "node": "ea1b0552-d74e",
          "index": 2
        }
      ],
      "outputs": [
        [
          {
            "node": "567d4443-7ba7",
            "index": -1
          }
        ]
      ],
      "looping": false
    },
    "3d0eef34-60ae": {
      "hash": "3d0eef34-60ae",
      "position": {
        "x": 31,
        "y": 11
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
          "node": "657a09b4-b59d",
          "index": 1
        }
      ],
      "outputs": [
        [
          {
            "node": "598b049f-c6d2",
            "index": -1
          }
        ]
      ],
      "looping": false
    },
    "575d6ba1-1ffd": {
      "hash": "575d6ba1-1ffd",
      "position": {
        "x": 17,
        "y": 19
      },
      "type": 1,
      "process": {
        "name": "slider",
        "state": 0.84
      },
      "inputs": [],
      "outputs": [
        [
          {
            "node": "2587d4d7-a555",
            "index": -1
          }
        ]
      ],
      "looping": false
    },
    "1dfcbeeb-0f8f": {
      "hash": "1dfcbeeb-0f8f",
      "position": {
        "x": 17,
        "y": 20
      },
      "type": 1,
      "process": {
        "name": "slider",
        "state": 0.46
      },
      "inputs": [],
      "outputs": [
        [
          {
            "node": "2587d4d7-a555",
            "index": -2
          }
        ]
      ],
      "looping": false
    },
    "ca2df10e-ec6c": {
      "hash": "ca2df10e-ec6c",
      "position": {
        "x": 17,
        "y": 21
      },
      "type": 1,
      "process": {
        "name": "slider",
        "state": 201250
      },
      "inputs": [],
      "outputs": [
        [
          {
            "node": "2587d4d7-a555",
            "index": -3
          }
        ]
      ],
      "looping": false
    },
    "ef6409fc-5a1a": {
      "hash": "ef6409fc-5a1a",
      "position": {
        "x": 17,
        "y": 22
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
            "node": "2587d4d7-a555",
            "index": -4
          }
        ]
      ],
      "looping": false
    },
    "ca4657a4-cc34": {
      "hash": "ca4657a4-cc34",
      "position": {
        "x": 17,
        "y": 23
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
            "node": "2587d4d7-a555",
            "index": -5
          }
        ]
      ],
      "looping": false
    },
    "3d41cb3f-8f60": {
      "hash": "3d41cb3f-8f60",
      "position": {
        "x": 30,
        "y": 21
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
            "node": "8c111aa8-a244",
            "index": -2
          }
        ]
      ],
      "looping": false
    },
    "8c111aa8-a244": {
      "hash": "8c111aa8-a244",
      "position": {
        "x": 31,
        "y": 18
      },
      "type": 0,
      "process": {
        "name": "mul",
        "path": [
          "std",
          "Math",
          "Basic",
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
          "node": "6b51d652-a511",
          "index": 1
        },
        {
          "node": "3d41cb3f-8f60",
          "index": 1
        }
      ],
      "outputs": [
        [
          {
            "node": "657a09b4-b59d",
            "index": -3
          }
        ]
      ],
      "looping": true
    },
    "567d4443-7ba7": {
      "hash": "567d4443-7ba7",
      "position": {
        "x": 39,
        "y": 8
      },
      "type": 1,
      "process": {
        "name": "view"
      },
      "inputs": [
        {
          "node": "598b049f-c6d2",
          "index": 1
        },
        {
          "node": "3da838e0-3a0e",
          "index": 1
        }
      ],
      "outputs": [],
      "looping": false
    },
    "3da838e0-3a0e": {
      "hash": "3da838e0-3a0e",
      "position": {
        "x": 39,
        "y": 11
      },
      "type": 1,
      "process": {
        "name": "input",
        "state": ""
      },
      "inputs": [],
      "outputs": [
        [
          {
            "node": "567d4443-7ba7",
            "index": -2
          }
        ]
      ],
      "looping": false
    }
  }
};