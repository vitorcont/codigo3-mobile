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
    isPointInside(point, singlePoint.coordinates)
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
      isPointInside(point, area.coordinates)
    );

    return filteredAreas.length > 0 && singleArea.id !== area.id;
  });

  const filteredByStatus = insideAreas.filter(
    (insideArea) => (insideArea.status ?? 0) > (area.status ?? 0)
  );

  return filteredByStatus.map((area) => area.coordinates);
};

export const isPointInside = (point: LatLng, polyPoints: LatLng[]) => {
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
