import * as Data from "./dataParser.js"
import { Coordinates } from "./coordinates.js"

// Initialize variables and the map
var TOLL_VC = null;
var VC_Queue = null;
var currentQueues = [];
var currentMarkers = [];
var currentTolls = { WHC: 40, CHT: 40, EHC: 40};
var mode = 2 // 0:Free, 1:Flat, 2:Time

const VICTORIA_HARBOUR = new google.maps.LatLng(22.296686, 114.196346);
const map = new google.maps.Map(document.getElementById("map"), {
	mapId: "784b7fb1ad33c982",
	zoom: 14,
	minZoom: 12,
	center: VICTORIA_HARBOUR,
	mapTypeId: "satellite",
	tilt: 0,
	zoomControl: false,
  streetViewControl: false,
  fullscreenControl: false,
});

// Render base case
const init = async () => {
  await Data.getTollVC().then((tolls) => {
    TOLL_VC = tolls;
    console.log("Loaded TOLL_VC")
  })
  await Data.getVCQueue().then((queue) => {
    VC_Queue = queue;
    console.log("Loaded VC Queue")
  })
  createRHCs()
  updateQueues()
  updateToll()
  setMode(2)
  console.log("Initialized")
}

init()

const updateToll = () => {
  setToll(currentTolls);
	// const WHC_MINUS_BUTTON = document.getElementById("WHC-minus")
	// const WHC_PLUS_BUTTON = document.getElementById("WHC-plus")
	// const CHT_MINUS_BUTTON = document.getElementById("CHT-minus")
	// const CHT_PLUS_BUTTON = document.getElementById("CHT-plus")
	// const EHC_MINUS_BUTTON = document.getElementById("EHC-minus")
	// const EHC_PLUS_BUTTON = document.getElementById("EHC-plus")

	// WHC_MINUS_BUTTON.style.visibility = "hidden"
	// WHC_PLUS_BUTTON.style.visibility = "hidden"
	// CHT_MINUS_BUTTON.style.visibility = "hidden"
	// CHT_PLUS_BUTTON.style.visibility = "hidden"
	// EHC_MINUS_BUTTON.style.visibility = "hidden"
	// EHC_PLUS_BUTTON.style.visibility = "hidden"
	document.getElementById("all-tolls-minus-5").style.display = "none"
	document.getElementById("all-tolls-plus-5").style.display = "none"
	document.getElementById("all-tolls-minus-5").disabled = false
	document.getElementById("all-tolls-plus-5").disabled = false

	// if (mode == 1) {
	// 	if (CURRENT_CASE_NO == 0) {
	// 		WHC_MINUS_BUTTON.style.visibility = "visible"
	// 	} else if (CURRENT_CASE_NO == 1) {
	// 		WHC_PLUS_BUTTON.style.visibility = "visible"
	// 	}
	// }

	if (mode == 2) {
		document.getElementById("all-tolls-minus-5").style.display = "inline"
		document.getElementById("all-tolls-plus-5").style.display = "inline"
	// 	if ([2, 5, 8, 11, 14].includes(CURRENT_CASE_NO)) {
	// 		EHC_MINUS_BUTTON.style.visibility = "visible"
	// 		if (CURRENT_CASE_NO != 2) WHC_PLUS_BUTTON.style.visibility = "visible"
	// 	}
	// 	if ([3, 6, 9, 12, 15].includes(CURRENT_CASE_NO)) {
	// 		CHT_MINUS_BUTTON.style.visibility = "visible"
	// 		EHC_PLUS_BUTTON.style.visibility = "visible"
	// 	}
	// 	if ([4, 7, 10, 13, 16].includes(CURRENT_CASE_NO)) {
	// 		WHC_MINUS_BUTTON.style.visibility = "visible"
	// 		CHT_PLUS_BUTTON.style.visibility = "visible"
	// 	}
	// 	if (CURRENT_CASE_NO == 17) {
	// 		WHC_PLUS_BUTTON.style.visibility = "visible"
	// 		document.getElementById("all-tolls-minus-5").disabled = true
	// 	}
	// 	if (CURRENT_CASE_NO == 2) {
	// 		document.getElementById("all-tolls-plus-5").disabled = true
	// 	}
	}
}

const addToMap = (array) => {
  array.forEach(element => {
    element.setMap(map);
  });
}

const removeFromMap = (array) => {
  array.forEach(element => {
    element.setMap(null);
  })
  array.length = 0
}

const updateQueues = () => {
  removeFromMap(currentQueues);
  removeFromMap(currentMarkers);
  createRoutes(getQueue(getVC()))
  addToMap(currentQueues);
  addToMap(currentMarkers);
  updateToll()
}

