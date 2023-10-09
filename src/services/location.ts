import { LatLng } from 'react-native-maps';
import * as Location from 'expo-location';

export const getUserLocation = async () => {
  try {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return null;
    }

    let location = await Location.getCurrentPositionAsync({
      accuracy: 4,
    });

    return location.coords;
  } catch (err) {
    return null;
  }
};

export const verifyPointInsideAreas = (point: LatLng, allPoints: models.PolyArea[]) => {
  const insideAreas = allPoints.filter((singlePoint) =>
    isPointInsidePolygon(point, singlePoint.coordinates)
  );
  if (insideAreas.length == 0) {
    return null;
  }

  const sortedAreas = insideAreas.sort((a, b) => (b.status ?? 0) - (a.status ?? 0));

  return sortedAreas[0];
};

export const verifyAreaInsideAreas = (area: models.PolyArea, allAreas: models.PolyArea[]) => {
  const insideAreas = allAreas.filter((singleArea) => {
    const filteredAreas = singleArea.coordinates.filter((point) =>
      isPointInsidePolygon(point, area.coordinates)
    );

    return filteredAreas.length > 0 && singleArea.id !== area.id;
  });

  const filteredByStatus = insideAreas.filter(
    (insideArea) => (insideArea.status ?? 0) > (area.status ?? 0)
  );

  return filteredByStatus.map((area) => area.coordinates);
};

export const isPointInsidePolygon = (point: LatLng, polyPoints: LatLng[]) => {
  // ray-casting algorithm
  const treatedPoint = [point.latitude, point.longitude];
  const vs = polyPoints.map((poly) => [poly.latitude, poly.longitude]);

  var x = treatedPoint[0],
    y = treatedPoint[1];

  var inside = false;
  for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    var xi = vs[i][0],
      yi = vs[i][1];
    var xj = vs[j][0],
      yj = vs[j][1];

    var intersect = yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }

  return inside;
};

export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const earthRadius = 6371; // Radius of the Earth in kilometers
  const degToRad = Math.PI / 180; // Conversion factor from degrees to radians

  // Convert latitude and longitude to radians
  const latRad1 = lat1 * degToRad;
  const lonRad1 = lon1 * degToRad;
  const latRad2 = lat2 * degToRad;
  const lonRad2 = lon2 * degToRad;

  // Calculate the differences between coordinates
  const latDiff = latRad2 - latRad1;
  const lonDiff = lonRad2 - lonRad1;

  // Calculate the distance using the Haversine formula
  const a =
    Math.sin(latDiff / 2) ** 2 + Math.cos(latRad1) * Math.cos(latRad2) * Math.sin(lonDiff / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c;

  return distance;
};

export interface Point {
  latitude: number;
  longitude: number;
}

export interface RoundedPoint {
  center: Point;
  minusOffset: Point;
  plusOffset: Point;
}

export const isPointInsideRadius = (checkPoint: Point, centerPoint: Point, km: number) => {
  const ky = 40000 / 360;
  const kx = Math.cos((Math.PI * centerPoint.latitude) / 180.0) * ky;
  const dx = Math.abs(centerPoint.longitude - checkPoint.longitude) * kx;
  const dy = Math.abs(centerPoint.latitude - checkPoint.latitude) * ky;
  return Math.sqrt(dx * dx + dy * dy) <= km;
};

export const getCenterCoordinates = (points: Point[]) => {
  const latSum = points.reduce((prev, current) => ({
    latitude: prev.latitude + current.latitude,
    longitude: prev.longitude + current.longitude,
  }));

  const markerCoords = {
    latitude: latSum.latitude / points.length ?? 1,
    longitude: latSum.longitude / points.length ?? 1,
  };

  return markerCoords;
};

export const addDistance = (point: number, km: number, longitude?: boolean) => {
  //fórmula haversine
  const earthRad = 6371;
  const latRad = point * (Math.PI / 180);
  const longRad = point * (Math.PI / 180);

  if (longitude) {
    const newLongRad = longRad + km / earthRad / Math.cos(latRad);
    const newLong = newLongRad * (180 / Math.PI);

    return newLong;
  }

  const newLatRad = latRad + km / earthRad;
  const newLat = newLatRad * (180 / Math.PI);

  return newLat;
};

export const calculateBearing = (pointInitial: Point, pointFinal: Point) => {
  const lat1 = pointInitial.latitude * (Math.PI / 180);
  const lon1 = pointInitial.longitude * (Math.PI / 180);
  const lat2 = pointFinal.latitude * (Math.PI / 180);
  const lon2 = pointFinal.longitude * (Math.PI / 180);

  const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
  const angle = Math.atan2(y, x);

  const bearing = ((angle * 180) / Math.PI + 360) % 360;

  return bearing;
};

// export const isPointInsideRoute = (pointSearched: Point, pointA: Point, pointB: Point) => {
//   const bearing = calculateBearing(pointA, pointB);

//   let latitudeFlag = false;
//   let longitudeFlag = false;

//   if ((bearing > 315 && bearing < 45) || (bearing > 134 && bearing < 225)) {
//     //NORTE OU SUL
//     const pointInitial = {
//       center: {
//         latitude: pointA.latitude,
//         longitude: pointA.longitude,
//       },
//       minusOffset: {
//         latitude: addDistance(pointA.latitude, -0.02),
//         longitude: pointA.longitude,
//       },
//       plusOffset: {
//         latitude: addDistance(pointA.latitude, 0.02),
//         longitude: pointA.longitude,
//       },
//     };
//     const pointFinal = {
//       center: {
//         latitude: pointB.latitude,
//         longitude: pointB.longitude,
//       },
//       minusOffset: {
//         latitude: addDistance(pointB.latitude, -0.02),
//         longitude: pointB.longitude,
//       },
//       plusOffset: {
//         latitude: addDistance(pointB.latitude, 0.02),
//         longitude: pointB.longitude,
//       },
//     };

