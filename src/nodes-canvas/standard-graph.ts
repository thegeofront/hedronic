export const STANDARD_GRAPH = {
  "meta": {
    "name": "graph",
    "date": 1665765961220
  },
  "dependencies": {
    "std_gf": {
      "filename": "std_gf",
      "url": "./plugins/std/"
    },
    "startin_gf": {
      "filename": "startin_gf",
      "url": "./plugins/startin/"
    },
    "copc_gf": {
      "filename": "copc_gf",
      "url": "./plugins/copc/"
    },
    "rust-min_gf": {
      "filename": "rust_min_gf",
      "url": "./plugins/rust-min/"
    }
  },
  "graph": {
    "76ddb65a-c329": {
      "hash": "76ddb65a-c329",
      "position": {
        "x": 9,
        "y": 14
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
        "x": 4,
        "y": 14
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
        "x": 4,
        "y": 11
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
        "x": 15,
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
    "0b1667d0-fc1e": {
      "hash": "0b1667d0-fc1e",
      "position": {
        "x": 4,
        "y": 16
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
        "x": 9,
        "y": 9
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
        "x": 4,
        "y": 10
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
        "x": 4,
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
            "index": -1
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
          "node": "11c65996-071e",
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
    "2587d4d7-a555": {
      "hash": "2587d4d7-a555",
      "position": {
        "x": 9,
        "y": 18
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
        "x": 15,
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
          "node": "11c65996-071e",
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
        "x": 27,
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
    "3d0eef34-60ae": {
      "hash": "3d0eef34-60ae",
      "position": {
        "x": 27,
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
          "node": "657a09b4-b59d",
          "index": 1
        }
      ],
      "outputs": [
        [
          {
            "node": "fedb1d44-f4eb",
            "index": -1
          }
        ]
      ],
      "looping": false
    },
    "575d6ba1-1ffd": {
      "hash": "575d6ba1-1ffd",
      "position": {
        "x": 4,
        "y": 18
      },
      "type": 1,
      "process": {
        "name": "slider",
        "state": 0.61
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
        "x": 4,
        "y": 19
      },
      "type": 1,
      "process": {
        "name": "slider",
        "state": 0.47000000000000003
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
        "x": 4,
        "y": 20
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
        "x": 4,
        "y": 21
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
        "x": 4,
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
            "index": -5
          }
        ]
      ],
      "looping": false
    },
    "3d41cb3f-8f60": {
      "hash": "3d41cb3f-8f60",
      "position": {
        "x": 19,
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
        "x": 21,
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
    "3da838e0-3a0e": {
      "hash": "3da838e0-3a0e",
      "position": {
        "x": 40,
        "y": 19
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
            "node": "50a399fe-83bb",
            "index": -2
          }
        ]
      ],
      "looping": false
    },
    "6a8a9c8a-3e9a": {
      "hash": "6a8a9c8a-3e9a",
      "position": {
        "x": 35,
        "y": 16
      },
      "type": 0,
      "process": {
        "name": "new_from_vec",
        "path": [
          "startin_gf",
          "Triangulation",
          "new_from_vec"
        ],
        "inCount": 1,
        "outCount": 1,
        "ins": [
          "Ref->Float64Array"
        ],
        "outs": [
          "Ref->Triangulation"
        ]
      },
      "inputs": [
        {
          "node": "fedb1d44-f4eb",
          "index": 1
        }
      ],
      "outputs": [
        [
          {
            "node": "50a399fe-83bb",
            "index": -1
          }
        ]
      ],
      "looping": false
    },
    "fedb1d44-f4eb": {
      "hash": "fedb1d44-f4eb",
      "position": {
        "x": 35,
        "y": 14
      },
      "type": 1,
      "process": {
        "name": "get",
        "state": {
          "keys": [
            "data"
          ],
          "types": [
            5
          ]
        }
      },
      "inputs": [
        {
          "node": "3d0eef34-60ae",
          "index": 1
        }
      ],
      "outputs": [
        [
          {
            "node": "6a8a9c8a-3e9a",
            "index": -1
          }
        ]
      ],
      "looping": false
    },
    "50a399fe-83bb": {
      "hash": "50a399fe-83bb",
      "position": {
        "x": 40,
        "y": 16
      },
      "type": 1,
      "process": {
        "name": "view"
      },
      "inputs": [
        {
          "node": "6a8a9c8a-3e9a",
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
    "7e4fbcfb-a6db": {
      "hash": "7e4fbcfb-a6db",
      "position": {
        "x": 21,
        "y": 7
      },
      "type": 1,
      "process": {
        "name": "Load From Potree",
        "state": "http://ahn2.pointclouds.nl/potree_data/tile_all/cloud.js"
      },
      "inputs": [],
      "outputs": [
        [
          {
            "node": "1b80b0cf-790b",
            "index": -1
          }
        ]
      ],
      "looping": false
    },
    "26f11582-535c": {
      "hash": "26f11582-535c",
      "position": {
        "x": 27,
        "y": 10
      },
      "type": 0,
      "process": {
        "name": "MultiPoint from array",
        "path": [
          "std",
          "Multi",
          "Multi Point",
          "MultiPoint from array"
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
          "node": "1b80b0cf-790b",
          "index": 1
        }
      ],
      "outputs": [
        []
      ],
      "looping": false
    },
    "1b80b0cf-790b": {
      "hash": "1b80b0cf-790b",
      "position": {
        "x": 27,
        "y": 7
      },
      "type": 0,
      "process": {
        "name": "scale_array",
        "path": [
          "copc_gf",
          "DumbHelpers",
          "scale_array"
        ],
        "inCount": 2,
        "outCount": 1,
        "ins": [
          "Ref->Float64Array",
          "number"
        ],
        "outs": [
          "Ref->Float64Array"
        ]
      },
      "inputs": [
        {
          "node": "7e4fbcfb-a6db",
          "index": 1
        },
        {
          "node": "7ff0f556-80c1",
          "index": 1
        }
      ],
      "outputs": [
        [
          {
            "node": "26f11582-535c",
            "index": -1
          }
        ]
      ],
      "looping": false
    },
    "7ff0f556-80c1": {
      "hash": "7ff0f556-80c1",
      "position": {
        "x": 21,
        "y": 11
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
            "node": "1b80b0cf-790b",
            "index": -2
          }
        ]
      ],
      "looping": false
    }
  }
}