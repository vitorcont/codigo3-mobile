import { Row, Box, StyledText } from '@mobile/components/elements';
import {
  getDistanceFromPoints,
  getPointOffset,
  getUserDistanceToStep,
  isPointInsidePolygon,
  isPointInsideRoute,
  maskDistance,
  Point,
} from '@mobile/services/location';
import theme from '@mobile/theme';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useReduxState } from '@mobile/hooks/useReduxState';
import { LocationContext } from '@mobile/context/LocationContext';
import { useDispatch } from 'react-redux';
import EndTripModal from '../EndTripModal/EndTripModal';
import { SocketContext } from '@mobile/context/SocketContext';
import { startLoading } from '@mobile/store/Loading/action';
import { Polygon, Polyline } from 'react-native-maps';

interface IPathPolygon {}

const PathPolygon = (props: IPathPolygon) => {
  const {
    places: { activeRoute },
  } = useReduxState();
  const dispatch = useDispatch();
  const { userLocation } = useContext(LocationContext)!;
  const allGeometry = useMemo(() => {
    const steps = activeRoute?.routes[0].legs[0].steps!;
    const allGeometry = steps
      .map((step, stepIndex) => {
        return step.geometry.coordinates.map((coord) => coord.concat(stepIndex));
      })
      .flat(1);

    return allGeometry;
  }, [activeRoute]);

  const allPolyline = useMemo(() => {
    const minusOffsetPile = [];
    const plusOffsetQueue: Point[] = [];
    for (let i = 0; i < allGeometry.length - 2; i++) {
      const pointA = {
        latitude: allGeometry[i][1],
        longitude: allGeometry[i][0],
      };
      const pointB = {
        latitude: allGeometry[i + 2][1],
        longitude: allGeometry[i + 2][0],
      };
      const dy = pointB.longitude - pointA.longitude;
      const dx = pointB.latitude - pointA.latitude;
      const pathAngle = Math.atan2(dy, dx);

      const pointAOffsets = getPointOffset(pointA, pathAngle);
      const pointBOffsets = getPointOffset(pointB, pathAngle);

      plusOffsetQueue.push(pointAOffsets.plusOffset);
      plusOffsetQueue.push(pointBOffsets.plusOffset);

      minusOffsetPile.push(pointAOffsets.minusOffset);
      minusOffsetPile.push(pointBOffsets.minusOffset);
    }
    const allOffsets = plusOffsetQueue.concat(minusOffsetPile.reverse());
    return allOffsets;
  }, [allGeometry]);

  const geometryPoly = useMemo(() => {
    const allPoints: Point[][] = [];
    for (let i = 0; i < allGeometry.length - 1; i++) {
      let aux = [];
      const pointA = {
        latitude: allGeometry[i][1],
        longitude: allGeometry[i][0],
      };
      const pointB = {
        latitude: allGeometry[i + 1][1],
        longitude: allGeometry[i + 1][0],
      };
      const dy = pointB.longitude - pointA.longitude;
      const dx = pointB.latitude - pointA.latitude;
      const pathAngle = Math.atan2(dy, dx);

      const pointAOffsets = getPointOffset(pointA, pathAngle);
      const pointBOffsets = getPointOffset(pointB, pathAngle);

      aux.push(pointAOffsets.plusOffset);
      aux.push(pointAOffsets.minusOffset);
      aux.push(pointBOffsets.minusOffset);
      aux.push(pointBOffsets.plusOffset);

      allPoints.push(aux);
    }

    return allPoints;
  }, [allGeometry]);

  // useEffect(() => {
  //   if (userLocation) {
  //     console.log('IN IT INSIDE?: ', isPointInsidePolygon({ ...userLocation }, allPolyline));
  //   }
  // }, [userLocation]);

  return (
    <>
      {allPolyline && <Polygon coordinates={allPolyline} fillColor="#038707a9" />}
      {geometryPoly.map((polygon) => (
        <Polygon coordinates={polygon} fillColor="#ff000052" />
      ))}
    </>
  );
};

export default PathPolygon;
