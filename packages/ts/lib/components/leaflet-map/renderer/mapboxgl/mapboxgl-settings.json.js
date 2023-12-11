var bearing = 0;
var name = "F5XC Map Light";
var owner = "F5, Inc.";
var glyphs = "https://api.maptiler.com/fonts/{fontstack}/{range}.pbf";
var sources = {
	openmaptiles: {
		url: "https://api.maptiler.com/tiles/v3/tiles.json",
		type: "vector"
	}
};
var layers = [
	{
		id: "park_outline",
		type: "line",
		source: "openmaptiles",
		"source-layer": "park",
		filter: [
			"all"
		],
		layout: {
		},
		paint: {
			"line-color": "rgb(255, 255, 255)",
			"line-dasharray": [
				1,
				1.5
			],
			"line-opacity": 1
		}
	},
	{
		id: "landuse_residential",
		type: "fill",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "landuse",
		maxzoom: 8,
		filter: [
			"all",
			[
				"in",
				"class",
				"residential",
				"suburbs",
				"neighbourhood"
			]
		],
		layout: {
			visibility: "visible"
		},
		paint: {
			"fill-color": {
				stops: [
					[
						9,
						"rgba(236, 236, 236, 0.8)"
					],
					[
						12,
						"rgba(236, 236, 236, 0.8)"
					]
				]
			}
		}
	},
	{
		id: "landcover_wood",
		type: "fill",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "landcover",
		filter: [
			"all",
			[
				"==",
				"class",
				"wood"
			]
		],
		paint: {
			"fill-antialias": false,
			"fill-color": "rgba(255, 255, 255, 0.7)",
			"fill-opacity": 0.4
		}
	},
	{
		id: "landcover_grass",
		type: "fill",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "landcover",
		filter: [
			"all",
			[
				"==",
				"class",
				"grass"
			]
		],
		paint: {
			"fill-antialias": false,
			"fill-color": "rgb(255, 255, 255)",
			"fill-opacity": 0.3
		}
	},
	{
		id: "landuse_cemetery",
		type: "fill",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "landuse",
		filter: [
			"==",
			"class",
			"cemetery"
		],
		layout: {
			visibility: "visible"
		},
		paint: {
			"fill-color": "rgb(221, 221, 221)"
		}
	},
	{
		id: "landuse_hospital",
		type: "fill",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "landuse",
		filter: [
			"==",
			"class",
			"hospital"
		],
		paint: {
			"fill-color": "rgb(249, 249, 249)"
		}
	},
	{
		id: "landuse_school",
		type: "fill",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "landuse",
		filter: [
			"==",
			"class",
			"school"
		],
		paint: {
			"fill-color": "rgb(236, 236, 236)"
		}
	},
	{
		id: "landuse_stadium",
		type: "fill",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "landuse",
		filter: [
			"all",
			[
				"in",
				"class",
				"stadium",
				"pitch",
				"track"
			]
		],
		paint: {
			"fill-color": "rgb(236, 236, 236)"
		}
	},
	{
		id: "waterway_tunnel",
		type: "line",
		source: "openmaptiles",
		"source-layer": "waterway",
		minzoom: 14,
		filter: [
			"all",
			[
				"==",
				"brunnel",
				"tunnel"
			]
		],
		layout: {
			"line-cap": "round"
		},
		paint: {
			"line-color": "rgb(236, 237, 238)",
			"line-dasharray": [
				2,
				4
			],
			"line-width": {
				base: 1.3,
				stops: [
					[
						13,
						0.5
					],
					[
						20,
						6
					]
				]
			}
		}
	},
	{
		id: "waterway_river",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "waterway",
		filter: [
			"all",
			[
				"==",
				"class",
				"river"
			],
			[
				"!=",
				"brunnel",
				"tunnel"
			],
			[
				"!=",
				"intermittent",
				1
			]
		],
		layout: {
			"line-cap": "round"
		},
		paint: {
			"line-color": "rgb(236, 237, 238)",
			"line-width": {
				base: 1.2,
				stops: [
					[
						11,
						0.5
					],
					[
						20,
						6
					]
				]
			}
		}
	},
	{
		id: "waterway_river_intermittent",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "waterway",
		filter: [
			"all",
			[
				"==",
				"class",
				"river"
			],
			[
				"!=",
				"brunnel",
				"tunnel"
			],
			[
				"==",
				"intermittent",
				1
			]
		],
		layout: {
			"line-cap": "round"
		},
		paint: {
			"line-color": "#a0c8f0",
			"line-dasharray": [
				3,
				2
			],
			"line-width": {
				base: 1.2,
				stops: [
					[
						11,
						0.5
					],
					[
						20,
						6
					]
				]
			}
		}
	},
	{
		id: "waterway_other",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "waterway",
		filter: [
			"all",
			[
				"!=",
				"class",
				"river"
			],
			[
				"!=",
				"brunnel",
				"tunnel"
			],
			[
				"!=",
				"intermittent",
				1
			]
		],
		layout: {
			"line-cap": "round"
		},
		paint: {
			"line-color": "rgb(236, 237, 238)",
			"line-width": {
				base: 1.3,
				stops: [
					[
						13,
						0.5
					],
					[
						20,
						6
					]
				]
			}
		}
	},
	{
		id: "waterway_other_intermittent",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "waterway",
		filter: [
			"all",
			[
				"!=",
				"class",
				"river"
			],
			[
				"!=",
				"brunnel",
				"tunnel"
			],
			[
				"==",
				"intermittent",
				1
			]
		],
		layout: {
			"line-cap": "round",
			visibility: "visible"
		},
		paint: {
			"line-color": "#a0c8f0",
			"line-dasharray": [
				4,
				3
			],
			"line-width": {
				base: 1.3,
				stops: [
					[
						13,
						0.5
					],
					[
						20,
						6
					]
				]
			}
		}
	},
	{
		id: "water_intermittent",
		type: "fill",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "water",
		filter: [
			"all",
			[
				"==",
				"intermittent",
				1
			]
		],
		layout: {
			visibility: "visible"
		},
		paint: {
			"fill-color": "rgba(172, 218, 251, 1)",
			"fill-opacity": 0.85
		}
	},
	{
		id: "landcover_sand",
		type: "fill",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "landcover",
		filter: [
			"all",
			[
				"in",
				"class",
				"sand"
			]
		],
		layout: {
			visibility: "visible"
		},
		paint: {
			"fill-antialias": false,
			"fill-color": "rgb(222, 222, 222)",
			"fill-opacity": 1
		}
	},
	{
		id: "landcover_sand_outline",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "landcover",
		filter: [
			"all",
			[
				"in",
				"class",
				"sand"
			]
		],
		layout: {
			visibility: "visible"
		},
		paint: {
			"line-color": "#f2e9ac",
			"line-width": 2
		}
	},
	{
		id: "aeroway_fill",
		type: "fill",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "aeroway",
		minzoom: 11,
		filter: [
			"==",
			"$type",
			"Polygon"
		],
		paint: {
			"fill-color": "rgb(241, 241, 241)",
			"fill-opacity": 0.7
		}
	},
	{
		id: "aeroway_runway",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "aeroway",
		minzoom: 11,
		filter: [
			"all",
			[
				"==",
				"$type",
				"LineString"
			],
			[
				"==",
				"class",
				"runway"
			]
		],
		paint: {
			"line-color": "rgb(255, 255, 255)",
			"line-width": {
				base: 1.2,
				stops: [
					[
						11,
						3
					],
					[
						20,
						16
					]
				]
			}
		}
	},
	{
		id: "aeroway_taxiway",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "aeroway",
		minzoom: 11,
		filter: [
			"all",
			[
				"==",
				"$type",
				"LineString"
			],
			[
				"==",
				"class",
				"taxiway"
			]
		],
		paint: {
			"line-color": "rgb(255, 255, 255)",
			"line-width": {
				base: 1.2,
				stops: [
					[
						11,
						0.5
					],
					[
						20,
						6
					]
				]
			}
		}
	},
	{
		id: "ferry",
		type: "line",
		source: "openmaptiles",
		"source-layer": "transportation",
		filter: [
			"all",
			[
				"in",
				"class",
				"ferry"
			]
		],
		layout: {
			"line-join": "round",
			visibility: "visible"
		},
		paint: {
			"line-color": "rgb(182, 182, 182)",
			"line-dasharray": [
				2,
				2
			],
			"line-width": 1.1
		}
	},
	{
		id: "tunnel_motorway_link_casing",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "transportation",
		filter: [
			"all",
			[
				"==",
				"class",
				"motorway"
			],
			[
				"==",
				"ramp",
				1
			],
			[
				"==",
				"brunnel",
				"tunnel"
			]
		],
		layout: {
			"line-join": "round",
			visibility: "visible"
		},
		paint: {
			"line-color": "rgb(233, 160, 182)",
			"line-dasharray": [
				0.5,
				0.25
			],
			"line-opacity": 1,
			"line-width": {
				base: 1.2,
				stops: [
					[
						12,
						1
					],
					[
						13,
						3
					],
					[
						14,
						4
					],
					[
						20,
						15
					]
				]
			}
		}
	},
	{
		id: "tunnel_service_track_casing",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "transportation",
		filter: [
			"all",
			[
				"==",
				"brunnel",
				"tunnel"
			],
			[
				"in",
				"class",
				"service",
				"track"
			]
		],
		layout: {
			"line-join": "round"
		},
		paint: {
			"line-color": "rgb(225, 225, 225)",
			"line-dasharray": [
				0.5,
				0.25
			],
			"line-width": {
				base: 1.2,
				stops: [
					[
						15,
						1
					],
					[
						16,
						4
					],
					[
						20,
						11
					]
				]
			}
		}
	},
	{
		id: "tunnel_link_casing",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "transportation",
		filter: [
			"all",
			[
				"==",
				"ramp",
				"1"
			],
			[
				"==",
				"brunnel",
				"tunnel"
			]
		],
		layout: {
			"line-join": "round"
		},
		paint: {
			"line-color": "rgb(233, 160, 182)",
			"line-opacity": 1,
			"line-width": {
				base: 1.2,
				stops: [
					[
						12,
						1
					],
					[
						13,
						3
					],
					[
						14,
						4
					],
					[
						20,
						15
					]
				]
			}
		}
	},
	{
		id: "tunnel_street_casing",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "transportation",
		filter: [
			"all",
			[
				"==",
				"brunnel",
				"tunnel"
			],
			[
				"in",
				"class",
				"street",
				"street_limited"
			]
		],
		layout: {
			"line-join": "round"
		},
		paint: {
			"line-color": "rgb(225, 225, 225)",
			"line-opacity": {
				stops: [
					[
						12,
						0
					],
					[
						12.5,
						1
					]
				]
			},
			"line-width": {
				base: 1.2,
				stops: [
					[
						12,
						0.5
					],
					[
						13,
						1
					],
					[
						14,
						4
					],
					[
						20,
						15
					]
				]
			}
		}
	},
	{
		id: "tunnel_secondary_tertiary_casing",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "transportation",
		filter: [
			"all",
			[
				"==",
				"brunnel",
				"tunnel"
			],
			[
				"in",
				"class",
				"secondary",
				"tertiary"
			]
		],
		layout: {
			"line-join": "round"
		},
		paint: {
			"line-color": "rgb(212, 212, 212)",
			"line-dasharray": [
				0.5,
				0.25
			],
			"line-opacity": 1,
			"line-width": {
				base: 1.2,
				stops: [
					[
						8,
						1.5
					],
					[
						20,
						17
					]
				]
			}
		}
	},
	{
		id: "tunnel_trunk_primary_casing",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "transportation",
		filter: [
			"all",
			[
				"==",
				"brunnel",
				"tunnel"
			],
			[
				"in",
				"class",
				"primary",
				"trunk"
			]
		],
		layout: {
			"line-join": "round"
		},
		paint: {
			"line-color": "rgb(233, 160, 182)",
			"line-dasharray": [
				0.5,
				0.25
			],
			"line-width": {
				base: 1.2,
				stops: [
					[
						5,
						0.4
					],
					[
						6,
						0.7
					],
					[
						7,
						1.75
					],
					[
						20,
						22
					]
				]
			}
		}
	},
	{
		id: "tunnel_motorway_casing",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "transportation",
		filter: [
			"all",
			[
				"==",
				"class",
				"motorway"
			],
			[
				"==",
				"brunnel",
				"tunnel"
			]
		],
		layout: {
			"line-join": "round",
			visibility: "visible"
		},
		paint: {
			"line-color": "rgb(233, 160, 182)",
			"line-dasharray": [
				0.5,
				0.25
			],
			"line-width": {
				base: 1.2,
				stops: [
					[
						5,
						0.4
					],
					[
						6,
						0.7
					],
					[
						7,
						1.75
					],
					[
						20,
						22
					]
				]
			}
		}
	},
	{
		id: "tunnel_path_pedestrian",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "transportation",
		filter: [
			"all",
			[
				"==",
				"$type",
				"LineString"
			],
			[
				"==",
				"brunnel",
				"tunnel"
			],
			[
				"in",
				"class",
				"path",
				"pedestrian"
			]
		],
		layout: {
			visibility: "visible"
		},
		paint: {
			"line-color": "rgba(216, 205, 206, 0.45)",
			"line-dasharray": [
				1,
				0.75
			],
			"line-width": {
				base: 1.2,
				stops: [
					[
						14,
						0.5
					],
					[
						20,
						6
					]
				]
			}
		}
	},
	{
		id: "tunnel_motorway_link",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "transportation",
		filter: [
			"all",
			[
				"==",
				"class",
				"motorway_link"
			],
			[
				"==",
				"ramp",
				1
			],
			[
				"==",
				"brunnel",
				"tunnel"
			]
		],
		layout: {
			"line-join": "round",
			visibility: "visible"
		},
		paint: {
			"line-color": "rgb(251, 181, 195)",
			"line-width": {
				base: 1.2,
				stops: [
					[
						12.5,
						0
					],
					[
						13,
						1.5
					],
					[
						14,
						2.5
					],
					[
						20,
						11.5
					]
				]
			}
		}
	},
	{
		id: "tunnel_service_track",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "transportation",
		filter: [
			"all",
			[
				"==",
				"brunnel",
				"tunnel"
			],
			[
				"in",
				"class",
				"service",
				"track"
			]
		],
		layout: {
			"line-join": "round"
		},
		paint: {
			"line-color": "rgb(255, 255, 255)",
			"line-width": {
				base: 1.2,
				stops: [
					[
						15.5,
						0
					],
					[
						16,
						2
					],
					[
						20,
						7.5
					]
				]
			}
		}
	},
	{
		id: "tunnel_link",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "transportation",
		filter: [
			"all",
			[
				"==",
				"ramp",
				"1"
			],
			[
				"==",
				"brunnel",
				"tunnel"
			]
		],
		layout: {
			"line-join": "round"
		},
		paint: {
			"line-color": "rgb(254, 240, 240)",
			"line-width": {
				base: 1.2,
				stops: [
					[
						12.5,
						0
					],
					[
						13,
						1.5
					],
					[
						14,
						2.5
					],
					[
						20,
						11.5
					]
				]
			}
		}
	},
	{
		id: "tunnel_minor",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "transportation",
		filter: [
			"all",
			[
				"==",
				"brunnel",
				"tunnel"
			],
			[
				"in",
				"class",
				"minor"
			]
		],
		layout: {
			"line-join": "round"
		},
		paint: {
			"line-color": "rgb(255, 255, 255)",
			"line-opacity": 1,
			"line-width": {
				base: 1.2,
				stops: [
					[
						13.5,
						0
					],
					[
						14,
						2.5
					],
					[
						20,
						11.5
					]
				]
			}
		}
	},
	{
		id: "tunnel_secondary_tertiary",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "transportation",
		filter: [
			"all",
			[
				"==",
				"brunnel",
				"tunnel"
			],
			[
				"in",
				"class",
				"secondary",
				"tertiary"
			]
		],
		layout: {
			"line-join": "round"
		},
		paint: {
			"line-color": "rgb(255, 255, 255)",
			"line-width": {
				base: 1.2,
				stops: [
					[
						6.5,
						0
					],
					[
						8,
						0.5
					],
					[
						20,
						13
					]
				]
			}
		}
	},
	{
		id: "tunnel_trunk_primary",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "transportation",
		filter: [
			"all",
			[
				"==",
				"brunnel",
				"tunnel"
			],
			[
				"in",
				"class",
				"primary",
				"trunk"
			]
		],
		layout: {
			"line-join": "round"
		},
		paint: {
			"line-color": "rgb(254, 240, 240)",
			"line-width": {
				base: 1.2,
				stops: [
					[
						5,
						0
					],
					[
						7,
						1
					],
					[
						20,
						18
					]
				]
			}
		}
	},
	{
		id: "tunnel_motorway",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "transportation",
		filter: [
			"all",
			[
				"==",
				"class",
				"motorway"
			],
			[
				"==",
				"brunnel",
				"tunnel"
			]
		],
		layout: {
			"line-join": "round",
			visibility: "visible"
		},
		paint: {
			"line-color": "rgb(253, 209, 217)",
			"line-width": {
				base: 1.2,
				stops: [
					[
						5,
						0
					],
					[
						7,
						1
					],
					[
						20,
						18
					]
				]
			}
		}
	},
	{
		id: "tunnel_major_rail",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "transportation",
		filter: [
			"all",
			[
				"==",
				"brunnel",
				"tunnel"
			],
			[
				"in",
				"class",
				"rail"
			]
		],
		paint: {
			"line-color": "rgb(208, 208, 208)",
			"line-width": {
				base: 1.4,
				stops: [
					[
						14,
						0.4
					],
					[
						15,
						0.75
					],
					[
						20,
						2
					]
				]
			}
		}
	},
	{
		id: "tunnel_major_rail_hatching",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "transportation",
		filter: [
			"all",
			[
				"==",
				"brunnel",
				"tunnel"
			],
			[
				"==",
				"class",
				"rail"
			]
		],
		paint: {
			"line-color": "rgb(208, 208, 208)",
			"line-dasharray": [
				0.2,
				8
			],
			"line-width": {
				base: 1.4,
				stops: [
					[
						14.5,
						0
					],
					[
						15,
						3
					],
					[
						20,
						8
					]
				]
			}
		}
	},
	{
		id: "road_area_pier",
		type: "fill",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "transportation",
		filter: [
			"all",
			[
				"==",
				"$type",
				"Polygon"
			],
			[
				"==",
				"class",
				"pier"
			]
		],
		layout: {
			visibility: "visible"
		},
		paint: {
			"fill-antialias": true,
			"fill-color": "rgb(252, 252, 252)"
		}
	},
	{
		id: "road_pier",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "transportation",
		filter: [
			"all",
			[
				"==",
				"$type",
				"LineString"
			],
			[
				"in",
				"class",
				"pier"
			]
		],
		layout: {
			"line-cap": "round",
			"line-join": "round"
		},
		paint: {
			"line-color": "rgba(246, 241, 229, 1)",
			"line-width": {
				base: 1.2,
				stops: [
					[
						15,
						1
					],
					[
						17,
						4
					]
				]
			}
		}
	},
	{
		id: "road_area_bridge",
		type: "fill",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "transportation",
		filter: [
			"all",
			[
				"==",
				"$type",
				"Polygon"
			],
			[
				"==",
				"brunnel",
				"bridge"
			]
		],
		layout: {
			visibility: "visible"
		},
		paint: {
			"fill-antialias": true,
			"fill-color": "rgba(255, 255, 255, 0.6)"
		}
	},
	{
		id: "road_area_pattern",
		type: "fill",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "transportation",
		filter: [
			"all",
			[
				"==",
				"$type",
				"Polygon"
			],
			[
				"!has",
				"brunnel"
			],
			[
				"!in",
				"class",
				"bridge",
				"pier"
			]
		],
		layout: {
			visibility: "visible"
		},
		paint: {
			"fill-color": "rgba(252, 252, 252, 1.0)"
		}
	},
	{
		id: "road_service_track_casing",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "transportation",
		filter: [
			"all",
			[
				"!in",
				"brunnel",
				"bridge",
				"tunnel"
			],
			[
				"in",
				"class",
				"service",
				"track"
			]
		],
		layout: {
			"line-cap": "round",
			"line-join": "round"
		},
		paint: {
			"line-color": "rgb(225, 225, 225)",
			"line-width": {
				base: 1.2,
				stops: [
					[
						15,
						1
					],
					[
						16,
						4
					],
					[
						20,
						11
					]
				]
			}
		}
	},
	{
		id: "road_link_casing",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "transportation",
		minzoom: 13,
		filter: [
			"all",
			[
				"!in",
				"brunnel",
				"bridge",
				"tunnel"
			],
			[
				"!in",
				"class",
				"motorway",
				"trunk",
				"primary",
				"pedestrian",
				"path",
				"track",
				"service"
			],
			[
				"==",
				"ramp",
				1
			]
		],
		layout: {
			"line-cap": "round",
			"line-join": "round",
			visibility: "visible"
		},
		paint: {
			"line-color": "rgb(233, 160, 182)",
			"line-opacity": 1,
			"line-width": {
				base: 1.2,
				stops: [
					[
						12,
						1
					],
					[
						13,
						3
					],
					[
						14,
						4
					],
					[
						20,
						15
					]
				]
			}
		}
	},
	{
		id: "road_trunk_primary_link_casing",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "transportation",
		filter: [
			"all",
			[
				"!in",
				"brunnel",
				"bridge",
				"tunnel"
			],
			[
				"==",
				"ramp",
				1
			],
			[
				"in",
				"class",
				"primary",
				"trunk"
			]
		],
		layout: {
			"line-cap": "butt",
			"line-join": "round",
			visibility: "visible"
		},
		paint: {
			"line-color": "rgba(246, 241, 232, 1)",
			"line-width": {
				base: 1.2,
				stops: [
					[
						5,
						0
					],
					[
						7,
						0.7
					],
					[
						20,
						14
					]
				]
			}
		}
	},
	{
		id: "road_motorway_link_casing",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "transportation",
		minzoom: 12,
		filter: [
			"all",
			[
				"!in",
				"brunnel",
				"bridge",
				"tunnel"
			],
			[
				"==",
				"class",
				"motorway"
			],
			[
				"==",
				"ramp",
				1
			]
		],
		layout: {
			"line-cap": "butt",
			"line-join": "round"
		},
		paint: {
			"line-color": "rgba(246, 241, 232, 1)",
			"line-opacity": 1,
			"line-width": {
				base: 1.2,
				stops: [
					[
						12,
						1
					],
					[
						13,
						3
					],
					[
						14,
						4
					],
					[
						20,
						15
					]
				]
			}
		}
	},
	{
		id: "road_minor_casing",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "transportation",
		filter: [
			"all",
			[
				"==",
				"$type",
				"LineString"
			],
			[
				"!in",
				"brunnel",
				"bridge",
				"tunnel"
			],
			[
				"in",
				"class",
				"minor"
			],
			[
				"!=",
				"ramp",
				"1"
			]
		],
		layout: {
			"line-cap": "round",
			"line-join": "round"
		},
		paint: {
			"line-color": "rgb(225, 225, 225)",
			"line-opacity": {
				stops: [
					[
						12,
						0
					],
					[
						12.5,
						1
					]
				]
			},
			"line-width": {
				base: 1.2,
				stops: [
					[
						12,
						0.5
					],
					[
						13,
						1
					],
					[
						14,
						4
					],
					[
						20,
						20
					]
				]
			}
		}
	},
	{
		id: "road_secondary_tertiary_casing",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "transportation",
		filter: [
			"all",
			[
				"!in",
				"brunnel",
				"bridge",
				"tunnel"
			],
			[
				"in",
				"class",
				"secondary",
				"tertiary"
			],
			[
				"!=",
				"ramp",
				1
			]
		],
		layout: {
			"line-cap": "round",
			"line-join": "round",
			visibility: "none"
		},
		paint: {
			"line-color": "rgb(212, 212, 212)",
			"line-opacity": 1,
			"line-width": {
				base: 1.2,
				stops: [
					[
						8,
						1.5
					],
					[
						20,
						17
					]
				]
			}
		}
	},
	{
		id: "road_trunk_primary_casing",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "transportation",
		filter: [
			"all",
			[
				"!in",
				"brunnel",
				"bridge",
				"tunnel"
			],
			[
				"!=",
				"ramp",
				1
			],
			[
				"in",
				"class",
				"primary",
				"trunk"
			],
			[
				"!=",
				"ramp",
				1
			]
		],
		layout: {
			"line-cap": "butt",
			"line-join": "round",
			visibility: "none"
		},
		paint: {
			"line-color": "rgba(246, 241, 232, 1)",
			"line-opacity": 1,
			"line-width": {
				base: 1.2,
				stops: [
					[
						5,
						0.4
					],
					[
						6,
						0.7
					],
					[
						7,
						1.75
					],
					[
						20,
						22
					]
				]
			}
		}
	},
	{
		id: "road_motorway_casing",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "transportation",
		minzoom: 5,
		filter: [
			"all",
			[
				"!in",
				"brunnel",
				"bridge",
				"tunnel"
			],
			[
				"==",
				"class",
				"motorway"
			],
			[
				"!=",
				"ramp",
				1
			]
		],
		layout: {
			"line-cap": "butt",
			"line-join": "round",
			visibility: "visible"
		},
		paint: {
			"line-color": "rgba(163, 213, 217, .)",
			"line-width": {
				base: 1.2,
				stops: [
					[
						5,
						0.4
					],
					[
						6,
						0.7
					],
					[
						7,
						1.75
					],
					[
						20,
						22
					]
				]
			}
		}
	},
	{
		id: "road_path_pedestrian",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "transportation",
		minzoom: 14,
		filter: [
			"all",
			[
				"==",
				"$type",
				"LineString"
			],
			[
				"!in",
				"brunnel",
				"bridge",
				"tunnel"
			],
			[
				"in",
				"class",
				"path",
				"pedestrian"
			]
		],
		layout: {
			"line-join": "round",
			visibility: "visible"
		},
		paint: {
			"line-color": "rgba(216, 205, 206, 0.45)",
			"line-dasharray": [
				1,
				1
			],
			"line-width": {
				base: 1.2,
				stops: [
					[
						14,
						1
					],
					[
						20,
						6
					]
				]
			}
		}
	},
	{
		id: "road_link",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "transportation",
		minzoom: 13,
		filter: [
			"all",
			[
				"!in",
				"brunnel",
				"bridge",
				"tunnel"
			],
			[
				"==",
				"ramp",
				1
			],
			[
				"!in",
				"class",
				"motorway",
				"trunk",
				"primary",
				"pedestrian",
				"path",
				"track",
				"service"
			]
		],
		layout: {
			"line-cap": "round",
			"line-join": "round",
			visibility: "visible"
		},
		paint: {
			"line-color": "rgba(246, 241, 232, 1)",
			"line-width": {
				base: 1.2,
				stops: [
					[
						12.5,
						0
					],
					[
						13,
						1.5
					],
					[
						14,
						2.5
					],
					[
						20,
						11.5
					]
				]
			}
		}
	},
	{
		id: "road_trunk_primary_link",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "transportation",
		filter: [
			"all",
			[
				"!in",
				"brunnel",
				"bridge",
				"tunnel"
			],
			[
				"==",
				"ramp",
				1
			],
			[
				"in",
				"class",
				"primary",
				"trunk"
			]
		],
		layout: {
			"line-cap": "round",
			"line-join": "round",
			visibility: "visible"
		},
		paint: {
			"line-color": "rgba(246, 241, 232, 1)",
			"line-width": {
				base: 1.2,
				stops: [
					[
						5,
						0
					],
					[
						7,
						0.5
					],
					[
						20,
						10
					]
				]
			}
		}
	},
	{
		id: "road_motorway_link",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "transportation",
		minzoom: 12,
		filter: [
			"all",
			[
				"!in",
				"brunnel",
				"bridge",
				"tunnel"
			],
			[
				"==",
				"class",
				"motorway"
			],
			[
				"==",
				"ramp",
				1
			]
		],
		layout: {
			"line-cap": "round",
			"line-join": "round"
		},
		paint: {
			"line-color": "rgba(246, 241, 232, 1)",
			"line-width": {
				base: 1.2,
				stops: [
					[
						12.5,
						0
					],
					[
						13,
						1.5
					],
					[
						14,
						2.5
					],
					[
						20,
						11.5
					]
				]
			}
		}
	},
	{
		id: "road_service_track",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "transportation",
		filter: [
			"all",
			[
				"!in",
				"brunnel",
				"bridge",
				"tunnel"
			],
			[
				"in",
				"class",
				"service",
				"track"
			]
		],
		layout: {
			"line-cap": "round",
			"line-join": "round",
			visibility: "visible"
		},
		paint: {
			"line-color": "rgb(255, 255, 255)",
			"line-width": {
				base: 1.2,
				stops: [
					[
						15.5,
						0
					],
					[
						16,
						2
					],
					[
						20,
						7.5
					]
				]
			}
		}
	},
	{
		id: "road_minor",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "transportation",
		filter: [
			"all",
			[
				"==",
				"$type",
				"LineString"
			],
			[
				"all",
				[
					"!in",
					"brunnel",
					"bridge",
					"tunnel"
				],
				[
					"in",
					"class",
					"minor"
				]
			]
		],
		layout: {
			"line-cap": "round",
			"line-join": "round",
			visibility: "none"
		},
		paint: {
			"line-color": "rgb(255, 255, 255)",
			"line-opacity": 1,
			"line-width": {
				base: 1.2,
				stops: [
					[
						13.5,
						0
					],
					[
						14,
						2.5
					],
					[
						20,
						18
					]
				]
			}
		}
	},
	{
		id: "road_secondary_tertiary",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "transportation",
		filter: [
			"all",
			[
				"!in",
				"brunnel",
				"bridge",
				"tunnel"
			],
			[
				"in",
				"class",
				"secondary",
				"tertiary"
			]
		],
		layout: {
			"line-cap": "round",
			"line-join": "round",
			visibility: "none"
		},
		paint: {
			"line-color": "rgb(255, 255, 255)",
			"line-width": {
				base: 1.2,
				stops: [
					[
						6.5,
						0
					],
					[
						8,
						0.5
					],
					[
						20,
						13
					]
				]
			}
		}
	},
	{
		id: "road_trunk_primary",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "transportation",
		filter: [
			"all",
			[
				"!in",
				"brunnel",
				"bridge",
				"tunnel"
			],
			[
				"!=",
				"ramp",
				1
			],
			[
				"in",
				"class",
				"primary",
				"trunk"
			]
		],
		layout: {
			"line-cap": "round",
			"line-join": "round",
			visibility: "visible"
		},
		paint: {
			"line-color": "rgba(246, 241, 232, 1)",
			"line-width": {
				base: 1.2,
				stops: [
					[
						5,
						0
					],
					[
						7,
						1
					],
					[
						20,
						18
					]
				]
			}
		}
	},
	{
		id: "road_motorway",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "transportation",
		minzoom: 5,
		filter: [
			"all",
			[
				"!in",
				"brunnel",
				"bridge",
				"tunnel"
			],
			[
				"==",
				"class",
				"motorway"
			],
			[
				"!=",
				"ramp",
				1
			]
		],
		layout: {
			"line-cap": "round",
			"line-join": "round",
			visibility: "visible"
		},
		paint: {
			"line-color": {
				stops: [
					[
						5,
						"rgba(246, 241, 232, 1)"
					],
					[
						6,
						"rgba(246, 241, 232, 1)"
					]
				]
			},
			"line-width": {
				base: 1.2,
				stops: [
					[
						5,
						0
					],
					[
						7,
						1
					],
					[
						20,
						18
					]
				]
			}
		}
	},
	{
		id: "road_major_rail",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "transportation",
		filter: [
			"all",
			[
				"!in",
				"brunnel",
				"bridge",
				"tunnel"
			],
			[
				"==",
				"class",
				"rail"
			]
		],
		paint: {
			"line-color": "rgb(208, 208, 208)",
			"line-width": {
				base: 1.4,
				stops: [
					[
						14,
						0.4
					],
					[
						15,
						0.75
					],
					[
						20,
						2
					]
				]
			}
		}
	},
	{
		id: "road_major_rail_hatching",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "transportation",
		filter: [
			"all",
			[
				"!in",
				"brunnel",
				"bridge",
				"tunnel"
			],
			[
				"==",
				"class",
				"rail"
			]
		],
		paint: {
			"line-color": "rgb(208, 208, 208)",
			"line-dasharray": [
				0.2,
				8
			],
			"line-width": {
				base: 1.4,
				stops: [
					[
						14.5,
						0
					],
					[
						15,
						3
					],
					[
						20,
						8
					]
				]
			}
		}
	},
	{
		id: "building",
		type: "fill",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "building",
		minzoom: 13,
		maxzoom: 14,
		layout: {
			visibility: "visible"
		},
		paint: {
			"fill-color": "rgba(181, 181, 181, 0.3)",
			"fill-outline-color": {
				stops: [
					[
						13,
						"rgba(198, 197, 197, 0.32)"
					],
					[
						14,
						"rgb(198, 197, 197)"
					]
				]
			}
		}
	},
	{
		id: "building-3d",
		type: "fill-extrusion",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "building",
		minzoom: 14,
		filter: [
			"all",
			[
				"!has",
				"hide_3d"
			]
		],
		layout: {
			visibility: "visible"
		},
		paint: {
			"fill-extrusion-base": {
				property: "render_min_height",
				type: "identity"
			},
			"fill-extrusion-color": "rgb(181, 181, 181)",
			"fill-extrusion-height": {
				property: "render_height",
				type: "identity"
			},
			"fill-extrusion-opacity": 0.3
		}
	},
	{
		id: "waterway-bridge-case",
		type: "line",
		source: "openmaptiles",
		"source-layer": "waterway",
		filter: [
			"all",
			[
				"==",
				"$type",
				"LineString"
			],
			[
				"==",
				"brunnel",
				"bridge"
			]
		],
		layout: {
			"line-cap": "butt",
			"line-join": "miter"
		},
		paint: {
			"line-color": "rgb(224, 224, 224)",
			"line-gap-width": {
				base: 1.3,
				stops: [
					[
						13,
						0.5
					],
					[
						20,
						6
					]
				]
			},
			"line-width": {
				base: 1.6,
				stops: [
					[
						12,
						0.5
					],
					[
						20,
						5
					]
				]
			}
		}
	},
	{
		id: "waterway-bridge",
		type: "line",
		source: "openmaptiles",
		"source-layer": "waterway",
		filter: [
			"all",
			[
				"==",
				"$type",
				"LineString"
			],
			[
				"==",
				"brunnel",
				"bridge"
			]
		],
		layout: {
			"line-cap": "round",
			"line-join": "round"
		},
		paint: {
			"line-color": "rgb(223, 229, 235)",
			"line-width": {
				base: 1.3,
				stops: [
					[
						13,
						0.5
					],
					[
						20,
						6
					]
				]
			}
		}
	},
	{
		id: "bridge_motorway_link_casing",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "transportation",
		filter: [
			"all",
			[
				"==",
				"class",
				"motorway"
			],
			[
				"==",
				"ramp",
				1
			],
			[
				"==",
				"brunnel",
				"bridge"
			]
		],
		layout: {
			"line-join": "round"
		},
		paint: {
			"line-color": "rgba(223, 219, 202, 1)",
			"line-opacity": 1,
			"line-width": {
				base: 1.2,
				stops: [
					[
						12,
						1
					],
					[
						13,
						3
					],
					[
						14,
						4
					],
					[
						20,
						15
					]
				]
			}
		}
	},
	{
		id: "bridge_service_track_casing",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "transportation",
		filter: [
			"all",
			[
				"==",
				"brunnel",
				"bridge"
			],
			[
				"in",
				"class",
				"service",
				"track"
			]
		],
		layout: {
			"line-join": "round"
		},
		paint: {
			"line-color": "rgb(225, 225, 225)",
			"line-width": {
				base: 1.2,
				stops: [
					[
						15,
						1
					],
					[
						16,
						4
					],
					[
						20,
						11
					]
				]
			}
		}
	},
	{
		id: "bridge_link_casing",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "transportation",
		filter: [
			"all",
			[
				"==",
				"class",
				"link"
			],
			[
				"==",
				"brunnel",
				"bridge"
			]
		],
		layout: {
			"line-join": "round"
		},
		paint: {
			"line-color": "rgba(223, 219, 202, 1)",
			"line-opacity": 1,
			"line-width": {
				base: 1.2,
				stops: [
					[
						12,
						1
					],
					[
						13,
						3
					],
					[
						14,
						4
					],
					[
						20,
						15
					]
				]
			}
		}
	},
	{
		id: "bridge_street_casing",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "transportation",
		filter: [
			"all",
			[
				"==",
				"brunnel",
				"bridge"
			],
			[
				"in",
				"class",
				"street",
				"street_limited"
			]
		],
		layout: {
			"line-join": "round"
		},
		paint: {
			"line-color": "rgb(209, 209, 209)",
			"line-opacity": {
				stops: [
					[
						12,
						0
					],
					[
						12.5,
						1
					]
				]
			},
			"line-width": {
				base: 1.2,
				stops: [
					[
						12,
						0.5
					],
					[
						13,
						1
					],
					[
						14,
						4
					],
					[
						20,
						25
					]
				]
			}
		}
	},
	{
		id: "bridge_path_pedestrian_casing",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "transportation",
		filter: [
			"all",
			[
				"==",
				"$type",
				"LineString"
			],
			[
				"==",
				"brunnel",
				"bridge"
			],
			[
				"in",
				"class",
				"path",
				"pedestrian"
			]
		],
		layout: {
			"line-join": "miter",
			visibility: "visible"
		},
		paint: {
			"line-color": "rgb(225, 225, 225)",
			"line-dasharray": [
				1,
				0
			],
			"line-width": {
				base: 1.2,
				stops: [
					[
						14,
						1.5
					],
					[
						20,
						18
					]
				]
			}
		}
	},
	{
		id: "bridge_secondary_tertiary_casing",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "transportation",
		filter: [
			"all",
			[
				"==",
				"brunnel",
				"bridge"
			],
			[
				"in",
				"class",
				"secondary",
				"tertiary"
			]
		],
		layout: {
			"line-join": "round"
		},
		paint: {
			"line-color": "rgb(212, 212, 212)",
			"line-opacity": 1,
			"line-width": {
				base: 1.2,
				stops: [
					[
						8,
						1.5
					],
					[
						20,
						17
					]
				]
			}
		}
	},
	{
		id: "bridge_trunk_primary_casing",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "transportation",
		filter: [
			"all",
			[
				"==",
				"brunnel",
				"bridge"
			],
			[
				"in",
				"class",
				"primary",
				"trunk"
			]
		],
		layout: {
			"line-join": "round"
		},
		paint: {
			"line-color": "rgba(223, 219, 202, 1)",
			"line-width": {
				base: 1.2,
				stops: [
					[
						5,
						0.4
					],
					[
						6,
						0.7
					],
					[
						7,
						1.75
					],
					[
						20,
						22
					]
				]
			}
		}
	},
	{
		id: "bridge_motorway_casing",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "transportation",
		filter: [
			"all",
			[
				"==",
				"class",
				"motorway"
			],
			[
				"==",
				"brunnel",
				"bridge"
			],
			[
				"!=",
				"ramp",
				1
			]
		],
		layout: {
			"line-join": "round"
		},
		paint: {
			"line-color": "rgba(223, 219, 202, 1)",
			"line-width": {
				base: 1.2,
				stops: [
					[
						5,
						0.4
					],
					[
						6,
						0.7
					],
					[
						7,
						1.75
					],
					[
						20,
						22
					]
				]
			}
		}
	},
	{
		id: "bridge_path_pedestrian",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "transportation",
		filter: [
			"all",
			[
				"==",
				"$type",
				"LineString"
			],
			[
				"==",
				"brunnel",
				"bridge"
			],
			[
				"in",
				"class",
				"path",
				"pedestrian"
			]
		],
		paint: {
			"line-color": "rgb(255, 255, 255)",
			"line-dasharray": [
				1,
				0.3
			],
			"line-width": {
				base: 1.2,
				stops: [
					[
						14,
						0.5
					],
					[
						20,
						10
					]
				]
			}
		}
	},
	{
		id: "bridge_motorway_link",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "transportation",
		filter: [
			"all",
			[
				"==",
				"class",
				"motorway"
			],
			[
				"==",
				"ramp",
				1
			],
			[
				"==",
				"brunnel",
				"bridge"
			]
		],
		layout: {
			"line-join": "round"
		},
		paint: {
			"line-color": "rgba(223, 219, 202, 1)",
			"line-width": {
				base: 1.2,
				stops: [
					[
						12.5,
						0
					],
					[
						13,
						1.5
					],
					[
						14,
						2.5
					],
					[
						20,
						11.5
					]
				]
			}
		}
	},
	{
		id: "bridge_service_track",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "transportation",
		filter: [
			"all",
			[
				"==",
				"brunnel",
				"bridge"
			],
			[
				"in",
				"class",
				"service",
				"track"
			]
		],
		layout: {
			"line-join": "round"
		},
		paint: {
			"line-color": "rgb(255, 255, 255)",
			"line-width": {
				base: 1.2,
				stops: [
					[
						15.5,
						0
					],
					[
						16,
						2
					],
					[
						20,
						7.5
					]
				]
			}
		}
	},
	{
		id: "bridge_link",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "transportation",
		filter: [
			"all",
			[
				"==",
				"class",
				"link"
			],
			[
				"==",
				"brunnel",
				"bridge"
			]
		],
		layout: {
			"line-join": "round"
		},
		paint: {
			"line-color": "rgba(223, 219, 202, 1)",
			"line-width": {
				base: 1.2,
				stops: [
					[
						12.5,
						0
					],
					[
						13,
						1.5
					],
					[
						14,
						2.5
					],
					[
						20,
						11.5
					]
				]
			}
		}
	},
	{
		id: "bridge_street",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "transportation",
		filter: [
			"all",
			[
				"==",
				"brunnel",
				"bridge"
			],
			[
				"in",
				"class",
				"minor"
			]
		],
		layout: {
			"line-join": "round"
		},
		paint: {
			"line-color": "rgb(255, 255, 255)",
			"line-opacity": 1,
			"line-width": {
				base: 1.2,
				stops: [
					[
						13.5,
						0
					],
					[
						14,
						2.5
					],
					[
						20,
						18
					]
				]
			}
		}
	},
	{
		id: "bridge_secondary_tertiary",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "transportation",
		filter: [
			"all",
			[
				"==",
				"brunnel",
				"bridge"
			],
			[
				"in",
				"class",
				"secondary",
				"tertiary"
			]
		],
		layout: {
			"line-join": "round"
		},
		paint: {
			"line-color": "rgb(255, 255, 255)",
			"line-width": {
				base: 1.2,
				stops: [
					[
						6.5,
						0
					],
					[
						8,
						0.5
					],
					[
						20,
						13
					]
				]
			}
		}
	},
	{
		id: "bridge_trunk_primary",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "transportation",
		filter: [
			"all",
			[
				"==",
				"brunnel",
				"bridge"
			],
			[
				"in",
				"class",
				"primary",
				"trunk"
			]
		],
		layout: {
			"line-join": "round"
		},
		paint: {
			"line-color": "rgba(223, 219, 202, 1)",
			"line-width": {
				base: 1.2,
				stops: [
					[
						5,
						0
					],
					[
						7,
						1
					],
					[
						20,
						18
					]
				]
			}
		}
	},
	{
		id: "bridge_motorway",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "transportation",
		filter: [
			"all",
			[
				"==",
				"class",
				"motorway"
			],
			[
				"==",
				"brunnel",
				"bridge"
			],
			[
				"!=",
				"ramp",
				1
			]
		],
		layout: {
			"line-join": "round"
		},
		paint: {
			"line-color": "rgba(223, 219, 202, 1)",
			"line-width": {
				base: 1.2,
				stops: [
					[
						5,
						0
					],
					[
						7,
						1
					],
					[
						20,
						18
					]
				]
			}
		}
	},
	{
		id: "bridge_major_rail",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "transportation",
		filter: [
			"all",
			[
				"==",
				"class",
				"rail"
			],
			[
				"==",
				"brunnel",
				"bridge"
			]
		],
		paint: {
			"line-color": "rgb(208, 208, 208)",
			"line-width": {
				base: 1.4,
				stops: [
					[
						14,
						0.4
					],
					[
						15,
						0.75
					],
					[
						20,
						2
					]
				]
			}
		}
	},
	{
		id: "bridge_major_rail_hatching",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "transportation",
		filter: [
			"all",
			[
				"==",
				"class",
				"rail"
			],
			[
				"==",
				"brunnel",
				"bridge"
			]
		],
		paint: {
			"line-color": "rgb(208, 208, 208)",
			"line-dasharray": [
				0.2,
				8
			],
			"line-width": {
				base: 1.4,
				stops: [
					[
						14.5,
						0
					],
					[
						15,
						3
					],
					[
						20,
						8
					]
				]
			}
		}
	},
	{
		id: "cablecar",
		type: "line",
		source: "openmaptiles",
		"source-layer": "transportation",
		minzoom: 13,
		filter: [
			"==",
			"class",
			"cable_car"
		],
		layout: {
			"line-cap": "round",
			visibility: "visible"
		},
		paint: {
			"line-color": "rgb(199, 199, 199)",
			"line-width": {
				base: 1,
				stops: [
					[
						11,
						1
					],
					[
						19,
						2.5
					]
				]
			}
		}
	},
	{
		id: "cablecar-dash",
		type: "line",
		source: "openmaptiles",
		"source-layer": "transportation",
		minzoom: 13,
		filter: [
			"==",
			"class",
			"cable_car"
		],
		layout: {
			"line-cap": "round",
			visibility: "visible"
		},
		paint: {
			"line-color": "rgb(199, 199, 199)",
			"line-dasharray": [
				2,
				3
			],
			"line-width": {
				base: 1,
				stops: [
					[
						11,
						3
					],
					[
						19,
						5.5
					]
				]
			}
		}
	},
	{
		id: "boundary_3",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "boundary",
		filter: [
			"match",
			[
				"get",
				"admin_level"
			],
			[
				3,
				4
			],
			true,
			false
		],
		layout: {
			"line-join": "round",
			visibility: "visible"
		},
		paint: {
			"line-color": "rgb(197, 208, 216)",
			"line-dasharray": [
				1,
				1
			],
			"line-width": {
				base: 1,
				stops: [
					[
						4,
						0.4
					],
					[
						5,
						1
					],
					[
						12,
						1.8
					]
				]
			},
			"line-opacity": 0.5
		}
	},
	{
		id: "boundary_2",
		type: "line",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "boundary",
		filter: [
			"all",
			[
				"==",
				"admin_level",
				2
			],
			[
				"!=",
				"disputed",
				1
			]
		],
		layout: {
			"line-cap": "round",
			"line-join": "round",
			visibility: "visible"
		},
		paint: {
			"line-color": "rgb(197, 208, 216)",
			"line-opacity": {
				base: 1,
				stops: [
					[
						0,
						0.4
					],
					[
						4,
						0.8
					]
				]
			},
			"line-width": {
				base: 1,
				stops: [
					[
						3,
						1
					],
					[
						5,
						1.2
					],
					[
						12,
						3
					]
				]
			}
		}
	},
	{
		id: "boundary_disputed_level_2",
		type: "line",
		source: "openmaptiles",
		"source-layer": "boundary",
		minzoom: 0,
		filter: [
			"all",
			[
				"<=",
				"admin_level",
				2
			],
			[
				"==",
				"disputed",
				1
			]
		],
		layout: {
			"line-cap": "round",
			"line-join": "round",
			visibility: "visible"
		},
		paint: {
			"line-color": "rgb(197, 208, 216)",
			"line-width": 1,
			"line-opacity": 0.7,
			"line-dasharray": [
				6,
				6
			]
		}
	},
	{
		id: "water_name_line",
		type: "symbol",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "water_name",
		minzoom: 0,
		filter: [
			"all",
			[
				"==",
				"$type",
				"LineString"
			]
		],
		layout: {
			"symbol-placement": "line",
			"text-field": "{name_en}",
			"text-font": [
				"Open Sans Regular"
			],
			"text-max-width": 5,
			"text-size": 12
		},
		paint: {
			"text-color": "rgb(178, 178, 178)",
			"text-halo-color": "rgba(255, 255, 255, 0.7)",
			"text-halo-width": 1
		}
	},
	{
		id: "water_name_point",
		type: "symbol",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "water_name",
		minzoom: 2,
		maxzoom: 24,
		filter: [
			"all",
			[
				"==",
				"$type",
				"Point"
			],
			[
				"!=",
				"class",
				"ocean"
			]
		],
		layout: {
			"text-field": "{name_en}",
			"text-font": [
				"Open Sans Regular"
			],
			"text-max-width": 5,
			"text-size": 12
		},
		paint: {
			"text-color": "rgba(159, 178, 195, 0.8)",
			"text-halo-color": "rgba(255, 255, 255, 0)",
			"text-halo-width": 1
		}
	},
	{
		id: "water_ocean_name_point",
		type: "symbol",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "water_name",
		minzoom: 0,
		filter: [
			"all",
			[
				"==",
				"$type",
				"Point"
			],
			[
				"==",
				"class",
				"ocean"
			]
		],
		layout: {
			"text-field": "{name_en}",
			"text-font": [
				"Open Sans Regular"
			],
			"text-max-width": 5,
			"text-size": 12
		},
		paint: {
			"text-color": "rgba(159, 178, 195, 0.6)",
			"text-halo-color": "rgba(255, 255, 255, 0)",
			"text-halo-width": 1
		}
	},
	{
		id: "poi_z16_subclass",
		type: "symbol",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "poi",
		minzoom: 16,
		filter: [
			"all",
			[
				"==",
				"$type",
				"Point"
			],
			[
				">=",
				"rank",
				20
			],
			[
				"any",
				[
					"all",
					[
						"in",
						"class",
						"pitch"
					],
					[
						"in",
						"subclass",
						"soccer",
						"tennis",
						"baseball",
						"basketball",
						"swimming",
						"golf"
					]
				]
			],
			[
				"any",
				[
					"!has",
					"level"
				],
				[
					"==",
					"level",
					0
				]
			]
		],
		layout: {
			"text-anchor": "top",
			"text-field": "{name_en}",
			"text-font": [
				"Open Sans Italic"
			],
			"text-max-width": 9,
			"text-offset": [
				0,
				0.6
			],
			"text-padding": 2,
			"text-size": 12,
			visibility: "none"
		},
		paint: {
			"text-color": "#666",
			"text-halo-blur": 0.5,
			"text-halo-color": "#ffffff",
			"text-halo-width": 1
		}
	},
	{
		id: "poi_z16",
		type: "symbol",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "poi",
		minzoom: 16,
		filter: [
			"all",
			[
				"==",
				"$type",
				"Point"
			],
			[
				">=",
				"rank",
				20
			],
			[
				"none",
				[
					"all",
					[
						"in",
						"class",
						"pitch"
					],
					[
						"in",
						"subclass",
						"soccer",
						"tennis",
						"baseball",
						"basketball",
						"swimming",
						"golf"
					]
				]
			],
			[
				"any",
				[
					"!has",
					"level"
				],
				[
					"==",
					"level",
					0
				]
			]
		],
		layout: {
			"text-anchor": "top",
			"text-field": "{name_en}",
			"text-font": [
				"Open Sans Italic"
			],
			"text-max-width": 9,
			"text-offset": [
				0,
				0.6
			],
			"text-padding": 2,
			"text-size": 12,
			visibility: "none"
		},
		paint: {
			"text-color": "rgb(216, 220, 223)",
			"text-halo-blur": 0.5,
			"text-halo-color": "rgb(255, 255, 255)",
			"text-halo-width": 1
		}
	},
	{
		id: "poi_z15",
		type: "symbol",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "poi",
		minzoom: 15,
		filter: [
			"all",
			[
				"==",
				"$type",
				"Point"
			],
			[
				">=",
				"rank",
				7
			],
			[
				"<",
				"rank",
				20
			],
			[
				"any",
				[
					"!has",
					"level"
				],
				[
					"==",
					"level",
					0
				]
			]
		],
		layout: {
			"text-anchor": "top",
			"text-field": "{name_en}",
			"text-font": [
				"Open Sans Italic"
			],
			"text-max-width": 9,
			"text-offset": [
				0,
				0.6
			],
			"text-padding": 2,
			"text-size": 12,
			visibility: "none"
		},
		paint: {
			"text-color": "rgb(216, 220, 223)",
			"text-halo-blur": 0.5,
			"text-halo-color": "rgb(255, 255, 255)",
			"text-halo-width": 1
		}
	},
	{
		id: "poi_z14",
		type: "symbol",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "poi",
		minzoom: 14.2,
		filter: [
			"all",
			[
				"==",
				"$type",
				"Point"
			],
			[
				"any",
				[
					"<",
					"rank",
					7
				]
			],
			[
				"any",
				[
					"!has",
					"level"
				],
				[
					"==",
					"level",
					0
				]
			]
		],
		layout: {
			"icon-size": 0.9,
			"text-anchor": "top",
			"text-field": "{name_en}",
			"text-font": [
				"Open Sans Italic"
			],
			"text-max-width": 9,
			"text-offset": [
				0,
				0.6
			],
			"text-padding": 2,
			"text-size": 12,
			visibility: "none"
		},
		paint: {
			"text-color": "rgb(216, 220, 223)",
			"text-halo-blur": 0.5,
			"text-halo-color": "rgb(255, 255, 255)",
			"text-halo-width": 1
		}
	},
	{
		id: "poi_transit",
		type: "symbol",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "poi",
		minzoom: 15,
		filter: [
			"all",
			[
				"in",
				"class",
				"bus",
				"railway",
				"airport"
			],
			[
				"==",
				"subclass",
				"station"
			]
		],
		layout: {
			"icon-size": 0.9,
			"text-anchor": "left",
			"text-field": "{name_en}",
			"text-font": [
				"Open Sans Italic"
			],
			"text-max-width": 9,
			"text-offset": [
				0.9,
				0
			],
			"text-padding": 2,
			"text-size": 12,
			visibility: "visible"
		},
		paint: {
			"text-color": "rgb(216, 220, 223)",
			"text-halo-blur": 0.5,
			"text-halo-color": "rgb(255, 255, 255)",
			"text-halo-width": 1
		}
	},
	{
		id: "road_oneway",
		type: "symbol",
		source: "openmaptiles",
		"source-layer": "transportation",
		minzoom: 15,
		filter: [
			"all",
			[
				"==",
				"oneway",
				1
			],
			[
				"in",
				"class",
				"motorway",
				"trunk",
				"primary",
				"secondary",
				"tertiary",
				"minor",
				"service"
			]
		],
		layout: {
			"icon-padding": 2,
			"icon-rotate": 90,
			"icon-rotation-alignment": "map",
			"icon-size": {
				stops: [
					[
						15,
						0.5
					],
					[
						19,
						1
					]
				]
			},
			"symbol-placement": "line",
			"symbol-spacing": 75
		},
		paint: {
			"icon-opacity": 0.5
		}
	},
	{
		id: "road_oneway_opposite",
		type: "symbol",
		source: "openmaptiles",
		"source-layer": "transportation",
		minzoom: 15,
		filter: [
			"all",
			[
				"==",
				"oneway",
				-1
			],
			[
				"in",
				"class",
				"motorway",
				"trunk",
				"primary",
				"secondary",
				"tertiary",
				"minor",
				"service"
			]
		],
		layout: {
			"icon-padding": 2,
			"icon-rotate": -90,
			"icon-rotation-alignment": "map",
			"icon-size": {
				stops: [
					[
						15,
						0.5
					],
					[
						19,
						1
					]
				]
			},
			"symbol-placement": "line",
			"symbol-spacing": 75
		},
		paint: {
			"icon-opacity": 0.5
		}
	},
	{
		id: "road_label",
		type: "symbol",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "transportation_name",
		filter: [
			"all"
		],
		layout: {
			"symbol-placement": "line",
			"text-anchor": "center",
			"text-field": "{name_en} ",
			"text-font": [
				"Open Sans Regular"
			],
			"text-offset": [
				0,
				0.15
			],
			"text-size": {
				base: 1,
				stops: [
					[
						13,
						12
					],
					[
						14,
						13
					]
				]
			}
		},
		paint: {
			"text-color": "rgba(161, 169, 176, 1)",
			"text-halo-blur": 0.5,
			"text-halo-width": 1
		}
	},
	{
		id: "highway-shield",
		type: "symbol",
		source: "openmaptiles",
		"source-layer": "transportation_name",
		minzoom: 8,
		filter: [
			"all",
			[
				"<=",
				"ref_length",
				6
			],
			[
				"==",
				"$type",
				"LineString"
			],
			[
				"!in",
				"network",
				"us-interstate",
				"us-highway",
				"us-state"
			]
		],
		layout: {
			"icon-rotation-alignment": "viewport",
			"icon-size": 1,
			"symbol-avoid-edges": true,
			"symbol-placement": {
				base: 1,
				stops: [
					[
						10,
						"point"
					],
					[
						11,
						"line"
					]
				]
			},
			"symbol-spacing": 200,
			"text-field": "{ref}",
			"text-font": [
				"Open Sans Regular"
			],
			"text-rotation-alignment": "viewport",
			"text-size": 10,
			visibility: "none"
		},
		paint: {
			"icon-color": "rgba(161, 169, 176, 1)",
			"text-color": "rgba(161, 169, 176, 1)"
		}
	},
	{
		id: "highway-shield-us-interstate",
		type: "symbol",
		source: "openmaptiles",
		"source-layer": "transportation_name",
		minzoom: 7,
		filter: [
			"all",
			[
				"<=",
				"ref_length",
				6
			],
			[
				"==",
				"$type",
				"LineString"
			],
			[
				"in",
				"network",
				"us-interstate"
			]
		],
		layout: {
			"icon-rotation-alignment": "viewport",
			"icon-size": 1,
			"symbol-avoid-edges": true,
			"symbol-placement": {
				base: 1,
				stops: [
					[
						7,
						"point"
					],
					[
						7,
						"line"
					],
					[
						8,
						"line"
					]
				]
			},
			"symbol-spacing": 200,
			"text-field": "{ref}",
			"text-font": [
				"Open Sans Regular"
			],
			"text-rotation-alignment": "viewport",
			"text-size": 9,
			visibility: "none"
		},
		paint: {
			"text-color": "rgb(255, 255, 255)"
		}
	},
	{
		id: "highway-shield-us-other",
		type: "symbol",
		source: "openmaptiles",
		"source-layer": "transportation_name",
		minzoom: 9,
		filter: [
			"all",
			[
				"<=",
				"ref_length",
				6
			],
			[
				"==",
				"$type",
				"LineString"
			],
			[
				"in",
				"network",
				"us-highway",
				"us-state"
			]
		],
		layout: {
			"icon-rotation-alignment": "viewport",
			"icon-size": 1,
			"symbol-avoid-edges": true,
			"symbol-placement": {
				base: 1,
				stops: [
					[
						10,
						"point"
					],
					[
						11,
						"line"
					]
				]
			},
			"symbol-spacing": 200,
			"text-field": "{ref}",
			"text-font": [
				"Open Sans Regular"
			],
			"text-rotation-alignment": "viewport",
			"text-size": 9,
			visibility: "none"
		},
		paint: {
			"text-color": "rgb(57, 57, 57)"
		}
	},
	{
		id: "place_other",
		type: "symbol",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "place",
		filter: [
			"all",
			[
				"in",
				"class",
				"hamlet",
				"island",
				"islet",
				"neighbourhood",
				"suburb"
			]
		],
		layout: {
			"text-field": "{name_en}",
			"text-font": [
				"Open Sans Italic"
			],
			"text-letter-spacing": 0.1,
			"text-max-width": 9,
			"text-size": {
				base: 1.2,
				stops: [
					[
						12,
						10
					],
					[
						15,
						14
					]
				]
			},
			"text-transform": "uppercase",
			visibility: "visible"
		},
		paint: {
			"text-color": "rgb(173, 182, 190)",
			"text-halo-color": "rgba(255, 255, 255, 0.6)",
			"text-halo-width": 1.2
		}
	},
	{
		id: "place_village",
		type: "symbol",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "place",
		filter: [
			"all",
			[
				"==",
				"class",
				"village"
			]
		],
		layout: {
			"text-field": "{name_en}",
			"text-font": [
				"Open Sans Regular"
			],
			"text-max-width": 8,
			"text-size": {
				base: 1.2,
				stops: [
					[
						10,
						12
					],
					[
						15,
						22
					]
				]
			},
			visibility: "none"
		},
		paint: {
			"text-color": "rgb(161, 169, 176)",
			"text-halo-color": "rgba(255, 255, 255, 0.6)",
			"text-halo-width": 1.2
		}
	},
	{
		id: "place_town",
		type: "symbol",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "place",
		filter: [
			"all",
			[
				"==",
				"class",
				"town"
			]
		],
		layout: {
			"text-anchor": "bottom",
			"text-field": "{name_en}",
			"text-font": [
				"Open Sans Regular"
			],
			"text-max-width": 8,
			"text-offset": [
				0,
				0
			],
			"text-size": {
				base: 1.2,
				stops: [
					[
						7,
						12
					],
					[
						11,
						16
					]
				]
			}
		},
		paint: {
			"text-color": "rgba(161, 169, 176, 0.8)",
			"text-halo-color": "rgba(255, 255, 255, 0.6)",
			"text-halo-width": 1.2
		}
	},
	{
		id: "place_city",
		type: "symbol",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "place",
		minzoom: 5,
		filter: [
			"all",
			[
				"==",
				"class",
				"city"
			]
		],
		layout: {
			"icon-allow-overlap": true,
			"icon-optional": false,
			"text-anchor": "bottom",
			"text-field": "{name_en}",
			"text-font": [
				"Open Sans Semibold"
			],
			"text-max-width": 8,
			"text-offset": [
				0,
				0
			],
			"text-size": {
				base: 1.2,
				stops: [
					[
						7,
						14
					],
					[
						11,
						24
					]
				]
			}
		},
		paint: {
			"text-color": "rgba(161, 169, 176, 0.8)",
			"text-halo-color": "rgba(255, 255, 255, 0.6)",
			"text-halo-width": 1.2
		}
	},
	{
		id: "country_other",
		type: "symbol",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "place",
		filter: [
			"all",
			[
				"==",
				"class",
				"country"
			],
			[
				"!has",
				"iso_a2"
			]
		],
		layout: {
			"text-field": "{name_en}",
			"text-font": [
				"Open Sans Italic"
			],
			"text-max-width": 6.25,
			"text-size": {
				stops: [
					[
						3,
						9
					],
					[
						7,
						15
					]
				]
			},
			"text-transform": "none"
		},
		paint: {
			"text-color": "rgba(159, 178, 195, 0.55)",
			"text-halo-blur": 1,
			"text-halo-color": "rgba(255, 255, 255, 0.6)",
			"text-halo-width": 0.8
		}
	},
	{
		id: "country_3",
		type: "symbol",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "place",
		minzoom: 2,
		filter: [
			"all",
			[
				">=",
				"rank",
				3
			],
			[
				"==",
				"class",
				"country"
			]
		],
		layout: {
			"text-field": "{name_en}",
			"text-font": [
				"Open Sans Italic"
			],
			"text-max-width": 6.25,
			"text-size": {
				stops: [
					[
						3,
						11
					],
					[
						7,
						17
					]
				]
			},
			"text-transform": "none",
			visibility: "visible"
		},
		paint: {
			"text-color": "rgba(159, 178, 195, 0.55)",
			"text-halo-blur": 1,
			"text-halo-color": "rgba(255, 255, 255, 0.6)",
			"text-halo-width": 0.8
		}
	},
	{
		id: "country_2",
		type: "symbol",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "place",
		minzoom: 2,
		filter: [
			"all",
			[
				"==",
				"rank",
				2
			],
			[
				"==",
				"class",
				"country"
			]
		],
		layout: {
			"text-field": "{name_en}",
			"text-font": [
				"Open Sans Italic"
			],
			"text-max-width": 6.25,
			"text-size": {
				stops: [
					[
						2,
						11
					],
					[
						5,
						17
					]
				]
			},
			"text-transform": "none",
			visibility: "visible"
		},
		paint: {
			"text-color": "rgba(159, 178, 195, 0.55)",
			"text-halo-blur": 1,
			"text-halo-color": "rgba(255, 255, 255, 0.6)",
			"text-halo-width": 0.8
		}
	},
	{
		id: "country_1",
		type: "symbol",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "place",
		minzoom: 2,
		filter: [
			"all",
			[
				"==",
				"rank",
				1
			],
			[
				"==",
				"class",
				"country"
			]
		],
		layout: {
			"text-field": "{name_en}",
			"text-font": [
				"Open Sans Italic"
			],
			"text-max-width": 6.25,
			"text-size": {
				stops: [
					[
						1,
						11
					],
					[
						4,
						17
					]
				]
			},
			"text-transform": "none",
			visibility: "visible"
		},
		paint: {
			"text-color": "rgba(159, 178, 195, 0.55)",
			"text-halo-blur": 1,
			"text-halo-color": "rgba(255, 255, 255, 0.6)",
			"text-halo-width": 0.8
		}
	},
	{
		id: "continent",
		type: "symbol",
		metadata: {
		},
		source: "openmaptiles",
		"source-layer": "place",
		maxzoom: 1,
		filter: [
			"all",
			[
				"==",
				"class",
				"continent"
			]
		],
		layout: {
			"text-field": "{name_en}",
			"text-font": [
				"Open Sans Italic"
			],
			"text-justify": "center",
			"text-size": 13,
			"text-transform": "uppercase"
		},
		paint: {
			"text-color": "rgb(168, 196, 220)",
			"text-halo-color": "rgba(255, 255, 255, 0.6)",
			"text-halo-width": 1
		}
	}
];
var version = 8;
var mapLibreBaseSettings = {
	bearing: bearing,
	name: name,
	owner: owner,
	glyphs: glyphs,
	sources: sources,
	layers: layers,
	version: version
};

export { bearing, mapLibreBaseSettings as default, glyphs, layers, name, owner, sources, version };
//# sourceMappingURL=mapboxgl-settings.json.js.map