//     if (
//       pointSearched.latitude <= pointInitial.plusOffset.latitude &&
//       pointSearched.latitude >= pointInitial.minusOffset.latitude
//     ) {
//       latitudeFlag = true;
//     }

//     if (
//       pointSearched.longitude <= pointInitial.plusOffset.longitude &&
//       pointSearched.longitude >= pointFinal.plusOffset.longitude
//     ) {
//       longitudeFlag = true;
//     }

//     if (
//       pointSearched.longitude <= pointInitial.plusOffset.longitude &&
//       pointSearched.longitude >= pointFinal.plusOffset.longitude
//     ) {
//       longitudeFlag = true;
//     }

//     if (longitudeFlag || latitudeFlag) {
//       console.log('ENTROU FLAG NORTE SUL', latitudeFlag, longitudeFlag);
//       console.log('INITIAL', pointInitial);
//       console.log('FINAL', pointFinal);
//       console.log('SEARCHED', pointSearched);

//       console.log(bearing);
//     }
//   } else {
//     //LESTE OU OESTE
//     const pointInitial = {
//       center: {
//         latitude: pointA.latitude,
//         longitude: pointA.longitude,
//       },
//       minusOffset: {
//         latitude: pointA.latitude,
//         longitude: addDistance(pointA.longitude, -0.02, true),
//       },
//       plusOffset: {
//         latitude: pointA.latitude,
//         longitude: addDistance(pointA.longitude, 0.02, true),
//       },
//     };
//     const pointFinal = {
//       center: {
//         latitude: pointB.latitude,
//         longitude: pointB.longitude,
//       },
//       minusOffset: {
//         latitude: pointA.latitude,
//         longitude: addDistance(pointB.longitude, -0.02, true),
//       },
//       plusOffset: {
//         latitude: pointA.latitude,
//         longitude: addDistance(pointB.longitude, 0.02, true),
//       },
//     };

//     if (
//       pointSearched.longitude <= pointInitial.plusOffset.longitude &&
//       pointSearched.longitude >= pointInitial.minusOffset.longitude
//     ) {
//       longitudeFlag = true;
//     }

//     if (
//       pointSearched.latitude <= pointInitial.plusOffset.latitude &&
//       pointSearched.latitude >= pointFinal.plusOffset.latitude
//     ) {
//       latitudeFlag = true;
//     }

//     if (
//       pointSearched.latitude <= pointInitial.plusOffset.latitude &&
//       pointSearched.latitude >= pointFinal.plusOffset.latitude
//     ) {
//       latitudeFlag = true;
//     }

//     if (longitudeFlag || latitudeFlag) {
//       console.log('ENTROU FLAG LESTE OESTE', latitudeFlag, longitudeFlag);
//       console.log('INITIAL', pointInitial);
//       console.log('FINAL', pointFinal);
//       console.log('SEARCHED', pointSearched);

//       console.log(bearing);
//     }
//   }

//   return longitudeFlag && latitudeFlag;
// };

export const getDistanceFromPoints = (pointA: Point, pointB: Point) => {
  var R = 6371;
  var dLat = deg2rad(pointB.latitude - pointA.latitude);
  var dLon = deg2rad(pointB.longitude - pointA.longitude);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(pointA.latitude)) *
      Math.cos(deg2rad(pointB.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
};

const deg2rad = (deg: number) => {
  return deg * (Math.PI / 180);
};

const getPointOffset = (point: Point, pathAngle: number) => {
  const addedAngleOffset = pathAngle + Math.PI / 2;
  const subAngleOffset = pathAngle - Math.PI / 2;
  const offsetValue = 0.00015;

  const addedCx = point.latitude + Math.cos(addedAngleOffset) * offsetValue;
  const addedCy = point.longitude + Math.sin(addedAngleOffset) * offsetValue;

  const subCx = point.latitude + Math.cos(subAngleOffset) * offsetValue;
  const subCy = point.longitude + Math.sin(subAngleOffset) * offsetValue;

  return {
    plusOffset: {
      latitude: addedCx,
      longitude: addedCy,
    },
    minusOffset: {
      latitude: subCx,
      longitude: subCy,
    },
  };
};

export const isPointInsideRoute = (pointSearched: Point, pointA: Point, pointB: Point) => {
  const dy = pointB.longitude - pointA.longitude;
  const dx = pointB.latitude - pointA.latitude;
  const pathAngle = Math.atan2(dy, dx);

  const pointAOffsets = getPointOffset(pointA, pathAngle);
  const pointBOffsets = getPointOffset(pointB, pathAngle);

  const isInside = isPointInsidePolygon({ ...pointSearched }, [
    {
      latitude: pointAOffsets.minusOffset.latitude,
      longitude: pointAOffsets.minusOffset.longitude,
    },
    {
      latitude: pointAOffsets.plusOffset.latitude,
      longitude: pointAOffsets.plusOffset.longitude,
    },
    {
      latitude: pointBOffsets.minusOffset.latitude,
      longitude: pointBOffsets.minusOffset.longitude,
    },
    {
      latitude: pointBOffsets.plusOffset.latitude,
      longitude: pointBOffsets.plusOffset.longitude,
    },
  ]);

  return isInside;
};