// Default route for each mode
export const setMode = (modeId) => {
  const FLAT_BTN = document.getElementById("mode-flat")
  const PEAK_BTN = document.getElementById("mode-peak")
  // const FREE_BTN = document.getElementById("mode-free")
  const BUTTONS = [FLAT_BTN, PEAK_BTN] //, FREE_BTN]
  document.getElementById("free-toggle-container").style.display = "flex"
  BUTTONS.forEach((button) => {
    button.classList.remove("mode-selector-selected")
  })
	if (modeId == 0) {
		mode = 0
    FLAT_BTN.classList.add("mode-selector-selected")
    // FREE_BTN.classList.add("mode-selector-selected")
		currentTolls = { WHC: 0, CHT: 0, EHC: 0 };
		updateQueues()
    // removeInterpeakTollCol()
	} else if (modeId == 1) {
		mode = 1
    FLAT_BTN.classList.add("mode-selector-selected")
    document.getElementById("default-toll-heading").innerHTML = "ALL-DAY"
		currentTolls = { WHC: 75, CHT: 20, EHC: 25 };
		updateQueues()
    // removeInterpeakTollCol();
	} else {
		mode = 2
    PEAK_BTN.classList.add("mode-selector-selected")
    document.getElementById("default-toll-heading").innerHTML = "PEAK"
    document.getElementById("free-toggle-container").style.display = "none"
		currentTolls = { WHC: 40, CHT: 40, EHC: 40 };
		updateQueues()
    // addInterpeakTollCol()
	}
}

// Button behavior
document.getElementById("WHC-minus").addEventListener("click", () => {
  if (mode == 1) {
    currentTolls.WHC -= 25;
  } else {
		currentTolls.WHC -= 5;
  }
	updateQueues()
})

document.getElementById("WHC-plus").addEventListener("click", () => {
  if (mode == 1) {
    currentTolls.WHC += 25;
  } else {
		currentTolls.WHC += 5;
	}
	updateQueues()
})

document.getElementById("CHT-minus").addEventListener("click", () => {
	currentTolls.CHT -= 5;
	updateQueues()
})

document.getElementById("CHT-plus").addEventListener("click", () => {
	currentTolls.CHT += 5;
	updateQueues()
})

document.getElementById("EHC-minus").addEventListener("click", () => {
	currentTolls.EHC -= 5;
	updateQueues()
})

document.getElementById("EHC-plus").addEventListener("click", () => {
	currentTolls.EHC += 5;
	updateQueues()
})

document.getElementById("all-tolls-minus-5").addEventListener("click", () => {
	if (currentTolls.WHC > 30) currentTolls.WHC -= 5
	if (currentTolls.CHT > 30) currentTolls.CHT -= 5
	if (currentTolls.EHC > 30) currentTolls.EHC -= 5
	updateQueues()
})

document.getElementById("all-tolls-plus-5").addEventListener("click", () => {
	if (currentTolls.WHC < 60) currentTolls.WHC += 5
	if (currentTolls.CHT < 60) currentTolls.CHT += 5
	if (currentTolls.EHC < 60) currentTolls.EHC += 5
	updateQueues()
})

document.getElementById("free-toggle").addEventListener("change", (e) => {
  if (e.target.checked) {
    setMode(0)
  } else {
    setMode(1)
  }
})

const getDistanceBetweenTwoCoordinates = (c1, c2) => {
	const deg2rad = (degrees) => {
		var pi = Math.PI;
		return degrees * (pi / 180);
	}

	var R = 6371; // Radius of the earth in km
	var dLat = deg2rad(c2.lat - c1.lat);
	var dLng = deg2rad(c2.lng - c1.lng);
	var a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(deg2rad(c1.lat)) *
			Math.cos(deg2rad(c2.lat)) *
			Math.sin(dLng / 2) *
			Math.sin(dLng / 2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = R * c; // Distance in km

	return d * 1000; // Distance in m
}

const getTotalLength = (coordinates) => {
	var length = 0;
	for (let i = 0; i < coordinates.length - 1; i++) {
		length += getDistanceBetweenTwoCoordinates(
			coordinates[i],
			coordinates[i + 1]
		);
	}
	return length;
}

const setToll = (tolls) => {
  document.getElementById("WHCToll").innerHTML = "$" + tolls.WHC
  document.getElementById("CHTToll").innerHTML = "$" + tolls.CHT
  document.getElementById("EHCToll").innerHTML = "$" + tolls.EHC
}

const createRHCs = () => {
  const RHCs = [ Coordinates.WHC_NB, Coordinates.WHC_SB, Coordinates.CHT_NB, Coordinates.CHT_SB, Coordinates.EHC_NB, Coordinates.EHC_SB ]
  const WHC_MID = new google.maps.LatLng(22.295103, 114.151056)
  const CHT_MID = new google.maps.LatLng(22.291886, 114.181839)
  const EHC_MID = new google.maps.LatLng(22.295208, 114.222589)
  const RHCs_MID = [ WHC_MID, CHT_MID, EHC_MID ]
  const RHCs_NAME = [ "WHC", "CHT", "EHC" ]
  RHCs.forEach((RHC) => {
    new google.maps.Polyline({
      path: RHC,
      strokeColor: "#9C9C9C",
      strokeOpacity: 1.0,
      strokeWeight: 7,
      map: map,
      zIndex: -1
    })
  })
  RHCs_MID.forEach((RHC_MID, index) => {
    new markerWithLabel.MarkerWithLabel({
      position: RHC_MID,
      map: map,
      labelContent: RHCs_NAME[index],
      labelClass: "rhc-label",
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 0,
      }
    })
  })
}

const createRoutes = (_RHCEntries) => {
  let RHCEntries = {..._RHCEntries} // Copy to avoid mutating the original
  let result = {}
  for (const entry in RHCEntries) {
    for (const queue in RHCEntries[entry]) {
      if (queue == "VC") continue
      if (result[queue] == undefined) {
        result[queue] = {}
      }
      result[queue] = RHCEntries[entry][queue]
    }
  }

  for (const queue in result) {
    var tmpCoordinates = getCoordinatesToDistance(queue, result[queue])
    var tmpRoute = new google.maps.Polyline({
      path: tmpCoordinates,
      strokeColor: '#FF0000',
      strokeOpacity: 0.55,
      strokeWeight: 7,
    })
    currentQueues.push(tmpRoute)

    var tmpMarker = new markerWithLabel.MarkerWithLabel({
      position: tmpCoordinates[0],
      labelContent: (getTotalLength(tmpCoordinates) / 1000).toFixed(1) + " km",
      labelClass: "queue-length-label",
      icon: {
        // path: google.maps.SymbolPath.CIRCLE,
        scale: 5,
        url: "http://labs.google.com/ridefinder/images/mm_20_red.png"
      },
    })
    currentMarkers.push(tmpMarker)
  }
}

const getCoordinatesToDistance = (roadName, distance) => {
  const coordinates = Coordinates[roadName]
  distance *= 1000  // Convert to meters
  if (!coordinates) return null
	var routeCoordinates = JSON.parse(JSON.stringify(coordinates)); // Clone the array, or happy bug hunting
	var routeLength = getTotalLength(coordinates);

	if (distance > 0 && distance <= routeLength) {
		while (getTotalLength(routeCoordinates) > distance) {
			routeCoordinates.shift();
		}
	}
  return routeCoordinates;
}

const getVC = () => {
  var result = {}
  TOLL_VC.forEach(toll_vc => {
    if (toll_vc.WHC_TOLL == currentTolls.WHC && toll_vc.CHT_TOLL == currentTolls.CHT && toll_vc.EHC_TOLL == currentTolls.EHC) {
      result = toll_vc
    }
  })
  return result
}

const getQueue = vc => {
  var result = {}
  const { WHC_VC_SB, WHC_VC_NB, CHT_VC_SB, CHT_VC_NB, EHC_VC_SB, EHC_VC_NB } = vc
  VC_Queue.WHC_SB.forEach(vc_queue => {
    if (vc_queue.VC == WHC_VC_SB) {
      result.WHC_QUEUE_SB = vc_queue
    }
  })
  VC_Queue.WHC_NB.forEach(vc_queue => {
    if (vc_queue.VC == WHC_VC_NB) {
      result.WHC_QUEUE_NB = vc_queue
    }
  })
  VC_Queue.CHT_SB.forEach(vc_queue => {
    if (vc_queue.VC == CHT_VC_SB) {
      result.CHT_QUEUE_SB = vc_queue
    }
  })
  VC_Queue.CHT_NB.forEach(vc_queue => {
    if (vc_queue.VC == CHT_VC_NB) {
      result.CHT_QUEUE_NB = vc_queue
    }
  })
  VC_Queue.EHC_SB.forEach(vc_queue => {
    if (vc_queue.VC == EHC_VC_SB) {
      result.EHC_QUEUE_SB = vc_queue
    }
  })
  VC_Queue.EHC_NB.forEach(vc_queue => {
    if (vc_queue.VC == EHC_VC_NB) {
      result.EHC_QUEUE_NB = vc_queue
    }
  })
  return result
}

window.setMode = setMode